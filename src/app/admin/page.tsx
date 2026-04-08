"use client";

import { useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Signup {
  id: string;
  name: string;
  email: string;
  pseudonym: string;
  createdAt: string;
}

interface Application {
  id: string;
  name: string;
  email: string;
  roleType: string;
  status: string;
  createdAt: string;
}

interface Profile {
  displayName: string | null;
  menopauseStage: string | null;
  avatarStyle: string | null;
}

interface UserRecord {
  id: string;
  email: string;
  createdAt: string;
  profile: Profile | null;
}

interface RoomRecord {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string;
  isDefault: boolean;
  sortOrder: number;
  _count: { posts: number; followers: number };
}

interface ModeratorRecord {
  id: string;
  userId: string;
  roomId: string;
  role: string;
  user: { email: string; profile: Profile | null };
  room: { name: string };
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const colors = {
  plum: "#6E5A7E",
  lavender: "#B7A8C9",
  ivory: "#F7F3EE",
  ink: "#2B2433",
  card: "#FDFBF8",
  border: "#DDD7CE",
  text2: "#6B6575",
  text3: "#9B94A3",
};

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 24,
  flexWrap: "wrap",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 20px",
  borderRadius: 20,
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  fontSize: "0.875rem",
  fontWeight: 500,
  background: active ? colors.plum : "transparent",
  color: active ? "#fff" : colors.text2,
  transition: "all 0.15s ease",
});

const tableWrapStyle: React.CSSProperties = {
  background: colors.card,
  borderRadius: 12,
  border: `1px solid ${colors.border}`,
  overflow: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  fontSize: "0.85rem",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  borderBottom: `2px solid ${colors.border}`,
  color: colors.text2,
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};

const tdStyle = (rowIndex: number): React.CSSProperties => ({
  padding: "9px 14px",
  borderBottom: `1px solid ${colors.border}`,
  color: colors.ink,
  background: rowIndex % 2 === 1 ? "rgba(183,168,201,0.06)" : "transparent",
});

const btnStyle: React.CSSProperties = {
  padding: "8px 18px",
  borderRadius: 10,
  border: "none",
  background: colors.plum,
  color: "#fff",
  cursor: "pointer",
  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  fontSize: "0.85rem",
  fontWeight: 500,
};

const btnDangerStyle: React.CSSProperties = {
  ...btnStyle,
  background: "#C44",
  fontSize: "0.8rem",
  padding: "5px 12px",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: `1px solid ${colors.border}`,
  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
  fontSize: "0.85rem",
  color: colors.ink,
  background: "#fff",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: 16,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
  fontSize: "1.25rem",
  color: colors.ink,
  fontWeight: 400,
  marginBottom: 12,
  marginTop: 28,
};

