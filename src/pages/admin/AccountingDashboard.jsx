import Layout from '../../components/Layout'
import RoleCard from '../../components/RoleCard'
export default function AccountingDashboard(){return <Layout title="المحاسبة"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><RoleCard title="رسوم الطلاب" description="إضافة رسوم مدرسية أو باص أو كتب" to="/admin/accounting/fees"/><RoleCard title="دفعات الطلاب" description="تسجيل دفعات وسندات قبض" to="/admin/accounting/payments"/><RoleCard title="الذمم والمتبقي" description="عرض إجمالي الرسوم والمدفوع والمتبقي" to="/admin/accounting/debts"/></div></Layout>}
