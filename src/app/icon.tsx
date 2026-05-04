import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #6E5A7E, #5A4668)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 5-petal periwinkle flower */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="11"
              cy="4.5"
              rx="3"
              ry="5.5"
              fill="white"
              fillOpacity="0.92"
              transform={`rotate(${deg} 11 11)`}
            />
          ))}
          <circle cx="11" cy="11" r="3" fill="#D7CCFF" />
          <circle cx="11" cy="11" r="1.5" fill="#6E5A7E" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
