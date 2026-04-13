import { useState } from "react";
import "./index.css";

const generateDailyCode = (userId, date) => {
  const seed = `${userId}-${date}-AQUA2024`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash |= 0;
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$!";
  let code = "";
  let h = Math.abs(hash);
  for (let i = 0; i < 10; i++) {
    code += chars[h % chars.length];
    h = Math.floor(h / chars.length) + (h * 17 + i * 31);
    h = Math.abs(h);
  }
  return code;
};

const today = () => new Date().toISOString().split("T")[0];
const ADMIN_SECRET = "ADMIN-9X7K2";

const INITIAL_USERS = {
  "lina@mail.com": {
    id: "u001",
    name: "Ліна Коваль",
    email: "lina@mail.com",
    password: "lina123",
    subscription: {
      plan: "monthly",
      start: "2026-04-01",
      end: "2026-05-01",
      active: true,
    },
  },
  "ivan@mail.com": {
    id: "u002",
    name: "Іван Петренко",
    email: "ivan@mail.com",
    password: "ivan123",
    subscription: null,
  },
};

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [usedCodes, setUsedCodes] = useState({});

  const markCodeUsed = (userId) =>
    setUsedCodes((p) => ({ ...p, [`${userId}-${today()}`]: true }));

  const isCodeUsed = (userId) => !!usedCodes[`${userId}-${today()}`];

  const handleLogout = () => { setUser(null); setIsAdmin(false); setPage("home"); };

  const handleSubscribed = (plan) => {
    const end = new Date();
    if (plan === "monthly") end.setMonth(end.getMonth() + 1);
    else if (plan === "quarterly") end.setMonth(end.getMonth() + 3);
    else end.setFullYear(end.getFullYear() + 1);
    const updated = {
      ...users,
      [user.email]: {
        ...users[user.email],
        subscription: { plan, start: today(), end: end.toISOString().split("T")[0], active: true },
      },
    };
    setUsers(updated);
    setUser(updated[user.email]);
    setPage("dashboard");
  };

  return (
    <div className="app">
      <RainBg />
      <Nav user={user} isAdmin={isAdmin} onLogin={() => setPage("login")} onRegister={() => setPage("register")} onLogout={handleLogout} onDashboard={() => setPage("dashboard")} onAdmin={() => setPage("admin")} onHome={() => setPage("home")} />
      {page === "home" && <HomePage onGetStarted={() => setPage("register")} onPurchase={() => { if (!user) setPage("login"); else setPage("purchase"); }} onAdmin={() => setPage("admin-login")} />}
      {page === "login" && <LoginPage users={users} setUser={setUser} setIsAdmin={setIsAdmin} setPage={setPage} />}
      {page === "register" && <RegisterPage users={users} setUsers={setUsers} setUser={setUser} setPage={setPage} />}
      {page === "dashboard" && user && <DashboardPage user={user} isCodeUsed={isCodeUsed(user.id)} onBuy={() => setPage("purchase")} onPage={setPage} />}
      {page === "purchase" && user && <PurchasePage user={user} onSuccess={handleSubscribed} onBack={() => setPage("dashboard")} />}
      {page === "admin-login" && <AdminLoginPage setIsAdmin={setIsAdmin} setPage={setPage} />}
      {page === "admin" && isAdmin && <AdminPage users={users} usedCodes={usedCodes} markUsed={markCodeUsed} onBack={() => setPage("home")} />}
      <Footer />
    </div>
  );
}

function RainBg() {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    left: `${i * 3.33 + Math.random() * 3}%`,
    height: `${60 + Math.random() * 120}px`,
    animationDuration: `${1.5 + Math.random() * 3}s`,
    animationDelay: `${Math.random() * 4}s`,
    opacity: 0.04 + Math.random() * 0.08,
  }));
  return (
    <div className="bg-rain">
      {drops.map((d, i) => <div key={i} className="rain-drop" style={d} />)}
    </div>
  );
}

