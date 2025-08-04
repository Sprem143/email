import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null); // ✅ Fix 1

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const local = 'http://localhost:9000'
  const api = 'https://gmail-b.onrender.com'
  useEffect(() => {
    const token = localStorage.getItem("email_sender_token"); // ✅ Fix 2
    if (token) {
      fetch(`${api}/verify-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({})
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            console.log(data.user)
            setUser(data.user);
             setLoading(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("email_sender_token");
          setLoading(false);
        });
    }else{
       setLoading(false); 
    }
  }, []);

 const login = (user, token) => {
  localStorage.setItem("token", token);
  setUser(user); // ✅ this must include `name`
};

  const logout = () => {
    localStorage.removeItem("email_sender_token");
    setUser(null);
  };

  return (
<AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
