const STORAGE_KEY = 'suriya-calendar-events-v2';
const seed = [
 {id:'e1',title:'Team Standup',date:'2026-08-17',time:'09:30',category:'meeting',description:'Daily product sync and blockers.'},
 {id:'e2',title:'Design Review',date:'2026-08-20',time:'10:00',category:'work',description:'Review the new landing page.'},
 {id:'e3',title:'Instagram Content',date:'2026-08-21',time:'14:00',category:'content',description:'Prepare and schedule the weekend carousel.'},
 {id:'e4',title:'Gym Session',date:'2026-08-22',time:'18:30',category:'personal',description:'Evening workout.'},
 {id:'e5',title:'Sprint Planning',date:'2026-08-24',time:'11:00',category:'work',description:'Plan sprint goals and assign tasks.'},
 {id:'e6',title:'Birthday Party',date:'2026-08-27',time:'19:00',category:'personal',description:'Family birthday celebration.'},
 {id:'e7',title:'Mock Interview',date:'2026-08-28',time:'15:30',category:'study',description:'Practice technical interview questions.'},
 {id:'e8',title:'Project Post',date:'2026-08-30',time:'12:00',category:'content',description:'Publish the project showcase post.'}
];
function read(){ try { const raw=localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw); localStorage.setItem(STORAGE_KEY,JSON.stringify(seed)); return seed; } catch { return seed; } }
function write(events){ localStorage.setItem(STORAGE_KEY,JSON.stringify(events)); }
const wait = () => new Promise(r=>setTimeout(r,80));
export async function getEvents(){ await wait(); return read(); }
export async function createEvent(data){ await wait(); const events=read(); const created={...data,id:`e-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}; write([...events,created]); return created; }
export async function updateEvent(id, updates){ await wait(); const events=read(); const updated=events.map(e=>e.id===id?{...e,...updates}:e).find(e=>e.id===id); if(!updated) throw new Error('Event not found'); write(events.map(e=>e.id===id?updated:e)); return updated; }
export async function deleteEvent(id){ await wait(); write(read().filter(e=>e.id!==id)); return {ok:true}; }
export function resetDemoData(){ write(seed); return seed; }
