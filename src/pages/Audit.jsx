import React, { useState, useEffect } from 'react';
import { auditAPI } from '../api/client';
import { Badge, Mono, PageHeader } from '../components/ui';

export default function Audit() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditAPI.list({ limit: 100 })
      .then(d => setLogs(d || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Audit" title="Audit log" />
      <div className="page-body">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Time</th><th>Actor</th><th>Action</th><th>Description</th><th>IP</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No audit logs yet</td></tr>
              ) : logs.map(l => (
                <tr key={l.id}>
                  <td><Mono size={11} color="var(--muted)">{new Date(l.created_at).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}</Mono></td>
                  <td>
                    <div style={{ fontSize:13, fontWeight:500 }}>{l.users?.name||'System'}</div>
                    <Mono size={10} color="var(--muted)">{l.actor_role||'—'}</Mono>
                  </td>
                  <td><Badge label={l.action?.replace(/_/g,' ')} variant="active" dot={false}/></td>
                  <td style={{ fontSize:12, color:'var(--muted)' }}>{l.description||'—'}</td>
                  <td><Mono size={11} color="var(--muted)">{l.ip_address||'—'}</Mono></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
