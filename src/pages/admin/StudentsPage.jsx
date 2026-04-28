import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function StudentsPage(){
  const [profiles,setProfiles]=useState([]), [classes,setClasses]=useState([]), [students,setStudents]=useState([])
  const [form,setForm]=useState({profile_id:'',class_id:'',student_number:'',date_of_birth:'',address:''})
  useEffect(()=>{load()},[])
  async function load(){
    const [p,c,s]=await Promise.all([
      supabase.from('profiles').select('*').eq('role','student').order('full_name'),
      supabase.from('classes').select('*').order('id'),
      supabase.from('students').select('*, profiles(full_name), classes(name,section)').order('id',{ascending:false})
    ])
    if(!p.error)setProfiles(p.data||[]); if(!c.error)setClasses(c.data||[]); if(!s.error)setStudents(s.data||[])
  }
  async function save(e){e.preventDefault(); const {error}=await supabase.from('students').insert({...form,class_id:Number(form.class_id),date_of_birth:form.date_of_birth||null}); if(error)alert(error.message); else{setForm({profile_id:'',class_id:'',student_number:'',date_of_birth:'',address:''});load()}}
  return <Layout title="إدارة الطلاب">
    <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-5 gap-3">
      <select className="input" value={form.profile_id} onChange={e=>setForm({...form,profile_id:e.target.value})} required><option value="">اختر حساب الطالب</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}</select>
      <select className="input" value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} required><option value="">اختر الصف</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section||''}</option>)}</select>
      <input className="input" placeholder="رقم الطالب" value={form.student_number} onChange={e=>setForm({...form,student_number:e.target.value})}/>
      <input className="input" type="date" value={form.date_of_birth} onChange={e=>setForm({...form,date_of_birth:e.target.value})}/>
      <button className="btn btn-primary">إضافة طالب</button>
      <input className="input md:col-span-5" placeholder="العنوان" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
    </form>
    <div className="table-wrap"><table className="w-full text-sm min-w-[700px]"><thead className="bg-slate-50"><tr><th className="p-3 text-right">الطالب</th><th className="p-3 text-right">رقمه</th><th className="p-3 text-right">الصف</th><th className="p-3 text-right">العنوان</th></tr></thead><tbody>{students.map(s=><tr key={s.id} className="border-t"><td className="p-3">{s.profiles?.full_name}</td><td className="p-3">{s.student_number}</td><td className="p-3">{s.classes?.name} {s.classes?.section||''}</td><td className="p-3">{s.address||'-'}</td></tr>)}</tbody></table></div>
  </Layout>
}
