import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import demandePersonnaliseeService from '../services/demandePersonnaliseeService';

const DemandeList = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await demandePersonnaliseeService.getDemandes();
      setDemandes(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des demandes personnalisées');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDemande = (demande) => {
    setSelectedDemande(demande);
    setShowModal(true);
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
    if (!dateString) return 'Non spécifiée';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement de vos demandes personnalisées...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mes Demandes Personnalisées</h1>
        <Button as={Link} to="/demandes/new" variant="success">
          Nouvelle demande
        </Button>
      </div>

      {demandes.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h5>Vous n'avez pas encore de demande personnalisée</h5>
            <p>Créez votre salle de rêve en spécifiant les caractéristiques dont vous avez besoin</p>
            <Button as={Link} to="/demandes/new" variant="success">
              Créer une demande personnalisée
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date de création</th>
                  <th>Date souhaitée</th>
                  <th>Statut</th>
                  <th>Salle assignée</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map(demande => (
                  <tr key={demande.id}>
                    <td>{demande.titre}</td>
                    <td>{formatDate(demande.created_at)}</td>
                    <td>{formatDate(demande.date_souhaitee)}</td>
                    <td>{getStatusBadge(demande.statut)}</td>
                    <td>
                      {demande.salle ? (
                        <Link to={`/salles/${demande.salle.id}`}>
                          {demande.salle.nom}
                        </Link>
                      ) : (
                        'Non assignée'
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDemande(demande)}
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal de détails de la demande personnalisée */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails de la demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDemande && (
            <>
              <h4>{selectedDemande.titre}</h4>
              <p className="text-muted">Créée le {formatDate(selectedDemande.created_at)}</p>
              
              <Card className="mb-3">
                <Card.Header>Description</Card.Header>
                <Card.Body>
                  <p className="mb-0">{selectedDemande.description}</p>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>Caractéristiques demandées</Card.Header>
                <Card.Body>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>Capacité tables</th>
                        <td>{selectedDemande.capacite_tables || 'Non spécifiée'}</td>
                      </tr>
                      <tr>
                        <th>Capacité chaises</th>
                        <td>{selectedDemande.capacite_chaises || 'Non spécifiée'}</td>
                      </tr>
                      <tr>
                        <th>Équipements</th>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedDemande.equipement_pc && (
                              <Badge bg="info">PC</Badge>
                            )}
                            {selectedDemande.equipement_datashow && (
                              <Badge bg="info">Datashow</Badge>
                            )}
                            {selectedDemande.has_internet && (
                              <Badge bg="info">Internet</Badge>
                            )}
                            {!selectedDemande.equipement_pc && 
                              !selectedDemande.equipement_datashow && 
                              !selectedDemande.has_internet && (
                              <span>Aucun équipement spécifié</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Date souhaitée</th>
                        <td>{formatDate(selectedDemande.date_souhaitee)}</td>
                      </tr>
                      <tr>
                        <th>Durée souhaitée</th>
                        <td>{selectedDemande.duree_souhaitee || 'Non spécifiée'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Statut de la demande</span>
                    {getStatusBadge(selectedDemande.statut)}
                  </div>
                </Card.Header>
                <Card.Body>
                  {selectedDemande.statut === 'validee' && (
                    <>
                      <p>Votre demande a été validée par l'administration.</p>
                      {selectedDemande.salle && (
                        <div>
                          <p>Une salle correspondant à vos critères a été trouvée :</p>
                          <Button 
                            as={Link} 
                            to={`/salles/${selectedDemande.salle.id}`}
                            variant="primary"
                          >
                            Voir la salle assignée
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedDemande.statut === 'refusee' && (
                    <p>Votre demande a été refusée.</p>
                  )}
                  
                  {selectedDemande.statut === 'en_attente' && (
                    <p>Votre demande est en cours d'examen par l'administration.</p>
                  )}
                  
                  {selectedDemande.reponse_admin && (
                    <div className="mt-3">
                      <h6>Réponse de l'administrateur :</h6>
                      <div className="border p-3 bg-light rounded">
                        {selectedDemande.reponse_admin}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default DemandeList;
