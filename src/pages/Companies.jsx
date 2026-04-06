// superadmin-web/src/pages/Companies.jsx
import React, { useState } from 'react';
import { Badge, Avatar, Button, Card, Mono, Input, Select, PageHeader, ProgressBar, SectionLabel } from '../components/ui';

const COMPANIES = [
  { id: 1, name: 'Tech Corp HQ',   slug: 'tech-corp',   city: 'Pune',    admin: 'Ravi Kumar',  employees: 336, limit: 350, plan: 'pro',      credits: 78, creditMax: 100, status: 'active',   zones: 3 },
  { id: 2, name: 'Logistics Ltd',  slug: 'logistics',   city: 'Mumbai',  admin: 'Suman Rao',   employees: 220, limit: 250, plan: 'business', credits: 41, creditMax: 80,  status: 'active',   zones: 5 },
  { id: 3, name: 'Factory Site',   slug: 'factory',     city: 'Akola',   admin: 'Deepak Joshi',employees: 197, limit: 200, plan: 'starter',  credits: 92, creditMax: 100, status: 'warning',  zones: 2 },
  { id: 4, name: 'RetailCo',       slug: 'retailco',    city: 'Nagpur',  admin: 'Meena Shah',  employees: 94,  limit: 100, plan: 'free',     credits: 5,  creditMax: 50,  status: 'inactive', zones: 1 },
];

const planColors = {
  pro:      { bg: 'var(--navy)', color: 'var(--teal)' },
  business: { bg: '#EBF9F6', color: 'var(--teal2)' },
  starter:  { bg: 'var(--amber-bg)', color: '#996600' },
  free:     { bg: 'var(--off)', color: 'var(--muted)' },
};

export default function Companies() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');

  const filtered = COMPANIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.admin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        breadcrumb="Superadmin / Companies"
        title="Companies"
        actions={
          <>
            <Button variant="ghost" size="sm">Export</Button>
            <Button variant="teal" size="sm" onClick={() => setShowForm(true)}>+ Add company</Button>
          </>
        }
      />

      <div className="page-body">

        {/* ── Create company form ─────────────────────────── */}
        {showForm && (
          <Card style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">Create new company + admin</span>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
            <div className="card-body">
              <div className="grid-3 mb-3">
                <Input label="Company name" placeholder="Tech Corp HQ"/>
                <Input label="City" placeholder="Pune"/>
                <Select label="Plan" options={['starter', 'pro', 'business', 'enterprise']}/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="Employee limit" type="number" placeholder="100"/>
                <Input label="Monthly report credits" type="number" placeholder="50"/>
                <Input label="Contact email" type="email" placeholder="admin@company.com"/>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 4 }}>
                <SectionLabel>Admin account</SectionLabel>
                <div className="grid-3 mb-3">
                  <Input label="Admin name" placeholder="Ravi Kumar"/>
                  <Input label="Admin email" placeholder="ravi@techcorp.com"/>
                  <Input label="Password" type="password" placeholder="Min 8 chars"/>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Create company + admin</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Search ─────────────────────────────────────── */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Search companies, admins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260, marginBottom: 0 }}
          />
          <Select options={['All status', 'Active', 'Warning', 'Inactive']} style={{ width: 140, marginBottom: 0 }}/>
          <Select options={['All plans', 'Free', 'Starter', 'Pro', 'Business']} style={{ width: 140, marginBottom: 0 }}/>
        </div>

        {/* ── Company table ──────────────────────────────── */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Admin</th>
                <th>Employees</th>
                <th>Zones</th>
                <th>Plan</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const pClr = planColors[c.plan];
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={c.name} size="sm" color={c.status === 'inactive' ? 'amber' : 'teal'}/>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                          <Mono size={10} color="var(--muted)">{c.city}, MH</Mono>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{c.admin}</td>
                    <td>
                      <Mono size={12}>{c.employees}/{c.limit}</Mono>
                      <ProgressBar value={c.employees} max={c.limit} height={3}/>
                    </td>
                    <td><Mono size={12}>{c.zones}</Mono></td>
                    <td>
                      <span className="badge" style={{ background: pClr.bg, color: pClr.color, fontSize: 10 }}>
                        {c.plan}
                      </span>
                    </td>
                    <td>
                      <Mono size={12} color={c.credits > c.creditMax * 0.9 ? 'var(--red)' : 'var(--text)'}>
                        {c.credits}/{c.creditMax}
                      </Mono>
                      <ProgressBar value={c.credits} max={c.creditMax} height={3}/>
                    </td>
                    <td>
                      <Badge
                        label={c.status}
                        variant={c.status === 'active' ? 'active' : c.status === 'warning' ? 'warning' : 'inactive'}
                        dot={false}
                      />
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Credits</Button>
                        {c.status !== 'inactive' && (
                          <Button variant="danger" size="sm">Suspend</Button>
                        )}
                      </div>
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
