// superadmin-web/src/pages/Leaves.jsx
import React, { useState } from 'react';
import { Badge, Avatar, Button, Mono, Select, PageHeader, StatCard } from '../components/ui';

const LEAVES = [
  { id:1, name:'Neha Singh',   code:'TC-0055', co:'Tech Corp',    type:'sick',    from:'Apr 5',  to:'Apr 6',  days:2, reason:'Fever',        status:'pending'  },
  { id:2, name:'Amit Mishra',  code:'LL-0031', co:'Logistics',    type:'casual',  from:'Apr 8',  to:'Apr 8',  days:1, reason:'Family',        status:'pending'  },
  { id:3, name:'Rohit Desai',  code:'FS-0023', co:'Factory',      type:'annual',  from:'Apr 10', to:'Apr 14', days:5, reason:'Vacation',      status:'approved' },
  { id:4, name:'Deepa Patil',  code:'LL-0041', co:'Logistics',    type:'comp_off',from:'Apr 9',  to:'Apr 9',  days:1, reason:'Overtime Apr 1',status:'approved' },
  { id:5, name:'Kiran More',   code:'TC-0067', co:'Tech Corp',    type:'sick',    from:'Apr 3',  to:'Apr 3',  days:1, reason:'Cold',          status:'rejected' },
];

const typeColors = {
  sick:     { bg:'#FFF0F1', color:'#CC2233' },
  casual:   { bg:'#FFF8EE', color:'#996600' },
  annual:   { bg:'#EBF9F6', color:'#007A62' },
  comp_off: { bg:'#EEF2FA', color:'#3355AA' },
  maternity:{ bg:'#F5F0FF', color:'#553399' },
  unpaid:   { bg:'var(--off)', color:'var(--muted)' },
};

export default function Leaves() {
  const [statusFilter, setStatus] = useState('pending');
  const pending  = LEAVES.filter(l => l.status === 'pending').length;
  const approved = LEAVES.filter(l => l.status === 'approved').length;
  const rejected = LEAVES.filter(l => l.status === 'rejected').length;
  const filtered = LEAVES.filter(l => statusFilter === 'all' || l.status === statusFilter);

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Leave" title="Leave requests"
        actions={<>
          <Select options={['pending','approved','rejected','all']} value={statusFilter} onChange={e=>setStatus(e.target.value)} style={{width:130,marginBottom:0}}/>
          <Button variant="ghost" size="sm">Export</Button>
          <Button variant="ghost" size="sm">Policy settings</Button>
        </>}
      />
      <div className="page-body">
        <div className="stat-grid mb-4">
          <StatCard label="Pending approval" value={pending}  change="Needs action" changeType="down" accent="amber"/>
          <StatCard label="Approved"         value={approved} change="This month"   changeType="up"   accent="teal"/>
          <StatCard label="Rejected"         value={rejected} change="This month"   changeType="neu"  accent="navy"/>
          <StatCard label="Total requests"   value={LEAVES.length} change="All time" changeType="neu" accent="navy"/>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Company</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const tc = typeColors[l.type] || typeColors.unpaid;
                return (
                  <tr key={l.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={l.name} size="sm" color="teal"/>
                        <div>
                          <div style={{fontWeight:500,fontSize:13}}>{l.name}</div>
                          <Mono size={10} color="var(--muted)">{l.code}</Mono>
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12}}>{l.co}</td>
                    <td>
                      <span className="badge" style={{background:tc.bg,color:tc.color,fontSize:10}}>
                        {l.type.replace('_',' ')}
                      </span>
                    </td>
                    <td><Mono size={11}>{l.from} – {l.to}</Mono></td>
                    <td><Mono size={12}>{l.days}d</Mono></td>
                    <td style={{fontSize:12,color:'var(--muted)'}}>{l.reason}</td>
                    <td>
                      <Badge label={l.status}
                        variant={l.status==='approved'?'active':l.status==='pending'?'warning':'absent'}
                        dot={false}
                      />
                    </td>
                    <td>
                      {l.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button variant="teal" size="sm">Approve</Button>
                          <Button variant="danger" size="sm">Reject</Button>
                        </div>
                      ) : <Button variant="ghost" size="sm">View</Button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
