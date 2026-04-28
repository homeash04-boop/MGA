import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
const days={1:'الأحد',2:'الاثنين',3:'الثلاثاء',4:'الأربعاء',5:'الخميس',6:'الجمعة',7:'السبت'}
export default function TimetableAdminPage(){
 const [items,setItems]=useState([]),[classes,setClasses]=useState([]),[subjects,setSubjects]=useState([]),[teachers,setTeachers]=useState([])
 const [form,setForm]=useState({class_id:'',subject_id:'',teacher_id:'',day_of_week:1,start_time:'08:00',end_time:'08:45',room:''})
 useEffect(()=>{load()},[])
 async function load(){
  const [a,b,c,d]=await Promise.all([
   supabase.from('timetable').select('*, classes(name,section), subjects(name), profiles(full_name)').order('day_of_week'),
   supabase.from('classes').select('*'), supabase.from('subjects').select('*'), supabase.from('profiles').select('*').eq('role','teacher')
  ])
  if(!a.error)setItems(a.data||[]); if(!b.error)setClasses(b.data||[]); if(!c.error)setSubjects(c.data||[]); if(!d.error)setTeachers(d.data||[])
 }
 async function save(e){e.preventDefault(); const {error}=await supabase.from('timetable').insert({...form,class_id:Number(form.class_id),subject_id:Number(form.subject_id),day_of_week:Number(form.day_of_week),teacher_id:form.teacher_id||null}); if(error)alert(error.message); else load()}
 return <Layout title="الجدول الدراسي">
  <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-4 gap-3">
   <select className="input" value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} required><option value="">الصف</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section||''}</option>)}</select>
   <select className="input" value={form.subject_id} onChange={e=>setForm({...form,subject_id:e.target.value})} required><option value="">المادة</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
   <select className="input" value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})}><option value="">المعلم</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.full_name}</option>)}</select>
   <select className="input" value={form.day_of_week} onChange={e=>setForm({...form,day_of_week:e.target.value})}>{Object.entries(days).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
   <input className="input" type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})}/><input className="input" type="time" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})}/><input className="input" placeholder="الغرفة" value={form.room} onChange={e=>setForm({...form,room:e.target.value})}/><button className="btn btn-primary">إضافة حصة</button>
  </form>
  <div className="table-wrap"><table className="w-full text-sm min-w-[800px]"><thead className="bg-slate-50"><tr><th className="p-3 text-right">اليوم</th><th className="p-3 text-right">الصف</th><th className="p-3 text-right">المادة</th><th className="p-3 text-right">المعلم</th><th className="p-3 text-right">الوقت</th><th className="p-3 text-right">الغرفة</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{days[i.day_of_week]}</td><td className="p-3">{i.classes?.name} {i.classes?.section||''}</td><td className="p-3">{i.subjects?.name}</td><td className="p-3">{i.profiles?.full_name}</td><td className="p-3">{i.start_time} - {i.end_time}</td><td className="p-3">{i.room||'-'}</td></tr>)}</tbody></table></div>
 </Layout>
}
