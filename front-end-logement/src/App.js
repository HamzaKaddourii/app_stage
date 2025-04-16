import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // Ajouter l'import de AdminRoute
import AdminDashboard from './pages/admin/AdminDashboard'; // Ajouter l'import de AdminDashboard
import AdminReservations from './pages/admin/AdminReservations'; // Ajouter l'import de AdminReservations
import AdminDemandes from './pages/admin/AdminDemandes'; // Ajouter l'import de AdminDemandes

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // Ajouter l'import de ForgotPassword
import ResetPassword from './pages/ResetPassword'; // Ajouter l'import de ResetPassword
import SalleList from './pages/SalleList';
import SalleDetail from './pages/SalleDetail';
import UserReservations from './pages/UserReservations';
import BonAchatList from './pages/BonAchatList';
import DemandeList from './pages/DemandeList';
import DemandeForm from './pages/DemandeForm';
import ProfilePage from './pages/ProfilePage';
import ReservationForm from './pages/ReservationForm';
import SalleManagement from './pages/admin/SalleManagement'; // Ajouter l'import de SalleManagement
import SalleForm from './pages/admin/SalleForm'; // Ajouter l'import de SalleForm

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/salles" element={<SalleList />} />
          <Route path="/salles/:id" element={<SalleDetail />} />
          
          {/* Routes protégées (utilisateur connecté) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reservations" element={<UserReservations />} />
            <Route path="/reservations/new" element={<ReservationForm />} />
            <Route path="/bons-achat" element={<BonAchatList />} />
            <Route path="/demandes" element={<DemandeList />} />
            <Route path="/demandes/new" element={<DemandeForm />} />
          </Route>
          
          {/* Routes administrateur (à implémenter plus tard) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/demandes" element={<AdminDemandes />} />
            <Route path="/admin/salles" element={<SalleManagement />} />
            <Route path="/admin/salles/create" element={<SalleForm />} />
            <Route path="/admin/salles/edit/:id" element={<SalleForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
