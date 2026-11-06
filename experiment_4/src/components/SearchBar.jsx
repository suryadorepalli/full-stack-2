import React, { memo } from 'react';

/**
 * Wrapped in React.memo so the search input avoids unnecessary updates when
 * its props remain unchanged.
 */
function SearchBar({ value, onChange, resultCount, totalCount }) {

  return (
    <div className="search-bar">
      <input
        type="search"
        aria-label="Search events"
        placeholder="Search events by title, category or description…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <span className="search-count">
          {resultCount} of {totalCount} events match
        </span>
      ) : (
        <span className="search-count search-count--muted">{totalCount} events total</span>
      )}
    </div>
  );
}

export default memo(SearchBar);
