// Lightweight store for real React Profiler timing data.
const profilerStats = new Map();

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
}
