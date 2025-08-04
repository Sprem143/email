import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
 const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>

      <Navbar key="lg" expand="lg" style={{ background: 'black', color: 'white' }} className="border text-white border-secondary border-start-0 border-end-0 ps-4" >
        <Container fluid className='p-0'>
          <Navbar.Brand href="/" className='fs-3'><img src="/static/logo.png" height={60} alt="logo" className='me-4' style={{ borderRadius: '0%' }} /><span className="text-white">Gstar Tool</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`} className='text-white'>
                Gstar   </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 align-items-center" style={{ paddingRight: '2vw' }}>


                {user ? (
        <div className='text-white'>
          <span className='me-4'>Hello, {user.name}</span>
          <button onClick={handleLogout}  style={{background:'transparent', color:'white'}}>Logout</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
              </Nav>

            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

    </>
  );
}

export default Header;
