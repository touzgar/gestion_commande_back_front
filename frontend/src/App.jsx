import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './components/AdminLayout';
import UserLayout from './components/UserLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCommandes from './pages/AdminCommandes';
import AdminProduits from './pages/AdminProduits';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import UserDashboard from './pages/UserDashboard';
import UserProduits from './pages/UserProduits';
import UserPanier from './pages/UserPanier';
import UserCommandes from './pages/UserCommandes';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return children || <Outlet />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <RegisterPage />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="commandes" element={<AdminCommandes />} />
        <Route path="produits" element={<AdminProduits />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      <Route path="/user" element={<UserLayout />}>
        <Route path="checkout" element={<UserPanier />} />
        <Route path="panier" element={<Navigate to="/user/checkout" replace />} />
        
        <Route element={<ProtectedRoute allowedRole="client" />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="produits" element={<UserProduits />} />
          <Route path="commandes" element={<UserCommandes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;