export function extractMapSrc(input) {
  if (!input) return "";
  const str = String(input).trim();
  const iframeMatch = str.match(/src\s*=\s*"([^"]+)"/i);
  if (iframeMatch && iframeMatch[1]) return iframeMatch[1];
  const iframeMatch2 = str.match(/src\s*=\s*'([^']+)'/i);
  if (iframeMatch2 && iframeMatch2[1]) return iframeMatch2[1];
  return str;
}

export default extractMapSrc;
