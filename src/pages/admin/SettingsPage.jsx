import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'
export default function SettingsPage(){
 const [settings,setSettings]=useState({school_name:'بوابة الطالب المدرسية',school_email_domain:'mga-school.com',student_number_prefix:'MGA-ST'})
 useEffect(()=>{load()},[])
 async function load(){const {data}=await supabase.from('app_settings').select('*'); const next={...settings}; (data||[]).forEach(r=>next[r.key]=r.value); setSettings(next)}
 async function save(e){e.preventDefault(); const rows=Object.entries(settings).map(([key,value])=>({key,value:String(value),updated_at:new Date().toISOString()})); const {error}=await supabase.from('app_settings').upsert(rows); if(error)alert(error.message); else alert('تم الحفظ')}
 return <Layout title="إعدادات المدرسة">
  <form onSubmit={save} className="card p-5 max-w-2xl space-y-3"><label className="font-bold">اسم المدرسة</label><input className="input" value={settings.school_name} onChange={e=>setSettings({...settings,school_name:e.target.value})}/><label className="font-bold">دومين الإيميلات</label><input className="input text-left" dir="ltr" value={settings.school_email_domain} onChange={e=>setSettings({...settings,school_email_domain:e.target.value.replace('@','')})}/><label className="font-bold">بادئة رقم الطالب</label><input className="input" value={settings.student_number_prefix} onChange={e=>setSettings({...settings,student_number_prefix:e.target.value})}/><button className="btn btn-primary">حفظ</button></form>
 </Layout>
}
