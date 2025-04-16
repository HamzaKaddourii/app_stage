import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import demandePersonnaliseeService from '../services/demandePersonnaliseeService';
import { useAuth } from '../context/AuthContext';

const DemandeForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    capacite_tables: '',
    capacite_chaises: '',
    equipement_pc: false,
    equipement_datashow: false,
    has_internet: false,
    date_souhaitee: '',
    duree_souhaitee: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await demandePersonnaliseeService.createDemande(formData);
      toast.success('Votre demande de salle personnalisée a été soumise avec succès !');
      navigate('/demandes');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la soumission de votre demande');
      toast.error('Erreur lors de la soumission de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="mb-4">Créer une Demande de Salle Personnalisée</h1>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <p className="lead">
            Décrivez votre salle de rêve avec toutes les caractéristiques spécifiques dont vous avez besoin.
            Notre équipe examinera votre demande et vous proposera une solution adaptée.
          </p>
        </Card.Body>
      </Card>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="titre">
              <Form.Label>Titre de votre demande *</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Ex: Salle pour séminaire 50 personnes"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description détaillée de vos besoins *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez en détail la salle dont vous avez besoin et son usage prévu"
                required
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="capacite_tables">
                  <Form.Label>Nombre de tables souhaité</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacite_tables"
                    value={formData.capacite_tables}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="capacite_chaises">
                  <Form.Label>Nombre de chaises souhaité</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacite_chaises"
                    value={formData.capacite_chaises}
                    onChange={handleChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Card className="mb-3">
              <Card.Header>Équipements souhaités</Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-4">
                  <Form.Check
                    type="checkbox"
                    id="equipement_pc"
                    name="equipement_pc"
                    label="Ordinateurs"
                    checked={formData.equipement_pc}
                    onChange={handleChange}
                  />
                  
                  <Form.Check
                    type="checkbox"
                    id="equipement_datashow"
                    name="equipement_datashow"
                    label="Projecteur / Datashow"
                    checked={formData.equipement_datashow}
                    onChange={handleChange}
                  />
                  
                  <Form.Check
                    type="checkbox"
                    id="has_internet"
                    name="has_internet"
                    label="Connexion Internet"
                    checked={formData.has_internet}
                    onChange={handleChange}
                  />
                </div>
              </Card.Body>
            </Card>
            
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="date_souhaitee">
                  <Form.Label>Date souhaitée</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_souhaitee"
                    value={formData.date_souhaitee}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="duree_souhaitee">
                  <Form.Label>Durée souhaitée</Form.Label>
                  <Form.Control
                    type="text"
                    name="duree_souhaitee"
                    value={formData.duree_souhaitee}
                    onChange={handleChange}
                    placeholder="Ex: 2 heures, Demi-journée, etc."
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Soumission en cours...' : 'Soumettre ma demande'}
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/demandes')}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default DemandeForm;
