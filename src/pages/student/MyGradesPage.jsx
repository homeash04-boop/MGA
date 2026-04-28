import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
function match(rule,grade,student){if(rule.student_id&&Number(rule.student_id)!==Number(student?.id))return false;if(rule.class_id&&Number(rule.class_id)!==Number(student?.class_id))return false;if(rule.subject_id&&Number(rule.subject_id)!==Number(grade.subject_id))return false;return true}
function show(grade,student,rules){const m=(rules||[]).filter(r=>match(r,grade,student)).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)); return m.length?!!m[m.length-1].is_visible:true}
export default function MyGradesPage(){
 const {user}=useAuth(); const [student,setStudent]=useState(null),[grades,setGrades]=useState([]),[rules,setRules]=useState([])
 useEffect(()=>{load()},[])
 async function load(){const {data:st}=await supabase.from('students').select('id,class_id').eq('profile_id',user.id).maybeSingle(); setStudent(st); const [g,r]=await Promise.all([supabase.from('grades').select('*, subjects(name)').order('created_at',{ascending:false}),supabase.from('grade_visibility_rules').select('*').order('created_at')]); setGrades(g.data||[]); setRules(r.data||[])}
 const visible=useMemo(()=>grades.filter(g=>show(g,student,rules)),[grades,student,rules])
 return <Layout title="درجاتي"><div className="table-wrap"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-right">المادة</th><th className="p-3 text-right">التقييم</th><th className="p-3 text-right">الدرجة</th></tr></thead><tbody>{visible.map(g=><tr key={g.id} className="border-t"><td className="p-3">{g.subjects?.name}</td><td className="p-3">{g.title}</td><td className="p-3 font-bold">{g.score}/{g.max_score}</td></tr>)}</tbody></table></div>{visible.length===0&&<p className="card p-4 mt-4 text-slate-500">لا توجد درجات متاحة للعرض حاليًا</p>}</Layout>
}
