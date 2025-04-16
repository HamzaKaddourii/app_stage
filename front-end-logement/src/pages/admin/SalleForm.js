import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Image, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import salleService from '../../services/salleService';

const SalleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    capacite_tables: '',
    capacite_chaises: '',
    equipement_pc: false,
    equipement_datashow: false,
    has_internet: false,
    prix_horaire: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchSalleDetails();
    }
  }, [id]);
  
  const fetchSalleDetails = async () => {
    try {
      setLoading(true);
      const data = await salleService.getSalle(id);
      setFormData({
        nom: data.nom,
        description: data.description || '',
        capacite_tables: data.capacite_tables,
        capacite_chaises: data.capacite_chaises,
        equipement_pc: data.equipement_pc,
        equipement_datashow: data.equipement_datashow,
        has_internet: data.has_internet,
        prix_horaire: data.prix_horaire
      });
      
      if (data.image_path) {
        setImagePreview(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${data.image_path}`);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des détails de la salle');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      
      // Créer une URL d'aperçu pour l'image
      const imageUrl = URL.createObjectURL(selectedImage);
      setImagePreview(imageUrl);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Créer un objet FormData pour envoyer les données multipart/form-data (pour l'image)
      const formDataObj = new FormData();
      
      // Ajouter tous les champs de formulaire au FormData
      Object.keys(formData).forEach(key => {
        // Pour les booléens, convertir explicitement en '0' ou '1' string
        if (typeof formData[key] === 'boolean') {
          formDataObj.append(key, formData[key] ? '1' : '0');
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Ajouter l'image si elle existe
      if (image) {
        formDataObj.append('image', image);
      }
      
      if (isEditMode) {
        await salleService.updateSalle(id, formDataObj);
        toast.success('Salle mise à jour avec succès');
      } else {
        await salleService.createSalle(formDataObj);
        toast.success('Salle créée avec succès');
      }
      
      navigate('/admin/salles');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue');
      toast.error('Erreur lors de l\'enregistrement de la salle');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
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
  
  return (
    <Layout>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h1>{isEditMode ? 'Modifier la salle' : 'Créer une nouvelle salle'}</h1>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/admin/salles')}
        >
          Retour à la liste
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="nom">
                  <Form.Label>Nom de la salle *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="capacite_tables">
                      <Form.Label>Capacité tables *</Form.Label>
                      <Form.Control
                        type="number"
                        name="capacite_tables"
                        value={formData.capacite_tables}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="capacite_chaises">
                      <Form.Label>Capacité chaises *</Form.Label>
                      <Form.Control
                        type="number"
                        name="capacite_chaises"
                        value={formData.capacite_chaises}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3" controlId="prix_horaire">
                  <Form.Label>Prix horaire (DH) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="prix_horaire"
                    value={formData.prix_horaire}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
                
                <Card className="mb-4">
                  <Card.Header>Équipements disponibles</Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-wrap gap-4">
                      <Form.Check
                        type="checkbox"
                        id="equipement_pc"
                        name="equipement_pc"
                        label="Ordinateurs"
                        checked={formData.equipement_pc}
                        onChange={handleChange}
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="equipement_datashow"
                        name="equipement_datashow"
                        label="Projecteur / Datashow"
                        checked={formData.equipement_datashow}
                        onChange={handleChange}
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="has_internet"
                        name="has_internet"
                        label="Connexion Internet"
                        checked={formData.has_internet}
                        onChange={handleChange}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card>
                  <Card.Header>Image de la salle</Card.Header>
                  <Card.Body>
                    {imagePreview ? (
                      <div className="mb-3 text-center">
                        <Image 
                          src={imagePreview} 
                          alt="Aperçu de l'image" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px', 
                            objectFit: 'contain' 
                          }} 
                          thumbnail
                        />
                      </div>
                    ) : (
                      <div className="text-center mb-3 p-4 bg-light">
                        <i className="bi bi-camera" style={{ fontSize: '3rem' }}></i>
                        <p>Aucune image sélectionnée</p>
                      </div>
                    )}
                    
                    <Form.Group controlId="image">
                      <Form.Label>Sélectionner une image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Form.Text className="text-muted">
                        Format recommandé: JPG, PNG. Taille max: 2MB
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <div className="d-grid gap-2 mt-4">
              <Button 
                variant="primary" 
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Enregistrement en cours...' : isEditMode ? 'Mettre à jour la salle' : 'Créer la salle'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default SalleForm;
