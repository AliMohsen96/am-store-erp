import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// ⚠️ استبدل القيمتين دول ببيانات مشروعك على https://supabase.com
const SUPABASE_URL = "https://nkenmvbnanixifgsvvcy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZW5tdmJuYW5peGlmZ3N2dmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzAyMTMsImV4cCI6MjA5NjU0NjIxM30.WDSYSGk0lFcxeEC-c-amuZh1m8Qlg0ZndY351RQEEsg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  :root {
    --bg: #0d1117; --bg2: #161b22; --bg3: #21262d; --bg4: #2d333b;
    --border: #30363d; --border2: #444c56;
    --text: #e6edf3; --text2: #8b949e; --text3: #6e7681;
    --gold: #d4a843; --gold2: #f0c060; --gold3: #b8892e;
    --green: #3fb950; --red: #f85149; --blue: #58a6ff;
    --orange: #f0883e; --purple: #bc8cff;
    --accent: #d4a843;
    --radius: 10px; --radius2: 6px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --font: 'Cairo', 'Tajawal', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); direction: rtl; min-height: 100vh; }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:var(--bg2); }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }
  .app { display:flex; height:100vh; overflow:hidden; }
  .sidebar { width:240px; background:var(--bg2); border-left:1px solid var(--border); display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; transition:width .2s; }
  .sidebar-logo { padding:20px 16px; border-bottom:1px solid var(--border); }
  .sidebar-logo h1 { font-size:20px; font-weight:800; background:linear-gradient(135deg,var(--gold),var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:1px; white-space:nowrap; }
  .sidebar-logo p { font-size:11px; color:var(--text3); margin-top:2px; }
  .sidebar-role { margin:12px 16px; padding:6px 10px; background:var(--bg3); border-radius:var(--radius2); font-size:12px; color:var(--text2); border:1px solid var(--border); }
  .sidebar-role span { color:var(--gold); font-weight:600; }
  .sidebar-nav { padding:8px; flex:1; }
  .nav-section { font-size:10px; font-weight:700; color:var(--text3); letter-spacing:1px; padding:8px 8px 4px; text-transform:uppercase; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:var(--radius2); cursor:pointer; font-size:13px; font-weight:500; color:var(--text2); margin-bottom:2px; transition:all .15s; position:relative; }
  .nav-item:hover { background:var(--bg3); color:var(--text); }
  .nav-item.active { background:linear-gradient(135deg,rgba(212,168,67,.2),rgba(212,168,67,.08)); color:var(--gold); border:1px solid rgba(212,168,67,.3); }
  .nav-item .badge { position:absolute; left:10px; background:var(--red); color:#fff; font-size:10px; font-weight:700; border-radius:10px; padding:1px 6px; min-width:18px; text-align:center; }
  .nav-icon { font-size:16px; width:20px; text-align:center; flex-shrink:0; }
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .topbar { background:var(--bg2); border-bottom:1px solid var(--border); padding:12px 24px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; gap:10px; }
  .topbar h2 { font-size:18px; font-weight:700; white-space:nowrap; }
  .topbar-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .content { flex:1; overflow-y:auto; padding:24px; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; margin-bottom:24px; }
  .stat-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:20px; position:relative; overflow:hidden; }
  .stat-card::before { content:''; position:absolute; top:0; right:0; left:0; height:3px; background:var(--accent-color,var(--gold)); }
  .stat-card .label { font-size:12px; color:var(--text2); font-weight:500; }
  .stat-card .value { font-size:26px; font-weight:800; margin:6px 0 4px; line-height:1; }
  .stat-card .sub { font-size:11px; color:var(--text3); }
  .stat-card .icon { position:absolute; left:16px; top:16px; font-size:28px; opacity:.25; }
  .table-wrap { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .table-header { padding:14px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
  .table-header h3 { font-size:15px; font-weight:700; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { background:var(--bg3); padding:10px 14px; text-align:right; font-weight:600; color:var(--text2); font-size:12px; border-bottom:1px solid var(--border); white-space:nowrap; }
  td { padding:10px 14px; border-bottom:1px solid var(--border); color:var(--text); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(255,255,255,.02); }
  .badge-green { background:rgba(63,185,80,.15); color:var(--green); padding:3px 8px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge-red { background:rgba(248,81,73,.15); color:var(--red); padding:3px 8px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge-orange { background:rgba(240,136,62,.15); color:var(--orange); padding:3px 8px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge-blue { background:rgba(88,166,255,.15); color:var(--blue); padding:3px 8px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge-gold { background:rgba(212,168,67,.15); color:var(--gold); padding:3px 8px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .btn { padding:8px 16px; border-radius:var(--radius2); border:none; cursor:pointer; font-family:var(--font); font-size:13px; font-weight:600; transition:all .15s; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
  .btn-primary { background:linear-gradient(135deg,var(--gold),var(--gold3)); color:#000; }
  .btn-primary:hover { filter:brightness(1.1); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; filter:none; }
  .btn-secondary { background:var(--bg3); color:var(--text); border:1px solid var(--border2); }
  .btn-secondary:hover { background:var(--bg4); }
  .btn-danger { background:rgba(248,81,73,.15); color:var(--red); border:1px solid rgba(248,81,73,.3); }
  .btn-success { background:rgba(63,185,80,.15); color:var(--green); border:1px solid rgba(63,185,80,.3); }
  .btn-whatsapp { background:rgba(37,211,102,.15); color:#25D366; border:1px solid rgba(37,211,102,.3); }
  .btn-sm { padding:5px 10px; font-size:12px; }
  .form-grid { display:grid; gap:14px; }
  .form-grid-2 { grid-template-columns:1fr 1fr; }
  .form-grid-3 { grid-template-columns:1fr 1fr 1fr; }
  .form-group { display:flex; flex-direction:column; gap:5px; }
  .form-group label { font-size:12px; font-weight:600; color:var(--text2); }
  .form-group input, .form-group select, .form-group textarea { background:var(--bg3); border:1px solid var(--border2); border-radius:var(--radius2); padding:8px 12px; color:var(--text); font-family:var(--font); font-size:13px; outline:none; direction:rtl; width:100%; }
  .form-group input:focus, .form-group select:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(212,168,67,.15); }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); width:100%; max-width:600px; max-height:92vh; overflow-y:auto; }
  .modal-header { padding:18px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--bg2); z-index:1; }
  .modal-header h3 { font-size:16px; font-weight:700; }
  .modal-body { padding:20px; }
  .modal-footer { padding:16px 20px; border-top:1px solid var(--border); display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
  .pos-layout { display:grid; grid-template-columns:1fr 380px; gap:20px; height:calc(100vh - 140px); }
  .pos-left { display:flex; flex-direction:column; gap:16px; overflow:hidden; }
  .pos-right { display:flex; flex-direction:column; gap:12px; overflow-y:auto; }
  .pos-products { flex:1; overflow-y:auto; }
  .product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:10px; padding:12px; }
  .product-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:12px; cursor:pointer; transition:all .15s; }
  .product-card:hover { border-color:var(--gold); transform:translateY(-1px); }
  .product-card .pname { font-size:12px; font-weight:600; margin-bottom:4px; line-height:1.3; }
  .product-card .pdetail { font-size:11px; color:var(--text2); }
  .product-card .pprice { font-size:16px; font-weight:800; color:var(--gold); margin-top:6px; }
  .product-card .pstock { font-size:10px; margin-top:2px; }
  .cart-item { display:flex; align-items:center; gap:8px; padding:8px 12px; border-bottom:1px solid var(--border); }
  .cart-item:last-child { border-bottom:none; }
  .cart-item-info { flex:1; min-width:0; }
  .cart-item-info .name { font-size:12px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cart-item-info .detail { font-size:11px; color:var(--text2); }
  .qty-control { display:flex; align-items:center; gap:4px; }
  .qty-btn { width:24px; height:24px; border-radius:4px; border:1px solid var(--border2); background:var(--bg4); color:var(--text); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; }
  .summary-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; }
  .summary-row.total { font-size:16px; font-weight:800; padding-top:10px; border-top:2px solid var(--border); color:var(--gold); }
  .chart-bar { display:flex; flex-direction:column; gap:8px; }
  .chart-bar-item { display:flex; align-items:center; gap:10px; font-size:12px; }
  .chart-bar-item .bar-label { width:110px; text-align:right; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; }
  .chart-bar-item .bar-track { flex:1; background:var(--bg3); border-radius:4px; height:16px; overflow:hidden; }
  .chart-bar-item .bar-fill { height:100%; border-radius:4px; transition:width .5s; background:linear-gradient(90deg,var(--gold3),var(--gold2)); }
  .chart-bar-item .bar-val { width:70px; text-align:left; font-weight:700; color:var(--text); flex-shrink:0; }
  .dash-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px; }
  .dash-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); }
  .dash-card-header { padding:14px 18px; border-bottom:1px solid var(--border); font-size:14px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .dash-card-body { padding:16px 18px; }
  .alert { padding:12px 16px; border-radius:var(--radius2); margin-bottom:12px; display:flex; align-items:center; gap:10px; font-size:13px; }
  .alert-warn { background:rgba(240,136,62,.1); border:1px solid rgba(240,136,62,.3); color:var(--orange); }
  .alert-danger { background:rgba(248,81,73,.1); border:1px solid rgba(248,81,73,.3); color:var(--red); }
  .alert-success { background:rgba(63,185,80,.1); border:1px solid rgba(63,185,80,.3); color:var(--green); }
  .alert-info { background:rgba(88,166,255,.1); border:1px solid rgba(88,166,255,.3); color:var(--blue); }
  .search-bar { display:flex; align-items:center; gap:8px; background:var(--bg3); border:1px solid var(--border2); border-radius:var(--radius2); padding:7px 12px; }
  .search-bar input { background:none; border:none; outline:none; color:var(--text); font-family:var(--font); font-size:13px; flex:1; direction:rtl; min-width:0; }
  .login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); padding:16px; }
  .login-card { background:var(--bg2); border:1px solid var(--border); border-radius:16px; padding:40px 36px; width:100%; max-width:380px; }
  .login-card h1 { text-align:center; font-size:28px; font-weight:800; background:linear-gradient(135deg,var(--gold),var(--gold2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:6px; }
  .login-card p { text-align:center; color:var(--text2); font-size:13px; margin-bottom:30px; }
  .user-btn { display:block; width:100%; padding:12px 14px; background:var(--bg3); border:1px solid var(--border2); border-radius:var(--radius2); color:var(--text); font-family:var(--font); font-size:13px; font-weight:600; cursor:pointer; text-align:right; margin-bottom:8px; transition:all .15s; }
  .user-btn:hover { border-color:var(--gold); background:var(--bg4); }
  .divider { height:1px; background:var(--border); margin:12px 0; }
  .text-gold { color:var(--gold); font-weight:700; }
  .text-green { color:var(--green); font-weight:700; }
  .text-red { color:var(--red); font-weight:700; }
  .text-muted { color:var(--text2); }
  .flex { display:flex; } .gap-10 { gap:10px; } .gap-8 { gap:8px; }
  .items-center { align-items:center; }
  .justify-between { justify-content:space-between; }
  .mt-16 { margin-top:16px; }
  .mb-16 { margin-bottom:16px; }
  .loading-overlay { position:fixed; inset:0; background:rgba(13,17,23,.8); z-index:200; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; }
  .spinner { width:40px; height:40px; border:3px solid var(--border2); border-top-color:var(--gold); border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .sync-indicator { position:fixed; bottom:16px; left:16px; background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-size:12px; color:var(--text2); display:flex; align-items:center; gap:6px; z-index:50; }
  .sync-dot { width:8px; height:8px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @media print {
    body * { visibility:hidden; }
    .invoice-print, .invoice-print * { visibility:visible; }
    .invoice-print { position:fixed; inset:0; background:#fff; color:#000; padding:20px; direction:rtl; }
  }
  @media(max-width:768px){
    .sidebar { position:fixed; right:0; top:0; bottom:0; z-index:50; transform:translateX(0); }
    .sidebar.collapsed { transform:translateX(100%); }
    .main { width:100%; }
    .content { padding:12px; }
    .pos-layout { grid-template-columns:1fr; height:auto; }
    .dash-grid { grid-template-columns:1fr; }
    .form-grid-2, .form-grid-3 { grid-template-columns:1fr; }
    .stat-grid { grid-template-columns:1fr 1fr; }
    .topbar { padding:10px 14px; }
    .topbar h2 { font-size:15px; }
    .modal { max-width:100%; margin:0; border-radius:var(--radius) var(--radius) 0 0; }
    .modal-overlay { align-items:flex-end; padding:0; }
    .hamburger { display:flex !important; }
    .sidebar-overlay { display:block !important; }
  }
  @media(min-width:769px){
    .hamburger { display:none !important; }
    .sidebar-overlay { display:none !important; }
  }
  .hamburger { background:none; border:none; color:var(--text); cursor:pointer; font-size:20px; padding:4px; }
  .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:49; }
`;

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt    = (n) => Number(n || 0).toLocaleString("ar-EG") + " ج.م";
const fmtNum = (n) => Number(n || 0).toLocaleString("ar-EG");
const today  = () => new Date().toISOString().slice(0, 10);
const uid    = () => crypto.randomUUID();

const calcStatus = (paid, net) => {
  const rem = net - paid;
  if (rem <= 0) return "مكتمل ✅";
  if (paid > 0) return "مدفوع جزئياً 🔶";
  return "لم يدفع ❌";
};

const ROLES = {
  admin:      { label:"مدير",    color:"var(--gold)",   access:["dashboard","pos","orders","inventory","customers","suppliers","purchases","expenses","safe","shipping","returns"] },
  sales:      { label:"مبيعات",  color:"var(--blue)",   access:["pos","orders","customers","shipping"] },
  inventory:  { label:"مخزن",    color:"var(--green)",  access:["inventory","suppliers","purchases"] },
  accountant: { label:"محاسب",   color:"var(--purple)", access:["dashboard","expenses","safe","purchases"] },
};

const USERS = [
  { id:"u1", name:"Ahmed Admin",     role:"admin",     pass:"1234" },
  { id:"u2", name:"Sara Sales",      role:"sales",     pass:"1234" },
  { id:"u3", name:"Karim Inventory", role:"inventory", pass:"1234" },
  { id:"u4", name:"Nour Accountant", role:"accountant",pass:"1234" },
];

const CHANNELS = ["واتساب","انستجرام","ستور","ويبسايت","تيك توك"];
const METHODS  = ["كاش","تحويل بنكى","شيك","فوري"];

// ─── SUPABASE HOOK ────────────────────────────────────────────────────────────
function useTable(tableName, orderBy = "created_at") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from(tableName)
      .select("*")
      .order(orderBy, { ascending: false });
    if (!error) setData(rows || []);
    setLoading(false);
  }, [tableName, orderBy]);

  useEffect(() => {
    fetchData();
    // Real-time subscription
    const channel = supabase
      .channel(`rt-${tableName}`)
      .on("postgres_changes", { event: "*", schema: "public", table: tableName }, fetchData)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchData, tableName]);

  const insert = async (row) => {
    const { error } = await supabase.from(tableName).insert(row);
    if (error) { alert("خطأ: " + error.message); return false; }
    return true;
  };

  const update = async (id, changes) => {
    const { error } = await supabase.from(tableName).update(changes).eq("id", id);
    if (error) { alert("خطأ: " + error.message); return false; }
    return true;
  };

  const remove = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) { alert("خطأ: " + error.message); return false; }
    return true;
  };

  return { data, loading, insert, update, remove, refresh: fetchData };
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
function getStatusBadge(status) {
  if (!status) return null;
  if (status.includes("مكتمل") || status.includes("مدفوع بالكامل") || status.includes("تم التسليم")) return <span className="badge-green">{status}</span>;
  if (status.includes("جزئياً") || status.includes("جارى")) return <span className="badge-orange">{status}</span>;
  if (status.includes("لم يدفع") || status.includes("ملغى") || status.includes("غير مدفوع")) return <span className="badge-red">{status}</span>;
  if (status.includes("معلق")) return <span className="badge-blue">{status}</span>;
  return <span className="badge-gold">{status}</span>;
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen() {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");

  const save = () => {
    localStorage.setItem("sb_url", url);
    localStorage.setItem("sb_key", key);
    window.location.reload();
  };

  return (
    <div className="login-wrap">
      <style>{css}</style>
      <div className="login-card" style={{maxWidth:480}}>
        <h1>A&M Store</h1>
        <p style={{marginBottom:20}}>أول مرة؟ أدخل بيانات Supabase مشروعك</p>
        <div className="alert alert-info" style={{marginBottom:16,fontSize:12}}>
          ابعد على <strong>supabase.com</strong> → New Project → Settings → API
        </div>
        <div className="form-grid" style={{gap:12,marginBottom:16}}>
          <div className="form-group">
            <label>Project URL</label>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://xxxx.supabase.co" dir="ltr"/>
          </div>
          <div className="form-group">
            <label>Anon Key</label>
            <input value={key} onChange={e=>setKey(e.target.value)} placeholder="eyJh..." dir="ltr"/>
          </div>
        </div>
        <button className="btn btn-primary" style={{width:"100%"}} onClick={save}>حفظ والمتابعة ←</button>
        <div style={{marginTop:16,fontSize:11,color:"var(--text3)",lineHeight:1.6}}>
          بعد ما تحفظ، روح Supabase → SQL Editor وشغل سكريبت الجداول الموجود في README.
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  return (
    <div className="login-wrap">
      <style>{css}</style>
      <div className="login-card">
        <h1>A&M Store</h1>
        <p>نظام إدارة المتجر المتكامل — اختر حسابك للدخول</p>
        {USERS.map(u => (
          <button key={u.id} className="user-btn" onClick={() => onLogin(u)}>
            <span style={{color:ROLES[u.role].color,fontWeight:700}}>{ROLES[u.role].label}</span>
            {"  —  "}{u.name}
          </button>
        ))}
        <div style={{marginTop:16,padding:10,background:"var(--bg3)",borderRadius:6,fontSize:11,color:"var(--text3)",textAlign:"center"}}>
          🔄 البيانات مشتركة مع كل المستخدمين أونلاين
        </div>
      </div>
    </div>
  );
}

// ─── INVOICE MODAL ────────────────────────────────────────────────────────────
function InvoiceModal({ data, onClose, customers }) {
  const { order, items } = data;
  const customer = customers?.find(c=>c.id===order.customer_id) || { name:order.customer_name, phone:"", email:"" };

  const invoiceText = () => {
    const lines = items.map(i=>`- ${i.name} (${i.color} / ${i.size}) × ${i.qty} = ${i.price*i.qty} ج.م`).join("\n");
    return `🧾 *فاتورة A&M Store*\n━━━━━━━━━━━━━━━━\nرقم الأوردر: ${order.id_display||order.id}\nالتاريخ: ${order.date}\n━━━━━━━━━━━━━━━━\n${lines}\n━━━━━━━━━━━━━━━━\nإجمالى الأصناف: ${order.subtotal} ج.م\n${order.shipping>0?`الشحن: ${order.shipping} ج.م\n`:""}${order.discount>0?`الخصم: -${order.discount} ج.م\n`:""}\n*صافى الفاتورة: ${order.net} ج.م*\nالمدفوع: ${order.paid} ج.م\n${order.remaining>0?`المتبقى: ${order.remaining} ج.م`:"✅ مسدد بالكامل"}`;
  };

  const sendWhatsapp = () => {
    const phone = customer.phone?.replace(/^0/, "20").replace(/\D/g,"");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(invoiceText())}`, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:500}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>🧾 فاتورة — {order.id_display||order.id?.slice(0,8)}</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:22,fontWeight:800,color:"var(--gold)"}}>A&M Store</div>
            <div style={{fontSize:11,color:"var(--text3)"}}>{order.id_display} — {order.date}</div>
          </div>
          <div style={{background:"var(--bg3)",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13}}>
            <div>العميل: <strong>{customer.name}</strong></div>
            {customer.phone&&<div>التليفون: {customer.phone}</div>}
            <div>القناة: {order.channel}</div>
          </div>
          <table style={{width:"100%",fontSize:12,marginBottom:12}}>
            <thead><tr style={{background:"var(--bg3)"}}>
              <th style={{padding:"6px 8px",textAlign:"right"}}>الصنف</th>
              <th style={{padding:"6px 8px"}}>الكمية</th>
              <th style={{padding:"6px 8px",textAlign:"left"}}>الإجمالى</th>
            </tr></thead>
            <tbody>
              {items.map((item,i)=>(
                <tr key={i}>
                  <td style={{padding:"5px 8px"}}>{item.name} — {item.color} {item.size}</td>
                  <td style={{padding:"5px 8px",textAlign:"center"}}>{item.qty}</td>
                  <td style={{padding:"5px 8px",textAlign:"left"}}>{fmt(item.price*item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divider"/>
          <div className="summary-row"><span>إجمالى الأصناف</span><span>{fmt(order.subtotal)}</span></div>
          {order.shipping>0&&<div className="summary-row"><span>الشحن</span><span>{fmt(order.shipping)}</span></div>}
          {order.discount>0&&<div className="summary-row"><span>الخصم</span><span className="text-red">- {fmt(order.discount)}</span></div>}
          <div className="summary-row total"><span>صافى الفاتورة</span><span>{fmt(order.net)}</span></div>
          <div className="summary-row"><span>المدفوع</span><span className="text-green">{fmt(order.paid)}</span></div>
          {order.remaining>0&&<div className="summary-row"><span>المتبقى</span><span className="text-red">{fmt(order.remaining)}</span></div>}
        </div>
        <div className="modal-footer">
          {customer.phone&&<button className="btn btn-whatsapp btn-sm" onClick={sendWhatsapp}>📱 واتساب</button>}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ orders, orderItems, expenses, products, safeLog }) {
  const totalSales   = orders.reduce((s,o)=>s+(o.net||0),0);
  const grossProfit  = orderItems.reduce((s,i)=>s+i.qty*((i.price||0)-(i.cost||0)),0);
  const totalExp     = expenses.reduce((s,e)=>s+(e.amount||0),0);
  const safeBalance  = safeLog.reduce((s,e)=>e.direction==="وارد"?s+(e.amount||0):s-(e.amount||0),0);
  const inventoryVal = products.reduce((s,p)=>s+(p.stock||0)*(p.cost||0),0);
  const lowStock     = products.filter(p=>p.stock<=p.reorder);

  const prodQty = {};
  orderItems.forEach(i=>{prodQty[i.product_id]=(prodQty[i.product_id]||0)+i.qty;});
  const top5products = Object.entries(prodQty).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,qty])=>{
    const p=products.find(x=>x.id===id);
    return {name:p?p.name:id,qty};
  });
  const maxPQ = top5products[0]?.qty||1;

  const custSales = {};
  orders.forEach(o=>{custSales[o.customer_name]=(custSales[o.customer_name]||0)+(o.net||0);});
  const top5cust = Object.entries(custSales).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCS = top5cust[0]?.[1]||1;

  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().slice(0,10);
    return {ds,total:orders.filter(o=>o.date===ds).reduce((s,o)=>s+(o.paid||0),0)};
  });
  const maxDay = Math.max(...days.map(d=>d.total),1);

  const statusCounts = {"مكتمل":0,"جزئى":0,"لم يدفع":0};
  orders.forEach(o=>{
    if(o.status?.includes("مكتمل")) statusCounts["مكتمل"]++;
    else if(o.status?.includes("جزئياً")) statusCounts["جزئى"]++;
    else statusCounts["لم يدفع"]++;
  });

  return (
    <div>
      {lowStock.length>0&&<div className="alert alert-warn">⚠️ تنبيه: {lowStock.length} منتج وصل للحد الأدنى — {lowStock.slice(0,3).map(p=>p.name).join("، ")}</div>}
      <div className="stat-grid">
        {[
          {icon:"🛒",label:"إجمالى المبيعات",value:fmtNum(totalSales),sub:`ج.م — ${orders.length} أوردر`,color:"var(--gold)",cls:"text-gold"},
          {icon:"💰",label:"إجمالى الأرباح",value:fmtNum(grossProfit),sub:`ج.م — هامش ${totalSales>0?((grossProfit/totalSales)*100).toFixed(1):0}%`,color:"var(--green)",cls:"text-green"},
          {icon:"💸",label:"إجمالى المصروفات",value:fmtNum(totalExp),sub:`ج.م — ${expenses.length} بند`,color:"var(--red)",cls:"text-red"},
          {icon:"🏦",label:"رصيد الخزنة",value:fmtNum(safeBalance),sub:"ج.م — كاش متاح",color:"var(--blue)"},
          {icon:"📦",label:"قيمة المخزون",value:fmtNum(inventoryVal),sub:`ج.م — ${products.length} صنف`,color:"var(--purple)"},
          {icon:"📊",label:"صافى الربح",value:fmtNum(grossProfit-totalExp),sub:"ج.م — بعد المصروفات",color:"var(--orange)"},
        ].map((c,i)=>(
          <div key={i} className="stat-card" style={{"--accent-color":c.color}}>
            <div className="icon">{c.icon}</div>
            <div className="label">{c.label}</div>
            <div className={`value ${c.cls||""}`} style={c.cls?{}:{color:c.color}}>{c.value}</div>
            <div className="sub">{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">📈 مبيعات آخر 7 أيام</div>
          <div className="dash-card-body">
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:8}}>
              {days.map((d,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:"100%",height:`${Math.max((d.total/maxDay)*70,2)}px`,background:"linear-gradient(to top,var(--gold3),var(--gold2))",borderRadius:"3px 3px 0 0",transition:"height .5s"}}/>
                  <span style={{fontSize:9,color:"var(--text3)"}}>{d.ds.slice(5)}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"var(--text2)",textAlign:"center"}}>إجمالى: {fmt(days.reduce((s,d)=>s+d.total,0))}</div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header">📦 حالات الأوردرات</div>
          <div className="dash-card-body">
            {[["مكتمل","var(--green)"],["جزئى","var(--orange)"],["لم يدفع","var(--red)"]].map(([k,c])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
                <div style={{flex:1,fontSize:13}}>{k}</div>
                <div style={{fontWeight:700,color:c,fontSize:15}}>{statusCounts[k]}</div>
                <div style={{width:80,background:"var(--bg3)",borderRadius:4,height:8}}>
                  <div style={{width:`${orders.length?(statusCounts[k]/orders.length*100):0}%`,height:"100%",background:c,borderRadius:4}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header">🏆 أفضل 5 منتجات</div>
          <div className="dash-card-body">
            <div className="chart-bar">
              {top5products.map((p,i)=>(
                <div key={i} className="chart-bar-item">
                  <div className="bar-label">{p.name.slice(0,16)}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${(p.qty/maxPQ)*100}%`}}/></div>
                  <div className="bar-val">{p.qty} قطعة</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header">👑 أفضل 5 عملاء</div>
          <div className="dash-card-body">
            <div className="chart-bar">
              {top5cust.map(([name,amt],i)=>(
                <div key={i} className="chart-bar-item">
                  <div className="bar-label">{name}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${(amt/maxCS)*100}%`,background:"linear-gradient(90deg,#5a3f9a,#9060e0)"}}/></div>
                  <div className="bar-val">{fmtNum(amt)} ج</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── POS ──────────────────────────────────────────────────────────────────────
function POS({ products, productsTbl, customers, ordersTbl, safeLogTbl }) {
  const [cart, setCart]               = useState([]);
  const [selCustomer, setSelCustomer] = useState(null);
  const [custSearch, setCustSearch]   = useState("");
  const [prodSearch, setProdSearch]   = useState("");
  const [channel, setChannel]         = useState("واتساب");
  const [shippingFee, setShippingFee] = useState(0);
  const [discountType, setDiscountType] = useState("none");
  const [discountVal, setDiscountVal] = useState(0);
  const [paidAmt, setPaidAmt]         = useState(0);
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState(null);
  const [showInvoice, setShowInvoice] = useState(null);

  const filteredProds = products.filter(p=>(p.name+p.color+p.size+p.id_display).includes(prodSearch));
  const filteredCust  = custSearch ? customers.filter(c=>(c.name+c.phone).includes(custSearch)) : [];

  const subtotal    = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const discountAmt = discountType==="percent" ? subtotal*discountVal/100 : discountType==="value" ? Number(discountVal) : 0;
  const net         = subtotal + Number(shippingFee) - discountAmt;
  const remaining   = net - Number(paidAmt);

  const addToCart = (p) => {
    if(p.stock<1) return;
    setCart(prev=>{
      const ex=prev.find(i=>i.id===p.id);
      if(ex){ if(ex.qty>=p.stock) return prev; return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i); }
      return [...prev,{...p,qty:1}];
    });
  };

  const submitOrder = async () => {
    if(!selCustomer||cart.length===0||saving) return;
    setSaving(true);
    const paid = Number(paidAmt);
    const rem  = net - paid;
    const orderId = uid();
    const orderSeq = "ORD-" + Date.now().toString().slice(-6);

    const order = {
      id: orderId,
      id_display: orderSeq,
      date: today(),
      customer_id: selCustomer.id,
      customer_name: selCustomer.name,
      channel,
      subtotal,
      shipping: Number(shippingFee),
      discount: discountAmt,
      net, paid, remaining: rem,
      status: calcStatus(paid, net),
    };

    const items = cart.map(item=>({
      id: uid(),
      order_id: orderId,
      product_id: item.id,
      name: item.name, color: item.color,
      size: item.size, qty: item.qty,
      price: item.price, cost: item.cost,
    }));

    // Insert order
    const ok1 = await ordersTbl.insert(order);
    if(!ok1){ setSaving(false); return; }

    // Insert items
    const { error: e2 } = await supabase.from("order_items").insert(items);
    if(e2){ setSaving(false); alert("خطأ في بنود الأوردر: " + e2.message); return; }

    // Update stock
    for(const item of cart){
      await supabase.from("products").update({stock: (products.find(p=>p.id===item.id)?.stock||0) - item.qty}).eq("id", item.id);
    }
    await productsTbl.refresh();

    // Safe entry if paid
    if(paid>0){
      await safeLogTbl.insert({id:uid(),date:today(),type:"إيداع",amount:paid,direction:"وارد",ref:orderSeq,officer:"POS"});
      // Payment record
      await supabase.from("payments").insert({id:uid(),order_id:orderId,amount:paid,date:today(),method:"كاش",note:"دفعة عند الأوردر"});
    }

    setShowInvoice({order:{...order,id_display:orderSeq}, items});
    setCart([]); setSelCustomer(null); setCustSearch(""); setProdSearch("");
    setShippingFee(0); setDiscountType("none"); setDiscountVal(0); setPaidAmt(0);
    setSuccess("تم إنشاء الأوردر بنجاح! ✅");
    setTimeout(()=>setSuccess(null),4000);
    setSaving(false);
  };

  const canSubmit = selCustomer && cart.length>0 && !saving;

  return (
    <div>
      {success&&<div className="alert alert-success">{success}</div>}
      {showInvoice&&<InvoiceModal data={showInvoice} onClose={()=>setShowInvoice(null)} customers={customers}/>}
      <div className="pos-layout">
        <div className="pos-left">
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="ابحث بالاسم، الكود، اللون..." value={prodSearch} onChange={e=>setProdSearch(e.target.value)}/>
          </div>
          <div className="pos-products table-wrap">
            {filteredProds.length===0
              ? <div style={{padding:30,textAlign:"center",color:"var(--text3)"}}>لا يوجد منتجات — أضف من المخزون أولاً</div>
              : <div className="product-grid">
                  {filteredProds.map(p=>(
                    <div key={p.id} className="product-card" onClick={()=>addToCart(p)} style={{opacity:p.stock<1?0.4:1}}>
                      <div className="pname">{p.name}</div>
                      <div className="pdetail">{p.color} — {p.size}</div>
                      <div className="pprice">{fmt(p.price)}</div>
                      <div className="pstock" style={{color:p.stock<=p.reorder?"var(--red)":"var(--text3)"}}>
                        {p.stock<=p.reorder?`⚠️ متبقى: ${p.stock}`:`📦 ${p.stock}`}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
        <div className="pos-right">
          <div className="table-wrap">
            <div className="table-header"><h3>👤 بيانات العميل</h3></div>
            <div style={{padding:12}}>
              <div className="search-bar" style={{marginBottom:6}}>
                <span>🔍</span>
                <input placeholder="ابحث باسم أو تليفون" value={custSearch} onChange={e=>{setCustSearch(e.target.value);setSelCustomer(null);}}/>
              </div>
              {custSearch&&filteredCust.length>0&&(
                <div style={{background:"var(--bg3)",borderRadius:6,border:"1px solid var(--border2)",overflow:"hidden",marginBottom:6}}>
                  {filteredCust.slice(0,5).map(c=>(
                    <div key={c.id} onClick={()=>{setSelCustomer(c);setCustSearch("");}} style={{padding:"8px 12px",cursor:"pointer",borderBottom:"1px solid var(--border)",fontSize:13}}>
                      {c.name} — {c.phone}
                    </div>
                  ))}
                </div>
              )}
              {!selCustomer&&<div style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"6px 0"}}>ابحث واختر عميل لإتمام البيع</div>}
              {selCustomer&&<div className="alert alert-success" style={{margin:0}}>✅ {selCustomer.name} — نقاط: {selCustomer.points}</div>}
            </div>
          </div>
          <div className="table-wrap" style={{flex:1}}>
            <div className="table-header"><h3>🛒 السلة ({cart.length})</h3></div>
            {cart.length===0
              ? <div style={{padding:20,textAlign:"center",color:"var(--text3)",fontSize:13}}>اضغط على منتج لإضافته</div>
              : cart.map(item=>(
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <div className="name">{item.name}</div>
                      <div className="detail">{item.color} {item.size} × {fmt(item.price)}</div>
                    </div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={()=>setCart(prev=>prev.map(i=>i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))}>−</button>
                      <span style={{fontSize:13,fontWeight:700,minWidth:22,textAlign:"center"}}>{item.qty}</span>
                      <button className="qty-btn" onClick={()=>setCart(prev=>prev.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i))}>+</button>
                    </div>
                    <div style={{fontWeight:700,fontSize:13,minWidth:70,textAlign:"left"}}>{fmt(item.price*item.qty)}</div>
                    <button className="btn btn-sm btn-danger" style={{padding:"3px 6px"}} onClick={()=>setCart(prev=>prev.filter(i=>i.id!==item.id))}>✕</button>
                  </div>
                ))
            }
          </div>
          <div className="table-wrap">
            <div style={{padding:14}}>
              <div className="form-grid form-grid-2" style={{gap:8,marginBottom:10}}>
                <div className="form-group">
                  <label>القناة</label>
                  <select value={channel} onChange={e=>setChannel(e.target.value)}>
                    {CHANNELS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>رسوم الشحن</label>
                  <input type="number" value={shippingFee} onChange={e=>setShippingFee(e.target.value)} min="0"/>
                </div>
                <div className="form-group">
                  <label>نوع الخصم</label>
                  <select value={discountType} onChange={e=>{setDiscountType(e.target.value);setDiscountVal(0);}}>
                    <option value="none">بدون خصم</option>
                    <option value="percent">نسبة %</option>
                    <option value="value">مبلغ ثابت</option>
                  </select>
                </div>
                {discountType!=="none"&&(
                  <div className="form-group">
                    <label>{discountType==="percent"?"نسبة %":"قيمة الخصم"}</label>
                    <input type="number" value={discountVal} onChange={e=>setDiscountVal(Number(e.target.value))} min="0"/>
                  </div>
                )}
              </div>
              <div className="divider"/>
              <div className="summary-row"><span>إجمالى الأصناف</span><span className="text-gold">{fmt(subtotal)}</span></div>
              <div className="summary-row"><span>رسوم الشحن</span><span>{fmt(Number(shippingFee))}</span></div>
              {discountAmt>0&&<div className="summary-row"><span>الخصم</span><span className="text-red">- {fmt(discountAmt)}</span></div>}
              <div className="summary-row total"><span>صافى الفاتورة</span><span>{fmt(net)}</span></div>
              <div className="form-group" style={{marginTop:10}}>
                <label>المبلغ المدفوع الآن</label>
                <input type="number" value={paidAmt} onChange={e=>setPaidAmt(e.target.value)} min="0"/>
              </div>
              {Number(paidAmt)>0&&(
                <div className="summary-row" style={{marginTop:6}}>
                  <span>المتبقى</span>
                  <span className={remaining<=0?"text-green":"text-red"}>{fmt(Math.max(remaining,0))}</span>
                </div>
              )}
              <button className="btn btn-primary" style={{width:"100%",marginTop:12,padding:"12px",fontSize:15,opacity:canSubmit?1:0.5}} onClick={submitOrder} disabled={!canSubmit}>
                {saving?"⏳ جارى الحفظ...":"✅ تأكيد الأوردر"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function Orders({ orders, ordersTbl, customers }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [selected, setSelected]       = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(null);
  const [payForm, setPayForm]         = useState({amount:0, date:today(), method:"كاش", note:""});
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [paymentsMap, setPaymentsMap] = useState({});

  const filtered = orders.filter(o=>{
    const ms = !search || (o.id_display+o.customer_name+o.channel).includes(search);
    const mst = !filterStatus || o.status?.includes(filterStatus);
    const mc  = !filterChannel || o.channel===filterChannel;
    return ms&&mst&&mc;
  });

  const loadOrderDetails = async (order) => {
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order.id);
    const { data: pays  } = await supabase.from("payments").select("*").eq("order_id", order.id);
    setOrderItemsMap(m=>({...m,[order.id]:items||[]}));
    setPaymentsMap(m=>({...m,[order.id]:pays||[]}));
    setSelected(order);
  };

  const submitPayment = async () => {
    if(!selected||!payForm.amount) return;
    const amt = Number(payForm.amount);
    const allPaid = (paymentsMap[selected.id]||[]).reduce((s,p)=>s+p.amount,0) + amt;
    const newRemaining = Math.max(selected.net - allPaid, 0);
    const newStatus = calcStatus(allPaid, selected.net);

    await supabase.from("payments").insert({id:uid(),order_id:selected.id,...payForm,amount:amt});
    await ordersTbl.update(selected.id, {paid:allPaid,remaining:newRemaining,status:newStatus});
    await supabase.from("safe_log").insert({id:uid(),date:payForm.date,type:"تحصيل",amount:amt,direction:"وارد",ref:selected.id_display,officer:"النظام"});

    const updOrder = {...selected,paid:allPaid,remaining:newRemaining,status:newStatus};
    setSelected(updOrder);
    setPaymentsMap(m=>({...m,[selected.id]:[...(m[selected.id]||[]),{...payForm,amount:amt,id:uid()}]}));
    setShowPayModal(false);
    setPayForm({amount:0,date:today(),method:"كاش",note:""});
  };

  return (
    <div>
      {showInvoice&&<InvoiceModal data={showInvoice} onClose={()=>setShowInvoice(null)} customers={customers}/>}
      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" style={{maxWidth:700}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 {selected.id_display}</h3>
              <button className="btn btn-secondary btn-sm" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid form-grid-2" style={{marginBottom:12}}>
                {[["العميل",selected.customer_name],["التاريخ",selected.date],["القناة",selected.channel],["صافى",fmt(selected.net)],["المدفوع",fmt(selected.paid)],["المتبقى",fmt(selected.remaining)]].map(([l,v])=>(
                  <div key={l}><span className="text-muted">{l}: </span><strong>{v}</strong></div>
                ))}
              </div>
              <div style={{marginBottom:8,display:"flex",gap:8,