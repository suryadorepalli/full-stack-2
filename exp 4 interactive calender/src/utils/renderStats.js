// Lightweight store for real React Profiler timing data.
const profilerStats = new Map();
const renderCounts = new Map();

export function recordComponentRender(name) {
  renderCounts.set(name, (renderCounts.get(name) || 0) + 1);
}

export function getRenderCounts() {
  return Object.fromEntries(renderCounts);
}

export function recordProfilerRender(id, actualDuration) {
  const prev = profilerStats.get(id) || { commits: 0, totalDuration: 0, lastDuration: 0 };
  profilerStats.set(id, {
    commits: prev.commits + 1,
    totalDuration: prev.totalDuration + actualDuration,
    lastDuration: actualDuration
  });
}

export function getProfilerStats() {
  return Object.fromEntries(profilerStats);
}

export function resetProfilerStats() {
  profilerStats.clear();
  renderCounts.clear();
}
