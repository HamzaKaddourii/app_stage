import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import reservationService from '../../services/reservationService';
import bonAchatService from '../../services/bonAchatService';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [actionType, setActionType] = useState(''); // 'validate' ou 'reject'
  const [commentaire, setCommentaire] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReservations();
      setReservations(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      toast.error('Erreur lors du chargement des réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowActionModal = (reservation, type) => {
    setCurrentReservation(reservation);
    setActionType(type);
    setCommentaire('');
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (!currentReservation) return;

    try {
      setModalLoading(true);
      
      if (actionType === 'validate') {
        // Valider la réservation
        await reservationService.updateReservation(currentReservation.id, {
          statut: 'validee',
          commentaire: commentaire
        });
        
        // Générer automatiquement un bon d'achat (10% du montant de la réservation)
        const montantReservation = calculateReservationAmount(currentReservation);
        const montantBon = montantReservation * 0.1; // 10% du montant total
        
        await bonAchatService.createBonAchat({
          user_id: currentReservation.user_id,
          reservation_id: currentReservation.id,
          montant: montantBon,
          date_expiration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 jours
        });
        
        toast.success('Réservation validée avec succès et bon d\'achat généré');
      } else {
        // Refuser la réservation
        await reservationService.updateReservation(currentReservation.id, {
          statut: 'refusee',
          commentaire: commentaire
        });
        toast.success('Réservation refusée');
      }
      
      fetchReservations();
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du traitement de la réservation';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setModalLoading(false);
      setShowActionModal(false);
      setCurrentReservation(null);
    }
  };

  // Fonction pour calculer le montant total d'une réservation
  const calculateReservationAmount = (reservation) => {
    const dateDebut = new Date(reservation.date_debut);
    const dateFin = new Date(reservation.date_fin);
    const heures = (dateFin - dateDebut) / (1000 * 60 * 60); // Différence en heures
    return heures * reservation.salle.prix_horaire;
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  // Filtrer les réservations selon le statut
  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.statut === filterStatus);

  // Obtenir le badge de statut
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

  return (
    <Layout>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h1>Gestion des réservations</h1>
        <div className="d-flex gap-2">
          <Form.Select 
            className="w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Toutes les réservations</option>
            <option value="en_attente">En attente</option>
            <option value="validee">Validées</option>
            <option value="refusee">Refusées</option>
          </Form.Select>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
              <p className="mt-2">Chargement des réservations...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-secondary" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Aucune réservation trouvée</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Salle</th>
                    <th>Date et heure</th>
                    <th>Statut</th>
                    <th>Montant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>#{reservation.id}</td>
                      <td>
                        <div className="fw-bold">{reservation.user?.name || 'Utilisateur inconnu'}</div>
                        <small className="text-muted">{reservation.user?.email}</small>
                      </td>
                      <td>{reservation.salle?.nom || 'Salle inconnue'}</td>
                      <td>
                        <div>Début: {formatDateTime(reservation.date_debut)}</div>
                        <div>Fin: {formatDateTime(reservation.date_fin)}</div>
                      </td>
                      <td>{getStatusBadge(reservation.statut)}</td>
                      <td>
                        {calculateReservationAmount(reservation).toFixed(2)} DH
                      </td>
                      <td>
                        {reservation.statut === 'en_attente' && (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleShowActionModal(reservation, 'validate')}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Valider
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleShowActionModal(reservation, 'reject')}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Refuser
                            </Button>
                          </div>
                        )}
                        {reservation.statut !== 'en_attente' && (
                          <div>
                            {reservation.commentaire ? (
                              <div>
                                <small className="text-muted">Commentaire: {reservation.commentaire}</small>
                              </div>
                            ) : (
                              <small className="text-muted">Aucun commentaire</small>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de validation/refus */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'validate' ? 'Valider la réservation' : 'Refuser la réservation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentReservation && (
            <>
              <p>
                Vous êtes sur le point de {actionType === 'validate' ? 'valider' : 'refuser'} la réservation de la salle{' '}
                <strong>{currentReservation.salle?.nom}</strong> faite par{' '}
                <strong>{currentReservation.user?.name}</strong>.
              </p>
              
              {actionType === 'validate' && (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  La validation générera automatiquement un bon d'achat de {(calculateReservationAmount(currentReservation) * 0.1).toFixed(2)} DH (10% du montant total) pour l'utilisateur.
                </Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Commentaire (optionnel)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder={actionType === 'validate' ? "Informations complémentaires pour l'utilisateur..." : "Raison du refus..."}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionModal(false)} disabled={modalLoading}>
            Annuler
          </Button>
          <Button
            variant={actionType === 'validate' ? 'success' : 'danger'}
            onClick={handleAction}
            disabled={modalLoading}
          >
            {modalLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Traitement en cours...
              </>
            ) : actionType === 'validate' ? (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Confirmer la validation
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-1"></i>
                Confirmer le refus
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default AdminReservations;
