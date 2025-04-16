import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import bonAchatService from '../services/bonAchatService';
import jsPDF from 'jspdf';
import { LOGO_BASE64 } from '../assets/logoBase64';

const BonAchatList = () => {
  const [bonsAchat, setBonsAchat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBon, setSelectedBon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBonsAchat();
  }, []);

  const fetchBonsAchat = async () => {
    try {
      setLoading(true);
      const data = await bonAchatService.getBonsAchat();
      setBonsAchat(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des bons d\'achat');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBon = (bon) => {
    setSelectedBon(bon);
    setShowModal(true);
  };

  const handleUseBon = async (id) => {
    try {
      await bonAchatService.useBonAchat(id);
      // Mettre à jour la liste des bons d'achat
      setBonsAchat(
        bonsAchat.map(bon => 
          bon.id === id ? { ...bon, is_used: true } : bon
        )
      );
      toast.success('Bon d\'achat marqué comme utilisé');
      setShowModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'utilisation du bon d\'achat');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Génération du PDF du bon d'achat avec le logo
  const generateBonAchatPDF = (bon) => {
    if (!bon) return;

    try {
      // On utilise un setTimeout pour éviter le blocage de l'interface utilisateur
      setTimeout(() => {
        try {
          // Création d'un nouveau document PDF au format A4
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          // Titre principal sans logo (pour éviter les problèmes liés à l'image)
          doc.setFontSize(22);
          doc.setTextColor(0, 51, 153);
          doc.text('InfoDesign', 105, 30, { align: 'center' });

          // Sous-titre
          doc.setFontSize(18);
          doc.setTextColor(0, 0, 0);
          doc.text('BON D\'ACHAT', 105, 50, { align: 'center' });

          // Informations du bon
          doc.setFontSize(16);
          doc.setTextColor(231, 76, 60); // rouge
          doc.text(`Montant: ${bon.montant} DH`, 105, 70, { align: 'center' });
          
          // Détail du calcul
          if (bon.reservation && bon.reservation.salle) {
            const prix_horaire = bon.reservation.salle.prix_horaire;
            const date_debut = new Date(bon.reservation.date_debut);
            const date_fin = new Date(bon.reservation.date_fin);
            const heures = ((date_fin - date_debut) / (1000 * 60 * 60)).toFixed(1);
            const montant_total = (prix_horaire * heures).toFixed(2);
            
            // Afficher le montant total de la réservation
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text(`Montant total de la réservation: ${montant_total} DH`, 105, 80, { align: 'center' });
            
            // Afficher le détail du calcul
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Détail du calcul: ${prix_horaire} DH/h x ${heures} h`, 105, 90, { align: 'center' });
            
            // Expliquer le rapport entre le bon d'achat et le montant total
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            doc.text(`Ce bon d'achat représente 10% du montant total de votre réservation`, 105, 100, { align: 'center' });
          }

          // Section code du bon
          doc.setFillColor(240, 240, 240);
          doc.rect(55, 110, 100, 30, 'F');
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text('Code du bon:', 105, 120, { align: 'center' });
          doc.setFontSize(16);
          doc.setTextColor(52, 152, 219); // bleu
          doc.text(bon.code, 105, 130, { align: 'center' });

          // Autres informations
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statut: ${bon.is_used ? 'Utilisé' : 'Disponible'}`, 20, 160);
          doc.text(`Date d'expiration: ${formatDate(bon.date_expiration)}`, 20, 170);
          
          if (bon.reservation && bon.reservation.salle) {
            doc.text(`Salle réservée: ${bon.reservation.salle.nom}`, 20, 180);
            doc.text(`Prix horaire: ${bon.reservation.salle.prix_horaire} DH/h`, 20, 190);
          } else {
            doc.text('Salle réservée: N/A', 20, 180);
          }
          
          if (bon.reservation) {
            const date_debut = new Date(bon.reservation.date_debut);
            const date_fin = new Date(bon.reservation.date_fin);
            const heures = ((date_fin - date_debut) / (1000 * 60 * 60)).toFixed(1);
            
            doc.text(`Date de réservation: ${formatDate(bon.reservation.date_debut)}`, 20, 200);
            doc.text(`Durée de réservation: ${heures} heures`, 20, 210);
          } else {
            doc.text(`Date de réservation: N/A`, 20, 200);
          }
          
          // Pied de page
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text('© InfoDesign - 2025', 105, 280, { align: 'center' });
          
          // Téléchargement du PDF
          doc.save(`bon-achat-${bon.code}.pdf`);
          toast.success('Bon d\'achat téléchargé avec succès');
        } catch (innerError) {
          console.error('Erreur lors de la génération du PDF:', innerError);
          toast.error('Erreur lors de la génération du PDF');
        }
      }, 100); // Délai de 100ms pour laisser l'interface se mettre à jour
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement de vos bons d'achat...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="mb-4">Mes Bons d'Achat</h1>

      {bonsAchat.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h5>Vous n'avez pas encore de bon d'achat</h5>
            <p>Les bons d'achat sont générés automatiquement lorsque vos réservations sont validées par l'administrateur.</p>
            <Button href="/salles" variant="primary">
              Réserver une salle
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Montant</th>
                  <th>Date d'expiration</th>
                  <th>Statut</th>
                  <th>Salle réservée</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bonsAchat.map(bon => (
                  <tr key={bon.id}>
                    <td><code>{bon.code}</code></td>
                    <td>{bon.montant} DH</td>
                    <td>{formatDate(bon.date_expiration)}</td>
                    <td>
                      {bon.is_used ? (
                        <Badge bg="secondary">Utilisé</Badge>
                      ) : (
                        <Badge bg="success">Disponible</Badge>
                      )}
                    </td>
                    <td>{bon.reservation?.salle?.nom || 'N/A'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewBon(bon)}
                        className="me-1"
                      >
                        Détails
                      </Button>
                      {!bon.is_used && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleUseBon(bon.id)}
                        >
                          Marquer comme utilisé
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

      {/* Modal de détails du bon d'achat */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Bon d'Achat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBon && (
            <>
              <div className="text-center mb-4">
                <h4 className="text-primary">{selectedBon.montant} DH</h4>
                <div className="border p-3 mb-3 bg-light">
                  <h5 className="fw-bold">Code du bon</h5>
                  <code className="fs-4">{selectedBon.code}</code>
                </div>
              </div>
              
              <table className="table">
                <tbody>
                  <tr>
                    <th>Statut</th>
                    <td>
                      {selectedBon.is_used ? (
                        <Badge bg="secondary">Utilisé</Badge>
                      ) : (
                        <Badge bg="success">Disponible</Badge>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Date d'expiration</th>
                    <td>{formatDate(selectedBon.date_expiration)}</td>
                  </tr>
                  <tr>
                    <th>Salle réservée</th>
                    <td>{selectedBon.reservation?.salle?.nom || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Date de réservation</th>
                    <td>
                      {selectedBon.reservation ? 
                        formatDate(selectedBon.reservation.date_debut) : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          {selectedBon && !selectedBon.is_used && (
            <Button 
              variant="success" 
              onClick={() => handleUseBon(selectedBon.id)}
            >
              Marquer comme utilisé
            </Button>
          )}
          {selectedBon && (
            <Button 
              variant="primary" 
              onClick={() => generateBonAchatPDF(selectedBon)}
            >
              <i className="bi bi-download me-1"></i>
              Télécharger PDF
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default BonAchatList;
