import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore.js'
import { useUserStore } from './store/useUserStore.js'

// Layout components
import Navbar from './components/layout/Navbar.jsx'
import DoctorSidebar from './components/layout/DoctorSidebar.jsx'
import AdminSidebar from './components/layout/AdminSidebar.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import { useSidebar } from './hooks/useSidebar.js'

// Auth pages
import UserLoginPage from './pages/auth/UserLoginPage.jsx'
import UserRegisterPage from './pages/auth/UserRegisterPage.jsx'
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx'
import CompleteProfilePage from './pages/auth/CompleteProfilePage.jsx'
import DoctorLoginPage from './pages/auth/DoctorLoginPage.jsx'
import AdminLoginPage from './pages/auth/AdminLoginPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx'

// User pages
import HomePage from './pages/user/HomePage.jsx'
import DoctorsPage from './pages/user/DoctorsPage.jsx'
import DoctorProfilePage from './pages/user/DoctorProfilePage.jsx'
import MyAppointmentsPage from './pages/user/MyAppointmentsPage.jsx'
import UserProfilePage from './pages/user/UserProfilePage.jsx'
import NotificationsPage from './pages/user/NotificationsPage.jsx'
import PaymentPage from './pages/user/PaymentPage.jsx'
import AboutPage from './pages/user/AboutPage.jsx'

// Doctor pages
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx'
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage.jsx'
import DoctorProfileEditPage from './pages/doctor/DoctorProfilePage.jsx'
import DoctorEarningsPage from './pages/doctor/DoctorEarningsPage.jsx'

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage.jsx'
import AdminPatientsPage from './pages/admin/AdminPatientsPage.jsx'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage.jsx'

import NotFoundPage from './pages/NotFoundPage.jsx'

// ─── Bouton hamburger flottant (portails médecin / admin) ────────────────────
// Visible sur toutes les tailles. Se déplace avec la sidebar quand elle est ouverte.
function SidebarToggle() {
  const { toggle, isOpen } = useSidebar()
  return (
    <button
      onClick={toggle}
      style={{ left: isOpen ? '268px' : '12px' }}
      className="fixed top-3 z-50 w-10 h-10 flex items-center justify-center bg-surface-container-lowest shadow-lg rounded-xl text-on-surface-variant hover:bg-surface-container transition-all duration-300"
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
    >
      <span className="material-symbols-outlined text-[22px]">
        {isOpen ? 'menu_open' : 'menu'}
      </span>
    </button>
  )
}

// ─── Layouts ────────────────────────────────────────────────────────────────

function PatientLayout() {
  const { utoken } = useAuthStore()
  const { fetchProfile } = useUserStore()

  useEffect(() => {
    if (utoken) fetchProfile()
  }, [utoken])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-[64px]">
        <Outlet />
      </main>
    </div>
  )
}

function DoctorLayout() {
  const { isOpen } = useSidebar()
  return (
    <ProtectedRoute role="doctor">
      <div className="min-h-screen bg-surface-container/30 flex">
        <SidebarToggle />
        <DoctorSidebar />
        <main className={`flex-1 min-h-screen overflow-x-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

function AdminLayout() {
  const { isOpen } = useSidebar()
  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-surface-container/30 flex">
        <SidebarToggle />
        <AdminSidebar />
        <main className={`flex-1 min-h-screen overflow-x-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth ── */}
        <Route path="/connexion"              element={<UserLoginPage />} />
        <Route path="/inscription"            element={<UserRegisterPage />} />
        <Route path="/verifier-email"         element={<VerifyEmailPage />} />
        <Route path="/completer-profil"        element={
          <ProtectedRoute role="user"><CompleteProfilePage /></ProtectedRoute>
        } />
        <Route path="/medecin/connexion"      element={<DoctorLoginPage />} />
        <Route path="/admin/connexion"        element={<AdminLoginPage />} />
        <Route path="/mot-de-passe-oublie"    element={<ForgotPasswordPage />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />

        {/* ── Patient ── */}
        <Route element={<PatientLayout />}>
          <Route path="/"             element={<HomePage />} />
          <Route path="/medecins"     element={<DoctorsPage />} />
          <Route path="/medecins/:id" element={<DoctorProfilePage />} />
          <Route path="/a-propos"     element={<AboutPage />} />

          <Route path="/mes-rendez-vous" element={
            <ProtectedRoute role="user"><MyAppointmentsPage /></ProtectedRoute>
          } />
          <Route path="/mon-profil" element={
            <ProtectedRoute role="user"><UserProfilePage /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute role="user"><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/paiement" element={
            <ProtectedRoute role="user"><PaymentPage /></ProtectedRoute>
          } />
        </Route>

        {/* ── Doctor Portal ── */}
        <Route path="/medecin" element={<DoctorLayout />}>
          <Route index element={<Navigate to="/medecin/tableau-de-bord" replace />} />
          <Route path="tableau-de-bord" element={<DoctorDashboardPage />} />
          <Route path="rendez-vous"     element={<DoctorAppointmentsPage />} />
          <Route path="profil"          element={<DoctorProfileEditPage />} />
          <Route path="gains"           element={<DoctorEarningsPage />} />
        </Route>

        {/* ── Admin Portal ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/tableau-de-bord" replace />} />
          <Route path="tableau-de-bord" element={<AdminDashboardPage />} />
          <Route path="medecins"        element={<AdminDoctorsPage />} />
          <Route path="patients"        element={<AdminPatientsPage />} />
          <Route path="rendez-vous"     element={<AdminAppointmentsPage />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}