function Nav({ user, isAdmin, onLogin, onRegister, onLogout, onDashboard, onAdmin, onHome }) {
  return (
    <nav>
      <div className="nav-logo" onClick={onHome}>💧 <span>AQUA</span>WASH</div>
      <div className="nav-actions">
        {isAdmin && <button className="btn btn-ghost btn-sm" onClick={onAdmin}>🛡 Адмін</button>}
        {user ? (
          <>
            <button className="btn btn-ghost btn-sm" onClick={onDashboard}>Мій акаунт</button>
            <button className="btn btn-primary btn-sm" onClick={onLogout}>Вийти</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={onLogin}>Увійти</button>
            <button className="btn btn-primary btn-sm" onClick={onRegister}>Реєстрація</button>
          </>
        )}
      </div>
    </nav>
  );
}

function HomePage({ onGetStarted, onPurchase, onAdmin }) {
  const plans = [
    { id: "monthly", name: "Місячний", price: "299", period: "/ місяць", badge: "Популярний", featured: true, features: ["Необмежені мийки", "Денний код доступу", "1 використання / день", "Автооновлення коду"] },
    { id: "quarterly", name: "Квартальний", price: "749", period: "/ 3 місяці", badge: null, featured: false, features: ["Необмежені мийки", "Денний код доступу", "1 використання / день", "Економія 16%"] },
    { id: "yearly", name: "Річний", price: "2490", period: "/ рік", badge: "Вигідно", featured: false, features: ["Необмежені мийки", "Денний код доступу", "1 використання / день", "Економія 31%"] },
  ];
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">✦ Преміум автомийка ✦</div>
        <h1>AQUAWASH</h1>
        <p className="hero-sub">Підписка на мийку — просто, зручно, вигідно. Отримуй унікальний код щодня і мий авто без черг.</p>
        <div className="hero-btns">
          <button className="btn btn-gold" onClick={onGetStarted}>Отримати підписку →</button>
          <button className="btn btn-ghost" onClick={onAdmin}>🛡 Вхід адміністратора</button>
        </div>
        <div className="hero-stats">
          {[["2 400+", "Клієнтів"], ["15 000+", "Мийок на місяць"], ["4.9★", "Рейтинг"], ["24/7", "Режим роботи"]].map(([n, l]) => (
            <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">ЯК ЦЕ ПРАЦЮЄ</div>
        <div className="divider" />
        <div className="how-grid">
          {[["01","Реєстрація","Створи акаунт за 2 хвилини. Введи своє ім'я, email та пароль."],["02","Обери план","Вибери підходящу підписку: місячну, квартальну чи річну."],["03","Отримай код","Кожен день о 00:00 твій код оновлюється автоматично."],["04","Мий авто","Покажи код касиру — він перевірить та активує мийку."]].map(([n,t,d]) => (
            <div className="how-card" key={n}><div className="how-num">{n}</div><div className="how-title">{t}</div><div className="how-text">{d}</div></div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">ПЛАНИ ПІДПИСКИ</div>
        <div className="divider" />
        <div className="plans-grid">
          {plans.map((p) => (
            <div key={p.id} className={`plan-card${p.featured ? " featured" : ""}`}>
              {p.badge && <div className="plan-badge">{p.badge}</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">₴{p.price}</div>
              <div className="plan-period">{p.period}</div>
              <ul className="plan-features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <button className={`btn ${p.featured ? "btn-primary" : "btn-ghost"} w100`} onClick={onPurchase}>Обрати план</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ users, setUser, setIsAdmin, setPage }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    setErr("");
    if (secret === ADMIN_SECRET) { setIsAdmin(true); setPage("admin"); return; }
    const u = users[email.toLowerCase()];
    if (!u || u.password !== pass) { setErr("Невірний email або пароль"); return; }
    setUser(u); setPage("dashboard");
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">ВХІД</div>
        <div className="auth-sub">Введіть свої дані для входу в акаунт</div>
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
        <div className="field"><label>Пароль</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></div>
        <div className="field">
          <label>Секретний код (для персоналу)</label>
          <input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Лише для адміністраторів" />
          <div className="field-hint">Якщо ви касир або адміністратор — введіть секретний код</div>
        </div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-primary w100 mt-24" onClick={submit}>Увійти →</button>
        <div className="auth-switch">Немає акаунту? <span className="link" onClick={() => setPage("register")}>Зареєструватись</span></div>
        <div className="auth-switch mt-8"><span className="link" onClick={() => setPage("home")}>← На головну</span></div>
      </div>
    </div>
  );
}

function RegisterPage({ users, setUsers, setUser, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    setErr("");
    if (!name || !email || !pass) { setErr("Заповніть всі поля"); return; }
    if (pass.length < 6) { setErr("Пароль має бути не менше 6 символів"); return; }
    if (pass !== pass2) { setErr("Паролі не збігаються"); return; }
    if (users[email.toLowerCase()]) { setErr("Цей email вже зареєстровано"); return; }
    const newUser = { id: "u" + Date.now(), name, email: email.toLowerCase(), password: pass, subscription: null };
    const updated = { ...users, [newUser.email]: newUser };
    setUsers(updated); setUser(newUser); setPage("dashboard");
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">РЕЄСТРАЦІЯ</div>
        <div className="auth-sub">Створіть свій акаунт AquaWash</div>
        <div className="field"><label>Ім'я та прізвище</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ліна Коваль" /></div>
        <div className="field"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
        <div className="field"><label>Пароль</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Мінімум 6 символів" /></div>
        <div className="field"><label>Повторіть пароль</label><input type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="••••••••" /></div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-primary w100 mt-24" onClick={submit}>Зареєструватись →</button>
        <div className="auth-switch">Вже є акаунт? <span className="link" onClick={() => setPage("login")}>Увійти</span></div>
      </div>
    </div>
  );
}

function DashboardPage({ user, isCodeUsed, onBuy, onPage }) {
  const sub = user.subscription;
  const code = sub ? generateDailyCode(user.id, today()) : null;
  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.end) - new Date()) / 86400000)) : 0;
  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="dash-greeting-label">Ласкаво просимо,</div>
          <div className="dash-greeting">{user.name.toUpperCase()}</div>
        </div>
        {sub && <span className="tag tag-green">✓ Підписка активна</span>}
      </div>
      {sub ? (
        <>
          <div className="dash-grid">
            <div className="dash-card">
              <div className="dash-card-label">Тип підписки</div>
              <div className="dash-card-value">{sub.plan === "monthly" ? "Місячна" : sub.plan === "quarterly" ? "Квартальна" : "Річна"}</div>
              <div className="dash-card-sub">Діє до {sub.end}</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-label">Залишилось днів</div>
              <div className="dash-card-value">{daysLeft}</div>
              <div className="dash-card-sub">Активовано {sub.start}</div>
            </div>
          </div>
          <div className="code-wrap">
            <div className="code-label">⚡ Ваш код на сьогодні</div>
            <div className={`code-display${isCodeUsed ? " used" : ""}`}>{code}</div>
            <br />
            <span className={`code-status ${isCodeUsed ? "used" : "active"}`}>
              <span className={`code-dot ${isCodeUsed ? "used" : "active"}`} />
              {isCodeUsed ? "Використано сьогодні" : "Доступний для використання"}
            </span>
            <div className="code-date">📅 Оновиться: {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString("uk-UA")} о 00:00</div>
            <div className="code-date" style={{ marginTop: 8 }}>Покажіть цей код касиру на автомийці</div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => onPage("purchase")}>🔄 Продовжити підписку</button>
          </div>
        </>
      ) : (
        <div className="no-sub">
          <div className="no-sub-icon">🚗</div>
          <h3>У вас немає активної підписки</h3>
          <p>Придбайте підписку, щоб отримувати щоденні коди доступу до автомийки</p>
          <button className="btn btn-gold" onClick={onBuy}>Придбати підписку →</button>
        </div>
      )}
    </div>
  );
}

function PurchasePage({ user, onSuccess, onBack }) {
  const plans = [
    { id: "monthly", name: "Місячна підписка", price: 299, desc: "30 днів необмежених мийок" },
    { id: "quarterly", name: "Квартальна підписка", price: 749, desc: "90 днів • Економія 16%" },
    { id: "yearly", name: "Річна підписка", price: 2490, desc: "365 днів • Економія 31%" },
  ];
  const [selected, setSelected] = useState("monthly");
  const [step, setStep] = useState(1);
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState(user.name.toUpperCase());
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const plan = plans.find((p) => p.id === selected);
  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
  const pay = () => {
    setErr("");
    if (cardNum.replace(/\s/g, "").length < 16) { setErr("Введіть повний номер картки"); return; }
    if (expiry.length < 5) { setErr("Введіть термін дії картки"); return; }
    if (cvv.length < 3) { setErr("Введіть CVV код"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); onSuccess(selected); }, 2000);
  };
  if (done) return (
    <div className="purchase-wrap"><div className="success-wrap"><div className="success-icon">🎉</div><div className="success-title">ОПЛАТА УСПІШНА!</div><p style={{ color: "var(--muted)", marginBottom: 32 }}>Ваша підписка активована. Перевірте особистий кабінет для отримання коду.</p></div></div>
  );
  return (
    <div className="purchase-wrap">
      <div className="purchase-header">ОФОРМЛЕННЯ ПІДПИСКИ</div>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>Оберіть план та введіть дані для оплати</p>
      {step === 1 && (
        <>
          {plans.map((p) => (
            <div key={p.id} className={`plan-select-card${selected === p.id ? " selected" : ""}`} onClick={() => setSelected(p.id)}>
              <div><div className="plan-select-name">{p.name}</div><div style={{ color: "var(--muted)", fontSize: 13 }}>{p.desc}</div></div>
              <div className="plan-select-price">₴{p.price}</div>
            </div>
          ))}
          <button className="btn btn-primary w100 mt-24" onClick={() => setStep(2)}>Перейти до оплати →</button>
          <button className="btn btn-ghost w100 mt-8" onClick={onBack}>← Назад</button>
        </>
      )}
      {step === 2 && (
        <div className="payment-box">
          <div className="payment-title">💳 ДАНІ КАРТКИ</div>
          <div className="field"><label>Номер картки</label><input value={cardNum} onChange={(e) => setCardNum(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" /></div>
          <div className="field"><label>Ім'я на картці</label><input value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} placeholder="LINA KOVAL" /></div>
          <div className="card-row">
            <div className="field"><label>Термін дії</label><input value={expiry} onChange={(e) => setExpiry(formatExp(e.target.value))} placeholder="MM/YY" /></div>
            <div className="field"><label>CVV</label><input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" /></div>
          </div>
          {err && <div className="err">{err}</div>}
          <div className="total-row"><span className="total-label">До сплати:</span><span className="total-price">₴{plan.price}</span></div>
          <button className="btn btn-gold w100" onClick={pay} disabled={loading}>{loading ? "⏳ Обробляємо оплату..." : `Оплатити ₴${plan.price} →`}</button>
          <button className="btn btn-ghost w100 mt-8" onClick={() => setStep(1)}>← Змінити план</button>
          <p className="secure-note">🔒 Захищено SSL-шифруванням. Дані картки не зберігаються.</p>
        </div>
      )}
    </div>
  );
}

function AdminLoginPage({ setIsAdmin, setPage }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (code === ADMIN_SECRET) { setIsAdmin(true); setPage("admin"); }
    else setErr("Невірний секретний код");
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title" style={{ color: "var(--gold)" }}>🛡 АДМІН</div>
        <div className="auth-sub">Введіть секретний код для доступу до панелі перевірки</div>
        <div className="field">
          <label>Секретний код</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXXX-XXXXX" className="mono-input" onKeyDown={(e) => e.key === "Enter" && submit()} />
          <div className="field-hint">Демо-код: <strong style={{ color: "var(--accent)" }}>ADMIN-9X7K2</strong></div>
        </div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-gold w100 mt-16" onClick={submit}>Увійти →</button>
        <div className="auth-switch"><span className="link" onClick={() => setPage("home")}>← На головну</span></div>
      </div>
    </div>
  );
}

function AdminPage({ users, usedCodes, markUsed, onBack }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [localUsed, setLocalUsed] = useState({});
  const verify = () => {
    setResult(null);
    if (!input.trim()) return;
    const code = input.trim().toUpperCase();
    let found = null;
    Object.values(users).forEach((u) => {
      if (u.subscription?.active) {
        if (generateDailyCode(u.id, 
