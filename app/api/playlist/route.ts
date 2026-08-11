import { NextResponse } from "next/server";

type YouTubeItem = { snippet: { resourceId?: { videoId?: string }; title: string; videoOwnerChannelTitle?: string; channelTitle: string; position: number; thumbnails?: Record<string, { url: string }> } };
type Video = { id: string; contentDetails?: { duration?: string }; snippet?: { channelTitle?: string; description?: string } };

function playlistId(url: string) {
  try { return new URL(url).searchParams.get("list"); } catch { return null; }
}
function duration(seconds: string | undefined) {
  const match = seconds?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return match ? (+match[1] || 0) * 3600 + (+match[2] || 0) * 60 + (+match[3] || 0) : undefined;
}

/**
 * Auto-generated music uploads credit the artists in the description, on the line
 * after "Provided to YouTube by", formatted as "Title · Artist · Artist". The
 * uploading channel is no help there — it is often a generic one like "Release - Topic".
 */
function creditedArtists(description: string | undefined) {
  const line = description?.split("\n").find((text) => text.includes(" · "));
  const parts = line?.split(" · ").map((part) => part.trim()).filter(Boolean);
  return parts && parts.length > 1 ? parts.slice(1).join(", ") : undefined;
}

const withoutTopic = (name: string | undefined) => name?.replace(/\s+-\s+Topic$/, "").trim() || undefined;

/** Cache the whole response, so bursts of traffic cost one upstream call per window. */
export const revalidate = 300;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL;
  // Server-only. Never fall back to a NEXT_PUBLIC_* name — those are inlined into the
  // client bundle at build time, which would hand the key to every visitor.
  const key = process.env.YOUTUBE_DATA_API_KEY;
  const id = url && playlistId(url);
  if (!id || !key) return NextResponse.json({ error: "Set NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL and YOUTUBE_DATA_API_KEY to load Tempo FM." }, { status: 500 });
  try {
    const items: YouTubeItem[] = []; let pageToken = "";
    do {
      const endpoint = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      endpoint.search = new URLSearchParams({ part: "snippet", playlistId: id, maxResults: "50", key, ...(pageToken && { pageToken }) }).toString();
      const response = await fetch(endpoint, { next: { revalidate: 300 } });
      if (!response.ok) throw new Error("YouTube rejected the playlist request.");
      const data = await response.json(); items.push(...data.items); pageToken = data.nextPageToken || "";
    } while (pageToken);
    const ids = items.map((item) => item.snippet.resourceId?.videoId).filter(Boolean) as string[];
    const details = new Map<string, Video>();
    for (let i = 0; i < ids.length; i += 50) {
      const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
      endpoint.search = new URLSearchParams({ part: "contentDetails,snippet", id: ids.slice(i, i + 50).join(","), key }).toString();
      const response = await fetch(endpoint, { next: { revalidate: 300 } });
      if (!response.ok) throw new Error("Could not load track details.");
      for (const video of (await response.json()).items as Video[]) details.set(video.id, video);
    }
    return NextResponse.json({ playlistId: id, tracks: items.map(({ snippet }) => {
      const videoId = snippet.resourceId?.videoId!; const video = details.get(videoId);
      const art = snippet.thumbnails?.maxres || snippet.thumbnails?.standard || snippet.thumbnails?.high || snippet.thumbnails?.medium || snippet.thumbnails?.default;
      const artist = creditedArtists(video?.snippet?.description)
        || withoutTopic(video?.snippet?.channelTitle)
        || withoutTopic(snippet.videoOwnerChannelTitle)
        || snippet.channelTitle;
      return { videoId, title: snippet.title, artist, position: snippet.position, thumbnail: art?.url, duration: duration(video?.contentDetails?.duration) };
    }).filter((track) => details.has(track.videoId)) });
  } catch (error) {
    // Log the detail, return a fixed string: an unexpected fetch failure can carry the
    // request URL — and therefore the key — in its message.
    console.error("playlist fetch failed", error);
    return NextResponse.json({ error: "Could not load the playlist right now." }, { status: 502 });
  }
}
