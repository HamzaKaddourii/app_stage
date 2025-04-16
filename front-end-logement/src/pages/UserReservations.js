import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import reservationService from '../services/reservationService';
import { useAuth } from '../context/AuthContext';

const UserReservations = () => {
  const { currentUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchReservations();
    }
  }, [currentUser]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getUserReservations(currentUser.id);
      setReservations(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await reservationService.cancelReservation(selectedReservation.id);
      setReservations(reservations.filter(r => r.id !== selectedReservation.id));
      toast.success('Réservation annulée avec succès');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'annulation de la réservation');
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_attente':
        return <Badge bg="warning">En attente</Badge>;
      case 'validee':
        return <Badge bg="success">Validée</Badge>;
      case 'refusee':
        return <Badge bg="danger">Refusée</Badge>;
      default:
        return <Badge bg="secondary">Inconnu</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: fr });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement de vos réservations...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4">Mes Réservations</h1>

      {reservations.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h5>Vous n'avez pas encore de réservation</h5>
            <p>Consultez nos salles disponibles et faites votre première réservation</p>
            <Button href="/salles" variant="primary">
              Voir les salles
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Salle</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Statut</th>
                  <th>Bon d'achat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td>{reservation.salle?.nom || 'N/A'}</td>
                    <td>{formatDate(reservation.date_debut)}</td>
                    <td>{formatDate(reservation.date_fin)}</td>
                    <td>{getStatusBadge(reservation.statut)}</td>
                    <td>
                      {reservation.statut === 'validee' && reservation.bonAchat ? (
                        <Badge bg="info">
                          Bon d'achat de {reservation.bonAchat.montant} DH
                        </Badge>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      {reservation.statut === 'en_attente' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleCancel(reservation)}
                        >
                          Annuler
                        </Button>
                      )}
                      {reservation.statut === 'validee' && reservation.bonAchat && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          href={`/bons-achat/${reservation.bonAchat.id}`}
                        >
                          Voir le bon
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal de confirmation d'annulation */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l'annulation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
          <p>Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Confirmer l'annulation
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default UserReservations;
