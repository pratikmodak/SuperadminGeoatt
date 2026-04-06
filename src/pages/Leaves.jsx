import React, { useState, useEffect } from 'react';
import { leavesAPI } from '../api/client';
import { Badge, Avatar, Button, Mono, PageHeader, StatCard } from '../components/ui';

export default function Leaves() {
  const [leaves,  setLeaves]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState('pending');

  const load = () => {
    setLoading(true);
    leavesAPI.list({ status, limit: 100 })
      .then(d => setLeaves(d || []))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);

  const act = async (id, newStatus, rejection_reason) => {
    await leavesAPI.approve(id, { status: newStatus, rejection_reason });
    load();
  };

  const counts = leaves.reduce((a,l)=>{a[l.status]=(a[l.status]||0)+1;return a;},{});

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Leave" title="Leave requests"
        actions={
          <select className="input-field" style={{ width:140, marginBottom:0 }} value={status} onChange={e=>setStatus(e.target.value)}>
            {['pending','approved','rejected'].map(s=><option key={s}>{s}</option>)}
          </select>
        }
      />
      <div className="page-body">
        <div className="stat-grid mb-4">
          <StatCard label="Pending"  value={counts.pending||0}  changeType="down" accent="amber"/>
          <StatCard label="Approved" value={counts.approved||0} changeType="up"   accent="teal"/>
          <StatCard label="Rejected" value={counts.rejected||0} changeType="neu"  accent="navy"/>
          <StatCard label="Total"    value={leaves.length}      changeType="neu"  accent="navy"/>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No {status} leave requests</td></tr>
              ) : leaves.map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={l.users?.name||'?'} size="sm" color="teal"/>
                      <div>
                        <div style={{ fontWeight:500, fontSize:13 }}>{l.users?.name||'—'}</div>
                        <Mono size={10} color="var(--muted)">{l.users?.employee_code||'—'}</Mono>
                      </div>
                    </div>
                  </td>
                  <td><Mono size={11}>{l.leave_type?.replace('_',' ')}</Mono></td>
                  <td><Mono size={11}>{l.from_date} → {l.to_date}</Mono></td>
                  <td><Mono size={12}>{l.total_days}d</Mono></td>
                  <td style={{ fontSize:12, color:'var(--muted)', maxWidth:200 }}>{l.reason}</td>
                  <td><Badge label={l.status} variant={l.status==='approved'?'active':l.status==='pending'?'warning':'absent'} dot={false}/></td>
                  <td>
                    {l.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button variant="teal" size="sm" onClick={()=>act(l.id,'approved')}>Approve</Button>
                        <Button variant="danger" size="sm" onClick={()=>{const r=prompt('Rejection reason:');if(r)act(l.id,'rejected',r);}}>Reject</Button>
                      </div>
                    ) : <Mono size={10} color="var(--muted)">{l.reviewed_at ? new Date(l.reviewed_at).toLocaleDateString('en-IN') : '—'}</Mono>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
