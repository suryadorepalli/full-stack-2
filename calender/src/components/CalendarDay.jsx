import React,{memo,useState} from 'react';
import EventCard from './EventCard.jsx';
export default memo(function CalendarDay({dateKey,day,isCurrentMonth,isToday,events,onEventClick,onDayClick,onDragStart,onDragEnd,onDrop,draggingEventId,creatingDrag}){
 const [over,setOver]=useState(false);
 return <div className={`calendar-day ${!isCurrentMonth?'calendar-day--outside':''} ${isToday?'calendar-day--today':''} ${over?'calendar-day--drag-over':''}`} data-date={dateKey} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);onDrop(dateKey,e)}} onClick={()=>onDayClick(dateKey)}>
  <div className="calendar-day__header"><span className={`calendar-day__number ${isToday?'is-today':''}`}>{day}</span>{isToday&&<span className="calendar-day__today-badge">TODAY</span>}</div>
  <div className="calendar-day__events">{events.map(e=><EventCard key={e.id} event={e} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggingEventId===e.id}/>)}</div>
  {over&&creatingDrag&&<div className="drop-hint">Drop to create</div>}
 </div>
});
