import Clock from "@/components/Clock";
import TempoPlayer from "@/components/TempoPlayer/TempoPlayer";

const playlistUrl = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL || "https://music.youtube.com";

export default function Home() {
  return (
    <main className="hero">
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-image" />
        <div className="backdrop-scrim" />
        <div className="backdrop-grain" />
      </div>

      <header className="topbar">
        <Clock />
        <a className="chip" href={playlistUrl} target="_blank" rel="noreferrer">
          <img src="/youtube-music.png" alt="" />
          YT Music
          <span className="chip-arrow" aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero-title">
        <p className="kicker"><span className="rule" aria-hidden="true" />Tempo FM</p>
        <h1>
          <span>देखो मगर</span>
          <span>प्यार से</span>
        </h1>
      </section>

      <section className="player-slot">
        <TempoPlayer />
      </section>
    </main>
  );
}
