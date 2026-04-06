// superadmin-web/src/pages/Payroll.jsx
import React, { useState } from 'react';
import { Badge, Avatar, Button, Mono, Select, Input, PageHeader, StatCard, Card } from '../components/ui';

export default function Payroll() {
  const [period, setPeriod] = useState('March 2026');

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Payroll" title="Payroll"
        actions={<>
          <Select options={['March 2026','February 2026','January 2026']} value={period} onChange={e=>setPeriod(e.target.value)} style={{width:160,marginBottom:0}}/>
          <Button variant="primary" size="sm">Compute records</Button>
          <Button variant="ghost" size="sm">Export greytHR</Button>
          <Button variant="ghost" size="sm">Export Zoho</Button>
        </>}
      />
      <div className="page-body">
        <div className="stat-grid mb-4">
          <StatCard label="Total employees"  value="847" change="Processed" changeType="neu" accent="navy"/>
          <StatCard label="Working days"     value="26"  change="March 2026" changeType="neu" accent="teal"/>
          <StatCard label="Avg present days" value="23"  change="88.5% rate" changeType="up" accent="teal"/>
          <StatCard label="OT hours total"   value="342" change="Across all" changeType="neu" accent="amber"/>
        </div>
        <div className="table-wrap">
          <div className="card-header">
            <span className="card-title">Payroll records — {period}</span>
            <Button variant="ghost" size="sm">Export Excel (3 sheets)</Button>
          </div>
          <table>
            <thead>
              <tr><th>Employee</th><th>Company</th><th>Working days</th><th>Present</th><th>Absent</th><th>Late</th><th>OT hours</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {[
                {name:'Ravi Kumar',  code:'TC-0042',co:'Tech Corp', wd:26,pr:25,ab:1, lt:0, ot:4.5},
                {name:'Priya Mehta', code:'TC-0038',co:'Tech Corp', wd:26,pr:23,ab:2, lt:3, ot:2.0},
                {name:'Vikram Shah', code:'LL-0017',co:'Logistics', wd:26,pr:24,ab:1, lt:1, ot:8.0},
                {name:'Deepa Patil', code:'LL-0041',co:'Logistics', wd:26,pr:26,ab:0, lt:0, ot:0.0},
              ].map(r => (
                <tr key={r.code}>
                  <td><div className="flex items-center gap-2"><Avatar name={r.name} size="sm" color="teal"/><div><div style={{fontWeight:500,fontSize:13}}>{r.name}</div><Mono size={10} color="var(--muted)">{r.code}</Mono></div></div></td>
                  <td style={{fontSize:12}}>{r.co}</td>
                  <td><Mono size={12}>{r.wd}</Mono></td>
                  <td><Mono size={12} color="var(--teal2)">{r.pr}</Mono></td>
                  <td><Mono size={12} color={r.ab>0?'var(--red)':'var(--muted)'}>{r.ab}</Mono></td>
                  <td><Mono size={12} color={r.lt>0?'var(--amber)':'var(--muted)'}>{r.lt}</Mono></td>
                  <td><Mono size={12}>{r.ot.toFixed(1)}</Mono></td>
                  <td><Button variant="ghost" size="sm">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
