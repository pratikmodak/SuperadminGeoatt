// superadmin-web/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  StatCard, Card, Badge, Avatar, Mono,
  ProgressBar, HealthPill, Button, PageHeader,
} from '../components/ui';

// ── Geofence live map (pure SVG — no Google API needed) ──
const LiveMap = () => (
  <svg width="100%" viewBox="0 0 680 240" preserveAspectRatio="xMidYMid slice">
    <rect width="680" height="240" fill="#E8F0FF"/>
    <defs>
      <pattern id="g" width="34" height="34" patternUnits="userSpaceOnUse">
        <path d="M34 0L0 0 0 34" fill="none" stroke="#D0DEFF" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="680" height="240" fill="url(#g)"/>
    {/* Roads */}
    <line x1="0" y1="120" x2="680" y2="120" stroke="#fff" strokeWidth="5" opacity=".8"/>
    <line x1="220" y1="0" x2="220" y2="240" stroke="#fff" strokeWidth="3" opacity=".6"/>
    <line x1="450" y1="0" x2="450" y2="240" stroke="#fff" strokeWidth="3" opacity=".6"/>
    <line x1="0" y1="68" x2="680" y2="68" stroke="#fff" strokeWidth="2" opacity=".5"/>
    <line x1="0" y1="172" x2="680" y2="172" stroke="#fff" strokeWidth="2" opacity=".5"/>
    {/* Zone 1: Tech Corp */}
    <circle cx="148" cy="104" r="64" fill="#00D4AA" fillOpacity=".10" stroke="#00D4AA" strokeWidth="1.5" strokeDasharray="5,3"/>
    <circle cx="148" cy="104" r="34" fill="#00D4AA" fillOpacity=".15" stroke="#00D4AA" strokeWidth="1"/>
    <text x="148" y="52" textAnchor="middle" fontSize="11" fontFamily="DM Mono, monospace" fill="#007A62">Tech Corp HQ</text>
    {/* Zone 2: Logistics */}
    <rect x="298" y="46" width="124" height="88" rx="8" fill="#0A1628" fillOpacity=".07" stroke="#0A1628" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="360" y="38" textAnchor="middle" fontSize="11" fontFamily="DM Mono, monospace" fill="#162B52">Logistics Ltd</text>
    {/* Zone 3: Factory */}
    <ellipse cx="556" cy="174" rx="80" ry="44" fill="#FF4757" fillOpacity=".07" stroke="#FF4757" strokeWidth="1.5" strokeDasharray="5,3"/>
    <text x="556" y="125" textAnchor="middle" fontSize="11" fontFamily="DM Mono, monospace" fill="#CC2233">Factory Site</text>
    {/* Employee dots — inside */}
    {[[142,98],[158,112],[144,118],[318,82],[345,96],[330,74],[548,168],[568,180]].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r="5" fill="#00D4AA" stroke="#fff" strokeWidth="1.5"/>
    ))}
    {/* Outside dot */}
    <circle cx="272" cy="44" r="5" fill="#FF4757" stroke="#fff" strokeWidth="1.5"/>
    <text x="282" y="42" fontSize="9" fontFamily="DM Mono, monospace" fill="#FF4757">outside</text>
    {/* Legend */}
    <circle cx="18" cy="228" r="4" fill="#00D4AA"/>
    <text x="28" y="232" fontSize="9" fontFamily="DM Mono, monospace" fill="#666">Inside zone</text>
    <circle cx="100" cy="228" r="4" fill="#FF4757"/>
    <text x="110" y="232" fontSize="9" fontFamily="DM Mono, monospace" fill="#666">Outside zone</text>
  </svg>
);

