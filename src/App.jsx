// superadmin-web/src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import './index.css';

// ── Lazy-loaded pages (code splitting — faster initial load) ──
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Companies  = lazy(() => import('./pages/Companies'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Leaves     = lazy(() => import('./pages/Leaves'));
const Audit      = lazy(() => import('./pages/Audit'));

// Placeholder pages (extend as needed)
const Analytics  = lazy(() => import('./pages/Dashboard'));  // reuse for now
const Admins     = lazy(() => import('./pages/Companies'));
const Geofences  = lazy(() => import('./pages/Dashboard'));
const Employees  = lazy(() => import('./pages/Attendance'));
const Shifts     = lazy(() => import('./pages/Dashboard'));
const Payroll    = lazy(() => import('./pages/Dashboard'));
const Credits    = lazy(() => import('./pages/Dashboard'));
const Settings   = lazy(() => import('./pages/Dashboard'));

const Loading = () => (
  <div style={{ padding: 40, textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#8A9BBB' }}>
    Loading...
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<Loading/>}>
          <Routes>
            <Route path="/"           element={<Dashboard/>}  />
            <Route path="/analytics"  element={<Analytics/>}  />
            <Route path="/companies"  element={<Companies/>}  />
            <Route path="/admins"     element={<Admins/>}     />
            <Route path="/geofences"  element={<Geofences/>}  />
            <Route path="/employees"  element={<Employees/>}  />
            <Route path="/attendance" element={<Attendance/>} />
            <Route path="/leaves"     element={<Leaves/>}     />
            <Route path="/shifts"     element={<Shifts/>}     />
            <Route path="/payroll"    element={<Payroll/>}    />
            <Route path="/credits"    element={<Credits/>}    />
            <Route path="/audit"      element={<Audit/>}      />
            <Route path="/settings"   element={<Settings/>}   />
            <Route path="*"           element={<Navigate to="/" replace/>} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
