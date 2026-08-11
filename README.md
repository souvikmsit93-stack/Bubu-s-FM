# Tempo FM

**देखो मगर प्यार से** — 90s Bollywood that plays in the back of an auto.

![Tempo FM](docs/screenshot.jpg)

## Why this exists

I came across [saloon.wtf](https://saloon.wtf) one evening and it completely disarmed me. A barbershop, a playlist, and suddenly I wasn't at my desk any more. I sat with it far longer than I meant to, grinning at nothing.

Because I know that feeling from the other side. Through my last years of school I got to class in a sharing auto — the kind that runs a fixed route through every tier-two and tier-three city in India, six of us folded into a bench built for three, and a stereo the driver had clearly invested in more seriously than the suspension. Every morning, at full volume, the same 90s Hindi playlist. Kumar Sanu at seven in the morning on the way to a physics class I hadn't studied for felt, at the time, like a punishment I hadn't earned.

I would pay real money to sit in one of those autos again.

That's the whole idea. Point it at a YouTube playlist and it becomes a station — the songs, the street, the ride. Tempo FM is a sibling of saloon.wtf: same instinct, different chair. Saloon is the barbershop. This one is the ride home.

## What it does

- Streams a YouTube playlist through a hidden IFrame Player — no video, just the audio and the artwork.
- Credits the real artists. Auto-generated music uploads sit on generic channels like `Release - Topic`, so the artist is read from the description line YouTube writes as `Title · Artist · Artist` instead of the uploader's name.
- Play / pause / skip, scrubbing and volume. The record keeps its rotation when you pause and picks up from the same angle.
- Auto-advances when a track ends and wraps at the end of the playlist.
- Ships an Open Graph card, so links pasted into WhatsApp or iMessage unfurl properly.

## Design

Warm, dusk-lit, one screen. A full-bleed illustration; everything else floats on top of it.

- **[Yatra One](https://fonts.google.com/specimen/Yatra+One)** for the Devanagari display type — a face drawn after Indian street signage, which is more or less exactly what a line on the back of an auto is.
- **[Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)** for interface text, **[DM Mono](https://fonts.google.com/specimen/DM+Mono)** for the clock and timestamps.
- The player is real glass — `backdrop-filter` over the artwork, tuned light enough that the illustration still reads through it.
- Scrims and grain sit in their own layers, so contrast can be tuned without touching the art.

## Running it

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev
```

| Variable | What it's for |
| --- | --- |
| `NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL` | Any public YouTube playlist URL. The `list=` ID is read from it, and the header link points here. |
| `YOUTUBE_DATA_API_KEY` | A YouTube Data API v3 key. Server-side only — restrict it to the YouTube Data API in Google Cloud. |
| `NEXT_PUBLIC_SITE_URL` | Optional. The canonical origin, used to resolve absolute Open Graph URLs. Set automatically on Vercel. |

`.env` is gitignored and the API key never reaches the browser — the playlist is fetched in `app/api/playlist/route.ts` on the server, and the response is cached for five minutes so traffic bursts cost one upstream call per window.

## Deploying

Built for Vercel. Push, import, add the environment variables, deploy. `NEXT_PUBLIC_SITE_URL` can be left unset there — the production URL is picked up automatically.

## Layout

```
app/
  page.tsx              hero, top bar, player placement
  layout.tsx            fonts, metadata, analytics
  globals.css           backdrop layers, scrims, grain, type scale
  opengraph-image.tsx   1200×630 share card, rendered at build time
  icon.tsx              favicon, composed from the artwork in _assets
  api/playlist/route.ts YouTube Data API → track list
  _assets/              fonts and art used only by the generated images
components/
  Clock.tsx             the local time in the corner
  TempoPlayer/          the glass player and everything it does
next.config.ts          security headers and content security policy
```

## Making it your own

The line in the hero is two `<span>`s in `app/page.tsx`, the illustration is `public/bg.png`, and the palette lives in the `:root` block of `app/globals.css`. Change those three and it's a different city.

---

Built by [Siddhanth Kapoor](https://github.com/SiddhanthKapoor).
