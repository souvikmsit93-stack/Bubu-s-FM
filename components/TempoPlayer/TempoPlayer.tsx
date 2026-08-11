"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./types";
import "./tempo-player.css";

declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }
const asTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const Prev = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 5.5v13L8 12l9.5-6.5Z" /><rect x="5.6" y="5.5" width="1.9" height="13" rx=".9" /></svg>;
const Next = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 5.5 16 12l-9.5 6.5v-13Z" /><rect x="16.5" y="5.5" width="1.9" height="13" rx=".9" /></svg>;
const Play = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.9 19.3 12 8 19.1V4.9Z" /></svg>;
const Pause = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5" width="3.6" height="14" rx="1.1" /><rect x="13.4" y="5" width="3.6" height="14" rx="1.1" /></svg>;
const Speaker = ({ off }: { off: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9.4h3.4L12 5.6v12.8L7.4 14.6H4V9.4Z" />
    {off
      ? <path d="M15.4 9.6 20 14.2m0-4.6-4.6 4.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      : <path d="M15.2 8.8a4.4 4.4 0 0 1 0 6.4M17.7 6.6a7.8 7.8 0 0 1 0 10.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
  </svg>
);

export default function TempoPlayer() {
  const holder = useRef<HTMLDivElement>(null), player = useRef<any>(null), tick = useRef<number | undefined>(undefined), indexRef = useRef(0);
  const [tracks, setTracks] = useState<Track[]>([]), [index, setIndex] = useState(0), [playing, setPlaying] = useState(false), [time, setTime] = useState(0), [duration, setDuration] = useState(0), [volume, setVolume] = useState(72), [muted, setMuted] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState<string>();
  const track = tracks[index];
  useEffect(() => { indexRef.current = index; }, [index]);
  const sync = useCallback(() => { if (player.current?.getCurrentTime) { setTime(player.current.getCurrentTime()); setDuration(player.current.getDuration() || track?.duration || 0); } }, [track?.duration]);
  const choose = useCallback((next: number) => { if (!tracks.length) return; const target = (next + tracks.length) % tracks.length; setIndex(target); setTime(0); player.current?.loadVideoById(tracks[target].videoId); }, [tracks]);
  useEffect(() => { fetch("/api/playlist").then(async r => { const data = await r.json(); if (!r.ok) throw new Error(data.error); setTracks(data.tracks); }).catch(e => setError(e.message)); }, []);
  useEffect(() => { if (!tracks.length || player.current || !holder.current) return; const boot = () => { player.current = new window.YT.Player(holder.current!, { width: "320", height: "180", videoId: tracks[0].videoId, playerVars: { playsinline: 1, origin: window.location.origin }, events: { onReady: (e: any) => { e.target.setVolume(volume); setReady(true); }, onStateChange: (e: any) => { const state = window.YT.PlayerState; setPlaying(e.data === state.PLAYING); if (e.data === state.ENDED) choose(indexRef.current + 1); sync(); }, onError: () => setError("This YouTube video is not available to play.") } }); };
    if (window.YT?.Player) boot(); else { const script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(script); window.onYouTubeIframeAPIReady = boot; }
  }, [tracks, choose, index, sync, volume]);
  useEffect(() => { if (playing) tick.current = window.setInterval(sync, 500); return () => window.clearInterval(tick.current); }, [playing, sync]);
  useEffect(() => { if (!ready) return; player.current?.setVolume(muted ? 0 : volume); muted ? player.current?.mute() : player.current?.unMute(); }, [volume, muted, ready]);
  const seek = (value: number) => { player.current?.seekTo(value, true); setTime(value); };
  const toggle = () => playing ? player.current?.pauseVideo() : player.current?.playVideo();
  const previous = () => time > 3 ? seek(0) : choose(index - 1);

  if (error) return <aside className="tempo-player is-message player-error"><span className="dot" />{error}</aside>;
  if (!track) return <aside className="tempo-player is-message"><span className="loading-disc" />Tuning into the Tempo…</aside>;

  const progress = duration ? (time / duration) * 100 : 0;
  return <section className="tempo-player" aria-label="Tempo FM music player">
    <div className={`art ${playing ? "spinning" : ""}`}>
      {track.thumbnail && <img src={track.thumbnail} alt="" />}
      <span className="art-ring" aria-hidden="true" />
    </div>

    <div className="track-info">
      <h2 title={track.title}>{track.title}</h2>
      <p>{track.channel}</p>
      <div className="scrub" style={{ ["--p" as string]: `${progress}%` }}>
        <input aria-label="Track progress" type="range" min="0" max={duration || 1} step="0.5" value={time} onChange={e => seek(+e.target.value)} />
        <span className="times"><b>{asTime(time)}</b> / {asTime(duration)}</span>
      </div>
    </div>

    <div className="controls">
      <span className="counter">{String(index + 1).padStart(2, "0")}<i>/</i>{tracks.length}</span>
      <div className="volume" style={{ ["--p" as string]: `${muted ? 0 : volume}%` }}>
        <button className="ghost" onClick={() => setMuted(!muted)} aria-label={muted ? "Unmute" : "Mute"}><Speaker off={muted} /></button>
        <input aria-label="Volume" type="range" min="0" max="100" value={muted ? 0 : volume} onChange={e => { setVolume(+e.target.value); setMuted(+e.target.value === 0); }} />
      </div>
      <button className="ghost" onClick={previous} aria-label="Previous track"><Prev /></button>
      <button className="play" onClick={toggle} aria-label={playing ? "Pause" : "Play"} disabled={!ready}>{playing ? <Pause /> : <Play />}</button>
      <button className="ghost" onClick={() => choose(index + 1)} aria-label="Next track"><Next /></button>
    </div>

    <div className="youtube-frame" aria-hidden="true"><div ref={holder} /></div>
    {!ready && <span className="ready">connecting to youtube…</span>}
  </section>;
}
