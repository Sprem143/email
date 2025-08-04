import { useEffect, useState } from 'react';
import SenderForm from './components/SenderForm';
import ReceiverForm from './components/ReceiverForm';
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function App() {

  const local = 'http://localhost:9000'
  const api = 'https://gmail-b.onrender.com'
  const [showform, setShowform] = useState(false)
    const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [senderEmail, setSenderEmail] = useState(''); // ✅ Moved to top

 

// ----------------sign up --------
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

   if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required.");
    }

    if (!validateEmail(form.email)) {
      return setError("Invalid email format.");
    }

    try {
      const res = await fetch(`${api}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }finally{
      setShowform(!showform)
    }

  };

  return (
    <div className='ps-4 pe-4'>
      {user && user.role == 'admin' &&
        <div>
          <button className='nobckgrnd' onClick={()=>setShowform(!showform)}>Add New User</button>
        </div>
      }
      {
        showform &&

        <div className='mb-4'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={form.name}
              className='me-2'
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
                            className='me-2'

              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
                            className='me-2'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Sign Up</button>
            
          </form>
          <button  onClick={()=>setShowform(!showform)} >Cancel</button>
        </div>
      }
      <SenderForm onSenderChange={setSenderEmail} />
      {senderEmail && <ReceiverForm senderEmail={senderEmail} />}
    </div>
  );
}

export default App;
