// superadmin-web/src/components/layout/AppShell.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Mono } from '../ui';

const NAV = [
  { section: 'Overview',    items: [{ path: '/',          label: 'Dashboard'   },
                                    { path: '/analytics',  label: 'Analytics'   }] },
  { section: 'Manage',      items: [{ path: '/companies', label: 'Companies'   },
                                    { path: '/admins',     label: 'Admins',     badge: 3 },
                                    { path: '/geofences',  label: 'Geofences'  },
                                    { path: '/employees',  label: 'Employees'  }] },
  { section: 'Operations',  items: [{ path: '/attendance', label: 'Attendance' },
                                    { path: '/leaves',     label: 'Leave',      badge: 18 },
                                    { path: '/shifts',     label: 'Shifts'     },
                                    { path: '/payroll',    label: 'Payroll'    }] },
  { section: 'System',      items: [{ path: '/credits',   label: 'Credits'    },
                                    { path: '/audit',      label: 'Audit log'  },
                                    { path: '/settings',   label: 'Settings'   }] },
];

// GeoAttend logo mark — SVG inline, no asset needed
const LogoMark = () => (
  <div className="topbar-logo-mark">
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3" fill="#00D4AA"/>
      <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7"
        stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 2v4M16 9h-4" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">

      {/* ── Topbar ─────────────────────────────────────── */}
      <header className="topbar app-header">
        <Link to="/" className="topbar-logo">
          <LogoMark />
          <span className="topbar-logo-text">GeoAttend</span>
        </Link>

        <nav className="topbar-nav">
          {[
            ['/companies', 'Companies'],
            ['/geofences', 'Geofences'],
            ['/attendance','Attendance'],
            ['/leaves',    'Leave'],
            ['/payroll',   'Payroll'],
            ['/audit',     'Audit'],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className={`topbar-nav-item ${pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="topbar-right">
          <span className="topbar-badge">Superadmin</span>
          <Avatar name="Pratik" size="md" color="teal" />
        </div>
      </header>

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className="sidebar app-sidebar">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sidebar-section">{group.section}</div>
            {group.items.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-item-dot" />
                {item.label}
                {item.badge ? <span className="sidebar-badge">{item.badge}</span> : null}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      {/* ── Main ───────────────────────────────────────── */}
      <main className="app-main">
        {children}
      </main>

    </div>
  );
}
