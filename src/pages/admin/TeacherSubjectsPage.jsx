import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function TeacherSubjectsPage(){
 const [items,setItems]=useState([]),[teachers,setTeachers]=useState([]),[classes,setClasses]=useState([]),[subjects,setSubjects]=useState([])
 const [form,setForm]=useState({teacher_id:'',class_id:'',subject_id:''})
 useEffect(()=>{load()},[])
 async function load(){
  const [a,b,c,d]=await Promise.all([
   supabase.from('teacher_subjects').select('*, profiles(full_name), classes(name,section), subjects(name)').order('id',{ascending:false}),
   supabase.from('profiles').select('*').eq('role','teacher').order('full_name'),
   supabase.from('classes').select('*').order('id'), supabase.from('subjects').select('*').order('id')
  ])
  if(!a.error)setItems(a.data||[]); if(!b.error)setTeachers(b.data||[]); if(!c.error)setClasses(c.data||[]); if(!d.error)setSubjects(d.data||[])
 }
 async function save(e){e.preventDefault(); const {error}=await supabase.from('teacher_subjects').insert({teacher_id:form.teacher_id,class_id:Number(form.class_id),subject_id:Number(form.subject_id)}); if(error)alert(error.message); else{setForm({teacher_id:'',class_id:'',subject_id:''});load()}}
 return <Layout title="ربط المعلمين بالمواد والصفوف">
  <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-4 gap-3">
   <select className="input" value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})} required><option value="">المعلم</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.full_name}</option>)}</select>
   <select className="input" value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} required><option value="">الصف</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section||''}</option>)}</select>
   <select className="input" value={form.subject_id} onChange={e=>setForm({...form,subject_id:e.target.value})} required><option value="">المادة</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
   <button className="btn btn-primary">ربط</button>
  </form>
  <div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">المعلم</th><th className="p-3 text-right">الصف</th><th className="p-3 text-right">المادة</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.profiles?.full_name}</td><td className="p-3">{i.classes?.name} {i.classes?.section||''}</td><td className="p-3">{i.subjects?.name}</td></tr>)}</tbody></table></div>
 </Layout>
}
