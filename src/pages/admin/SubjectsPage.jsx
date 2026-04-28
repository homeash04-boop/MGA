import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function SubjectsPage(){
  const [items,setItems]=useState([]); const [form,setForm]=useState({name:'',code:''}); const [editingId,setEditingId]=useState(null)
  useEffect(()=>{load()},[])
  async function load(){const {data,error}=await supabase.from('subjects').select('*').order('id'); if(error)alert(error.message); else setItems(data||[])}
  async function save(e){e.preventDefault(); const payload={name:form.name,code:form.code||null}; const q=editingId?supabase.from('subjects').update(payload).eq('id',editingId):supabase.from('subjects').insert(payload); const {error}=await q; if(error)alert(error.message); else{setForm({name:'',code:''});setEditingId(null);load()}}
  async function remove(id){if(!confirm('حذف المادة؟'))return; const {error}=await supabase.from('subjects').delete().eq('id',id); if(error)alert(error.message); else load()}
  return <Layout title="إدارة المواد">
    <form onSubmit={save} className="card p-4 mb-6 grid md:grid-cols-3 gap-3"><input className="input" placeholder="اسم المادة" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input className="input" placeholder="الكود" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/><button className="btn btn-primary">{editingId?'حفظ التعديل':'إضافة مادة'}</button></form>
    <div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">المادة</th><th className="p-3 text-right">الكود</th><th className="p-3 text-right">إجراءات</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.name}</td><td className="p-3">{i.code||'-'}</td><td className="p-3 flex gap-3"><button onClick={()=>{setEditingId(i.id);setForm({name:i.name,code:i.code||''})}} className="text-blue-600 font-bold">تعديل</button><button onClick={()=>remove(i.id)} className="text-red-600 font-bold">حذف</button></td></tr>)}</tbody></table></div>
  </Layout>
}
