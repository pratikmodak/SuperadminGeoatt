import React, { useState, useEffect } from 'react';
import { companiesAPI, reportsAPI } from '../api/client';
import { Button, Mono, PageHeader, StatCard } from '../components/ui';

export default function Payroll() {
  const [companies, setCompanies] = useState([]);
  const [coId,    setCo]        = useState('');
  const [month,   setMonth]     = useState(String(new Date().getMonth()+1).padStart(2,'0'));
  const [year,    setYear]      = useState(String(new Date().getFullYear()));

  useEffect(() => { companiesAPI.list().then(d=>setCompanies(d||[])); }, []);

  const download = (type) => {
    if (!coId) return alert('Select a company first');
    if (type === 'attendance') reportsAPI.downloadAttendance({ month, year, company_id: coId });
    else reportsAPI.downloadPayroll({ month, year, company_id: coId });
  };

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Payroll" title="Payroll & reports" />
      <div className="page-body">
        <div className="flex gap-2 mb-4">
          <select className="input-field" style={{ width:220, marginBottom:0 }} value={coId} onChange={e=>setCo(e.target.value)}>
            <option value="">Select company</option>
            {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input-field" style={{ width:120, marginBottom:0 }} value={month} onChange={e=>setMonth(e.target.value)}>
            {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m=><option key={m}>{m}</option>)}
          </select>
          <select className="input-field" style={{ width:100, marginBottom:0 }} value={year} onChange={e=>setYear(e.target.value)}>
            {['2025','2026','2027'].map(y=><option key={y}>{y}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:20, flex:1 }}>
            <div style={{ fontWeight:500, fontSize:14, color:'var(--navy)', marginBottom:6 }}>Attendance Excel</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>Full month attendance for all employees — P/A/L/WO codes</div>
            <Button variant="primary" size="sm" onClick={()=>download('attendance')}>Download Excel</Button>
          </div>
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:20, flex:1 }}>
            <div style={{ fontWeight:500, fontSize:14, color:'var(--navy)', marginBottom:6 }}>Payroll summary Excel</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>Working days, present, absent, OT hours per employee</div>
            <Button variant="ghost" size="sm" onClick={()=>download('payroll')}>Download Excel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
