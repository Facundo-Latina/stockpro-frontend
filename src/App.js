import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

const Guard = ({ admin, children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spin" style={{ minHeight: '100vh' }} />;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/productos" replace />;
  return children;
};

function Shell() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={user ? <Navigate to="/productos" /> : <Login />} />
        <Route path="/registro"        element={user ? <Navigate to="/productos" /> : <Register />} />
        <Route path="/quienes-somos"   element={<QuienesSomos />} />
        <Route path="/contacto"        element={<Contacto />} />

        <Route path="/productos"       element={<Guard><Products /></Guard>} />
        <Route path="/dashboard"       element={<Guard admin><Dashboard /></Guard>} />
        <Route path="/admin/productos" element={<Guard admin><AdminProducts /></Guard>} />
        <Route path="/admin/categorias"element={<Guard admin><AdminCategories /></Guard>} />
        <Route path="/admin/usuarios"  element={<Guard admin><AdminUsers /></Guard>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Shell />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{
            background: 'rgba(12,17,32,0.96)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            color: '#f1f5f9',
          }}
        />
      </Router>
    </AuthProvider>
  );
}
