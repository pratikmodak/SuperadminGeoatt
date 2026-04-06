import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser, clearAuth, authAPI } from '../../api/client';

const NAV = [
  { path:'/',           label:'Dashboard'  },
  { path:'/companies',  label:'Companies'  },
  { path:'/employees',  label:'Employees'  },
  { path:'/geofences',  label:'Geofences'  },
  { path:'/attendance', label:'Attendance' },
  { path:'/leaves',     label:'Leave'      },
  { path:'/payroll',    label:'Payroll'    },
  { path:'/credits',    label:'Credits'    },
  { path:'/audit',      label:'Audit'      },
];

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const user = getUser();

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar app-header">
        <Link to="/" className="topbar-logo">
          <div style={{ width:28, height:28, borderRadius:8, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" fill="#00D4AA"/>
              <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="topbar-logo-text">GeoAttend</span>
        </Link>

        <nav className="topbar-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path}
              className={`topbar-nav-item ${pathname === n.path ? 'active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-right">
          <span className="topbar-badge">{user?.role || 'superadmin'}</span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--navy)', color:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, fontFamily:'var(--mono)' }}>
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <button onClick={logout} style={{ background:'none', border:'1px solid var(--border)', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12, fontFamily:'var(--mono)', color:'var(--muted)' }}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main" style={{ gridColumn:'1/-1', paddingTop:56 }}>
        {children}
      </main>
    </div>
  );
}
