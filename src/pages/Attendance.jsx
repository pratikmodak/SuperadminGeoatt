// superadmin-web/src/pages/Attendance.jsx
import React, { useState } from 'react';
import { Badge, Avatar, Button, Mono, Input, Select, PageHeader, StatCard } from '../components/ui';

const RECORDS = [
  { id:1, name:'Ravi Kumar',    code:'TC-0042', co:'Tech Corp',    dept:'Engineering',   checkIn:'09:02', checkOut:'—',     hours:'3h 14m', status:'present', gps:'±2m',  late:0  },
  { id:2, name:'Priya Mehta',   code:'TC-0038', co:'Tech Corp',    dept:'Design',        checkIn:'09:31', checkOut:'—',     hours:'2h 45m', status:'late',    gps:'±4m',  late:16 },
  { id:3, name:'Anita Sharma',  code:'FS-0091', co:'Factory Site', dept:'Operations',    checkIn:'—',     checkOut:'—',     hours:'—',      status:'absent',  gps:'—',    late:0  },
  { id:4, name:'Vikram Shah',   code:'LL-0017', co:'Logistics',    dept:'Warehouse',     checkIn:'09:45', checkOut:'10:05', hours:'0h 20m', status:'present', gps:'±5m',  late:0  },
  { id:5, name:'Neha Singh',    code:'TC-0055', co:'Tech Corp',    dept:'HR',            checkIn:'—',     checkOut:'—',     hours:'—',      status:'on_leave',gps:'—',    late:0  },
  { id:6, name:'Rohit Desai',   code:'FS-0023', co:'Factory Site', dept:'Production',    checkIn:'08:55', checkOut:'—',     hours:'3h 21m', status:'present', gps:'±3m',  late:0  },
  { id:7, name:'Deepa Patil',   code:'LL-0041', co:'Logistics',    dept:'Admin',         checkIn:'09:00', checkOut:'13:00', hours:'4h 00m', status:'present', gps:'±6m',  late:0  },
];

export default function Attendance() {
  const [search, setSearch]   = useState('');
  const [coFilter, setCo]     = useState('All');
  const [stFilter, setSt]     = useState('All');
  const [period, setPeriod]   = useState('Today');

  const filtered = RECORDS.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
    const matchCo  = coFilter === 'All' || r.co === coFilter;
    const matchSt  = stFilter === 'All' || r.status === stFilter;
    return matchSearch && matchCo && matchSt;
  });

  const counts = RECORDS.reduce((a,r) => { a[r.status] = (a[r.status]||0)+1; return a; }, {});

  return (
    <div>
      <PageHeader
        breadcrumb="Superadmin / Attendance"
        title="Attendance records"
        actions={
          <>
            <div className="toggle-group">
              {['Today','Week','Month'].map(p => (
                <div key={p} className={`toggle-opt ${period===p?'on':''}`} onClick={() => setPeriod(p)}>{p}</div>
              ))}
            </div>
            <Button variant="ghost" size="sm">Export Excel</Button>
          </>
        }
      />

      <div className="page-body">

        {/* ── Summary cards ─────────────────────────────── */}
        <div className="stat-grid mb-4">
          <StatCard label="Present"  value={counts.present||0}  change={`${Math.round(((counts.present||0)/RECORDS.length)*100)}% rate`} changeType="up"  accent="teal"/>
          <StatCard label="Absent"   value={counts.absent||0}   change="Auto-marked 11:59 PM" changeType="neu" accent="navy"/>
          <StatCard label="Late"     value={counts.late||0}     change="Avg 12 min late" changeType="down" accent="amber"/>
          <StatCard label="On leave" value={counts.on_leave||0} change="Approved" changeType="neu" accent="navy"/>
        </div>

        {/* ── Filters ───────────────────────────────────── */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Search name, code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, marginBottom: 0 }}
          />
          <Select
            options={['All', 'Tech Corp', 'Logistics Ltd', 'Factory Site']}
            value={coFilter}
            onChange={e => setCo(e.target.value)}
            style={{ width: 160, marginBottom: 0 }}
          />
          <Select
            options={['All', 'present', 'absent', 'late', 'on_leave']}
            value={stFilter}
            onChange={e => setSt(e.target.value)}
            style={{ width: 140, marginBottom: 0 }}
          />
          <Button variant="ghost" size="sm">Regularise selected</Button>
        </div>

        {/* ── Table ─────────────────────────────────────── */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Company · Dept</th>
                <th>Check in</th>
                <th>Check out</th>
                <th>Hours</th>
                <th>Late</th>
                <th>Status</th>
                <th>GPS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={r.name} size="sm"
                        color={r.status==='present'?'teal':r.status==='late'?'amber':r.status==='absent'?'red':'navy'}
                      />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</div>
                        <Mono size={10} color="var(--muted)">{r.code}</Mono>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{r.co}</div>
                    <Mono size={10} color="var(--muted)">{r.dept}</Mono>
                  </td>
                  <td><Mono size={12} color={r.checkIn==='—'?'var(--muted)':'var(--text)'}>{r.checkIn}</Mono></td>
                  <td><Mono size={12} color={r.checkOut==='—'?'var(--muted)':'var(--text)'}>{r.checkOut}</Mono></td>
                  <td><Mono size={12}>{r.hours}</Mono></td>
                  <td>
                    {r.late > 0
                      ? <Mono size={11} color="var(--amber)">{r.late} min</Mono>
                      : <Mono size={11} color="var(--muted)">—</Mono>
                    }
                  </td>
                  <td>
                    <Badge
                      label={r.status.replace('_',' ')}
                      variant={r.status==='present'?'present':r.status==='late'?'late':r.status==='absent'?'absent':'leave'}
                    />
                  </td>
                  <td>
                    <Mono size={11} color={r.gps==='—'?'var(--muted)':'var(--teal2)'}>{r.gps}</Mono>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
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
