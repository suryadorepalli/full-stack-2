import React from 'react';
import { ArrowUpRight,CalendarClock } from 'lucide-react';
import {categoryColor,categoryLabel} from '../utils/calendarUtils.js';
export default React.memo(function EventList({events,onEventClick}){if(!events.length)return <div className="empty-state"><CalendarClock/><p>No upcoming events.</p></div>;return <div className="event-list">{events.map(e=><button key={e.id} className="event-list__item" onClick={()=>onEventClick(e)} style={{'--event-color':categoryColor(e.category)}}><span className="event-list__dot"/><span className="event-list__content"><small>{e.date} • {e.time||'Any time'}</small><strong>{e.title}</strong><em>{categoryLabel(e.category)}</em></span><ArrowUpRight size={16}/></button>)}</div>});
