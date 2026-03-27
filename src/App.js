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
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import NotFound from './pages/NotFound';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ height: '100vh' }} />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spinner" style={{ height: '100vh' }} />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/productos" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/productos" /> : <Login />} />
        <Route path="/registro" element={user ? <Navigate to="/productos" /> : <Register />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/productos" element={
          <ProtectedRoute><Products /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/productos" element={
          <AdminRoute><AdminProducts /></AdminRoute>
        } />
        <Route path="/admin/usuarios" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />
        <Route path="/admin/categorias" element={
          <AdminRoute><AdminCategories /></AdminRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

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
            background: 'rgba(13,18,37,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
