const PROXY_BASE = 'https://gtfs-proxy.sys-dev-run.re/proxy/'

export const proxyUrl = (url: string): string => {
  // Don't proxy relative or absolute paths (local files)
  if (url.startsWith('./') || url.startsWith('/') || url.startsWith('../')) {
    return url
  }

  // Only proxy remote HTTP/HTTPS URLs
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return PROXY_BASE + parsed.host + parsed.pathname + parsed.search
    }
    return url
  } catch {
    // If URL parsing fails, assume it's a relative path
    return url
  }
}
