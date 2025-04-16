import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Row, Col, ListGroup, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Layout from '../components/Layout';
import salleService from '../services/salleService';
import reservationService from '../services/reservationService';
import { useAuth } from '../context/AuthContext';

const SalleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [salle, setSalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState({
    date_debut: '',
    date_fin: '',
    commentaire: ''
  });
  const [formVisible, setFormVisible] = useState(false);

  // Charger les détails de la salle
  useEffect(() => {
    const fetchSalle = async () => {
      try {
        setLoading(true);
        const data = await salleService.getSalle(id);
        setSalle(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des détails de la salle");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalle();
  }, [id]);

  // Gérer les changements de champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission du formulaire de réservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      const reservationData = {
        user_id: currentUser.id,
        salle_id: parseInt(id),
        date_debut: reservation.date_debut,
        date_fin: reservation.date_fin,
        commentaire: reservation.commentaire
      };
      
      await reservationService.createReservation(reservationData);
      toast.success('Demande de réservation envoyée avec succès');
      navigate('/reservations');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la création de la réservation');
    }
  };

  if (loading) {
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

  if (!salle) {
    return (
      <Layout>
        <div className="text-center my-5">
          <p className="text-danger">Salle non trouvée</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/salles')}
          >
            Retour à la liste des salles
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-3">
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/salles')}
        >
          &larr; Retour aux salles
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Header as="h3">{salle.nom}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={7}>
              {salle.image_path ? (
                <Card className="mb-4">
                  <Card.Img 
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${salle.image_path}`} 
                    alt={salle.nom}
                    className="img-fluid"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                </Card>
              ) : (
                <Card className="mb-4 bg-light">
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <i className="bi bi-building text-secondary" style={{ fontSize: '4rem' }}></i>
                  </div>
                </Card>
              )}
            
              <Card.Text>{salle.description || "Aucune description disponible."}</Card.Text>
              
              <Card className="mb-4">
                <Card.Header as="h5">Caractéristiques</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Capacité tables</span>
                    <Badge bg="primary">{salle.capacite_tables}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Capacité chaises</span>
                    <Badge bg="primary">{salle.capacite_chaises}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Prix horaire</span>
                    <Badge bg="success">{salle.prix_horaire} DH/h</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              
              <Card>
                <Card.Header as="h5">Équipements</Card.Header>
                <Card.Body>
                  <div className="d-flex flex-wrap gap-2">
                    {salle.equipement_pc && (
                      <Badge bg="info" className="p-2">
                        <i className="bi bi-pc-display"></i> PC
                      </Badge>
                    )}
                    {salle.equipement_datashow && (
                      <Badge bg="info" className="p-2">
                        <i className="bi bi-projector"></i> Datashow
                      </Badge>
                    )}
                    {salle.has_internet && (
                      <Badge bg="info" className="p-2">
                        <i className="bi bi-wifi"></i> Internet
                      </Badge>
                    )}
                    {!salle.equipement_pc && !salle.equipement_datashow && !salle.has_internet && (
                      <Badge bg="secondary" className="p-2">Aucun équipement spécial</Badge>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Header as="h5">Réservation</Card.Header>
                <Card.Body>
                  {formVisible ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="date_debut">
                        <Form.Label>Date et heure de début</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="date_debut"
                          value={reservation.date_debut}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="date_fin">
                        <Form.Label>Date et heure de fin</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="date_fin"
                          value={reservation.date_fin}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3" controlId="commentaire">
                        <Form.Label>Commentaire (optionnel)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="commentaire"
                          value={reservation.commentaire}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      
                      <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">
                          Envoyer la demande
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setFormVisible(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="text-center">
                      <p>Pour réserver cette salle, veuillez cliquer sur le bouton ci-dessous.</p>
                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          onClick={() => {
                            if (!currentUser) {
                              navigate('/login');
                            } else {
                              setFormVisible(true);
                            }
                          }}
                        >
                          Réserver cette salle
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card className="mt-4">
                <Card.Header as="h5">Vous avez besoin d'une salle personnalisée?</Card.Header>
                <Card.Body>
                  <p>Créez votre salle de rêve avec les caractéristiques spécifiques dont vous avez besoin.</p>
                  <div className="d-grid">
                    <Button 
                      variant="success" 
                      onClick={() => {
                        if (!currentUser) {
                          navigate('/login');
                        } else {
                          navigate('/demandes/new');
                        }
                      }}
                    >
                      Créer une demande personnalisée
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default SalleDetail;
