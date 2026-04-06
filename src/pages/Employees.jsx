import React, { useState, useEffect } from 'react';
import { employeesAPI, companiesAPI } from '../api/client';
import { Badge, Avatar, Button, Mono, Input, PageHeader } from '../components/ui';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [coFilter,  setCo]        = useState('');
  const [search,    setSearch]    = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', employee_code:'', department:'', designation:'', phone:'', company_id:'' });

  const load = () => {
    setLoading(true);
    const params = coFilter ? { company_id: coFilter } : {};
    Promise.all([employeesAPI.list(params), companiesAPI.list()])
      .then(([e, c]) => { setEmployees(e||[]); setCompanies(c||[]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [coFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await employeesAPI.create(form);
      setShowForm(false);
      setForm({ name:'', email:'', password:'', employee_code:'', department:'', designation:'', phone:'', company_id:'' });
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const filtered = employees.filter(e =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Employees" title="Employees"
        actions={<Button variant="teal" size="sm" onClick={()=>setShowForm(s=>!s)}>+ Add employee</Button>}
      />
      <div className="page-body">

        {showForm && (
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:16 }}>
            <div className="card-header"><span className="card-title">Add employee</span><Button variant="ghost" size="sm" onClick={()=>setShowForm(false)}>Cancel</Button></div>
            <form onSubmit={handleCreate}>
              <div className="grid-3 mb-3">
                <Input label="Full name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                <Input label="Email" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                <Input label="Password" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 chars"/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="Employee code" value={form.employee_code} onChange={e=>setForm({...form,employee_code:e.target.value})} placeholder="EMP-001"/>
                <Input label="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/>
                <Input label="Designation" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                <div>
                  <div className="input-label">Company</div>
                  <select className="input-field" required value={form.company_id} onChange={e=>setForm({...form,company_id:e.target.value})}>
                    <option value="">Select company</option>
                    {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div/>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" type="submit" loading={saving}>Create employee</Button>
                <Button variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <input className="input-field" style={{ width:240, marginBottom:0 }} placeholder="Search name, code, email..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select className="input-field" style={{ width:180, marginBottom:0 }} value={coFilter} onChange={e=>setCo(e.target.value)}>
            <option value="">All companies</option>
            {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Department</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No employees yet</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={emp.name} size="sm" color="teal"/>
                      <div>
                        <div style={{ fontWeight:500, fontSize:13 }}>{emp.name}</div>
                        <Mono size={10} color="var(--muted)">{emp.employee_code||'—'}</Mono>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize:12 }}>{emp.department||'—'}</td>
                  <td style={{ fontSize:12 }}>{emp.email}</td>
                  <td><Badge label={emp.is_active?'Active':'Inactive'} variant={emp.is_active?'active':'inactive'} dot={false}/></td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={()=>{ if(confirm(emp.is_active?'Deactivate?':'Activate?')) employeesAPI.update(emp.id,{is_active:!emp.is_active}).then(load); }}>
                      {emp.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
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
