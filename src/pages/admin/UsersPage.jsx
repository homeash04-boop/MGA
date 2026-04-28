import { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

function rolePrefix(role) {
  if (role === 'teacher') return 'teacher'
  if (role === 'parent') return 'parent'
  if (role === 'admin') return 'admin'
  return 'student'
}

function cleanName(name) {
  return String(name || '').trim().replace(/[^\u0600-\u06FFa-zA-Z0-9 ]/g, '').replace(/\s+/g, '.').toLowerCase()
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({ school_email_domain: 'mga-school.com' })
  const [form, setForm] = useState({ full_name: '', email: '', password: '12345678', role: 'student', phone: '' })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [u, s] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('app_settings').select('*')
    ])
    if (u.error) alert(u.error.message); else setUsers(u.data || [])
    const next = { school_email_domain: 'mga-school.com' }
    ;(s.data || []).forEach(row => next[row.key] = row.value)
    setSettings(next)
    setLoading(false)
  }

  const suggestedEmail = useMemo(() => {
    const domain = settings.school_email_domain || 'mga-school.com'
    const n = cleanName(form.full_name)
    const num = String(users.length + 1).padStart(4, '0')
    return `${n ? `${rolePrefix(form.role)}.${n}` : `${rolePrefix(form.role)}-${num}`}@${domain}`
  }, [form, settings, users.length])

  async function createUser(e) {
    e.preventDefault()
    setCreating(true)
    const { data, error } = await supabase.functions.invoke('create-user', { body: form })
    if (error) alert(error.message || 'فشل إنشاء المستخدم. تأكد من نشر Edge Function')
    else if (data?.error) alert(data.error)
    else {
      alert('تم إنشاء المستخدم')
      setForm({ full_name: '', email: '', password: '12345678', role: 'student', phone: '' })
      loadAll()
    }
    setCreating(false)
  }

  return (
    <Layout title="إدارة المستخدمين">
      <form onSubmit={createUser} className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-black text-lg">إنشاء مستخدم جديد</h3>
            <p className="text-sm text-slate-500">الدومين الحالي: @{settings.school_email_domain}</p>
          </div>
          <a href="/admin/settings" className="text-blue-600 font-bold text-sm">تعديل إعدادات الإيميل</a>
        </div>
        <div className="grid md:grid-cols-5 gap-3">
          <input className="input" placeholder="الاسم" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} required />
          <input className="input text-left" dir="ltr" placeholder="email@mga-school.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" required />
          <input className="input" placeholder="كلمة المرور" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} minLength="6" required />
          <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
            <option value="student">طالب</option><option value="teacher">معلم</option><option value="parent">ولي أمر</option><option value="admin">إدارة</option>
          </select>
          <input className="input" placeholder="الهاتف" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        </div>
        <div className="mt-3 bg-slate-50 rounded-xl p-3 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span className="text-sm text-slate-600">إيميل مقترح: <b dir="ltr">{suggestedEmail}</b></span>
          <button type="button" onClick={()=>setForm({...form,email:suggestedEmail})} className="btn btn-dark text-sm">استخدم الإيميل المقترح</button>
        </div>
        <button disabled={creating} className="btn btn-primary mt-4">{creating ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}</button>
      </form>

      <div className="table-wrap">
        {loading ? <p className="p-4">جاري التحميل...</p> : (
          <table className="w-full text-sm min-w-[750px]">
            <thead className="bg-slate-50"><tr><th className="p-3 text-right">الاسم</th><th className="p-3 text-right">الدور</th><th className="p-3 text-right">الهاتف</th><th className="p-3 text-right">المعرف</th></tr></thead>
            <tbody>{users.map(u=><tr key={u.id} className="border-t"><td className="p-3">{u.full_name}</td><td className="p-3">{u.role}</td><td className="p-3">{u.phone || '-'}</td><td className="p-3 font-mono text-xs">{u.id}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
