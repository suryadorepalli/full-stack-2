// Lightweight store for real React Profiler timing data.
const profilerStats = new Map();
const renderCounts = new Map();
const optimizationRenderCounts = {
  memoCards: { on: 0, off: 0 },
  useCallbackHandlers: { on: 0, off: 0 },
  memoAgenda: { on: 0, off: 0 }
};

export function recordComponentRender(name, settings) {
  renderCounts.set(name, (renderCounts.get(name) || 0) + 1);
  Object.keys(optimizationRenderCounts).forEach((key) => {
    optimizationRenderCounts[key][settings[key] ? 'on' : 'off'] += 1;
  });
}

export function getRenderCounts() {
  return Object.fromEntries(renderCounts);
}

export function getOptimizationRenderCounts() {
  return structuredClone(optimizationRenderCounts);
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
  Object.values(optimizationRenderCounts).forEach((counts) => {
    counts.on = 0;
    counts.off = 0;
  });
}
