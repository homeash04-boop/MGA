import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setErrorText('')

    if (password.length < 6) return setErrorText('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    if (password !== confirm) return setErrorText('كلمتا المرور غير متطابقتين')

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) setErrorText('لا يمكن تغيير كلمة المرور إلا من رابط موافقة الأدمن. ' + (error.message || ''))
    else {
      setMessage('تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.')
      await supabase.auth.signOut()
    }

    setLoading(false)
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-black text-slate-800 mb-2">تغيير كلمة المرور</h1>
        <p className="text-slate-500 mb-6 leading-7">هذه الصفحة تعمل فقط عند فتح رابط تغيير كلمة المرور المعتمد من الإدارة.</p>
        {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm">{message}</div>}
        {errorText && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-sm">{errorText}</div>}
        <label className="block mb-2 text-sm font-medium">كلمة المرور الجديدة</label>
        <input className="input mb-4" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <label className="block mb-2 text-sm font-medium">تأكيد كلمة المرور</label>
        <input className="input mb-6" value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required />
        <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60">{loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}</button>
        <Link to="/login" className="block text-center mt-4 text-sm text-blue-600 hover:underline">تسجيل الدخول</Link>
      </form>
    </div>
  )
}
