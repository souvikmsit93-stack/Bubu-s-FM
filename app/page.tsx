import Clock from "@/components/Clock";
import PlaylistLibrary from "@/components/PlaylistLibrary";
import TempoPlayer from "@/components/TempoPlayer/TempoPlayer";

const playlistUrl = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL || "https://www.youtube.com/watch?v=VkBBb5vUuhY&list=PLBYEEUa003Zs&index=1";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="backdrop" aria-hidden="true"><div className="backdrop-image" /><div className="backdrop-wash" /><div className="backdrop-grain" /></div>
        <header className="topbar">
          <span className="brand-mark">P / FM</span>
          <div className="topbar-right"><Clock /><a className="playlist-link" href={playlistUrl} target="_blank" rel="noreferrer"><span className="live-dot" /> her playlist ↗</a></div>
        </header>
        <div className="hero-copy">
          <p className="eyebrow">a private collection of songs</p>
          <h1>Protyusha<span>.</span></h1>
          <p className="hero-line">radio for one.</p>
          <a className="enter-button" href="#collection">enter the radio <span>↓</span></a>
        </div>
        <div className="hero-bottom"><span>BLUE / PINK / GOLDEN HOUR</span><span>01 / THE COLLECTION</span></div>
      </section>

      <section className="collection section" id="collection">
        <div className="section-inner">
          <div className="section-head">
            <div><p className="eyebrow">01 / the collection</p><h2>Her radio.</h2></div>
            <p className="section-note">The playlist is the source. Add a song there and the station can discover it here automatically.</p>
          </div>
          <TempoPlayer />
          <div className="library-wrap"><div className="library-head"><span>THE LIBRARY</span><span>{"//"} LIVE COLLECTION</span></div><PlaylistLibrary /></div>
        </div>
      </section>

      <section className="archive section">
        <div className="section-inner">
          <div className="section-head"><div><p className="eyebrow">02 / the archive</p><h2>Somewhere<br />between songs.</h2></div><p className="section-note">Four moments that deserve to live somewhere outside a camera roll.</p></div>
          <div className="memory-grid">
            <article className="memory"><span>01 / PRINCEP GHAT</span><div><h3>Our first kiss.</h3><p>Princep Ghat. The river beside us, the city moving somewhere in the distance, and one moment that quietly changed everything.</p></div></article>
            <article className="memory"><span>02 / THE GHAT</span><div><h3>Old Monk & the Ganges.</h3><p>Just sitting there. Drinking Old Monk. Talking about nothing and everything. One of those evenings that didn't need an itinerary.</p></div></article>
            <article className="memory"><span>03 / 24:00+</span><div><h3>Twenty-four hours on a call.</h3><p>Sleep, conversations, silence, random nonsense. We didn't really need a reason to stay.</p></div></article>
            <article className="memory"><span>04 / THE LONG WAY HOME</span><div><h3>“You are my home.”</h3><p>The long drive home. And somewhere along the way, you said the sentence I don't think I'll ever forget.</p></div></article>
          </div>
        </div>
      </section>

      <section className="ending section"><div className="ending-glow" /><div className="ending-inner"><p className="eyebrow">03 / one last thing</p><h2>For<br /><em>Protyusha.</em></h2><p>There are songs you like, songs you remember, and songs that become attached to people. This little place is for all three.</p><div className="signature">always, Souvik.</div></div></section>
      <footer><span>PROTYUSHA RADIO</span><span>made with songs & memories</span></footer>
    </main>
  );
}
