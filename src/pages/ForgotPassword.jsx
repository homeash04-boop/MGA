import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setErrorText('')
    setLoading(true)

    const { error } = await supabase.from('password_reset_requests').insert({
      email: email.trim().toLowerCase(),
      status: 'pending'
    })

    if (error) setErrorText(error.message || 'تعذر إرسال الطلب')
    else {
      setMessage('تم إرسال طلب تغيير كلمة المرور للإدارة. لن تتغير كلمة السر إلا بعد موافقة الأدمن.')
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-black text-slate-800 mb-2">طلب تغيير كلمة المرور</h1>
        <p className="text-slate-500 mb-6 leading-7">أدخل بريدك الإلكتروني. سيتم إرسال طلب للإدارة فقط.</p>
        {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm">{message}</div>}
        {errorText && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-sm">{errorText}</div>}
        <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
        <input className="input mb-6 text-left" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60">{loading ? 'جاري إرسال الطلب...' : 'إرسال طلب للإدارة'}</button>
        <Link to="/login" className="block text-center mt-4 text-sm text-blue-600 hover:underline">العودة إلى تسجيل الدخول</Link>
      </form>
    </div>
  )
}
