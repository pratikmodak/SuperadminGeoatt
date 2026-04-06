import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn, getUser } from './api/client';
import AppShell from './components/layout/AppShell';
import './index.css';

const Login      = lazy(() => import('./pages/Login'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Companies  = lazy(() => import('./pages/Companies'));
const Employees  = lazy(() => import('./pages/Employees'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Leaves     = lazy(() => import('./pages/Leaves'));
const Geofences  = lazy(() => import('./pages/Geofences'));
const Payroll    = lazy(() => import('./pages/Payroll'));
const Audit      = lazy(() => import('./pages/Audit'));
const Credits    = lazy(() => import('./pages/Credits'));

const Loading = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'DM Mono,monospace', fontSize:12, color:'#8A9BBB' }}>
    Loading...
  </div>
);

// Protected route — redirects to /login if not authenticated
const Protected = ({ children }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/"           element={<Protected><Dashboard  /></Protected>} />
          <Route path="/companies"  element={<Protected><Companies  /></Protected>} />
          <Route path="/employees"  element={<Protected><Employees  /></Protected>} />
          <Route path="/attendance" element={<Protected><Attendance /></Protected>} />
          <Route path="/leaves"     element={<Protected><Leaves     /></Protected>} />
          <Route path="/geofences"  element={<Protected><Geofences  /></Protected>} />
          <Route path="/payroll"    element={<Protected><Payroll    /></Protected>} />
          <Route path="/audit"      element={<Protected><Audit      /></Protected>} />
          <Route path="/credits"    element={<Protected><Credits    /></Protected>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
