import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/productos" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/productos" replace /> : children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/contacto" element={<Contacto />} />

      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/registro" element={<GuestRoute><Register /></GuestRoute>} />

      <Route path="/productos" element={<ProtectedRoute><Products /></ProtectedRoute>} />

      <Route path="/admin/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/categorias" element={<AdminRoute><AdminCategories /></AdminRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            background: 'rgba(10,15,28,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
