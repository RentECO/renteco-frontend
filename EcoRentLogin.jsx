import { useState, useEffect, useRef } from "react";

const ENDPOINTS = { login: "/api/login", register: "/api/register" };

function LeafAvatar({ size = 52 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "#e8f4ee", border: "0.5px solid #b8ddc8",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d7a50" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21c0 0 2-8 9-12 3.5-1.8 7-2 7-2s-.9 4.5-4.5 8S7 21 5 21z"/>
        <path d="M5 21c1.8-3.5 5-6 8-7.5"/>
      </svg>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, padding: "3px 10px", borderRadius: 20,
      background: "#e8f4ee", color: "#2d7a50",
      border: "0.5px solid #b8ddc8", marginBottom: 14,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12l-3.75 2.7 1.5-4.5L6 7.5h4.5z"/></svg>
      {children}
    </span>
  );
}

function StatusBanner({ message, type }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div style={{
      marginBottom: 16, padding: "10px 14px", borderRadius: 8,
      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      background: isError ? "#fff1f2" : "#f0fdf4",
      color: isError ? "#991b1b" : "#166534",
      border: `0.5px solid ${isError ? "#fca5a5" : "#86efac"}`,
      animation: "slideIn 0.2s ease",
    }}>
      {message}
    </div>
  );
}

function Field({ label, id, type = "text", placeholder, value, onChange, required, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{
        display: "block", fontSize: 11, fontWeight: 500,
        letterSpacing: "0.07em", textTransform: "uppercase",
        color: "#5a6e64", marginBottom: 6,
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</label>
      <input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        required={required} autoComplete={autoComplete}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 14px", boxSizing: "border-box",
          border: `0.5px solid ${focused ? "#2d7a50" : "#cdd4cf"}`,
          borderRadius: 8, fontSize: 14,
          background: focused ? "#fff" : "#f5f7f5",
          color: "#1a2e24", outline: "none",
          fontFamily: "'DM Sans', sans-serif",
          transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(45,122,80,0.1)" : "none",
        }}
      />
    </div>
  );
}

export default function EcoRentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(p => !p);
    setStatus({ message: "", type: "" });
    setName(""); setEmail(""); setPassword(""); setConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });
    if (!isLogin && password !== confirm) {
      setStatus({ message: "Passwords don't match — please try again.", type: "error" });
      return;
    }
    setLoading(true);
    const payload = { email: email.trim(), password };
    if (!isLogin) payload.name = name.trim();
    try {
      const res = await fetch(isLogin ? ENDPOINTS.login : ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ message: data?.message || "Something went wrong. Please try again.", type: "error" });
        return;
      }
      setStatus({
        message: data?.message || (isLogin ? "Signed in successfully." : "Account created! Redirecting…"),
        type: "success",
      });
      if (!isLogin) setTimeout(toggleMode, 1800);
      else { setEmail(""); setPassword(""); }
    } catch {
      setStatus({ message: "Unable to reach the server. Please check your connection.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .eco-nav-link { font-size: 13px; color: #5a6e64; text-decoration: none; font-family: 'DM Sans', sans-serif; transition: color 0.15s; }
        .eco-nav-link:hover { color: #143d2c; }
        .eco-footer-link { font-size: 12px; color: #8a9e94; text-decoration: none; }
        .eco-footer-link:hover { text-decoration: underline; }
        input::placeholder { color: #b0bdb8; }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(135deg, #f0f4f1 0%, #eef2ec 100%)",
      }}>
        {/* Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px", background: "rgba(255,255,255,0.95)",
          borderBottom: "0.5px solid rgba(20,61,44,0.08)",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: "#143d2c" }}>
            <LeafAvatar size={32} />
            EcoRent
          </div>
          <nav style={{ display: "flex", gap: 20 }}>
            {["Browse", "How it works", "About us", "Dashboard"].map(l => (
              <a key={l} href="#" className="eco-nav-link">{l}</a>
            ))}
          </nav>
          <div style={{ width: 90 }} />
        </header>

        {/* Main */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div style={{
            width: "100%", maxWidth: 420,
            background: "#fff",
            borderRadius: 20,
            border: "0.5px solid rgba(20,61,44,0.09)",
            boxShadow: "0 4px 24px rgba(20,61,44,0.08)",
            overflow: "hidden",
            animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both",
          }}>
            {/* Card top */}
            <div style={{ padding: "32px 32px 0" }}>
              <LeafAvatar size={52} />
              <div style={{ marginTop: 16 }}>
                <Tag>{isLogin ? "Welcome back" : "New here"}</Tag>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24, fontWeight: 500,
                color: "#143d2c", margin: "0 0 8px", lineHeight: 1.2,
              }}>
                {isLogin ? "Sign in to EcoRent" : "Join EcoRent"}
              </h1>
              <p style={{ fontSize: 13.5, color: "#5a6e64", margin: "0 0 24px", lineHeight: 1.6 }}>
                {isLogin
                  ? "Borrow things, swap stories, keep the planet a little lighter."
                  : "Create an account and start sharing with your neighbourhood."}
              </p>
              <div style={{ height: "0.5px", background: "rgba(20,61,44,0.08)", margin: "0 0 0" }} />
            </div>

            {/* Card body */}
            <div style={{ padding: "24px 32px 32px" }}>
              <StatusBanner message={status.message} type={status.type} />

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div style={{ animation: "slideIn 0.2s ease" }}>
                    <Field label="Full name" id="inp-name" placeholder="Alex Morgan" value={name} onChange={setName} required autoComplete="name" />
                  </div>
                )}
                <Field label="Email address" id="inp-email" type="email" placeholder="alex@example.com" value={email} onChange={setEmail} required autoComplete="email" />
                <Field label="Password" id="inp-pass" type="password" placeholder="Your password" value={password} onChange={setPassword} required autoComplete={isLogin ? "current-password" : "new-password"} />
                {!isLogin && (
                  <div style={{ animation: "slideIn 0.2s ease 0.05s both" }}>
                    <Field label="Confirm password" id="inp-confirm" type="password" placeholder="••••••••" value={confirm} onChange={setConfirm} required autoComplete="new-password" />
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  style={{
                    width: "100%", padding: "12px", marginTop: 4,
                    background: loading ? "#3d7a5c" : "#143d2c",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 14.5, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em",
                    transition: "background 0.15s, transform 0.1s",
                    transform: loading ? "scale(0.99)" : "scale(1)",
                  }}
                >
                  {loading ? "Connecting…" : isLogin ? "Sign in" : "Create account"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "0.5px solid rgba(20,61,44,0.08)" }}>
                <button
                  onClick={toggleMode}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13.5, fontWeight: 500, color: "#2d7a50",
                    fontFamily: "'DM Sans', sans-serif", padding: 0,
                  }}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px", background: "rgba(255,255,255,0.9)",
          borderTop: "0.5px solid rgba(20,61,44,0.08)", flexWrap: "wrap", gap: 8,
        }}>
          <p style={{ fontSize: 12, color: "#8a9e94", margin: 0 }}>© 2026 EcoRent — renting that feels like sharing.</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Rental terms", "Privacy", "FAQ"].map(l => (
              <a key={l} href="#" className="eco-footer-link">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
