import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const art = `data:image/png;base64,${readFileSync(join(process.cwd(), "app/_assets/icon-art.png")).toString("base64")}`;

/** The supplied artwork on a white field, ringed in the green sampled from the auto in bg.png. */
export function renderMark(edge: number) {
  const ring = Math.max(2, Math.round(edge * 0.07));
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
          border: `${ring}px solid #2f6b33`,
          borderRadius: edge * 0.22,
        }}
      >
        <img src={art} width={edge - ring * 4} style={{ objectFit: "contain" }} alt="" />
      </div>
    ),
    { width: edge, height: edge },
  );
}
