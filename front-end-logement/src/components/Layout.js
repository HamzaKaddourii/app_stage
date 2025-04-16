import React from 'react';
import { Container } from 'react-bootstrap';
import AppNavbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        {children}
      </Container>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default Layout;