const statusColors: Record<string, string> = {
  PENDING: "#888",
  REVIEWING: "#B8860B",
  APPROVED: "#2E7D32",
  DECLINED: "#C44",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Tab = "signups" | "applications" | "users" | "moderators" | "rooms";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [denied, setDenied] = useState(false);
  const [tab, setTab] = useState<Tab>("signups");

  // Data
  const [signups, setSignups] = useState<Signup[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [moderators, setModerators] = useState<ModeratorRecord[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);

  // Forms
  const [newMod, setNewMod] = useState({ userId: "", roomId: "", role: "MODERATOR" });
  const [newRoom, setNewRoom] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    isDefault: false,
    sortOrder: 0,
  });

  // Loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------------------------------------
  // Auth check
  // -----------------------------------------------------------------------
  useEffect(() => {
    const stored = sessionStorage.getItem("periwink-admin-auth");
    if (stored === "true") {
      setAuthed(true);
      return;
    }
    const pw = window.prompt("Enter admin password:");
    if (pw === "periwink2026") {
      sessionStorage.setItem("periwink-admin-auth", "true");
      setAuthed(true);
    } else {
      setDenied(true);
    }
  }, []);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [sRes, aRes, uRes, mRes, rRes] = await Promise.all([
        fetch("/api/admin/signups"),
        fetch("/api/admin/applications"),
        fetch("/api/admin/users"),
        fetch("/api/admin/moderators"),
        fetch("/api/admin/rooms"),
      ]);
      setSignups(await sRes.json());
      setApplications(await aRes.json());
      setUsers(await uRes.json());
      setModerators(await mRes.json());
      setRooms(await rRes.json());
    } catch (e) {
      setError("Failed to load data. " + (e instanceof Error ? e.message : ""));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  // -----------------------------------------------------------------------
  // Mutations
  // -----------------------------------------------------------------------

  async function updateApplicationStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch {
      setError("Failed to update application status.");
    }
  }

  async function addModerator() {
    if (!newMod.userId || !newMod.roomId) {
      setError("Select a user and room.");
      return;
    }
    try {
      const res = await fetch("/api/admin/moderators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMod),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add moderator.");
        return;
      }
      setNewMod({ userId: "", roomId: "", role: "MODERATOR" });
      await fetchData();
    } catch {
      setError("Failed to add moderator.");
    }
  }

  async function removeModerator(id: string) {
    if (!confirm("Remove this moderator?")) return;
    try {
      await fetch("/api/admin/moderators", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchData();
    } catch {
      setError("Failed to remove moderator.");
    }
  }

  async function createRoom() {
    if (!newRoom.name || !newRoom.slug || !newRoom.description) {
      setError("Name, slug, and description are required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create room.");
        return;
      }
      setNewRoom({ name: "", slug: "", description: "", icon: "", isDefault: false, sortOrder: 0 });
      await fetchData();
    } catch {
      setError("Failed to create room.");
    }
  }

  // -----------------------------------------------------------------------
  // Render guards
  // -----------------------------------------------------------------------
  if (denied) {
    return (
      <div style={{ textAlign: "center", marginTop: 80, fontFamily: "var(--font-body, 'DM Sans', sans-serif)", color: colors.text2 }}>
        <p style={{ fontSize: "1.1rem" }}>Access denied.</p>
      </div>
    );
  }

  if (!authed) return null;

  // -----------------------------------------------------------------------
  // Tab content renderers
  // -----------------------------------------------------------------------

  const tabs: { key: Tab; label: string }[] = [
    { key: "signups", label: "Signups" },
    { key: "applications", label: "Applications" },
    { key: "users", label: "Users" },
    { key: "moderators", label: "Moderators" },
    { key: "rooms", label: "Rooms" },
  ];

  function renderSignups() {
    return (
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Pseudonym</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((s, i) => (
              <tr key={s.id}>
                <td style={tdStyle(i)}>{s.name}</td>
                <td style={tdStyle(i)}>{s.email}</td>
                <td style={tdStyle(i)}>{s.pseudonym}</td>
                <td style={tdStyle(i)}>{fmtDate(s.createdAt)}</td>
              </tr>
            ))}
            {signups.length === 0 && (
              <tr>
                <td style={{ ...tdStyle(0), color: colors.text3 }} colSpan={4}>
                  No signups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderApplications() {
    return (
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a, i) => (
              <tr key={a.id}>
                <td style={tdStyle(i)}>{a.name}</td>
                <td style={tdStyle(i)}>{a.email}</td>
                <td style={tdStyle(i)}>{a.roleType}</td>
                <td style={tdStyle(i)}>
                  <select
                    value={a.status}
                    onChange={(e) => updateApplicationStatus(a.id, e.target.value)}
                    style={{
                      ...selectStyle,
                      color: statusColors[a.status] || colors.ink,
                      fontWeight: 600,
                      padding: "4px 8px",
                      fontSize: "0.8rem",
                    }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWING">REVIEWING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </td>
                <td style={tdStyle(i)}>{fmtDate(a.createdAt)}</td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td style={{ ...tdStyle(0), color: colors.text3 }} colSpan={5}>
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderUsers() {
    return (
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Display Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Avatar Style</th>
              <th style={thStyle}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td style={tdStyle(i)}>{u.profile?.displayName || "--"}</td>
                <td style={tdStyle(i)}>{u.email}</td>
                <td style={tdStyle(i)}>{u.profile?.menopauseStage || "--"}</td>
                <td style={tdStyle(i)}>{u.profile?.avatarStyle || "--"}</td>
                <td style={tdStyle(i)}>{fmtDate(u.createdAt)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td style={{ ...tdStyle(0), color: colors.text3 }} colSpan={5}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderModerators() {
    return (
      <>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Room</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {moderators.map((m, i) => (
                <tr key={m.id}>
                  <td style={tdStyle(i)}>
                    {m.user.profile?.displayName || m.user.email}
                  </td>
                  <td style={tdStyle(i)}>{m.room.name}</td>
                  <td style={tdStyle(i)}>{m.role}</td>
                  <td style={tdStyle(i)}>
                    <button style={btnDangerStyle} onClick={() => removeModerator(m.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {moderators.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle(0), color: colors.text3 }} colSpan={4}>
                    No moderators assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 style={sectionHeadingStyle}>Add Moderator</h3>
        <div style={formRowStyle}>
          <select
            style={{ ...selectStyle, minWidth: 180 }}
            value={newMod.userId}
            onChange={(e) => setNewMod({ ...newMod, userId: e.target.value })}
          >
            <option value="">Select user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.profile?.displayName || u.email}
              </option>
            ))}
          </select>

          <select
            style={{ ...selectStyle, minWidth: 160 }}
            value={newMod.roomId}
            onChange={(e) => setNewMod({ ...newMod, roomId: e.target.value })}
          >
            <option value="">Select room...</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            style={selectStyle}
            value={newMod.role}
            onChange={(e) => setNewMod({ ...newMod, role: e.target.value })}
          >
            <option value="MODERATOR">MODERATOR</option>
            <option value="OWNER">OWNER</option>
          </select>

          <button style={btnStyle} onClick={addModerator}>
            Add
          </button>
        </div>
      </>
    );
  }

  function renderRooms() {
    return (
      <>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Icon</th>
                <th style={thStyle}>Posts</th>
                <th style={thStyle}>Followers</th>
                <th style={thStyle}>Default</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={r.id}>
                  <td style={tdStyle(i)}>{r.name}</td>
                  <td style={tdStyle(i)}>{r.slug}</td>
                  <td style={tdStyle(i)}>{r.icon || "--"}</td>
                  <td style={tdStyle(i)}>{r._count.posts}</td>
                  <td style={tdStyle(i)}>{r._count.followers}</td>
                  <td style={tdStyle(i)}>{r.isDefault ? "Yes" : "No"}</td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle(0), color: colors.text3 }} colSpan={6}>
                    No rooms yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 style={sectionHeadingStyle}>Create Room</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 500, marginTop: 8 }}>
          <input
            style={inputStyle}
            placeholder="Room name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="slug (e.g. hot-flashes)"
            value={newRoom.slug}
            onChange={(e) => setNewRoom({ ...newRoom, slug: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Description"
            value={newRoom.description}
            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Icon (emoji)"
            value={newRoom.icon}
            onChange={(e) => setNewRoom({ ...newRoom, icon: e.target.value })}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              style={{ ...inputStyle, width: 80 }}
              type="number"
              placeholder="Sort"
              value={newRoom.sortOrder}
              onChange={(e) =>
                setNewRoom({ ...newRoom, sortOrder: parseInt(e.target.value) || 0 })
              }
            />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: colors.text2 }}>
              <input
                type="checkbox"
                checked={newRoom.isDefault}
                onChange={(e) => setNewRoom({ ...newRoom, isDefault: e.target.checked })}
              />
              Default room
            </label>
          </div>
          <div>
            <button style={btnStyle} onClick={createRoom}>
              Create Room
            </button>
          </div>
        </div>
      </>
    );
  }

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------
  return (
    <div>
      {error && (
        <div
          style={{
            background: "#FEE",
            border: "1px solid #ECC",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            color: "#922",
            fontSize: "0.85rem",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#922", fontSize: "1rem" }}
          >
            x
          </button>
        </div>
      )}

      {loading && (
        <div style={{ color: colors.text3, fontSize: "0.85rem", marginBottom: 16, fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}>
          Loading...
        </div>
      )}

      <div style={tabBarStyle}>
        {tabs.map((t) => (
          <button key={t.key} style={tabStyle(tab === t.key)} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "signups" && renderSignups()}
      {tab === "applications" && renderApplications()}
      {tab === "users" && renderUsers()}
      {tab === "moderators" && renderModerators()}
      {tab === "rooms" && renderRooms()}
    </div>
  );
}
