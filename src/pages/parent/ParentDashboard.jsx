import Layout from '../../components/Layout'
import RoleCard from '../../components/RoleCard'
export default function ParentDashboard(){return <Layout title="لوحة ولي الأمر"><div className="grid md:grid-cols-3 gap-4"><RoleCard title="أبنائي" description="متابعة بيانات الأبناء" to="/parent/children"/><RoleCard title="الرسائل" description="التواصل مع المدرسة" to="/messages"/></div></Layout>}
