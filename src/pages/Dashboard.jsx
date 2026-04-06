import React, { useState, useEffect } from 'react';
import { superadminAPI, companiesAPI } from '../api/client';
import { StatCard, Card, PageHeader, Mono, Badge, ProgressBar } from '../components/ui';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    Promise.all([superadminAPI.dashboard(), superadminAPI.stats()])
      .then(([dash, cos]) => { setStats(dash); setCompanies(cos || []); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><Mono size={12} color="var(--muted)">Loading...</Mono></div>;
  if (error)   return <div className="page-body"><Mono size={12} color="var(--red)">{error}</Mono></div>;

  const att = stats?.attendance_today || {};
  const present = att.present || 0;
  const absent  = att.absent  || 0;
  const late    = att.late    || 0;
  const total   = present + absent + late + (att.on_leave || 0);

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Dashboard" title="Platform overview" />
      <div className="page-body">

        <div className="stat-grid mb-4">
          <StatCard label="Active companies"  value={stats?.companies?.active  ?? 0} changeType="neu" accent="teal"/>
          <StatCard label="Total employees"   value={stats?.employees           ?? 0} changeType="neu" accent="navy"/>
          <StatCard label="Present today"     value={present} change={total > 0 ? `${Math.round((present/total)*100)}% rate` : '—'} changeType="up" accent="teal"/>
          <StatCard label="Spoofing blocked"  value={stats?.spoofing_today      ?? 0} changeType="down" accent="red"/>
        </div>

        <div className="table-wrap">
          <div className="card-header">
            <span className="card-title">Companies</span>
          </div>
          <table>
            <thead>
              <tr><th>Company</th><th>Plan</th><th>Employees</th><th>Credits used</th><th>Status</th></tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--muted)', padding:32 }}>No companies yet — create one first</td></tr>
              ) : companies.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:500 }}>{c.name}</td>
                  <td><Mono size={11}>{c.plan}</Mono></td>
                  <td>
                    <Mono size={12}>{c.employee_count}/{c.employee_limit}</Mono>
                    <ProgressBar value={c.employee_count || 0} max={c.employee_limit || 1} height={3}/>
                  </td>
                  <td>
                    <Mono size={12} color={(c.credits_used/c.report_credits)>.9?'var(--red)':'var(--text)'}>
                      {c.credits_used}/{c.report_credits}
                    </Mono>
                  </td>
                  <td><Badge label={c.status} variant={c.status==='active'?'active':'inactive'} dot={false}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
