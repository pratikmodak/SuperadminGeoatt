// superadmin-web/src/pages/Credits.jsx
import React from 'react';
import { Button, Mono, Input, PageHeader, StatCard, ProgressBar, Card } from '../components/ui';

export default function Credits() {
  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Credits" title="Credit management"
        actions={<Button variant="teal" size="sm">Top up credits</Button>}
      />
      <div className="page-body">
        <div className="stat-grid mb-4">
          <StatCard label="Total credits issued" value="580"  change="This cycle" changeType="neu" accent="navy"/>
          <StatCard label="Credits used"          value="216"  change="37% consumed" changeType="neu" accent="amber"/>
          <StatCard label="Credits remaining"     value="364"  change="Across 12 cos" changeType="up" accent="teal"/>
          <StatCard label="Near limit (>90%)"     value="1"    change="Factory Site"  changeType="down" accent="red"/>
        </div>
        <div className="table-wrap">
          <div className="card-header"><span className="card-title">Company credit usage</span></div>
          <table>
            <thead><tr><th>Company</th><th>Plan</th><th>Used</th><th>Limit</th><th>Remaining</th><th>Usage</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                {co:'Tech Corp',    plan:'pro',      used:78, max:100},
                {co:'Logistics Ltd',plan:'business', used:41, max:80 },
                {co:'Factory Site', plan:'starter',  used:92, max:100},
                {co:'RetailCo',     plan:'free',     used:5,  max:50 },
              ].map(r => (
                <tr key={r.co}>
                  <td style={{fontWeight:500,fontSize:13}}>{r.co}</td>
                  <td><Mono size={11}>{r.plan}</Mono></td>
                  <td><Mono size={12}>{r.used}</Mono></td>
                  <td><Mono size={12}>{r.max}</Mono></td>
                  <td><Mono size={12} color={r.max-r.used<10?'var(--red)':'var(--teal2)'}>{r.max-r.used}</Mono></td>
                  <td style={{width:120}}><ProgressBar value={r.used} max={r.max}/></td>
                  <td><Button variant="ghost" size="sm">+ Add</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
