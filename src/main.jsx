import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Header from './Header.jsx'
import Login from './components/Login.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
     <BrowserRouter>
     <Header/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<App/>} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
   </AuthProvider>
  </StrictMode>,
)
