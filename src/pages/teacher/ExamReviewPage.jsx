import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function ExamReviewPage(){
 const [attempts,setAttempts]=useState([]),[selected,setSelected]=useState(null),[answers,setAnswers]=useState([])
 useEffect(()=>{load()},[])
 async function load(){const {data,error}=await supabase.from('online_exam_attempts').select('*, online_exams(title), students(student_number, profiles(full_name))').order('submitted_at',{ascending:false}); if(error)alert(error.message); else setAttempts(data||[])}
 async function open(a){setSelected(a); const {data}=await supabase.from('online_exam_answers').select('*, online_exam_questions(question_text, question_type, correct_answer, score)').eq('attempt_id',a.id); setAnswers(data||[])}
 async function save(ans,score){await supabase.from('online_exam_answers').update({score_awarded:Number(score)}).eq('id',ans.id); open(selected)}
 async function finalize(){const total=answers.reduce((a,b)=>a+Number(b.score_awarded||0),0); await supabase.from('online_exam_attempts').update({total_score:total,status:'graded'}).eq('id',selected.id); alert('تم اعتماد العلامة'); load()}
 return <Layout title="مراجعة الامتحانات"><div className="grid lg:grid-cols-2 gap-4"><div className="card p-4"><h3 className="font-black mb-3">المحاولات</h3>{attempts.map(a=><div key={a.id} className="border-t py-3"><b>{a.students?.profiles?.full_name}</b><p>{a.online_exams?.title} - العلامة: {a.total_score}</p><button onClick={()=>open(a)} className="text-blue-600 font-bold">فتح</button></div>)}</div><div className="card p-4"><h3 className="font-black mb-3">الإجابات</h3>{answers.map(a=><Answer key={a.id} a={a} onSave={save}/>) }{selected&&<button onClick={finalize} className="btn btn-green">اعتماد العلامة النهائية</button>}</div></div></Layout>
}
function Answer({a,onSave}){const [score,setScore]=useState(a.score_awarded||0);return <div className="border rounded-xl p-3 mb-3"><b>{a.online_exam_questions?.question_text}</b><p>إجابة الطالب: {a.answer_text||'-'}</p><p>الإجابة الصحيحة: {a.online_exam_questions?.correct_answer||'-'}</p><input className="input mt-2" value={score} onChange={e=>setScore(e.target.value)}/><button onClick={()=>onSave(a,score)} className="btn btn-primary mt-2">حفظ</button></div>}
