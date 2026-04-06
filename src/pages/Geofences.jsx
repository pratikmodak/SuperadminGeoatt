import React, { useState, useEffect } from 'react';
import { geofencesAPI, companiesAPI } from '../api/client';
import { Badge, Button, Mono, Input, PageHeader } from '../components/ui';

export default function Geofences() {
  const [zones,     setZones]     = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [coFilter,  setCo]        = useState('');
  const [form, setForm] = useState({ name:'', company_id:'', latitude:'', longitude:'', radius_meters:100, accuracy_threshold_m:50, strict_mode:true, allow_wfh:false });

  const load = () => {
    setLoading(true);
    const params = coFilter ? { company_id: coFilter } : {};
    Promise.all([geofencesAPI.list(params), companiesAPI.list()])
      .then(([z, c]) => { setZones(z||[]); setCompanies(c||[]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [coFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await geofencesAPI.create({ ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), radius_meters: parseInt(form.radius_meters) });
      setShowForm(false);
      setForm({ name:'', company_id:'', latitude:'', longitude:'', radius_meters:100, accuracy_threshold_m:50, strict_mode:true, allow_wfh:false });
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Geofences" title="Geofence zones"
        actions={<Button variant="teal" size="sm" onClick={()=>setShowForm(s=>!s)}>+ Create zone</Button>}
      />
      <div className="page-body">
        {showForm && (
          <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:20, marginBottom:16 }}>
            <div className="card-header">
              <span className="card-title">Create geofence zone</span>
              <Button variant="ghost" size="sm" onClick={()=>setShowForm(false)}>Cancel</Button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="grid-3 mb-3">
                <Input label="Zone name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Main campus"/>
                <div>
                  <div className="input-label">Company</div>
                  <select className="input-field" required value={form.company_id} onChange={e=>setForm({...form,company_id:e.target.value})}>
                    <option value="">Select company</option>
                    {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <Input label="Radius (metres)" type="number" required value={form.radius_meters} onChange={e=>setForm({...form,radius_meters:e.target.value})}/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="Latitude"  required value={form.latitude}  onChange={e=>setForm({...form,latitude:e.target.value})}  placeholder="18.5204"/>
                <Input label="Longitude" required value={form.longitude} onChange={e=>setForm({...form,longitude:e.target.value})} placeholder="73.8567"/>
                <Input label="GPS accuracy threshold (m)" type="number" value={form.accuracy_threshold_m} onChange={e=>setForm({...form,accuracy_threshold_m:+e.target.value})}/>
              </div>
              <div className="flex gap-3 mb-3" style={{ alignItems:'center' }}>
                <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13 }}>
                  <input type="checkbox" checked={form.strict_mode} onChange={e=>setForm({...form,strict_mode:e.target.checked})}/> Strict mode
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13 }}>
                  <input type="checkbox" checked={form.allow_wfh} onChange={e=>setForm({...form,allow_wfh:e.target.checked})}/> Allow WFH check-in
                </label>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" type="submit" loading={saving}>Create zone</Button>
                <Button variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <select className="input-field" style={{ width:200, marginBottom:0 }} value={coFilter} onChange={e=>setCo(e.target.value)}>
            <option value="">All companies</option>
            {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Zone name</th><th>Company</th><th>Radius</th><th>GPS threshold</th><th>Strict</th><th>WFH</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : zones.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>No zones yet — create one above</td></tr>
              ) : zones.map(z => (
                <tr key={z.id}>
                  <td style={{ fontWeight:500 }}>{z.name}</td>
                  <td style={{ fontSize:12 }}>{companies.find(c=>c.id===z.company_id)?.name||z.company_id}</td>
                  <td><Mono size={12}>{z.radius_meters}m</Mono></td>
                  <td><Mono size={11} color="var(--teal2)">±{z.accuracy_threshold_m}m</Mono></td>
                  <td><Badge label={z.strict_mode?'Yes':'No'} variant={z.strict_mode?'active':'inactive'} dot={false}/></td>
                  <td><Badge label={z.allow_wfh?'Yes':'No'} variant={z.allow_wfh?'active':'inactive'} dot={false}/></td>
                  <td><Badge label={z.is_active?'Active':'Inactive'} variant={z.is_active?'active':'inactive'} dot={false}/></td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={()=>geofencesAPI.update(z.id,{is_active:!z.is_active}).then(load)}>
                        {z.is_active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={()=>{ if(confirm('Delete this zone?')) geofencesAPI.delete(z.id).then(load); }}>Delete</Button>
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
