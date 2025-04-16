import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import salleService from '../services/salleService';

const SalleList = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    min_tables: '',
    min_chaises: '',
    pc: false,
    datashow: false,
    internet: false,
    sort: 'nom'
  });

  // Charger les salles au chargement de la page
  useEffect(() => {
    fetchSalles();
  }, []);

  // Charger les salles avec les filtres actuels
  const fetchSalles = async () => {
    try {
      setLoading(true);
      console.log('Envoi des filtres au serveur:', filters);
      const data = await salleService.getSalles(filters);
      console.log('Données reçues du serveur:', data);
      console.log('Nombre de salles reçues:', Array.isArray(data) ? data.length : 'Non array');
      setSalles(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des salles');
      console.error('Erreur fetchSalles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de filtre
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Appliquer les filtres
  const applyFilters = (e) => {
    e.preventDefault();
    fetchSalles();
  };

  return (
    <Layout>
      <h1 className="mb-4">Salles disponibles</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <h5>Filtres</h5>
          <Form onSubmit={applyFilters}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group controlId="min_tables">
                  <Form.Label>Capacité min. tables</Form.Label>
                  <Form.Control
                    type="number"
                    name="min_tables"
                    value={filters.min_tables}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="min_chaises">
                  <Form.Label>Capacité min. chaises</Form.Label>
                  <Form.Control
                    type="number"
                    name="min_chaises"
                    value={filters.min_chaises}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <div className="d-flex flex-wrap gap-3 h-100 align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="pc"
                    name="pc"
                    label="PC"
                    checked={filters.pc}
                    onChange={handleFilterChange}
                  />
                  
                  <Form.Check
                    type="checkbox"
                    id="datashow"
                    name="datashow"
                    label="Datashow"
                    checked={filters.datashow}
                    onChange={handleFilterChange}
                  />
                  
                  <Form.Check
                    type="checkbox"
                    id="internet"
                    name="internet"
                    label="Internet"
                    checked={filters.internet}
                    onChange={handleFilterChange}
                  />
                  
                  <Form.Group controlId="sort" className="ms-auto">
                    <Form.Label>Trier par</Form.Label>
                    <Form.Select
                      name="sort"
                      value={filters.sort}
                      onChange={handleFilterChange}
                    >
                      <option value="nom">Nom</option>
                      <option value="prix_asc">Prix (croissant)</option>
                      <option value="prix_desc">Prix (décroissant)</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary">
                Appliquer les filtres
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des salles...</p>
        </div>
      ) : (
        <>
          {salles.length === 0 ? (
            <div className="text-center my-5">
              <p>Aucune salle ne correspond aux critères sélectionnés.</p>
            </div>
          ) : (
            <Row className="g-4">
              {salles.map(salle => (
                <Col key={salle.id} md={4}>
                  <Card className="h-100 shadow-sm">
                    {salle.image_path ? (
                      <Card.Img 
                        variant="top" 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${salle.image_path}`} 
                        style={{ height: '200px', objectFit: 'cover' }}
                        alt={salle.nom}
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center" 
                        style={{ height: '200px' }}
                      >
                        <i className="bi bi-building text-secondary" style={{ fontSize: '3rem' }}></i>
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>{salle.nom}</Card.Title>
                      
                      <div className="my-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Capacité tables:</span>
                          <strong>{salle.capacite_tables}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Capacité chaises:</span>
                          <strong>{salle.capacite_chaises}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Prix horaire:</span>
                          <strong>{salle.prix_horaire} DH/h</strong>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6>Équipements:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {salle.equipement_pc && (
                            <Badge bg="info">PC</Badge>
                          )}
                          {salle.equipement_datashow && (
                            <Badge bg="info">Datashow</Badge>
                          )}
                          {salle.has_internet && (
                            <Badge bg="info">Internet</Badge>
                          )}
                          {!salle.equipement_pc && !salle.equipement_datashow && !salle.has_internet && (
                            <Badge bg="secondary">Aucun équipement spécial</Badge>
                          )}
                        </div>
                      </div>
                      
                      {salle.description && (
                        <Card.Text className="mb-3">
                          {salle.description}
                        </Card.Text>
                      )}
                      
                      <div className="d-grid gap-2">
                        <Button
                          as={Link}
                          to={`/salles/${salle.id}`}
                          variant="outline-primary"
                        >
                          Détails
                        </Button>
                        <Button
                          as={Link}
                          to={`/reservations/new?salle=${salle.id}`}
                          variant="primary"
                        >
                          Réserver
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Layout>
  );
};

export default SalleList;
