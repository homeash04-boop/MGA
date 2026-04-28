import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
export default function ChildrenPage(){const {user}=useAuth(); const [items,setItems]=useState([]); useEffect(()=>{load()},[]); async function load(){const {data}=await supabase.from('parent_students').select('*, students(student_number, profiles(full_name), classes(name,section))').eq('parent_id',user.id); setItems(data||[])} return <Layout title="أبنائي"><div className="grid md:grid-cols-2 gap-4">{items.map(i=><div key={i.id} className="card p-4"><h3 className="font-black">{i.students?.profiles?.full_name}</h3><p>رقم الطالب: {i.students?.student_number}</p><p>الصف: {i.students?.classes?.name} {i.students?.classes?.section||''}</p></div>)}</div></Layout>}
