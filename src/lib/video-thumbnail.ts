const YOUTUBE_HOSTNAME_PATTERN = /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i;

function extractYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTNAME_PATTERN.test(parsed.hostname)) return null;

  if (parsed.hostname.toLowerCase().includes("youtu.be")) {
    return parsed.pathname.slice(1) || null;
  }

  if (parsed.pathname === "/watch") {
    return parsed.searchParams.get("v");
  }

  const pathMatch = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
  return pathMatch ? pathMatch[1] : null;
}

// Returns a thumbnail image URL for recognized video hosts (currently
// YouTube), or null if the URL doesn't match a known pattern — callers
// should fall back to a generic placeholder in that case.
export function getVideoThumbnailUrl(videoUrl: string): string | null {
  const youTubeId = extractYouTubeVideoId(videoUrl);
  if (youTubeId) {
    return `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
  }
  return null;
}
