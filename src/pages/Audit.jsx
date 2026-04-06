// superadmin-web/src/pages/Audit.jsx
import React, { useState } from 'react';
import { Badge, Mono, Button, Select, Input, PageHeader } from '../components/ui';

const LOGS = [
  { id:1, ts:'Apr 4 09:14', actor:'Anita Sharma',   role:'employee',    action:'spoofing_blocked', entity:'check_in',  detail:'Mock location detected — Android',        ip:'103.x.x.x', result:'blocked' },
  { id:2, ts:'Apr 4 09:02', actor:'Ravi Kumar',     role:'employee',    action:'checkin',          entity:'Zone 1',    detail:'Tech Corp HQ · ±2m · fused GPS',          ip:'49.x.x.x',  result:'success' },
  { id:3, ts:'Apr 4 08:55', actor:'Admin Ravi',     role:'admin',       action:'geofence_edit',    entity:'Zone 2',    detail:'Radius updated 50m → 80m',                ip:'Web',        result:'saved'   },
  { id:4, ts:'Apr 4 08:30', actor:'Superadmin',     role:'superadmin',  action:'credits_update',   entity:'Factory',   detail:'Credits topped up to 100',                ip:'Web',        result:'done'    },
  { id:5, ts:'Apr 3 18:01', actor:'Vikram Shah',    role:'employee',    action:'checkout',         entity:'Zone 3',    detail:'Logistics Ltd · early exit',              ip:'182.x.x.x', result:'success' },
  { id:6, ts:'Apr 3 10:22', actor:'Neha Singh',     role:'employee',    action:'leave_apply',      entity:'leave_req', detail:'Sick leave Apr 5–6 · 2 days',             ip:'49.x.x.x',  result:'pending' },
  { id:7, ts:'Apr 3 09:00', actor:'Admin Deepak',   role:'admin',       action:'employee_create',  entity:'users',     detail:'New employee: FS-0099 · Factory Site',    ip:'Web',        result:'done'    },
];

const actionBadge = {
  spoofing_blocked: { label: 'Spoofing',    cls: 'spoof' },
  checkin:          { label: 'Check in',    cls: 'present' },
  checkout:         { label: 'Check out',   cls: 'leave' },
  geofence_edit:    { label: 'Geo edit',    cls: 'warning' },
  credits_update:   { label: 'Credits',     cls: 'warning' },
  leave_apply:      { label: 'Leave',       cls: 'leave' },
  employee_create:  { label: 'New emp',     cls: 'active' },
};

const resultBadge = {
  blocked: { cls: 'absent', label: 'Blocked' },
  success: { cls: 'present', label: 'Success' },
  saved:   { cls: 'active', label: 'Saved' },
  done:    { cls: 'active', label: 'Done' },
  pending: { cls: 'warning', label: 'Pending' },
};

export default function Audit() {
  const [search, setSearch] = useState('');
  const [actionFilter, setAction] = useState('all');
  const filtered = LOGS.filter(l =>
    (actionFilter === 'all' || l.action === actionFilter) &&
    (!search || l.actor.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Audit log" title="Audit log"
        actions={<>
          <Button variant="ghost" size="sm">Export CSV</Button>
        </>}
      />
      <div className="page-body">
        <div className="flex gap-2 mb-3">
          <Input placeholder="Search actor, detail..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:240,marginBottom:0}}/>
          <Select
            options={[
              {value:'all',label:'All actions'},
              {value:'spoofing_blocked',label:'Spoofing'},
              {value:'checkin',label:'Check in'},
              {value:'geofence_edit',label:'Geofence edits'},
              {value:'credits_update',label:'Credits'},
              {value:'leave_apply',label:'Leave'},
            ]}
            value={actionFilter}
            onChange={e=>setAction(e.target.value)}
            style={{width:160,marginBottom:0}}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>Actor</th><th>Role</th><th>Action</th><th>Detail</th><th>IP / Source</th><th>Result</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const ab = actionBadge[l.action] || { label: l.action, cls: 'default' };
                const rb = resultBadge[l.result] || { label: l.result, cls: 'default' };
                return (
                  <tr key={l.id}>
                    <td><Mono size={11} color="var(--muted)">{l.ts}</Mono></td>
                    <td style={{fontSize:13,fontWeight:500}}>{l.actor}</td>
                    <td><Mono size={10} color="var(--muted)">{l.role}</Mono></td>
                    <td><Badge label={ab.label} variant={ab.cls} dot={false}/></td>
                    <td style={{fontSize:12,color:'var(--muted)',maxWidth:260}}>{l.detail}</td>
                    <td><Mono size={11} color="var(--muted)">{l.ip}</Mono></td>
                    <td><Badge label={rb.label} variant={rb.cls} dot={false}/></td>
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
