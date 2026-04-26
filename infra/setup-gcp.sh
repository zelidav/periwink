#!/usr/bin/env bash
#
# Periwink — GCP Infrastructure Setup
# Run once to provision all cloud resources.
#
# Prerequisites:
#   - gcloud CLI installed and authenticated (gcloud auth login)
#   - A GCP project created (set PROJECT_ID below or pass as env var)
#   - Billing enabled on the project
#
# Usage:
#   export PROJECT_ID=your-gcp-project-id
#   bash infra/setup-gcp.sh
#
set -euo pipefail

# ── Configuration ──
PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID env var}"
REGION="${REGION:-us-east1}"
SERVICE_NAME="periwink"
DB_INSTANCE="periwink-db"
DB_NAME="periwink"
DB_USER="periwink"
REPO_NAME="periwink"
VPC_CONNECTOR="periwink-connector"

echo "=== Periwink GCP Setup ==="
echo "Project:  $PROJECT_ID"
echo "Region:   $REGION"
echo ""

# ── Set project ──
gcloud config set project "$PROJECT_ID"

# ── Enable required APIs ──
echo "→ Enabling APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com \
  compute.googleapis.com

# ── Artifact Registry (Docker repo) ──
echo "→ Creating Artifact Registry repo..."
gcloud artifacts repositories create "$REPO_NAME" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Periwink container images" \
  --quiet 2>/dev/null || echo "  (repo already exists)"

# ── Cloud SQL (PostgreSQL 15) ──
echo "→ Creating Cloud SQL instance (this takes a few minutes)..."
gcloud sql instances create "$DB_INSTANCE" \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=04:00 \
  --availability-type=zonal \
  --quiet 2>/dev/null || echo "  (instance already exists)"

echo "→ Creating database..."
gcloud sql databases create "$DB_NAME" \
  --instance="$DB_INSTANCE" \
  --quiet 2>/dev/null || echo "  (database already exists)"

echo "→ Creating database user..."
DB_PASSWORD=$(openssl rand -base64 24)
gcloud sql users create "$DB_USER" \
  --instance="$DB_INSTANCE" \
  --password="$DB_PASSWORD" \
  --quiet 2>/dev/null || echo "  (user already exists — password NOT changed)"

# Build the Cloud SQL connection string
CLOUD_SQL_CONNECTION=$(gcloud sql instances describe "$DB_INSTANCE" --format='value(connectionName)')
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?host=/cloudsql/${CLOUD_SQL_CONNECTION}"

# ── VPC Connector (for Cloud Run → Cloud SQL private networking) ──
echo "→ Creating Serverless VPC connector..."
gcloud compute networks vpc-access connectors create "$VPC_CONNECTOR" \
  --region="$REGION" \
  --range="10.8.0.0/28" \
  --quiet 2>/dev/null || echo "  (connector already exists)"

# ── Secret Manager ──
echo "→ Storing secrets..."

# DATABASE_URL
echo -n "$DATABASE_URL" | gcloud secrets create periwink-database-url \
  --data-file=- --quiet 2>/dev/null || \
  echo -n "$DATABASE_URL" | gcloud secrets versions add periwink-database-url --data-file=-

# NEXTAUTH_SECRET (generate a strong one)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -n "$NEXTAUTH_SECRET" | gcloud secrets create periwink-nextauth-secret \
  --data-file=- --quiet 2>/dev/null || echo "  (secret already exists)"

# RESEND_API_KEY (placeholder — user must set this)
echo -n "REPLACE_WITH_RESEND_API_KEY" | gcloud secrets create periwink-resend-api-key \
  --data-file=- --quiet 2>/dev/null || echo "  (secret already exists)"

# ADMIN_SECRET
ADMIN_SECRET=$(openssl rand -base64 24)
echo -n "$ADMIN_SECRET" | gcloud secrets create periwink-admin-secret \
  --data-file=- --quiet 2>/dev/null || echo "  (secret already exists)"

# ── Grant Cloud Run access to secrets ──
echo "→ Granting IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CLOUD_RUN_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for SECRET in periwink-database-url periwink-nextauth-secret periwink-resend-api-key periwink-admin-secret; do
  gcloud secrets add-iam-policy-binding "$SECRET" \
    --member="serviceAccount:${CLOUD_RUN_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet
done

# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_RUN_SA}" \
  --role="roles/cloudsql.client" \
  --quiet

# ── Cloud Build trigger (GitHub push to main) ──
echo "→ Creating Cloud Build trigger..."
echo "  NOTE: Connect your GitHub repo in the GCP Console first:"
echo "  https://console.cloud.google.com/cloud-build/triggers?project=${PROJECT_ID}"
echo ""
echo "  Then create a trigger with:"
echo "    - Source: GitHub repo zelidav/periwink"
echo "    - Branch: ^main$"
echo "    - Config: cloudbuild.yaml"
echo "    - Substitution variables are already set in cloudbuild.yaml"

# ── Summary ──
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Cloud SQL instance:  $DB_INSTANCE"
echo "Cloud SQL connection: $CLOUD_SQL_CONNECTION"
echo "Database:            $DB_NAME"
echo "Database user:       $DB_USER"
echo "Database password:   $DB_PASSWORD"
echo "Admin secret:        $ADMIN_SECRET"
echo ""
echo "IMPORTANT: Save these credentials securely!"
echo ""
echo "Next steps:"
echo "  1. Update RESEND_API_KEY secret:"
echo "     echo -n 'your-key' | gcloud secrets versions add periwink-resend-api-key --data-file=-"
echo ""
echo "  2. Connect GitHub repo to Cloud Build:"
echo "     https://console.cloud.google.com/cloud-build/triggers?project=${PROJECT_ID}"
echo ""
echo "  3. First deploy (manual):"
echo "     gcloud builds submit --config=cloudbuild.yaml --substitutions=SHORT_SHA=initial"
echo ""
echo "  4. Set custom domain (optional):"
echo "     gcloud run domain-mappings create --service=$SERVICE_NAME --domain=app.yourperiwink.com --region=$REGION"
echo ""
