import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "../utils/api.js";
import { useAuth } from "../utils/AuthContext.jsx";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]         = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error("All fields are required."); return; }
    if (form.password !== form.confirm) { toast.error("Passwords do not match."); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { data } = await registerUser({ username: form.username, email: form.email, password: form.password });
      login(data.user, data.token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>Shop<span style={{ color: "#f97316" }}>EZ</span></h1>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.sub}>Join thousands of happy shoppers</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={styles.inputWrap}>
              <FiUser style={styles.inputIcon} />
              <input name="username" placeholder="johndoe" value={form.username} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={styles.inputWrap}>
              <FiMail style={styles.inputIcon} />
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.inputIcon} />
              <input name="password" type={showPass ? "text" : "password"} placeholder="Min 6 characters" value={form.password} onChange={handleChange} style={{ ...styles.input, paddingRight: 40 }} required />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass((p) => !p)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div style={styles.inputWrap}>
              <FiLock style={styles.inputIcon} />
              <input name="confirm" type="password" placeholder="Repeat password" value={form.confirm} onChange={handleChange} style={styles.input} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8, padding: "13px" }} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap:      { minHeight: "calc(100vh - 130px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)" },
  card:      { background: "#fff", borderRadius: 16, padding: "36px 32px", boxShadow: "0 8px 30px rgba(0,0,0,.1)", width: "100%", maxWidth: 420 },
  header:    { textAlign: "center", marginBottom: 28 },
  logo:      { fontSize: 28, fontWeight: 900, marginBottom: 8 },
  title:     { fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 4 },
  sub:       { fontSize: 14, color: "#6b7280" },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 12, color: "#9ca3af", fontSize: 16 },
  input:     { width: "100%", padding: "11px 14px 11px 38px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafafa" },
  eyeBtn:    { position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: "#9ca3af" },
  footer:    { textAlign: "center", marginTop: 20, fontSize: 14, color: "#6b7280" },
};