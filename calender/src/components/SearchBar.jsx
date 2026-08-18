import React from 'react';
import { Search } from 'lucide-react';
export default React.memo(function SearchBar({value,onChange,resultCount,totalCount}){return <div className="search-bar"><Search size={18}/><input aria-label="Search events" type="search" placeholder="Search events, categories or notes…" value={value} onChange={e=>onChange(e.target.value)}/><span className="search-count">{value?`${resultCount} matches`:`${totalCount} events`}</span></div>});
