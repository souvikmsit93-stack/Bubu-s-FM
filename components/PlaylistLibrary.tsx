"use client";
import { useEffect, useState } from "react";
import type { Track } from "./TempoPlayer/types";

export default function PlaylistLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    fetch("/api/playlist").then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.error); setTracks(data.tracks); }).catch((e) => setError(e.message));
  }, []);
  if (error) return <div className="library-message">The library is waiting for its playlist connection.</div>;
  if (!tracks.length) return <div className="library-message"><span className="library-pulse" /> loading the collection…</div>;
  return <div className="library-grid">{tracks.map((track, i) => (
    <article className="library-row" key={`${track.videoId}-${i}`}>
      <span className="library-number">{String(i + 1).padStart(2, "0")}</span>
      <div className="library-art">{track.thumbnail && <img src={track.thumbnail} alt="" />}</div>
      <div className="library-copy"><h3>{track.title}</h3><p>{track.artist}</p></div>
      <span className="library-duration">{track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}` : ""}</span>
    </article>
  ))}</div>;
}
