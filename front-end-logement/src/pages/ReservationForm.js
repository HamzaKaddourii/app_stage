import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/AuthContext';
import reservationService from '../services/reservationService';
import salleService from '../services/salleService';

const ReservationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const salleId = queryParams.get('salle');

  const [loading, setLoading] = useState(false);
  const [loadingSalle, setLoadingSalle] = useState(true);
  const [error, setError] = useState('');
  const [salle, setSalle] = useState(null);
  
  const [formData, setFormData] = useState({
    date_debut: new Date(),
    date_fin: new Date(new Date().setHours(new Date().getHours() + 1)),
    motif: '',
    nombre_participants: 1,
    salle_id: salleId || '',
    user_id: currentUser?.id || ''
  });

  useEffect(() => {
    // Si l'ID de salle est fourni, charger les détails de la salle
    if (salleId) {
      fetchSalleDetails(salleId);
    } else {
      setLoadingSalle(false);
    }
  }, [salleId]);

  const fetchSalleDetails = async (id) => {
    try {
      setLoadingSalle(true);
      const data = await salleService.getSalle(id);
      setSalle(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails de la salle');
      console.error(error);
    } finally {
      setLoadingSalle(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      if (!formData.salle_id) {
        setError('Veuillez sélectionner une salle');
        return;
      }
      
      if (formData.date_fin <= formData.date_debut) {
        setError('La date de fin doit être postérieure à la date de début');
        return;
      }

      // Formatage des dates pour l'API
      const dataToSend = {
        ...formData,
        date_debut: formData.date_debut.toISOString(),
        date_fin: formData.date_fin.toISOString(),
        user_id: currentUser.id
      };
      
      const response = await reservationService.createReservation(dataToSend);
      toast.success('Réservation créée avec succès');
      
      // Rediriger vers la liste des réservations de l'utilisateur
      navigate('/reservations');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la création de la réservation');
      toast.error('Erreur lors de la création de la réservation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Si on attend le chargement des détails de la salle
  if (loadingSalle && salleId) {
    return (
      <Layout>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des détails de la salle...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4">Nouvelle réservation</h1>
      
      {salle && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{salle.nom}</Card.Title>
            <Row>
              <Col md={8}>
                <p>{salle.description}</p>
                <div className="d-flex flex-wrap mb-3">
                  <div className="me-4">
                    <strong>Capacité tables:</strong> {salle.capacite_tables}
                  </div>
                  <div className="me-4">
                    <strong>Capacité chaises:</strong> {salle.capacite_chaises}
                  </div>
                  <div>
                    <strong>Prix horaire:</strong> {salle.prix_horaire} DH/h
                  </div>
                </div>
                <div>
                  <strong>Équipements:</strong>
                  <ul className="list-inline">
                    {salle.equipement_pc && <li className="list-inline-item">PC</li>}
                    {salle.equipement_datashow && <li className="list-inline-item">Datashow</li>}
                    {salle.has_internet && <li className="list-inline-item">Internet</li>}
                  </ul>
                </div>
              </Col>
              {salle.image_path && (
                <Col md={4}>
                  <img 
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${salle.image_path}`} 
                    alt={salle.nom} 
                    className="img-fluid rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            {!salleId && (
              <Form.Group className="mb-3" controlId="salle_id">
                <Form.Label>Salle *</Form.Label>
                <Form.Control
                  as="select"
                  name="salle_id"
                  value={formData.salle_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez une salle</option>
                  {/* Ici, vous pourriez charger dynamiquement la liste des salles */}
                </Form.Control>
              </Form.Group>
            )}
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="date_debut">
                  <Form.Label>Date et heure de début *</Form.Label>
                  <DatePicker
                    selected={formData.date_debut}
                    onChange={(date) => handleDateChange(date, 'date_debut')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="date_fin">
                  <Form.Label>Date et heure de fin *</Form.Label>
                  <DatePicker
                    selected={formData.date_fin}
                    onChange={(date) => handleDateChange(date, 'date_fin')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="motif">
              <Form.Label>Motif de la réservation *</Form.Label>
              <Form.Control
                as="textarea"
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                rows={3}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="nombre_participants">
              <Form.Label>Nombre de participants *</Form.Label>
              <Form.Control
                type="number"
                name="nombre_participants"
                value={formData.nombre_participants}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Création en cours...' : 'Créer la réservation'}
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => navigate(-1)}
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

export default ReservationForm;
