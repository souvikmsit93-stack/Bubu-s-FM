import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const font = readFileSync(join(process.cwd(), "app/_assets/YatraOne-Regular.ttf"));

/** टे — the first syllable of टेम्पो, sized to stay legible down to 16px. */
export function renderMark(edge: number) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          /* The green is sampled from the auto in bg.png. */
          color: "#2f6b33",
          border: `${Math.round(edge * 0.07)}px solid #2f6b33`,
          borderRadius: edge * 0.22,
          fontFamily: "Yatra One",
          fontSize: edge * 0.7,
          paddingTop: edge * 0.2,
        }}
      >
        टे
      </div>
    ),
    { width: edge, height: edge, fonts: [{ name: "Yatra One", data: font, weight: 400, style: "normal" }] },
  );
}
