import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardRedirect() {
  const { session, profile, profileError, loading, logout } = useAuth()

  if (loading) return <div dir="rtl" className="min-h-screen grid place-items-center bg-slate-100">جاري التحميل...</div>
  if (!session) return <Navigate to="/login" replace />

  if (!profile) {
    return (
      <div dir="rtl" className="min-h-screen grid place-items-center bg-slate-100 px-4">
        <div className="card p-6 max-w-lg w-full text-center">
          <h1 className="text-2xl font-black text-red-700 mb-3">الحساب غير مربوط بصلاحية</h1>
          <p className="text-slate-600 leading-7 mb-4">تسجيل الدخول نجح، لكن لم يتم العثور على سجل لهذا الحساب داخل جدول profiles.</p>
          {profileError && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4 text-right">{profileError}</div>}
          <button onClick={logout} className="btn btn-primary w-full">تسجيل خروج</button>
        </div>
      </div>
    )
  }

  if (profile.role === 'admin') return <Navigate to="/admin" replace />
  if (profile.role === 'teacher') return <Navigate to="/teacher" replace />
  if (profile.role === 'student') return <Navigate to="/student" replace />
  if (profile.role === 'parent') return <Navigate to="/parent" replace />

  return <div dir="rtl">دور غير معروف</div>
}
