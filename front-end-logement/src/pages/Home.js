import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <Layout>
      <div className="text-center mb-5">
        <h1>Bienvenue sur la plateforme de Gestion de Salle Logement</h1>
        <p className="lead">
          Une solution complète pour gérer les réservations de salles et leurs équipements
        </p>
      </div>

      <Container>
        <Row className="justify-content-center g-4">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                <i className="bi bi-building text-primary" style={{ fontSize: '4rem' }}></i>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>Consulter les salles</Card.Title>
                <Card.Text>
                  Découvrez toutes les salles disponibles avec leurs capacités et équipements.
                </Card.Text>
                <div className="mt-auto">
                  <Button as={Link} to="/salles" variant="primary" className="w-100">
                    Voir les salles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {currentUser && (
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <i className="bi bi-calendar-check text-primary" style={{ fontSize: '4rem' }}></i>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Mes réservations</Card.Title>
                  <Card.Text>
                    Consultez et gérez vos demandes de réservation.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button as={Link} to="/reservations" variant="primary" className="w-100">
                      Voir mes réservations
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                <i className="bi bi-stars text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>Créer votre salle de rêve</Card.Title>
                <Card.Text>
                  Soumettez votre demande personnalisée pour une salle avec les caractéristiques spécifiques dont vous avez besoin.
                </Card.Text>
                <div className="mt-auto">
                  {currentUser ? (
                    <Button as={Link} to="/demandes/new" variant="success" className="w-100">
                      Créer une demande
                    </Button>
                  ) : (
                    <Button as={Link} to="/login" variant="outline-primary" className="w-100">
                      Connectez-vous pour créer une demande
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {currentUser && (
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <i className="bi bi-gift text-warning" style={{ fontSize: '4rem' }}></i>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Mes bons d'achat</Card.Title>
                  <Card.Text>
                    Consultez les bons d'achat que vous avez obtenus lors de la validation de vos réservations.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button as={Link} to="/bons-achat" variant="primary" className="w-100">
                      Voir mes bons d'achat
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}

          {isAdmin() && (
            <Col md={4}>
              <Card className="h-100 shadow-sm border-danger">
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <i className="bi bi-gear text-danger" style={{ fontSize: '4rem' }}></i>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Administration</Card.Title>
                  <Card.Text>
                    Accédez au panneau d'administration pour gérer les salles, les réservations et les demandes personnalisées.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button as={Link} to="/admin/salles" variant="danger" className="w-100">
                      Panneau d'administration
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </Layout>
  );
};

export default Home;
