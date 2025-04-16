import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const LogoComponent = () => (
    <div 
      style={{
        width: 40,
        height: 40,
        backgroundColor: '#1a4789', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span>EID</span>
      <div 
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          width: 20,
          height: 20,
          backgroundColor: '#ffcc00', 
          transform: 'rotate(45deg)'
        }}
      ></div>
      <div 
        style={{
          position: 'absolute',
          bottom: -5,
          left: -5,
          width: 20,
          height: 20,
          backgroundColor: '#d35f5f', 
          transform: 'rotate(45deg)'
        }}
      ></div>
    </div>
  );

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <LogoComponent />
          <span className="ms-2">Ecole InfoDesign Béjaia</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/salles">Salles</Nav.Link>
            
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/reservations">Mes Réservations</Nav.Link>
                <Nav.Link as={Link} to="/bons-achat">Mes Bons d'Achat</Nav.Link>
                <Nav.Link as={Link} to="/demandes">Mes Demandes Personnalisées</Nav.Link>
              </>
            )}
            
            {isAdmin() && (
              <NavDropdown title="Administration" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/admin/salles">Gestion des Salles</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/reservations">Gestion des Réservations</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/demandes">Demandes Personnalisées</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            {currentUser ? (
              <NavDropdown title={`Bonjour, ${currentUser.name}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Mon Profil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
