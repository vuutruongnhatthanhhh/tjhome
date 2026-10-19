import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a78d6",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path d="M12 3.2L3.5 10.2V21H9.5V14H14.5V21H20.5V10.2L12 3.2Z" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
