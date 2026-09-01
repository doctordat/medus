// Pure PDF.js text-item line grouping shared by Admin extraction and tests.
// PDF coordinates use a baseline Y; items within tolerance belong to one line.
export function groupTextItemsIntoLines(rawItems, tolerance = 2) {
  const items = (rawItems || [])
    .filter((item) => String(item?.str ?? '').trim())
    .map((item) => ({
      text: String(item.str).trim(),
      x: Number(item.transform?.[4] ?? item.x ?? 0),
      y: Number(item.transform?.[5] ?? item.y ?? 0),
    }))
    .sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  for (const item of items) {
    let line = lines.find((candidate) => Math.abs(candidate.y - item.y) <= tolerance);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  }
  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => line.items.sort((a, b) => a.x - b.x).map((item) => item.text).join(' '));
}
