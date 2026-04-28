import { Link } from 'react-router-dom'

export default function RoleCard({ title, description, to }) {
  return (
    <Link to={to} className="block bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-6">{description}</p>
    </Link>
  )
}
