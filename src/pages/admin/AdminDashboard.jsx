import Layout from '../../components/Layout'
import RoleCard from '../../components/RoleCard'

export default function AdminDashboard() {
  return (
    <Layout title="لوحة الإدارة">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoleCard title="المستخدمون" description="إنشاء الطلاب والمعلمين وأولياء الأمور" to="/admin/users" />
        <RoleCard title="طلبات كلمة المرور" description="موافقة أو رفض تغيير كلمة المرور" to="/admin/password-resets" />
        <RoleCard title="إدارة الطلاب" description="ربط الطلاب بالصفوف والبيانات الأساسية" to="/admin/students" />
        <RoleCard title="الصفوف والشُعب" description="إضافة وتعديل وحذف الصفوف" to="/admin/classes" />
        <RoleCard title="المواد" description="إضافة وتعديل وحذف المواد" to="/admin/subjects" />
        <RoleCard title="الفصول الدراسية" description="إدارة السنوات والفصول الدراسية" to="/admin/academic-terms" />
        <RoleCard title="مواد الصفوف" description="ربط المواد بالصفوف والفصول" to="/admin/class-subjects" />
        <RoleCard title="ربط المعلمين" description="ربط المعلم بالمادة والصف" to="/admin/teacher-subjects" />
        <RoleCard title="الجدول الدراسي" description="إدارة الحصص والأوقات والغرف" to="/admin/timetable" />
        <RoleCard title="الإعلانات" description="نشر إعلانات للمدرسة أو حسب الدور" to="/admin/announcements" />
        <RoleCard title="إظهار/إخفاء العلامات" description="إظهار العلامات أو إخفاؤها كليًا أو جزئيًا" to="/admin/grade-visibility" />
        <RoleCard title="المحاسبة" description="رسوم ودفعات وذمم الطلاب" to="/admin/accounting" />
        <RoleCard title="التقارير" description="درجات وحضور وملخصات إدارية" to="/admin/reports" />
        <RoleCard title="إعدادات المدرسة" description="الدومين واسم المدرسة وترقيم الطلاب" to="/admin/settings" />
      </div>
    </Layout>
  )
}
