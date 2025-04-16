import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import demandeService from '../../services/demandePersonnaliseeService';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

const AdminDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentDemande, setCurrentDemande] = useState(null);
  const [actionType, setActionType] = useState(''); // 'validate' ou 'reject'
  const [commentaire, setCommentaire] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await demandeService.getDemandes();
      setDemandes(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des demandes personnalisées');
      toast.error('Erreur lors du chargement des demandes personnalisées');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowActionModal = (demande, type) => {
    setCurrentDemande(demande);
    setActionType(type);
    setCommentaire('');
    setShowActionModal(true);
  };

  const handleAction = async () => {
    if (!currentDemande) return;

    try {
      setModalLoading(true);
      
      if (actionType === 'validate') {
        await demandeService.updateDemande(currentDemande.id, {
          statut: 'validee',
          commentaire: commentaire
        });
        toast.success('Demande validée avec succès');
      } else {
        await demandeService.updateDemande(currentDemande.id, {
          statut: 'refusee',
          commentaire: commentaire
        });
        toast.success('Demande refusée');
      }
      
      fetchDemandes();
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors du traitement de la demande';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setModalLoading(false);
      setShowActionModal(false);
      setCurrentDemande(null);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Filtrer les demandes selon le statut
  const filteredDemandes = filterStatus === 'all' 
    ? demandes 
    : demandes.filter(d => d.statut === filterStatus);

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
        <h1>Gestion des demandes personnalisées</h1>
        <div className="d-flex gap-2">
          <Form.Select 
            className="w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Toutes les demandes</option>
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
              <p className="mt-2">Chargement des demandes personnalisées...</p>
            </div>
          ) : filteredDemandes.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clipboard-x text-secondary" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Aucune demande personnalisée trouvée</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Titre</th>
                    <th>Caractéristiques</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.map((demande) => (
                    <tr key={demande.id}>
                      <td>#{demande.id}</td>
                      <td>
                        <div className="fw-bold">{demande.user?.name || 'Utilisateur inconnu'}</div>
                        <small className="text-muted">{demande.user?.email}</small>
                      </td>
                      <td>{demande.titre}</td>
                      <td>
                        <div><strong>Tables:</strong> {demande.capacite_tables}</div>
                        <div><strong>Chaises:</strong> {demande.capacite_chaises}</div>
                        <div>
                          {demande.equipement_pc && <Badge bg="info" className="me-1">PC</Badge>}
                          {demande.equipement_datashow && <Badge bg="info" className="me-1">Projecteur</Badge>}
                          {demande.has_internet && <Badge bg="info">Internet</Badge>}
                        </div>
                      </td>
                      <td>{formatDate(demande.created_at)}</td>
                      <td>{getStatusBadge(demande.statut)}</td>
                      <td>
                        {demande.statut === 'en_attente' && (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleShowActionModal(demande, 'validate')}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Valider
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleShowActionModal(demande, 'reject')}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Refuser
                            </Button>
                          </div>
                        )}
                        {demande.statut !== 'en_attente' && (
                          <div>
                            {demande.commentaire ? (
                              <div>
                                <small className="text-muted">Commentaire: {demande.commentaire}</small>
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
            {actionType === 'validate' ? 'Valider la demande' : 'Refuser la demande'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDemande && (
            <>
              <p>
                Vous êtes sur le point de {actionType === 'validate' ? 'valider' : 'refuser'} la demande de salle personnalisée{' '}
                <strong>"{currentDemande.titre}"</strong> faite par{' '}
                <strong>{currentDemande.user?.name}</strong>.
              </p>
              
              <Card className="mb-3">
                <Card.Header>Description de la demande</Card.Header>
                <Card.Body>
                  <p>{currentDemande.description || "Pas de description fournie."}</p>
                  <hr />
                  <div className="d-flex flex-wrap gap-3">
                    <div>
                      <strong>Tables:</strong> {currentDemande.capacite_tables}
                    </div>
                    <div>
                      <strong>Chaises:</strong> {currentDemande.capacite_chaises}
                    </div>
                    <div>
                      <strong>PC:</strong> {currentDemande.equipement_pc ? 'Oui' : 'Non'}
                    </div>
                    <div>
                      <strong>Projecteur:</strong> {currentDemande.equipement_datashow ? 'Oui' : 'Non'}
                    </div>
                    <div>
                      <strong>Internet:</strong> {currentDemande.has_internet ? 'Oui' : 'Non'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Form.Group className="mb-3">
                <Form.Label>Commentaire {actionType === 'reject' ? '(obligatoire)' : '(optionnel)'}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder={actionType === 'validate' ? "Informations complémentaires pour l'utilisateur..." : "Raison du refus..."}
                  required={actionType === 'reject'}
                />
                {actionType === 'reject' && commentaire.trim() === '' && (
                  <Form.Text className="text-danger">
                    Veuillez fournir une raison pour le refus de la demande.
                  </Form.Text>
                )}
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
            disabled={modalLoading || (actionType === 'reject' && commentaire.trim() === '')}
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

export default AdminDemandes;
