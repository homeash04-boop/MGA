import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
export default function AttendancePage(){
 const {user}=useAuth(); const [classes,setClasses]=useState([]),[students,setStudents]=useState([]),[classId,setClassId]=useState(''),[date,setDate]=useState(new Date().toISOString().slice(0,10))
 useEffect(()=>{supabase.from('classes').select('*').then(r=>setClasses(r.data||[]))},[])
 async function loadStudents(id){setClassId(id); const {data}=await supabase.from('students').select('id, student_number, profiles(full_name)').eq('class_id',id); setStudents(data||[])}
 async function mark(st,status){const {error}=await supabase.from('attendance').upsert({student_id:st.id,class_id:Number(classId),date,status,created_by:user.id},{onConflict:'student_id,date'}); if(error)alert(error.message); else alert('تم التسجيل')}
 return <Layout title="الحضور والغياب"><div className="card p-4 mb-6 grid md:grid-cols-3 gap-3"><select className="input" value={classId} onChange={e=>loadStudents(e.target.value)}><option value="">اختر الصف</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name} {c.section||''}</option>)}</select><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><div className="space-y-2">{students.map(s=><div key={s.id} className="card p-3 flex justify-between items-center"><span>{s.profiles?.full_name}</span><div className="flex gap-2"><button onClick={()=>mark(s,'present')} className="btn btn-green text-xs">حاضر</button><button onClick={()=>mark(s,'absent')} className="btn btn-red text-xs">غائب</button><button onClick={()=>mark(s,'late')} className="btn btn-dark text-xs">متأخر</button></div></div>)}</div></Layout>
}
