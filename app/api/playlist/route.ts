import { NextResponse } from "next/server";

type YouTubeItem = { snippet: { resourceId?: { videoId?: string }; title: string; videoOwnerChannelTitle?: string; channelTitle: string; position: number; thumbnails?: Record<string, { url: string }> } };
type Video = { id: string; contentDetails?: { duration?: string }; snippet?: { channelTitle?: string } };

function playlistId(url: string) {
  try { return new URL(url).searchParams.get("list"); } catch { return null; }
}
function duration(seconds: string | undefined) {
  const match = seconds?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return match ? (+match[1] || 0) * 3600 + (+match[2] || 0) * 60 + (+match[3] || 0) : undefined;
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_URL;
  const key = process.env.YOUTUBE_DATA_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
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
      return { videoId, title: snippet.title, channel: snippet.videoOwnerChannelTitle || video?.snippet?.channelTitle || snippet.channelTitle, position: snippet.position, thumbnail: art?.url, duration: duration(video?.contentDetails?.duration) };
    }).filter((track) => details.has(track.videoId)) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load playlist." }, { status: 502 }); }
}
