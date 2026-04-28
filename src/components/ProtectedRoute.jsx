import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, profile, loading } = useAuth()

  if (loading) return <div dir="rtl" className="min-h-screen grid place-items-center">جاري التحميل...</div>
  if (!session) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(profile?.role)) return <Navigate to="/dashboard" replace />

  return children
}
