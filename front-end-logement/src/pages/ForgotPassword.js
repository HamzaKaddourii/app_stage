import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple de l'email
    if (!email || !email.includes('@')) {
      setError('Veuillez saisir une adresse email valide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      setResetLink('');
      
      const response = await authService.forgotPassword(email);
      
      if (response.status === 'email_error') {
        // Afficher le lien si l'email n'a pas pu être envoyé
        setResetLink(response.reset_link);
        setMessage(`${response.message}`);
        toast.warning('Problème d\'envoi d\'email, utilisez le lien ci-dessous');
      } else {
        // Email envoyé avec succès
        setMessage('Un email a été envoyé avec les instructions pour réinitialiser votre mot de passe.');
        toast.success('Email de réinitialisation envoyé');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      setError(error.message || 'Une erreur est survenue lors du traitement de votre demande');
      toast.error('Erreur lors de la demande de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink)
      .then(() => {
        toast.info('Lien copié dans le presse-papier');
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
        toast.error('Erreur lors de la copie du lien');
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="mb-3">Mot de passe oublié</h2>
                <p className="text-muted">
                  Entrez votre adresse email et nous vous fournirons un lien pour réinitialiser votre mot de passe
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-4">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Traitement en cours...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </div>

                {resetLink && (
                  <div className="mb-4 p-3 border rounded bg-light">
                    <p className="mb-2 fw-bold">Lien de réinitialisation :</p>
                    <div className="d-flex align-items-center">
                      <div className="text-truncate text-primary mb-2" style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                        <a href={resetLink} target="_blank" rel="noopener noreferrer">
                          {resetLink}
                        </a>
                      </div>
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={copyToClipboard}
                      className="mt-2"
                    >
                      Copier le lien
                    </Button>
                    <p className="mt-3 text-muted small">
                      <i className="bi bi-info-circle"></i> Note: En production, ce lien serait envoyé par email.
                    </p>
                  </div>
                )}

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

export default ForgotPassword;
