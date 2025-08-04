import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
export default function Login() {

    const local = 'http://localhost:9000'
    const api = 'https://gmail-b.onrender.com'
const { login } = useAuth()

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            return setError("Both fields are required.");
        }

        if (!validateEmail(form.email)) {
            return setError("Invalid email format.");
        }

        try {
            const res = await fetch(`${api}/api/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Login failed.");
            }
            localStorage.setItem("email_sender_token", data.token);
            if (data.token && data.user) {
      login(data.user, data.token); // ✅ correctly set user + token
      navigate('/dashboard');       // ✅ navigate after setting state
    }
           
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
