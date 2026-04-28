import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import DashboardRedirect from './pages/DashboardRedirect'
import MessagesPage from './pages/MessagesPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import UsersPage from './pages/admin/UsersPage'
import StudentsPage from './pages/admin/StudentsPage'
import ClassesPage from './pages/admin/ClassesPage'
import SubjectsPage from './pages/admin/SubjectsPage'
import AcademicTermsPage from './pages/admin/AcademicTermsPage'
import ClassSubjectsPage from './pages/admin/ClassSubjectsPage'
import TeacherSubjectsPage from './pages/admin/TeacherSubjectsPage'
import TimetableAdminPage from './pages/admin/TimetableAdminPage'
import AnnouncementsPage from './pages/admin/AnnouncementsPage'
import ReportsPage from './pages/admin/ReportsPage'
import PasswordResetRequestsPage from './pages/admin/PasswordResetRequestsPage'
import SettingsPage from './pages/admin/SettingsPage'
import AccountingDashboard from './pages/admin/AccountingDashboard'
import StudentFeesPage from './pages/admin/StudentFeesPage'
import StudentPaymentsPage from './pages/admin/StudentPaymentsPage'
import StudentDebtsPage from './pages/admin/StudentDebtsPage'
import GradeVisibilityPage from './pages/admin/GradeVisibilityPage'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import GradesPage from './pages/teacher/GradesPage'
import AttendancePage from './pages/teacher/AttendancePage'
import AssignmentsPage from './pages/teacher/AssignmentsPage'
import OnlineAssignmentsTeacherPage from './pages/teacher/OnlineAssignmentsPage'
import OnlineExamsTeacherPage from './pages/teacher/OnlineExamsPage'
import ExamReviewPage from './pages/teacher/ExamReviewPage'

import StudentDashboard from './pages/student/StudentDashboard'
import MyGradesPage from './pages/student/MyGradesPage'
import MyAttendancePage from './pages/student/MyAttendancePage'
import MyAssignmentsPage from './pages/student/MyAssignmentsPage'
import MyTimetablePage from './pages/student/MyTimetablePage'
import OnlineAssignmentsStudentPage from './pages/student/OnlineAssignmentsPage'
import OnlineExamsStudentPage from './pages/student/OnlineExamsPage'

import ParentDashboard from './pages/parent/ParentDashboard'
import ChildrenPage from './pages/parent/ChildrenPage'

function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen grid place-items-center bg-slate-100">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-black mb-2">الصفحة غير موجودة</h1>
        <a href="/dashboard" className="text-blue-600 font-bold">العودة للرئيسية</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/password-resets" element={<ProtectedRoute allowedRoles={['admin']}><PasswordResetRequestsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><StudentsPage /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><ClassesPage /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={['admin']}><SubjectsPage /></ProtectedRoute>} />
          <Route path="/admin/academic-terms" element={<ProtectedRoute allowedRoles={['admin']}><AcademicTermsPage /></ProtectedRoute>} />
          <Route path="/admin/class-subjects" element={<ProtectedRoute allowedRoles={['admin']}><ClassSubjectsPage /></ProtectedRoute>} />
          <Route path="/admin/teacher-subjects" element={<ProtectedRoute allowedRoles={['admin']}><TeacherSubjectsPage /></ProtectedRoute>} />
          <Route path="/admin/timetable" element={<ProtectedRoute allowedRoles={['admin']}><TimetableAdminPage /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AnnouncementsPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin/grade-visibility" element={<ProtectedRoute allowedRoles={['admin']}><GradeVisibilityPage /></ProtectedRoute>} />
          <Route path="/admin/accounting" element={<ProtectedRoute allowedRoles={['admin']}><AccountingDashboard /></ProtectedRoute>} />
          <Route path="/admin/accounting/fees" element={<ProtectedRoute allowedRoles={['admin']}><StudentFeesPage /></ProtectedRoute>} />
          <Route path="/admin/accounting/payments" element={<ProtectedRoute allowedRoles={['admin']}><StudentPaymentsPage /></ProtectedRoute>} />
          <Route path="/admin/accounting/debts" element={<ProtectedRoute allowedRoles={['admin']}><StudentDebtsPage /></ProtectedRoute>} />

          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/grades" element={<ProtectedRoute allowedRoles={['teacher']}><GradesPage /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><AttendancePage /></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher']}><AssignmentsPage /></ProtectedRoute>} />
          <Route path="/teacher/online-assignments" element={<ProtectedRoute allowedRoles={['teacher']}><OnlineAssignmentsTeacherPage /></ProtectedRoute>} />
          <Route path="/teacher/online-exams" element={<ProtectedRoute allowedRoles={['teacher']}><OnlineExamsTeacherPage /></ProtectedRoute>} />
          <Route path="/teacher/exam-review" element={<ProtectedRoute allowedRoles={['teacher']}><ExamReviewPage /></ProtectedRoute>} />

          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/grades" element={<ProtectedRoute allowedRoles={['student']}><MyGradesPage /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><MyAttendancePage /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><MyAssignmentsPage /></ProtectedRoute>} />
          <Route path="/student/online-assignments" element={<ProtectedRoute allowedRoles={['student']}><OnlineAssignmentsStudentPage /></ProtectedRoute>} />
          <Route path="/student/online-exams" element={<ProtectedRoute allowedRoles={['student']}><OnlineExamsStudentPage /></ProtectedRoute>} />
          <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={['student']}><MyTimetablePage /></ProtectedRoute>} />

          <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/children" element={<ProtectedRoute allowedRoles={['parent']}><ChildrenPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
