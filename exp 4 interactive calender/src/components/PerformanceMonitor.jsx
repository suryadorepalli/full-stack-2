import React, { useEffect, useState } from 'react';
import { useOptimizationSettings } from '../context/OptimizationContext.jsx';
import {
  getOptimizationRenderCounts,
  getProfilerStats,
  getRenderCounts,
  resetProfilerStats
} from '../utils/renderStats.js';

const TOGGLES = [
  {
    key: 'memoCards',
    label: 'React.memo on cards',
    help: 'EventCard skips re-rendering when its own props are unchanged.'
  },
  {
    key: 'useCallbackHandlers',
    label: 'useCallback on handlers',
    help: 'Click/drag handlers keep a stable reference instead of being recreated every render.'
  },
  {
    key: 'memoAgenda',
    label: 'useMemo for agenda',
    help: 'The "Upcoming Events" list is only recomputed when events or the search term change.'
  }
];

/**
 * "Heavier" analytics-style panel, intentionally code-split via React.lazy
 * in App.jsx to demonstrate lazy loading + Suspense.
 *
 * It combines three things the experiment's "Re-render Analysis" section
 * asks for:
 *  1. Three optimize/unoptimize toggles (backed by OptimizationContext) that
 *     actually flip real React.memo/useCallback/useMemo usage at runtime.
 *  2. Real render-duration data captured via React's built-in <Profiler>
 *     API (wired up in App.jsx around the calendar and the agenda list),
 *     showing actual milliseconds spent rendering — not a simulated number.
 */
function PerformanceMonitor({ visibleEventCount, filteredEventCount, totalEventCount }) {
  const { settings, toggle } = useOptimizationSettings();
  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [liveStats, setLiveStats] = useState(() => ({
    profiler: getProfilerStats(),
    renders: getRenderCounts(),
    optimizationRenders: getOptimizationRenderCounts()
  }));

  useEffect(() => {
    setLastUpdate(new Date());
  }, [visibleEventCount, filteredEventCount, totalEventCount]);

  // Poll the shared render-stats store on an interval while this panel is
  // mounted, rather than subscribing with setState calls fired from inside
  // other components' render phases (which React warns against).
  useEffect(() => {
    const id = setInterval(() => {
      setLiveStats({
        profiler: getProfilerStats(),
        renders: getRenderCounts(),
        optimizationRenders: getOptimizationRenderCounts()
      });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleReset = () => {
    resetProfilerStats();
    setLiveStats({
      profiler: getProfilerStats(),
      renders: getRenderCounts(),
      optimizationRenders: getOptimizationRenderCounts()
    });
  };

  const profilerIds = Object.keys(liveStats.profiler).sort();
  const renderCount = Object.values(liveStats.renders).reduce((total, count) => total + count, 0);

  return (
    <div className="performance-monitor">
      <h3>Optimization Lab</h3>
      <p className="performance-monitor__hint">
        Toggle the React optimizations below and compare the real Profiler timings.
      </p>

      <div className="perf-toggles">
        {TOGGLES.map(({ key, label, help }) => (
          <label key={key} className="perf-toggle" title={help}>
            <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />
            <span>
              {label}
              <em>{settings[key] ? 'Optimized' : 'Unoptimized'}</em>
            </span>
          </label>
        ))}
      </div>

      <dl className="performance-monitor__stats">
        <dt>Total events</dt>
        <dd>{totalEventCount}</dd>
        <dt>Matching events</dt>
        <dd>{filteredEventCount}</dd>
        <dt>This month</dt>
        <dd>{visibleEventCount}</dd>
        <dt>Tracked renders</dt>
        <dd>{renderCount}</dd>
        <dt>Updated</dt>
        <dd>{lastUpdate.toLocaleTimeString()}</dd>
      </dl>

      <div className="performance-monitor__section">
        <h4>Render count comparison</h4>
        <table className="performance-monitor__table">
          <thead>
            <tr>
              <th>Optimization</th>
              <th>On</th>
              <th>Off</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {TOGGLES.map(({ key, label }) => {
              const counts = liveStats.optimizationRenders[key];
              const difference = counts.off - counts.on;
              return (
                <tr key={key}>
                  <td>{label}</td>
                  <td>{counts.on}</td>
                  <td>{counts.off}</td>
                  <td>{difference > 0 ? `+${difference}` : difference}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="performance-monitor__section">
        <h4>React Profiler timings</h4>
        {profilerIds.length === 0 ? (
          <p className="performance-monitor__empty">Interact with the calendar to collect timing data.</p>
        ) : (
          <table className="performance-monitor__table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Commits</th>
                <th>Last (ms)</th>
                <th>Total (ms)</th>
              </tr>
            </thead>
            <tbody>
              {profilerIds.map((id) => {
                const stat = liveStats.profiler[id];
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{stat.commits}</td>
                    <td>{stat.lastDuration.toFixed(2)}</td>
                    <td>{stat.totalDuration.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button type="button" className="btn btn--ghost btn--full" onClick={handleReset}>
        Reset render measurements
      </button>
    </div>
  );
}

export default PerformanceMonitor;
