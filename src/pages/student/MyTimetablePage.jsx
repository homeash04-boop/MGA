import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
const days={1:'الأحد',2:'الاثنين',3:'الثلاثاء',4:'الأربعاء',5:'الخميس',6:'الجمعة',7:'السبت'}
export default function MyTimetablePage(){const {user}=useAuth(); const [items,setItems]=useState([]); useEffect(()=>{load()},[]); async function load(){const {data:st}=await supabase.from('students').select('class_id').eq('profile_id',user.id).maybeSingle(); if(!st)return; const {data}=await supabase.from('timetable').select('*, subjects(name), profiles(full_name)').eq('class_id',st.class_id).order('day_of_week'); setItems(data||[])} return <Layout title="جدولي الدراسي"><div className="grid md:grid-cols-2 gap-4">{items.map(i=><div key={i.id} className="card p-4"><h3 className="font-black">{days[i.day_of_week]}</h3><p>{i.subjects?.name}</p><p className="text-slate-500">{i.start_time} - {i.end_time}</p><p className="text-slate-500">المعلم: {i.profiles?.full_name||'-'}</p></div>)}</div></Layout>}
