import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function StudentDebtsPage(){
 const [items,setItems]=useState([]),[filter,setFilter]=useState('all')
 useEffect(()=>{load()},[])
 async function load(){const {data,error}=await supabase.from('student_account_summary').select('*').order('student_name'); if(error)alert(error.message); else setItems(data||[])}
 const shown=items.filter(i=>filter==='debt'?Number(i.balance)>0:filter==='paid'?Number(i.balance)<=0:true)
 function csv(){const h=['student_name','student_number','class_name','total_fees','total_payments','balance']; const rows=shown.map(i=>h.map(k=>`"${String(i[k]??'').replaceAll('"','""')}"`).join(',')); const blob=new Blob([[h.join(','),...rows].join('\n')],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='student-debts.csv'; a.click()}
 return <Layout title="ذمم الطلاب"><div className="card p-4 mb-6 flex gap-3 justify-between"><select className="input max-w-xs" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">كل الطلاب</option><option value="debt">غير مسددين</option><option value="paid">مسددين</option></select><button onClick={csv} className="btn btn-dark">تصدير CSV</button></div><div className="table-wrap"><table className="w-full text-sm min-w-[800px]"><thead className="bg-slate-50"><tr><th className="p-3 text-right">الطالب</th><th className="p-3 text-right">الرسوم</th><th className="p-3 text-right">الخصومات</th><th className="p-3 text-right">المدفوع</th><th className="p-3 text-right">المتبقي</th></tr></thead><tbody>{shown.map(i=><tr key={i.student_id} className="border-t"><td className="p-3">{i.student_name}</td><td className="p-3">{i.total_fees}</td><td className="p-3">{i.total_discounts}</td><td className="p-3">{i.total_payments}</td><td className={`p-3 font-bold ${Number(i.balance)>0?'text-red-600':'text-green-700'}`}>{i.balance}</td></tr>)}</tbody></table></div></Layout>
}
