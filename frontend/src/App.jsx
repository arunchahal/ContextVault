import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import EditProject from './pages/EditProject';
import Resources from './pages/Resources';
import Decisions from './pages/Decisions';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import Register from './pages/Register';

const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      <p className="text-gray-500 font-medium text-sm">{message}</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingState message="Initializing ContextVault..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      } />
      <Route path="/projects/new" element={
        <ProtectedRoute>
          <CreateProject />
        </ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <ProjectDetail />
        </ProtectedRoute>
      } />
      <Route path="/projects/:id/edit" element={
        <ProtectedRoute>
          <EditProject />
        </ProtectedRoute>
      } />
      <Route path="/resources" element={
        <ProtectedRoute>
          <Resources />
        </ProtectedRoute>
      } />
      <Route path="/decisions" element={
        <ProtectedRoute>
          <Decisions />
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />

      {/* Backward Compatibility Redirects */}
      <Route path="/pinned" element={<Navigate to="/projects" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
      <Route path="/vault" element={<Navigate to="/projects" replace />} />
      <Route path="/categories" element={<Navigate to="/projects" replace />} />
      <Route path="/context/:id" element={<Navigate to="/projects" replace />} />
      <Route path="/context/new" element={<Navigate to="/projects/new" replace />} />

      {/* Default Fallbacks */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
