import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function ClassSubjectsPage(){
 const [items,setItems]=useState([]),[classes,setClasses]=useState([]),[subjects,setSubjects]=useState([]),[terms,setTerms]=useState([])
 const [form,setForm]=useState({class_id:'',subject_id:'',academic_term_id:''})
 useEffect(()=>{load()},[])
 async function load(){
  const [a,b,c,d]=await Promise.all([
   supabase.from('class_subjects').select('*, classes(name,section), subjects(name), academic_terms(name,year_label)').order('id',{ascending:false}),
   supabase.from('classes').select('*').order('id'), supabase.from('subjects').select('*').order('id'), supabase.from('academic_terms').select('*').order('id',{ascending:false})
  ])
  if(!a.error)setItems(a.data||[]); if(!b.error)setClasses(b.data||[]); if(!c.error)setSubjects(c.data||[]); if(!d.error)setTerms(d.data||[])
 }
 async function save(e){e.preventDefault(); const {error}=await supabase.from('class_subjects').insert({class_id:Number(form.class_id),subject_id:Number(form.subject_id),academic_term_id:form.academic_term_id?Number(form.academic_term_id):null}); if(error)alert(error.message); else{setForm({class_id:'',subject_id:'',academic_term_id:''});load()}}
 return <Layout title="ربط المواد بالصفوف">
  <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-4 gap-3">
    <select className="input" value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} required><option value="">الصف</option>{classes.map(x=><option key={x.id} value={x.id}>{x.name} {x.section||''}</option>)}</select>
    <select className="input" value={form.subject_id} onChange={e=>setForm({...form,subject_id:e.target.value})} required><option value="">المادة</option>{subjects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
    <select className="input" value={form.academic_term_id} onChange={e=>setForm({...form,academic_term_id:e.target.value})}><option value="">الفصل</option>{terms.map(x=><option key={x.id} value={x.id}>{x.name} - {x.year_label}</option>)}</select>
    <button className="btn btn-primary">ربط</button>
  </form>
  <div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">الصف</th><th className="p-3 text-right">المادة</th><th className="p-3 text-right">الفصل</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.classes?.name} {i.classes?.section||''}</td><td className="p-3">{i.subjects?.name}</td><td className="p-3">{i.academic_terms?`${i.academic_terms.name} - ${i.academic_terms.year_label}`:'-'}</td></tr>)}</tbody></table></div>
 </Layout>
}
