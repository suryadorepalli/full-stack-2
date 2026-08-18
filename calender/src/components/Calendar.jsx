import React,{useCallback,useMemo,useState} from 'react';
import { ChevronLeft,ChevronRight,Plus,CalendarDays } from 'lucide-react';
import CalendarDay from './CalendarDay.jsx';
import { MONTH_NAMES,WEEKDAY_LABELS,buildMonthGrid,groupEventsByDate,todayKey } from '../utils/calendarUtils.js';
export default function Calendar({events,onEventClick,onDayClick,onMoveEvent,onCreateFromDrop}){
 const [currentDate,setCurrentDate]=useState(new Date()),[draggingEventId,setDraggingEventId]=useState(null),[dragPayload,setDragPayload]=useState(null);
 const year=currentDate.getFullYear(),month=currentDate.getMonth();
 const grid=useMemo(()=>buildMonthGrid(year,month),[year,month]); const byDate=useMemo(()=>groupEventsByDate(events),[events]); const today=todayKey();
 const nav=useCallback(delta=>setCurrentDate(d=>new Date(d.getFullYear(),d.getMonth()+delta,1)),[]);
 const start=useCallback((e,event)=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',event.id);setDraggingEventId(event.id);setDragPayload(null)},[]);
 const end=useCallback(()=>{setDraggingEventId(null);setDragPayload(null)},[]);
 const handleDrop=useCallback((date,e)=>{setDraggingEventId(id=>{if(id) onMoveEvent(id,date); return null}); if(!draggingEventId && e.dataTransfer.getData('application/x-new-event')==='new-event') onCreateFromDrop(date); setDragPayload(null)},[draggingEventId,onMoveEvent,onCreateFromDrop]);
 const startNewDrag=e=>{e.dataTransfer.setData('application/x-new-event','new-event');e.dataTransfer.effectAllowed='copy';setDragPayload('new')};
 return <section className="calendar-shell"><div className="calendar__toolbar"><div className="calendar__title"><div className="calendar__icon"><CalendarDays size={20}/></div><div><h2>{MONTH_NAMES[month]} {year}</h2><p>Drag posts to reschedule • click a day to add</p></div></div><div className="calendar__actions"><button className="btn btn--soft" onClick={()=>setCurrentDate(new Date())}>Today</button><button className="icon-btn" onClick={()=>nav(-1)} aria-label="Previous month"><ChevronLeft/></button><button className="icon-btn" onClick={()=>nav(1)} aria-label="Next month"><ChevronRight/></button></div></div>
 <div className="calendar__weekdays">{WEEKDAY_LABELS.map(x=><div key={x}>{x}</div>)}</div><div className="calendar__grid">{grid.map(c=><CalendarDay key={c.dateKey} {...c} isToday={c.dateKey===today} events={byDate.get(c.dateKey)||[]} onEventClick={onEventClick} onDayClick={onDayClick} onDragStart={start} onDragEnd={end} onDrop={handleDrop} draggingEventId={draggingEventId} creatingDrag={dragPayload==='new'}/>)}</div>
 <div className="calendar__footer"><div className="drop-create" draggable onDragStart={startNewDrag} onDragEnd={end}><Plus size={15}/> Drag here, then drop on a day to create</div><span>42-day month grid • responsive layout</span></div></section>
}
