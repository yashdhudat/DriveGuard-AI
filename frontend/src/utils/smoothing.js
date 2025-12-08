export function smoothData(data, key, windowSize = 5) {
  if (!data.length) return data;
  const smoothed = [];

  for (let i = 0; i < data.length; i++) {
    let start = Math.max(0, i - windowSize + 1);
    let chunk = data.slice(start, i + 1);

    let avg =
      chunk.reduce((sum, item) => sum + (item[key] || 0), 0) /
      chunk.length;

    smoothed.push({
      ...data[i],
      [key]: avg,
    });
  }
  return smoothed;
}
