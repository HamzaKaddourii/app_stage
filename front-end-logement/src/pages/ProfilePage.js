import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ProfilePage = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        password_confirmation: ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification de la correspondance des mots de passe
    if (formData.password && formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Ne pas envoyer le mot de passe s'il est vide
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }
      
      await updateUser(dataToSend);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la mise à jour du profil');
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="mb-4">Mon Profil</h1>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nouveau mot de passe (laisser vide pour ne pas changer)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password_confirmation">
              <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default ProfilePage;
