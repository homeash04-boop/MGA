import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
export default function MyAttendancePage(){const {user}=useAuth(); const [items,setItems]=useState([]); useEffect(()=>{load()},[]); async function load(){const {data:st}=await supabase.from('students').select('id').eq('profile_id',user.id).maybeSingle(); if(!st)return; const {data}=await supabase.from('attendance').select('*').eq('student_id',st.id).order('date',{ascending:false}); setItems(data||[])} return <Layout title="حضوري"><div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">التاريخ</th><th className="p-3 text-right">الحالة</th></tr></thead><tbody>{items.map(i=><tr key={i.id} className="border-t"><td className="p-3">{i.date}</td><td className="p-3">{i.status}</td></tr>)}</tbody></table></div></Layout>}
