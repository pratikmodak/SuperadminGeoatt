import React, { useState, useEffect } from 'react';
import { companiesAPI, superadminAPI } from '../api/client';
import { Button, Mono, PageHeader, StatCard, ProgressBar } from '../components/ui';

export default function Credits() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => companiesAPI.list().then(d=>setCompanies(d||[])).finally(()=>setLoading(false));
  useEffect(() => { load(); }, []);

  const topup = async (id, current, max) => {
    const amt = prompt(`Add credits to this company (current: ${current}/${max}):`);
    if (!amt || isNaN(amt)) return;
    await superadminAPI.updateCredits(id, { action:'add', amount: parseInt(amt) });
    load();
  };

  return (
    <div>
      <PageHeader breadcrumb="Superadmin / Credits" title="Credit management" />
      <div className="page-body">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Plan</th><th>Used</th><th>Limit</th><th>Remaining</th><th>Usage</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'var(--muted)' }}>Loading...</td></tr>
              ) : companies.map(c => {
                const remaining = c.report_credits - c.credits_used;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight:500 }}>{c.name}</td>
                    <td><Mono size={11}>{c.plan}</Mono></td>
                    <td><Mono size={12}>{c.credits_used}</Mono></td>
                    <td><Mono size={12}>{c.report_credits}</Mono></td>
                    <td><Mono size={12} color={remaining<10?'var(--red)':'var(--teal2)'}>{remaining}</Mono></td>
                    <td style={{ width:120 }}><ProgressBar value={c.credits_used} max={c.report_credits||1}/></td>
                    <td><Button variant="ghost" size="sm" onClick={()=>topup(c.id, c.credits_used, c.report_credits)}>+ Add</Button></td>
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
