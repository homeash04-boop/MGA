import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
export default function OnlineAssignmentsPage(){
 const {user}=useAuth(); const [student,setStudent]=useState(null),[assignments,setAssignments]=useState([]),[answers,setAnswers]=useState({})
 useEffect(()=>{load()},[])
 async function load(){const {data:st}=await supabase.from('students').select('id,class_id').eq('profile_id',user.id).maybeSingle(); if(!st)return; setStudent(st); const {data}=await supabase.from('assignments').select('*, subjects(name)').eq('class_id',st.class_id).eq('is_online',true).order('created_at',{ascending:false}); setAssignments(data||[])}
 async function submit(a){const text=answers[a.id]||''; if(!text.trim())return alert('اكتب الإجابة'); const {error}=await supabase.from('assignment_submissions').upsert({assignment_id:a.id,student_id:student.id,answer_text:text,submitted_at:new Date().toISOString()},{onConflict:'assignment_id,student_id'}); if(error)alert(error.message); else alert('تم التسليم')}
 return <Layout title="واجبات أونلاين"><div className="space-y-4">{assignments.map(a=><div key={a.id} className="card p-4"><h3 className="font-black">{a.title}</h3><p className="text-sm text-slate-500">{a.subjects?.name} - آخر موعد: {a.due_date||'-'}</p><p className="my-3">{a.description}</p><textarea className="input min-h-[120px]" placeholder="إجابتك" value={answers[a.id]||''} onChange={e=>setAnswers({...answers,[a.id]:e.target.value})}/><button onClick={()=>submit(a)} className="btn btn-primary mt-3">تسليم</button></div>)}</div></Layout>
}
