import React, { useState, useEffect } from 'react';
import { companiesAPI, superadminAPI } from '../api/client';
import { Badge, Avatar, Button, Card, Mono, Input, Select, PageHeader, ProgressBar, StatCard } from '../components/ui';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState('');
  const [showForm,setShowForm]    = useState(false);
  const [saving,  setSaving]      = useState(false);
  const [form,    setForm]        = useState({ name:'', city:'', plan:'starter', employee_limit:100, report_credits:50, admin_name:'', admin_email:'', admin_password:'' });

  const load = () => {
    setLoading(true);
    companiesAPI.list()
      .then(d => setCompanies(d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companiesAPI.create(form);
      setShowForm(false);
      setForm({ name:'', city:'', plan:'starter', employee_limit:100, report_credits:50, admin_name:'', admin_email:'', admin_password:'' });
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleSuspend = async (id) => {
    if (!confirm('Suspend this company?')) return;
    await companiesAPI.update(id, { status: 'suspended' });
    load();
  };

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Companies" title="Companies"
        actions={<Button variant="teal" size="sm" onClick={()=>setShowForm(s=>!s)}>+ Add company</Button>}
      />
      <div className="page-body">

        {showForm && (
          <Card style={{ marginBottom:16 }}>
            <div className="card-header">
              <span className="card-title">Create new company + admin</span>
              <Button variant="ghost" size="sm" onClick={()=>setShowForm(false)}>Cancel</Button>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <div className="grid-3 mb-3">
                  <Input label="Company name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Tech Corp HQ"/>
                  <Input label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Pune"/>
                  <div>
                    <div className="input-label">Plan</div>
                    <select className="input-field" value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})}>
                      {['free','starter','pro','business','enterprise'].map(p=><option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-3 mb-3">
                  <Input label="Employee limit" type="number" value={form.employee_limit} onChange={e=>setForm({...form,employee_limit:+e.target.value})}/>
                  <Input label="Report credits" type="number" value={form.report_credits} onChange={e=>setForm({...form,report_credits:+e.target.value})}/>
                  <div/>
                </div>
                <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, marginBottom:14 }}>
                  <Mono size={10} color="var(--muted)" style={{ textTransform:'uppercase', letterSpacing:'.07em' }}>Admin account</Mono>
                </div>
                <div className="grid-3 mb-3">
                  <Input label="Admin name" required value={form.admin_name} onChange={e=>setForm({...form,admin_name:e.target.value})} placeholder="Ravi Kumar"/>
                  <Input label="Admin email" type="email" required value={form.admin_email} onChange={e=>setForm({...form,admin_email:e.target.value})} placeholder="ravi@techcorp.com"/>
                  <Input label="Password" type="password" required value={form.admin_password} onChange={e=>setForm({...form,admin_password:e.target.value})} placeholder="Min 6 chars"/>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" type="submit" loading={saving}>Create company + admin</Button>
                  <Button variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {error && <div style={{ color:'var(--red)', marginBottom:12, fontSize:13 }}>{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Company</th><th>Plan</th><th>Employees</th><th>Credits</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : companies.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No companies yet</td></tr>
              ) : companies.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={c.name} size="sm" color="teal"/>
                      <div>
                        <div style={{ fontWeight:500, fontSize:13 }}>{c.name}</div>
                        <Mono size={10} color="var(--muted)">{c.city || '—'}</Mono>
                      </div>
                    </div>
                  </td>
                  <td><Mono size={11}>{c.plan}</Mono></td>
                  <td>
                    <Mono size={12}>{c.employee_count || 0}/{c.employee_limit}</Mono>
                    <ProgressBar value={c.employee_count||0} max={c.employee_limit||1} height={3}/>
                  </td>
                  <td>
                    <Mono size={12} color={(c.credits_used/c.report_credits)>.9?'var(--red)':'var(--text)'}>{c.credits_used}/{c.report_credits}</Mono>
                  </td>
                  <td><Badge label={c.status} variant={c.status==='active'?'active':c.status==='suspended'?'absent':'inactive'} dot={false}/></td>
                  <td>
                    <div className="flex gap-2">
                      {c.status === 'active' && <Button variant="danger" size="sm" onClick={()=>handleSuspend(c.id)}>Suspend</Button>}
                      {c.status !== 'active' && <Button variant="ghost" size="sm" onClick={()=>companiesAPI.update(c.id,{status:'active'}).then(load)}>Activate</Button>}
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
