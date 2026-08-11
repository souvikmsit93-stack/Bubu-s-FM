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
          background: "#b23324",
          color: "#fff4e6",
          fontFamily: "Yatra One",
          fontSize: edge * 0.82,
          paddingTop: edge * 0.26,
        }}
      >
        टे
      </div>
    ),
    { width: edge, height: edge, fonts: [{ name: "Yatra One", data: font, weight: 400, style: "normal" }] },
  );
}
