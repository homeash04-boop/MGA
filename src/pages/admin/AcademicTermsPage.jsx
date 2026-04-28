import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function AcademicTermsPage(){
  const [items,setItems]=useState([]); const [form,setForm]=useState({name:'',year_label:'',starts_on:'',ends_on:''})
  useEffect(()=>{load()},[])
  async function load(){const {data,error}=await supabase.from('academic_terms').select('*').order('id',{ascending:false}); if(error)alert(error.message); else setItems(data||[])}
  async function save(e){e.preventDefault(); const {error}=await supabase.from('academic_terms').insert({...form, starts_on:form.starts_on||null, ends_on:form.ends_on||null}); if(error)alert(error.message); else{setForm({name:'',year_label:'',starts_on:'',ends_on:''});load()}}
  async function setActive(id){await supabase.from('academic_terms').update({is_active:false}).neq('id',id); await supabase.from('academic_terms').update({is_active:true}).eq('id',id); load()}
  return <Layout title="الفصول الدراسية">
    <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-5 gap-3"><input className="input" placeholder="الفصل" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input className="input" placeholder="السنة" value={form.year_label} onChange={e=>setForm({...form,year_label:e.target.value})} required/><input className="input" type="date" value={form.starts_on} onChange={e=>setForm({...form,starts_on:e.target.value})}/><input className="input" type="date" value={form.ends_on} onChange={e=>setForm({...form,ends_on:e.target.value})}/><button className="btn btn-primary">إضافة</button></form>
    <div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">الفصل</th><th className="p-3 text-right">السنة</th><th className="p-3 text-right">الحالة</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.name}</td><td className="p-3">{i.year_label}</td><td className="p-3">{i.is_active?'نشط':<button onClick={()=>setActive(i.id)} className="text-blue-600 font-bold">جعله نشطًا</button>}</td></tr>)}</tbody></table></div>
  </Layout>
}
