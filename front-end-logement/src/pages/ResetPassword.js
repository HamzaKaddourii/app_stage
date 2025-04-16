import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [passwords, setPasswords] = useState({
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Vérifier si le token et l'email sont présents
    if (!token || !email) {
      setTokenValid(false);
      setError('Lien de réinitialisation invalide ou expiré.');
    } else {
      // Vérifier si le token est valide
      checkToken();
    }
  }, [token, email]);

  const checkToken = async () => {
    try {
      setLoading(true);
      await authService.checkResetToken(token, email);
      setTokenValid(true);
    } catch (error) {
      console.error('Token invalide:', error);
      setTokenValid(false);
      setError('Lien de réinitialisation invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (passwords.password !== passwords.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (passwords.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await authService.resetPassword(token, email, passwords.password, passwords.password_confirmation);
      
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/login', { state: { message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.' } });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setError(error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
      toast.error('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="mb-3">Lien invalide</h2>
                  <Alert variant="danger">
                    {error || 'Lien de réinitialisation invalide ou expiré.'}
                  </Alert>
                  <p>
                    <Link to="/forgot-password" className="btn btn-primary">
                      Demander un nouveau lien
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="mb-3">Réinitialisation du mot de passe</h2>
                <p className="text-muted">
                  Créez un nouveau mot de passe pour votre compte
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={passwords.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password_confirmation">
                  <Form.Label>Confirmer le mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={passwords.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    Retour à la page de connexion
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
