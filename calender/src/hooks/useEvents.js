import { useCallback,useEffect,useState } from 'react';
import { createEvent,deleteEvent,getEvents,updateEvent } from '../services/eventService.js';
export function useEvents(){
 const [events,setEvents]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(null);
 const loadEvents=useCallback(async()=>{setLoading(true);setError(null);try{setEvents(await getEvents())}catch(e){setError(e.message||'Failed to load events')}finally{setLoading(false)}},[]);
 useEffect(()=>{loadEvents()},[loadEvents]);
 const addEvent=useCallback(async data=>{const e=await createEvent(data);setEvents(p=>[...p,e]);return e},[]);
 const editEvent=useCallback(async(id,data)=>{const e=await updateEvent(id,data);setEvents(p=>p.map(x=>x.id===id?e:x));return e},[]);
 const removeEvent=useCallback(async id=>{await deleteEvent(id);setEvents(p=>p.filter(x=>x.id!==id))},[]);
 const moveEvent=useCallback(async(id,date)=>editEvent(id,{date}),[editEvent]);
 return {events,loading,error,reloadEvents:loadEvents,addEvent,editEvent,removeEvent,moveEvent};
}
