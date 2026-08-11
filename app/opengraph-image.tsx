import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Tempo FM — देखो मगर प्यार से";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFileSync(join(process.cwd(), "app/_assets", file));
const backdrop = `data:image/jpeg;base64,${asset("og-bg.jpg").toString("base64")}`;
const cover = { position: "absolute", top: 0, left: 0, width: size.width, height: size.height } as const;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", color: "#fff4e6", fontFamily: "Instrument Sans" }}>
        <img src={backdrop} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} alt="" />
        {/* satori has no `inset` shorthand — each scrim needs explicit offsets and a size. */}
        <div style={{ ...cover, background: "linear-gradient(90deg, rgba(16,8,4,.9) 0%, rgba(16,8,4,.4) 46%, rgba(16,8,4,.04) 100%)" }} />
        <div style={{ ...cover, background: "linear-gradient(0deg, rgba(20,10,5,.8) 0%, rgba(20,10,5,.14) 24%, rgba(20,10,5,0) 44%)" }} />
        <div style={{ ...cover, background: "linear-gradient(180deg, rgba(20,10,5,.58) 0%, rgba(20,10,5,0) 30%)" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,244,230,.72)" }}>
            <div style={{ width: 56, height: 2, background: "rgba(255,244,230,.55)" }} />
            Tempo FM
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: "Yatra One", fontSize: 132, lineHeight: 1.06 }}>देखो मगर</div>
            <div style={{ fontFamily: "Yatra One", fontSize: 132, lineHeight: 1.06, color: "#ffe9cf" }}>प्यार से</div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", fontSize: 30, color: "rgba(255,244,230,.86)", maxWidth: 720 }}>
              90s Bollywood that plays in the back of an auto.
            </div>
            <div style={{ display: "flex", fontSize: 21, letterSpacing: 3, color: "rgba(255,244,230,.6)" }}>saloon.wtf</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Yatra One", data: asset("YatraOne-Regular.ttf"), weight: 400, style: "normal" },
        { name: "Instrument Sans", data: asset("InstrumentSans-Medium.ttf"), weight: 500, style: "normal" },
      ],
    },
  );
}
