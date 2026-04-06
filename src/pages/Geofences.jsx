// superadmin-web/src/pages/Geofences.jsx
import React, { useState } from 'react';
import { Badge, Button, Mono, Input, Select, PageHeader, Card } from '../components/ui';

const ZONES = [
  { id:1, name:'Tech Corp — Main campus',  co:'Tech Corp',    shape:'circle',  radius:100, employees:336, accuracy:50, strict:true,  wfh:false, status:'active' },
  { id:2, name:'Logistics — Gate A',       co:'Logistics Ltd',shape:'circle',  radius:80,  employees:110, accuracy:30, strict:true,  wfh:false, status:'active' },
  { id:3, name:'Factory Site — Floor 1',   co:'Factory Site', shape:'polygon', radius:null,employees:197, accuracy:50, strict:true,  wfh:false, status:'active' },
  { id:4, name:'RetailCo — Store front',   co:'RetailCo',     shape:'circle',  radius:50,  employees:94,  accuracy:30, strict:false, wfh:true,  status:'inactive'},
];

export default function Geofences() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Geofences" title="Geofences"
        actions={<Button variant="teal" size="sm" onClick={()=>setShowForm(s=>!s)}>+ Create zone</Button>}
      />
      <div className="page-body">
        {showForm && (
          <Card style={{marginBottom:16}}>
            <div className="card-header"><span className="card-title">Create geofence zone</span><Button variant="ghost" size="sm" onClick={()=>setShowForm(false)}>Cancel</Button></div>
            <div className="card-body">
              <div className="grid-3 mb-3">
                <Input label="Zone name" placeholder="Main campus"/>
                <Select label="Company" options={['Tech Corp','Logistics','Factory']}/>
                <Select label="Shape" options={['circle','polygon']}/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="Latitude"  placeholder="18.5204"/>
                <Input label="Longitude" placeholder="73.8567"/>
                <Input label="Radius (m)" placeholder="100"/>
              </div>
              <div className="grid-3 mb-3">
                <Input label="GPS accuracy threshold (m)" placeholder="50"/>
                <Select label="Strict mode" options={['Yes','No']}/>
                <Select label="Allow WFH check-in" options={['No','Yes']}/>
              </div>
              <Button variant="primary">Create zone</Button>
            </div>
          </Card>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Zone name</th><th>Company</th><th>Shape</th><th>Radius</th><th>Employees</th><th>GPS threshold</th><th>Strict</th><th>WFH</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {ZONES.map(z => (
                <tr key={z.id}>
                  <td style={{fontWeight:500,fontSize:13}}>{z.name}</td>
                  <td style={{fontSize:12}}>{z.co}</td>
                  <td><Mono size={11}>{z.shape}</Mono></td>
                  <td><Mono size={12}>{z.radius ? `${z.radius}m` : 'polygon'}</Mono></td>
                  <td><Mono size={12}>{z.employees}</Mono></td>
                  <td><Mono size={11} color="var(--teal2)">±{z.accuracy}m</Mono></td>
                  <td><Badge label={z.strict?'Yes':'No'} variant={z.strict?'active':'inactive'} dot={false}/></td>
                  <td><Badge label={z.wfh?'Yes':'No'} variant={z.wfh?'active':'inactive'} dot={false}/></td>
                  <td><Badge label={z.status} variant={z.status==='active'?'active':'inactive'} dot={false}/></td>
                  <td><div className="flex gap-2"><Button variant="ghost" size="sm">Edit</Button><Button variant="danger" size="sm">Delete</Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
