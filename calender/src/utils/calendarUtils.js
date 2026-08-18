export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const WEEKDAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const EVENT_CATEGORIES = [
  { value:'work', label:'Work', color:'#6C5CE7' },
  { value:'content', label:'Content', color:'#00B894' },
  { value:'meeting', label:'Meeting', color:'#0984E3' },
  { value:'personal', label:'Personal', color:'#E84393' },
  { value:'study', label:'Study', color:'#F39C12' },
  { value:'general', label:'General', color:'#7F8C8D' }
];
export const categoryColor = (value) => EVENT_CATEGORIES.find(c => c.value === value)?.color || '#7F8C8D';
export const categoryLabel = (value) => EVENT_CATEGORIES.find(c => c.value === value)?.label || 'General';
export const toDateKey = (year, month, day) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
export const todayKey = () => { const d = new Date(); return toDateKey(d.getFullYear(), d.getMonth(), d.getDate()); };
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({length:42}, (_, i) => { const d = new Date(start); d.setDate(start.getDate()+i); return { dateKey:toDateKey(d.getFullYear(),d.getMonth(),d.getDate()), day:d.getDate(), isCurrentMonth:d.getMonth()===month }; });
}
export const groupEventsByDate = (events) => events.reduce((map,e) => { const arr=map.get(e.date)||[]; arr.push(e); arr.sort((a,b)=>(a.time||'').localeCompare(b.time||'')); map.set(e.date,arr); return map; }, new Map());
export const formatLongDate = (key) => new Date(`${key}T00:00:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
