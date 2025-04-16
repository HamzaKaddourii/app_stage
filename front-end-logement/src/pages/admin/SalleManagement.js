import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Alert, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import salleService from '../../services/salleService';

const SalleManagement = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salleToDelete, setSalleToDelete] = useState(null);

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const data = await salleService.getSalles();
      setSalles(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des salles');
      toast.error('Erreur lors du chargement des salles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (salle) => {
    setSalleToDelete(salle);
    setShowDeleteModal(true);
  };

  const handleDeleteSalle = async () => {
    if (!salleToDelete) return;

    try {
      setLoading(true);
      await salleService.deleteSalle(salleToDelete.id);
      toast.success('Salle supprimée avec succès');
      fetchSalles();
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la suppression de la salle';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSalleToDelete(null);
    }
  };

  return (
    <Layout>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h1>Gestion des salles</h1>
        <Link to="/admin/salles/create">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Ajouter une salle
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading && salles.length === 0 ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
              <p className="mt-2">Chargement des salles...</p>
            </div>
          ) : salles.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building text-secondary" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Aucune salle disponible</p>
              <Link to="/admin/salles/create">
                <Button variant="outline-primary">
                  Ajouter votre première salle
                </Button>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Capacité</th>
                    <th>Équipements</th>
                    <th>Prix/Heure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salles.map((salle) => (
                    <tr key={salle.id}>
                      <td style={{ width: '80px' }}>
                        {salle.image_path ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${salle.image_path}`}
                            alt={salle.nom}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-building text-secondary"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="fw-bold">{salle.nom}</div>
                        <small className="text-muted">{salle.description?.substring(0, 50)}{salle.description?.length > 50 ? '...' : ''}</small>
                      </td>
                      <td>
                        <div><i className="bi bi-table me-1"></i> {salle.capacite_tables} tables</div>
                        <div><i className="bi bi-person me-1"></i> {salle.capacite_chaises} chaises</div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {salle.equipement_pc && (
                            <Badge bg="info" className="me-1">
                              <i className="bi bi-pc-display me-1"></i>PC
                            </Badge>
                          )}
                          {salle.equipement_datashow && (
                            <Badge bg="info" className="me-1">
                              <i className="bi bi-projector me-1"></i>Projecteur
                            </Badge>
                          )}
                          {salle.has_internet && (
                            <Badge bg="info">
                              <i className="bi bi-wifi me-1"></i>Internet
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>{salle.prix_horaire} DH/h</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/admin/salles/edit/${salle.id}`}>
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleShowDeleteModal(salle)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir supprimer la salle{' '}
            <strong>{salleToDelete?.nom}</strong> ?
          </p>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Cette action est irréversible. Les réservations associées à cette salle ne seront plus disponibles.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteSalle}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default SalleManagement;
