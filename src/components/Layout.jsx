import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ title, children }) {
  const { profile, logout } = useAuth()

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-800">بوابة الطالب المدرسية</h1>
            <p className="text-sm text-slate-500">{profile?.full_name} - {profile?.role}</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link to="/dashboard" className="text-blue-600 font-bold">الرئيسية</Link>
            <Link to="/messages" className="text-blue-600 font-bold">الرسائل</Link>
            <button onClick={logout} className="text-red-600 font-bold">خروج</button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-black mb-6 text-slate-800">{title}</h2>
        {children}
      </main>
    </div>
  )
}
