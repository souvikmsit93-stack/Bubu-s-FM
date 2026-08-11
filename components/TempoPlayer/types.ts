export type Track = { videoId: string; title: string; artist: string; position: number; thumbnail?: string; duration?: number };
export type PlayerState = { currentIndex: number; isPlaying: boolean; currentTime: number; duration: number; volume: number; isMuted: boolean; isReady: boolean; error?: string };
