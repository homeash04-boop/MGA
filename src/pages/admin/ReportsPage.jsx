import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function ReportsPage(){
 const [stats,setStats]=useState({students:0,grades:0,avg:0,payments:0})
 useEffect(()=>{load()},[])
 async function load(){
  const [s,g,p]=await Promise.all([supabase.from('students').select('id',{count:'exact',head:true}),supabase.from('grades').select('score'),supabase.from('student_payments').select('amount')])
  const scores=g.data||[]; const pays=p.data||[]
  setStats({students:s.count||0,grades:scores.length,avg:scores.length?(scores.reduce((a,b)=>a+Number(b.score||0),0)/scores.length).toFixed(1):0,payments:pays.reduce((a,b)=>a+Number(b.amount||0),0)})
 }
 return <Layout title="التقارير"><div className="grid md:grid-cols-4 gap-4"><div className="card p-5"><p>عدد الطلاب</p><b className="text-3xl">{stats.students}</b></div><div className="card p-5"><p>عدد الدرجات</p><b className="text-3xl">{stats.grades}</b></div><div className="card p-5"><p>متوسط الدرجات</p><b className="text-3xl">{stats.avg}</b></div><div className="card p-5"><p>إجمالي الدفعات</p><b className="text-3xl">{stats.payments}</b></div></div></Layout>
}
