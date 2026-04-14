import { useState, useEffect } from "react";

/* ============================================================
   AQUAWASH — Повна система підписок для автомийки
   Версія: 2.0 | Один файл | Без зовнішніх залежностей
   ============================================================ */

// ─── Глобальні стилі (вставляються в <head>) ──────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #060b14;
    --surf:    #0d1825;
    --card:    #111d2e;
    --brd:     #1e3250;
    --accent:  #00d4ff;
    --gold:    #f0c040;
    --green:   #00e5a0;
    --red:     #ff4060;
    --text:    #e8f4ff;
    --muted:   #5a7a9a;
    --dsp:     'Bebas Neue', sans-serif;
    --body:    'DM Sans', sans-serif;
    --mono:    'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--body); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  /* Rain */
  .aw-rain { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
  .aw-drop { position:absolute; width:1px; background:linear-gradient(transparent, var(--accent)); animation:aw-fall linear infinite; }
  @keyframes aw-fall { from{transform:translateY(-120px)} to{transform:translateY(110vh)} }

  /* Nav */
  .aw-nav {
    position:sticky; top:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 40px;
    background:rgba(6,11,20,.93); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--brd);
  }
  .aw-logo { display:flex; align-items:center; gap:8px; cursor:pointer; user-select:none; }
  .aw-logo-icon { font-size:22px; }
  .aw-logo-text { font-family:var(--dsp); font-size:28px; letter-spacing:3px; }
  .aw-logo-aqua { color:var(--accent); text-shadow:0 0 20px rgba(0,212,255,.6); }
  .aw-logo-wash { color:var(--text); }
  .aw-nav-btns { display:flex; gap:10px; align-items:center; }

  /* Buttons */
  .aw-btn {
    font-family:var(--body); font-weight:600; border:none; cursor:pointer;
    border-radius:9px; transition:all .2s; display:inline-flex; align-items:center;
    gap:7px; font-size:15px; padding:10px 22px; white-space:nowrap;
  }
  .aw-btn:disabled { opacity:.55; cursor:not-allowed; }
  .aw-btn-sm { padding:7px 15px; font-size:13px; }
  .aw-btn-lg { padding:14px 34px; font-size:17px; }
  .aw-btn-xl { padding:16px 40px; font-size:18px; }

  .aw-btn-primary { background:var(--accent); color:#060b14; box-shadow:0 0 20px rgba(0,212,255,.3); }
  .aw-btn-primary:hover:not(:disabled) { background:#33ddff; box-shadow:0 0 32px rgba(0,212,255,.55); transform:translateY(-2px); }

  .aw-btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--brd); }
  .aw-btn-ghost:hover { border-color:var(--accent); color:var(--accent); }

  .aw-btn-gold { background:var(--gold); color:#060b14; font-weight:700; }
  .aw-btn-gold:hover:not(:disabled) { background:#f5d060; transform:translateY(-2px); box-shadow:0 10px 28px rgba(240,192,64,.35); }

  .aw-btn-danger { background:var(--red); color:#fff; }
  .aw-btn-danger:hover { opacity:.85; }

  .aw-w100 { width:100%; justify-content:center; }
  .aw-mt8  { margin-top:8px; }
  .aw-mt16 { margin-top:16px; }
  .aw-mt24 { margin-top:24px; }
  .aw-mt32 { margin-top:32px; }

  /* Hero */
  .aw-hero {
    min-height:92vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center;
    padding:60px 24px; position:relative; z-index:1;
  }
  .aw-hero-pill {
    display:inline-block; padding:7px 20px; border-radius:999px;
    border:1px solid var(--accent); color:var(--accent);
    font-family:var(--mono); font-size:11px; letter-spacing:3px;
    text-transform:uppercase; margin-bottom:28px;
    animation:aw-fade-in .8s ease both;
  }
  .aw-hero-h1 {
    font-family:var(--dsp); font-size:clamp(64px,13vw,140px);
    line-height:.88; letter-spacing:5px; margin-bottom:16px;
    background:linear-gradient(135deg,#fff 0%,var(--accent) 50%,var(--gold) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:aw-fade-up .9s ease .1s both;
  }
  .aw-hero-sub {
    font-size:clamp(16px,2.2vw,20px); color:var(--muted);
    max-width:530px; line-height:1.65; margin-bottom:42px;
    animation:aw-fade-up .9s ease .2s both;
  }
  .aw-hero-btns { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; animation:aw-fade-up .9s ease .3s both; }
  .aw-hero-stats { display:flex; gap:56px; margin-top:70px; flex-wrap:wrap; justify-content:center; animation:aw-fade-up .9s ease .4s both; }
  .aw-stat { text-align:center; }
  .aw-stat-n { font-family:var(--dsp); font-size:52px; color:var(--accent); line-height:1; }
  .aw-stat-l { font-size:11px; color:var(--muted); letter-spacing:2.5px; text-transform:uppercase; margin-top:4px; }

  @keyframes aw-fade-in { from{opacity:0} to{opacity:1} }
  @keyframes aw-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* Sections */
  .aw-section { padding:80px 24px; max-width:1100px; margin:0 auto; position:relative; z-index:1; }
  .aw-sec-head { margin-bottom:48px; }
  .aw-sec-title { font-family:var(--dsp); font-size:clamp(38px,6vw,68px); letter-spacing:2px; margin-bottom:6px; }
  .aw-sec-line  { width:60px; height:3px; background:var(--accent); border-radius:2px; margin-top:14px; }

  /* How it works */
  .aw-how-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:22px; }
  .aw-how-card {
    background:var(--card); border:1px solid var(--brd); border-radius:20px;
    padding:32px 26px; transition:transform .25s;
  }
  .aw-how-card:hover { transform:translateY(-4px); }
  .aw-how-n { font-family:var(--dsp); font-size:68px; color:var(--brd); line-height:1; margin-bottom:12px; }
  .aw-how-t { font-family:var(--dsp); font-size:24px; margin-bottom:8px; }
  .aw-how-d { color:var(--muted); font-size:14px; line-height:1.75; }

  /* Plans */
  .aw-plans-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; }
  .aw-plan-card {
    background:var(--card); border:1px solid var(--brd); border-radius:22px;
    padding:38px 30px; position:relative; overflow:hidden;
    transition:transform .3s, box-shadow .3s;
  }
  .aw-plan-card::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(0,212,255,.04),transparent);
    pointer-events:none;
  }
  .aw-plan-card:hover { transform:translateY(-7px); box-shadow:0 24px 64px rgba(0,0,0,.45); }
  .aw-plan-card.best { border-color:var(--accent); box-shadow:0 0 44px rgba(0,212,255,.18); }
  .aw-plan-badge {
    position:absolute; top:22px; right:22px;
    background:var(--accent); color:#060b14; font-size:11px;
    padding:4px 12px; border-radius:999px; font-weight:700; letter-spacing:1px;
  }
  .aw-plan-name  { font-family:var(--dsp); font-size:30px; letter-spacing:1px; margin-bottom:6px; }
  .aw-plan-price { font-family:var(--dsp); font-size:60px; color:var(--accent); line-height:1; margin:18px 0 4px; }
  .aw-plan-per   { color:var(--muted); font-size:14px; margin-bottom:26px; }
  .aw-plan-list  { list-style:none; margin-bottom:34px; }
  .aw-plan-list li {
    padding:9px 0; border-bottom:1px solid var(--brd);
    font-size:14px; color:var(--muted);
    display:flex; gap:10px; align-items:center;
  }
  .aw-plan-list li::before { content:'✓'; color:var(--green); font-weight:700; flex-shrink:0; }

  /* Auth */
  .aw-auth-wrap {
    min-height:100vh; display:flex; align-items:center;
    justify-content:center; padding:24px; position:relative; z-index:1;
  }
  .aw-auth-card {
    background:var(--card); border:1px solid var(--brd); border-radius:24px;
    padding:50px 44px; width:100%; max-width:450px;
    box-shadow:0 40px 80px rgba(0,0,0,.55);
  }
  .aw-auth-title { font-family:var(--dsp); font-size:44px; letter-spacing:2px; margin-bottom:6px; }
  .aw-auth-sub   { color:var(--muted); font-size:14px; margin-bottom:36px; }
  .aw-auth-switch { text-align:center; margin-top:22px; font-size:14px; color:var(--muted); }
  .aw-link { color:var(--accent); cursor:pointer; text-decoration:underline; }

  /* Fields */
  .aw-field { margin-bottom:20px; }
  .aw-label {
    display:block; font-family:var(--mono); font-size:11px; color:var(--muted);
    letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;
  }
  .aw-input {
    width:100%; padding:13px 16px; background:var(--surf); border:1px solid var(--brd);
    border-radius:10px; color:var(--text); font-size:15px; font-family:var(--body);
    outline:none; transition:border-color .18s;
  }
  .aw-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(0,212,255,.12); }
  .aw-input-mono  { font-family:var(--mono) !important; letter-spacing:3px; }
  .aw-input-big   { font-size:24px !important; text-align:center; letter-spacing:5px !important; }
  .aw-hint { font-size:12px; color:var(--muted); margin-top:6px; }
  .aw-err  {
    color:var(--red); font-size:13px; padding:11px 15px;
    background:rgba(255,64,96,.1); border:1px solid rgba(255,64,96,.25);
    border-radius:9px; margin-top:8px;
  }

  /* Dashboard */
  .aw-dash { max-width:960px; margin:0 auto; padding:44px 24px; position:relative; z-index:1; }
  .aw-dash-top {
    display:flex; justify-content:space-between; align-items:flex-start;
    flex-wrap:wrap; gap:16px; margin-bottom:40px;
  }
  .aw-dash-hello { font-family:var(--mono); font-size:12px; color:var(--muted); margin-bottom:5px; }
  .aw-dash-name  { font-family:var(--dsp); font-size:44px; letter-spacing:1px; }
  .aw-cards2 { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-bottom:28px; }
  .aw-info-card { background:var(--card); border:1px solid var(--brd); border-radius:20px; padding:28px; }
  .aw-info-lbl { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; margin-bottom:12px; }
  .aw-info-val { font-family:var(--dsp); font-size:38px; letter-spacing:1px; }
  .aw-info-sub { font-size:13px; color:var(--muted); margin-top:6px; }

  /* Code box */
  .aw-code-box {
    background:var(--card); border:1px solid var(--brd); border-radius:24px;
    padding:44px; text-align:center; position:relative; overflow:hidden;
  }
  .aw-code-box::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse at 50% 0%,rgba(0,212,255,.09),transparent 68%);
  }
  .aw-code-lbl { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:3px; text-transform:uppercase; margin-bottom:22px; }
  .aw-code-val {
    font-family:var(--mono); font-size:clamp(26px,5.5vw,50px); font-weight:700;
    letter-spacing:6px; color:var(--accent); text-shadow:0 0 32px rgba(0,212,255,.55);
    background:var(--surf); border:1px solid var(--brd); border-radius:16px;
    padding:22px 34px; display:inline-block; margin-bottom:20px;
    word-break:break-all; transition:all .3s;
  }
  .aw-code-val.used { color:var(--muted); text-shadow:none; opacity:.42; text-decoration:line-through; }
  .aw-code-status {
    display:inline-flex; align-items:center; gap:9px; padding:9px 22px;
    border-radius:999px; font-family:var(--mono); font-size:12px; font-weight:700; letter-spacing:1px;
  }
  .aw-cs-ok   { background:rgba(0,229,160,.1); color:var(--green); border:1px solid rgba(0,229,160,.22); }
  .aw-cs-used { background:rgba(90,122,154,.1); color:var(--muted); border:1px solid var(--brd); }
  .aw-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
  .aw-dot-ok   { background:var(--green); box-shadow:0 0 8px var(--green); animation:aw-pulse 2s infinite; }
  .aw-dot-used { background:var(--muted); }
  @keyframes aw-pulse { 0%,100%{opacity:1} 50%{opacity:.25} }
  .aw-code-note { font-family:var(--mono); font-size:11px; color:var(--muted); margin-top:12px; }

  /* No sub */
  .aw-nosub { text-align:center; padding:64px 24px; }
  .aw-nosub-icon  { font-size:68px; margin-bottom:20px; }
  .aw-nosub-title { font-family:var(--dsp); font-size:40px; margin-bottom:12px; }
  .aw-nosub-desc  { color:var(--muted); font-size:16px; margin-bottom:34px; }

  /* Purchase */
  .aw-pur { max-width:680px; margin:0 auto; padding:44px 24px; position:relative; z-index:1; }
  .aw-pur-title { font-family:var(--dsp); font-size:44px; margin-bottom:6px; }
  .aw-pur-sub   { color:var(--muted); font-size:14px; margin-bottom:32px; }
  .aw-prow {
    background:var(--card); border:2px solid var(--brd); border-radius:16px;
    padding:22px 24px; cursor:pointer; display:flex;
    justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:12px; margin-bottom:12px;
    transition:border-color .18s, background .18s;
  }
  .aw-prow:hover { border-color:#0099cc; }
  .aw-prow.sel   { border-color:var(--accent); background:rgba(0,212,255,.05); }
  .aw-prow-name  { font-family:var(--dsp); font-size:24px; }
  .aw-prow-desc  { color:var(--muted); font-size:13px; margin-top:3px; }
  .aw-prow-price { font-family:var(--mono); font-size:20px; color:var(--accent); }
  .aw-pay-box { background:var(--card); border:1px solid var(--brd); border-radius:20px; padding:34px; margin-top:22px; }
  .aw-pay-title { font-family:var(--dsp); font-size:30px; margin-bottom:24px; }
  .aw-row2  { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .aw-total { display:flex; justify-content:space-between; align-items:center; padding:20px 0; border-top:1px solid var(--brd); margin-top:22px; margin-bottom:18px; }
  .aw-total-lbl { color:var(--muted); font-size:15px; }
  .aw-total-amt { font-family:var(--dsp); font-size:34px; color:var(--accent); }
  .aw-secure { text-align:center; color:var(--muted); font-size:12px; margin-top:14px; }
  .aw-success { text-align:center; padding:56px 24px; }
  .aw-success-icon  { font-size:76px; margin-bottom:20px; }
  .aw-success-title { font-family:var(--dsp); font-size:54px; color:var(--green); margin-bottom:12px; }
  .aw-success-sub   { color:var(--muted); font-size:16px; }

  /* Admin */
  .aw-adm { max-width:700px; margin:0 auto; padding:44px 24px; position:relative; z-index:1; }
  .aw-adm-title { font-family:var(--dsp); font-size:44px; color:var(--gold); margin-bottom:6px; }
  .aw-adm-sub   { font-family:var(--mono); font-size:12px; color:var(--muted); margin-bottom:38px; }
  .aw-vbox { background:var(--card); border:1px solid var(--brd); border-radius:20px; padding:36px; margin-bottom:22px; }
  .aw-vbox-title { font-family:var(--dsp); font-size:22px; color:var(--gold); margin-bottom:20px; }
  .aw-vres { margin-top:24px; padding:24px; border-radius:16px; text-align:center; }
  .aw-vres-ok  { background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.2); }
  .aw-vres-use { background:rgba(90,122,154,.08); border:1px solid var(--brd); }
  .aw-vres-bad { background:rgba(255,64,96,.08); border:1px solid rgba(255,64,96,.2); }
  .aw-vres-icon { font-size:50px; margin-bottom:12px; }
  .aw-vres-name { font-family:var(--dsp); font-size:30px; margin-bottom:6px; }
  .aw-vres-det  { font-family:var(--mono); font-size:12px; color:var(--muted); margin-top:4px; }
  .aw-ulist { background:var(--card); border:1px solid var(--brd); border-radius:20px; padding:30px; }
  .aw-urow {
    padding:16px 0; border-bottom:1px solid var(--brd);
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:12px;
  }
  .aw-urow:last-child { border-bottom:none; }
  .aw-uname { font-weight:600; font-size:15px; }
  .aw-uemail { font-family:var(--mono); font-size:11px; color:var(--muted); margin-top:2px; }
  .aw-ucode { font-family:var(--mono); font-size:13px; color:var(--accent); margin-top:4px; }
  .aw-ucode.used { color:var(--muted); text-decoration:line-through; }

  /* Badges */
  .aw-badge {
    display:inline-flex; align-items:center; gap:6px; padding:5px 14px;
    border-radius:999px; font-family:var(--mono); font-size:11px; white-space:nowrap;
  }
  .aw-badge-green { background:rgba(0,229,160,.1); color:var(--green); border:1px solid rgba(0,229,160,.22); }
  .aw-badge-red   { background:rgba(255,64,96,.1); color:var(--red); border:1px solid rgba(255,64,96,.22); }
  .aw-badge-gray  { background:rgba(90,122,154,.1); color:var(--muted); border:1px solid var(--brd); }
  .aw-badge-gold  { background:rgba(240,192,64,.1); color:var(--gold); border:1px solid rgba(240,192,64,.22); }

  /* Footer */
  .aw-footer {
    border-top:1px solid var(--brd); padding:40px 40px;
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:14px; color:var(--muted); font-size:13px;
    position:relative; z-index:1;
  }
  .aw-footer-logo { font-family:var(--dsp); font-size:24px; color:var(--accent); }
  .aw-footer-ver  { font-family:var(--mono); font-size:11px; color:var(--brd); }

  /* Responsive */
  @media (max-width:640px) {
    .aw-nav  { padding:12px 18px; }
    .aw-cards2 { grid-template-columns:1fr; }
    .aw-auth-card { padding:34px 24px; }
    .aw-row2 { grid-template-columns:1fr; }
    .aw-hero-stats { gap:30px; }
    .aw-stat-n { font-size:38px; }
  }
`;

// ─── Утиліти ──────────────────────────────────────────────────
function genCode(userId, date) {
  const seed = `${userId}::${date}::AW2026`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "", n = Math.abs(h);
  for (let i = 0; i < 10; i++) {
    code += alpha[n % alpha.length];
    n = Math.abs(Math.imul(n, 1664525) + 1013904223 | 0) + i * 997;
  }
  return code;
}

const todayStr  = () => new Date().toISOString().split("T")[0];
const tomorrowStr = () => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("uk-UA");
};
const daysLeft = (end) => Math.max(0, Math.ceil((new Date(end) - new Date()) / 86400000));

const ADMIN_KEY = "ADMIN-9X7K2";

const INITIAL_DB = {
  "lina@mail.com": {
    id: "u001", name: "Ліна Коваль",
    email: "lina@mail.com", password: "lina123",
    sub: { plan: "monthly", start: "2026-04-01", end: "2026-05-01" },
  },
  "ivan@mail.com": {
    id: "u002", name: "Іван Петренко",
    email: "ivan@mail.com", password: "ivan123",
    sub: null,
  },
};

// ─── Inject CSS once ──────────────────────────────────────────
function useGlobalCSS() {
  useEffect(() => {
    const id = "aquawash-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);
}

// ─── Rain ─────────────────────────────────────────────────────
function Rain() {
  const drops = Array.from({ length: 28 }, (_, i) => ({
    left: `${i * 3.6 + 0.5}%`,
    height: `${55 + (i * 17 % 90)}px`,
    animationDuration: `${1.4 + (i % 6) * 0.45}s`,
    animationDelay: `${(i % 8) * 0.35}s`,
    opacity: 0.05 + (i % 5) * 0.018,
  }));
  return (
    <div className="aw-rain">
      {drops.map((s, i) => <div key={i} className="aw-drop" style={s} />)}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────
function Nav({ user, isAdmin, go }) {
  return (
    <nav className="aw-nav">
      <div className="aw-logo" onClick={() => go("home")}>
        <span className="aw-logo-icon">💧</span>
        <span className="aw-logo-text">
          <span className="aw-logo-aqua">AQUA</span>
          <span className="aw-logo-wash">WASH</span>
        </span>
      </div>
      <div className="aw-nav-btns">
        {isAdmin && (
          <button className="aw-btn aw-btn-ghost aw-btn-sm" onClick={() => go("admin")}>
            🛡 Адмін
          </button>
        )}
        {user ? (
          <>
            <button className="aw-btn aw-btn-ghost aw-btn-sm" onClick=
