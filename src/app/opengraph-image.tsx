import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio";
export const alt = "Sheheer’s World — an interactive developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f8f5ea",
        color: "#203e36",
        padding: "64px 76px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#203e36",
            color: "#f8f5ea",
            fontSize: 46,
            fontWeight: 700,
          }}
        >
          s.
        </div>
        <div style={{ display: "flex", fontSize: 19, letterSpacing: 4 }}>
          SHEHEER’S WORLD
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 58,
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: -6,
          lineHeight: 1.02,
        }}
      >
        <span>Small world.</span>
        <span style={{ color: "#66846b" }}>Big ideas.</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 42,
          fontSize: 22,
        }}
      >
        <span>{profile.name}</span>
        <span>Drive a little. Discover a lot.</span>
      </div>
    </div>,
    size,
  );
}
