import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
export default function AnnouncementsPage(){
 const {user}=useAuth(); const [items,setItems]=useState([]); const [form,setForm]=useState({title:'',body:'',target_role:''})
 useEffect(()=>{load()},[])
 async function load(){const {data,error}=await supabase.from('announcements').select('*').order('created_at',{ascending:false}); if(error)alert(error.message); else setItems(data||[])}
 async function save(e){e.preventDefault(); const {error}=await supabase.from('announcements').insert({title:form.title,body:form.body,target_role:form.target_role||null,created_by:user.id}); if(error)alert(error.message); else{setForm({title:'',body:'',target_role:''});load()}}
 return <Layout title="الإعلانات">
  <form onSubmit={save} className="card p-4 mb-6 grid gap-3"><input className="input" placeholder="العنوان" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><select className="input" value={form.target_role} onChange={e=>setForm({...form,target_role:e.target.value})}><option value="">الكل</option><option value="student">الطلاب</option><option value="teacher">المعلمون</option><option value="parent">أولياء الأمور</option></select><textarea className="input min-h-[120px]" placeholder="نص الإعلان" value={form.body} onChange={e=>setForm({...form,body:e.target.value})} required/><button className="btn btn-primary">نشر</button></form>
  <div className="space-y-3">{items.map(i=><div key={i.id} className="card p-4"><h3 className="font-black">{i.title}</h3><p className="text-slate-600 whitespace-pre-wrap">{i.body}</p><p className="text-xs text-slate-400 mt-2">{i.target_role||'الكل'}</p></div>)}</div>
 </Layout>
}
