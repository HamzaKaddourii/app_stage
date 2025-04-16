import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import salleService from '../../services/salleService';
import reservationService from '../../services/reservationService';
import demandeService from '../../services/demandePersonnaliseeService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSalles: 0,
    totalReservations: 0,
    reservationsEnAttente: 0,
    totalDemandes: 0,
    demandesEnAttente: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les données nécessaires pour les statistiques
        const salles = await salleService.getSalles();
        const reservations = await reservationService.getAllReservations();
        const demandes = await demandeService.getAllDemandes();
        
        // Calculer les statistiques
        const reservationsEnAttente = reservations.filter(r => r.statut === 'en_attente');
        const demandesEnAttente = demandes.filter(d => d.statut === 'en_attente');
        
        setStats({
          totalSalles: salles.length,
          totalReservations: reservations.length,
          reservationsEnAttente: reservationsEnAttente.length,
          totalDemandes: demandes.length,
          demandesEnAttente: demandesEnAttente.length
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, link }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted">{title}</h6>
            <h3 className="fw-bold">{loading ? '...' : value}</h3>
          </div>
          <div className={`rounded-circle d-flex align-items-center justify-content-center`} style={{ width: 50, height: 50, backgroundColor: `rgba(${color}, 0.1)` }}>
            <i className={`bi ${icon} fs-4`} style={{ color: `rgb(${color})` }}></i>
          </div>
        </div>
      </Card.Body>
      {link && (
        <Card.Footer className="bg-white border-0">
          <Link to={link}>
            <Button variant="link" className="text-decoration-none p-0">
              Voir les détails <i className="bi bi-arrow-right ms-1"></i>
            </Button>
          </Link>
        </Card.Footer>
      )}
    </Card>
  );

  return (
    <Layout>
      <div className="mb-4">
        <h1>Tableau de bord administrateur</h1>
        <p className="text-muted">Bienvenue sur votre tableau de bord de gestion des salles, réservations et demandes personnalisées.</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <StatCard 
            title="Salles disponibles" 
            value={stats.totalSalles} 
            icon="bi-building" 
            color="25, 135, 84"
            link="/admin/salles"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            title="Total des réservations" 
            value={stats.totalReservations} 
            icon="bi-calendar-check" 
            color="13, 110, 253" 
            link="/admin/reservations"
          />
        </Col>
        <Col md={4}>
          <StatCard 
            title="Réservations en attente" 
            value={stats.reservationsEnAttente} 
            icon="bi-hourglass-split" 
            color="255, 193, 7" 
            link="/admin/reservations"
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <StatCard 
            title="Total des demandes personnalisées" 
            value={stats.totalDemandes} 
            icon="bi-card-checklist" 
            color="111, 66, 193" 
            link="/admin/demandes"
          />
        </Col>
        <Col md={6}>
          <StatCard 
            title="Demandes en attente" 
            value={stats.demandesEnAttente} 
            icon="bi-clock-history" 
            color="220, 53, 69" 
            link="/admin/demandes"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Actions rapides</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/admin/salles/create">
                  <Button variant="outline-primary" className="d-block w-100 text-start">
                    <i className="bi bi-plus-circle me-2"></i>
                    Ajouter une nouvelle salle
                  </Button>
                </Link>
                <Link to="/admin/reservations">
                  <Button variant="outline-warning" className="d-block w-100 text-start">
                    <i className="bi bi-check2-circle me-2"></i>
                    Gérer les réservations en attente ({stats.reservationsEnAttente})
                  </Button>
                </Link>
                <Link to="/admin/demandes">
                  <Button variant="outline-danger" className="d-block w-100 text-start">
                    <i className="bi bi-envelope-open me-2"></i>
                    Répondre aux demandes personnalisées ({stats.demandesEnAttente})
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Aide et support</h5>
            </Card.Header>
            <Card.Body>
              <p>En tant qu'administrateur, vous pouvez :</p>
              <ul>
                <li>Gérer toutes les salles (ajout, modification, suppression)</li>
                <li>Valider ou refuser les réservations des utilisateurs</li>
                <li>Répondre aux demandes personnalisées de "salle de rêve"</li>
                <li>Suivre l'activité globale de la plateforme via ce tableau de bord</li>
              </ul>
              <p className="mb-0">Pour toute question ou problème technique, contactez le support technique.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default AdminDashboard;