export default function Dashboard() {
  const [date] = useState(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }));

  return (
    <div>
      <PageHeader
        breadcrumb="Superadmin / Dashboard"
        title="Platform overview"
        actions={
          <>
            <div className="toggle-group">
              <div className="toggle-opt on">Today</div>
              <div className="toggle-opt">Week</div>
              <div className="toggle-opt">Month</div>
            </div>
            <Button variant="ghost" size="sm">Export</Button>
            <Button variant="primary" size="sm">+ Add company</Button>
          </>
        }
      />

      <div className="page-body">

        {/* ── Date bar ───────────────────────────────────── */}
        <div className="flex items-center" style={{ marginBottom: 16, gap: 8 }}>
          <Mono size={12} color="var(--muted)">{date}</Mono>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D4AA' }}/>
          <Mono size={12} color="#00B894">Live</Mono>
        </div>

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="stat-grid mb-4">
          <StatCard label="Active companies" value="12"  change="↑ 2 this month" changeType="up" accent="teal"/>
          <StatCard label="Employees"        value="847" change="Across 12 companies" changeType="neu" accent="navy"/>
          <StatCard label="Present today"    value="631" change="↑ 74.5% rate" changeType="up" accent="teal"/>
          <StatCard label="Spoofing blocked" value="14"  change="↓ All stopped" changeType="down" accent="red"/>
        </div>

        {/* ── Main row ───────────────────────────────────── */}
        <div className="flex gap-3 mb-4">

          {/* Live table */}
          <div style={{ flex: 1.5 }}>
            <div className="table-wrap">
              <div className="card-header">
                <span className="card-title">Live employee status</span>
                <Link to="/attendance" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--teal2)', textDecoration: 'none' }}>
                  View all →
                </Link>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Company</th>
                    <th>Check in</th>
                    <th>Status</th>
                    <th>GPS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ravi Kumar',   code: 'TC-0042', co: 'Tech Corp',    time: '09:02', status: 'present', gps: '±2m',  color: 'teal' },
                    { name: 'Priya Mehta',  code: 'TC-0038', co: 'Tech Corp',    time: '09:31', status: 'late',    gps: '±4m',  color: 'navy' },
                    { name: 'Anita Sharma', code: 'FS-0091', co: 'Factory Site', time: '—',     status: 'spoof',   gps: 'blocked', color: 'red' },
                    { name: 'Vikram Shah',  code: 'LL-0017', co: 'Logistics',    time: '09:45', status: 'leave',   gps: '—',    color: 'amber' },
                    { name: 'Neha Singh',   code: 'TC-0055', co: 'Tech Corp',    time: '—',     status: 'absent',  gps: '—',    color: 'red' },
                  ].map(row => (
                    <tr key={row.code}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={row.name} size="sm" color={row.color}/>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{row.name}</div>
                            <Mono size={10} color="var(--muted)">{row.code}</Mono>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{row.co}</td>
                      <td><Mono size={12}>{row.time}</Mono></td>
                      <td><Badge label={row.status.replace('_', ' ')} variant={row.status === 'spoof' ? 'spoof' : row.status === 'present' ? 'present' : row.status === 'late' ? 'late' : row.status === 'absent' ? 'absent' : 'leave'} /></td>
                      <td><Mono size={11} color={row.gps === 'blocked' ? 'var(--red)' : 'var(--teal2)'}>{row.gps}</Mono></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel: credits + health */}
          <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Credit usage */}
            <Card title="Credit usage">
              {[
                { name: 'Tech Corp',    v: 78,  max: 100 },
                { name: 'Logistics',    v: 41,  max: 80  },
                { name: 'Factory Site', v: 92,  max: 100 },
                { name: 'RetailCo',     v: 5,   max: 50  },
              ].map(c => (
                <div key={c.name} style={{ marginBottom: 10 }}>
                  <div className="flex items-center mb-3" style={{ gap: 8 }}>
                    <span style={{ fontSize: 12, flex: 1 }}>{c.name}</span>
                    <Mono size={10} color="var(--muted)">{c.v}/{c.max}</Mono>
                  </div>
                  <ProgressBar value={c.v} max={c.max}/>
                </div>
              ))}
              <Link to="/credits">
                <Button variant="ghost" size="sm" style={{ width: '100%', marginTop: 8 }}>Manage credits</Button>
              </Link>
            </Card>

            {/* System health */}
            <div style={{ background: 'var(--navy)', borderRadius: 12, padding: 16 }}>
              <Mono size={10} color="var(--teal)" style={{ textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 12 }}>
                System health
              </Mono>
              <HealthPill label="GPS engine"   value="±2m"    status="ok"/>
              <HealthPill label="Anti-spoof"   value="active" status="ok"/>
              <HealthPill label="Socket.io"    value="online" status="ok"/>
              <HealthPill label="Push (FCM)"   value="online" status="ok"/>
              <HealthPill label="BLE beacons"  value="beta"   status="warn"/>
              <HealthPill label="Database"     value="healthy" status="ok"/>
            </div>

          </div>
        </div>

        {/* ── Live geofence map ──────────────────────────── */}
        <Card title="Live geofence map"
          bodyClass=""
          style={{ marginBottom: 0 }}
        >
          <div className="map-bg" style={{ borderRadius: '0 0 12px 12px' }}>
            <LiveMap/>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'var(--white)' }}>
              <Mono size={12} color="var(--navy)" style={{ fontWeight: 500 }}>3 active zones · 847 employees</Mono>
              <div style={{ display: 'flex', gap: 16 }}>
                <Mono size={11} color="var(--teal2)">631 inside ↑</Mono>
                <Mono size={11} color="var(--red)">1 outside</Mono>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
