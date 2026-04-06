import React, { useState } from 'react';
import { authAPI, setAuth } from '../api/client';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(email.trim().toLowerCase(), password);
      setAuth(data.token, data.refresh_token, data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F7F9FC' }}>
      <div style={{ width:'100%', maxWidth:420, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'#0A1628', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="5" fill="#00D4AA"/>
              <path d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12" stroke="#00D4AA" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily:'Outfit,sans-serif', fontSize:24, fontWeight:700, color:'#0A1628', margin:0 }}>GeoAttend</h1>
          <p style={{ fontFamily:'Outfit,sans-serif', fontSize:14, color:'#8A9BBB', marginTop:6 }}>Superadmin panel</p>
        </div>
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #E2E8F4', padding:'32px' }}>
          <h2 style={{ fontFamily:'Outfit,sans-serif', fontSize:18, fontWeight:600, color:'#0A1628', margin:'0 0 24px' }}>Sign in</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontFamily:'DM Mono,monospace', fontSize:11, color:'#8A9BBB', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Email</label>
              <input type="email" required autoFocus value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@company.com"
                style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #E2E8F4', fontSize:14, fontFamily:'Outfit,sans-serif', color:'#0A1628', background:'#F7F9FC', outline:'none', boxSizing:'border-box' }}/>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontFamily:'DM Mono,monospace', fontSize:11, color:'#8A9BBB', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6 }}>Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid #E2E8F4', fontSize:14, fontFamily:'Outfit,sans-serif', color:'#0A1628', background:'#F7F9FC', outline:'none', boxSizing:'border-box' }}/>
            </div>
            {error && <div style={{ background:'#FFF0F1', border:'1px solid #FFCDD0', borderRadius:8, padding:'10px 14px', fontFamily:'Outfit,sans-serif', fontSize:13, color:'#CC2233', marginBottom:16 }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'12px', borderRadius:8, background:loading?'#8A9BBB':'#0A1628', color:'#fff', border:'none', cursor:loading?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:15, fontWeight:600 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', marginTop:24, fontFamily:'DM Mono,monospace', fontSize:11, color:'#C0CCDD' }}>GeoAttend · Ligera Technology</p>
      </div>
    </div>
  );
}
