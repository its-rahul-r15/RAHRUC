import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyDrive from '../pages/MyDrive';
import Photos from '../pages/Photos';
import Starred from '../pages/Starred';
import Trash from '../pages/Trash';
import Settings from '../pages/Settings';
import Vault from '../pages/Vault';
import PublicView from '../pages/PublicView';
import Landing from '../pages/Landing';
import { useAuthStore } from '../store/authStore';

export default function AppRouter() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/drive" replace /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:slug" element={<PublicView />} />

        {/* Protected URLs */}
        <Route element={<ProtectedRoute />}>
          <Route path="/drive" element={<MyDrive />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/vault" element={<Vault />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
