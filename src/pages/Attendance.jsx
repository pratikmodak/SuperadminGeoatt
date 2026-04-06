import React, { useState, useEffect } from 'react';
import { attendanceAPI, companiesAPI } from '../api/client';
import { Badge, Avatar, Button, Mono, Input, Select, PageHeader, StatCard } from '../components/ui';

export default function Attendance() {
  const [records,   setRecords]   = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [coFilter,  setCo]        = useState('');
  const [period,    setPeriod]    = useState('today');

  useEffect(() => {
    companiesAPI.list().then(d => setCompanies(d || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (coFilter) params.company_id = coFilter;
    attendanceAPI.today(params)
      .then(d => setRecords(d?.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [coFilter]);

  const counts = records.reduce((a,r) => { a[r.status]=(a[r.status]||0)+1; return a; }, {});
  const total  = records.length;

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Attendance" title="Attendance" />
      <div className="page-body">

        <div className="stat-grid mb-4">
          <StatCard label="Present"  value={counts.present||0}  change={total>0?`${Math.round(((counts.present||0)/total)*100)}%`:''} changeType="up"  accent="teal"/>
          <StatCard label="Absent"   value={counts.absent||0}   changeType="neu" accent="navy"/>
          <StatCard label="Late"     value={counts.late||0}     changeType="down" accent="amber"/>
          <StatCard label="On leave" value={counts.on_leave||0} changeType="neu" accent="navy"/>
        </div>

        <div className="flex gap-2 mb-3">
          <select className="input-field" style={{ width:200, marginBottom:0 }} value={coFilter} onChange={e=>setCo(e.target.value)}>
            <option value="">All companies</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Company</th><th>Check in</th><th>Check out</th><th>Hours</th><th>Status</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No attendance records for today</td></tr>
              ) : records.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.users?.name||'?'} size="sm" color={r.status==='present'?'teal':r.status==='late'?'amber':'red'}/>
                      <div>
                        <div style={{ fontWeight:500, fontSize:13 }}>{r.users?.name||'—'}</div>
                        <Mono size={10} color="var(--muted)">{r.users?.employee_code||'—'}</Mono>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:12 }}>{r.company_id}</td>
                  <td><Mono size={12}>{r.first_check_in ? new Date(r.first_check_in).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—'}</Mono></td>
                  <td><Mono size={12}>{r.last_check_out ? new Date(r.last_check_out).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '—'}</Mono></td>
                  <td><Mono size={12}>{r.total_hours ? parseFloat(r.total_hours).toFixed(1)+'h' : '—'}</Mono></td>
                  <td><Badge label={r.status?.replace('_',' ')} variant={r.status==='present'?'present':r.status==='late'?'late':r.status==='absent'?'absent':'leave'}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
