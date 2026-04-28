import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function PasswordResetRequestsPage(){
 const [items,setItems]=useState([])
 useEffect(()=>{load()},[])
 async function load(){const {data,error}=await supabase.from('password_reset_requests').select('*').order('created_at',{ascending:false}); if(error)alert(error.message); else setItems(data||[])}
 async function review(id,decision){const {data,error}=await supabase.functions.invoke('approve-password-reset',{body:{request_id:id,decision,redirect_to:`${window.location.origin}/update-password`}}); if(error)alert(error.message); else if(data?.error)alert(data.error); else{ if(data.action_link){await navigator.clipboard.writeText(data.action_link); alert('تم نسخ رابط تغيير كلمة المرور')} else alert('تم التنفيذ'); load()}}
 return <Layout title="طلبات تغيير كلمة المرور"><div className="table-wrap"><table className="w-full text-sm min-w-[800px]"><thead className="bg-slate-50"><tr><th className="p-3 text-right">البريد</th><th className="p-3 text-right">الحالة</th><th className="p-3 text-right">الرابط</th><th className="p-3 text-right">إجراءات</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3" dir="ltr">{i.email}</td><td className="p-3">{i.status}</td><td className="p-3">{i.action_link?<button onClick={()=>navigator.clipboard.writeText(i.action_link)} className="text-blue-600 font-bold">نسخ</button>:'-'}</td><td className="p-3 flex gap-2">{i.status==='pending'?<><button onClick={()=>review(i.id,'approved')} className="btn btn-green text-xs">موافقة</button><button onClick={()=>review(i.id,'rejected')} className="btn btn-red text-xs">رفض</button></>:'تمت المراجعة'}</td></tr>)}</tbody></table></div></Layout>
}
