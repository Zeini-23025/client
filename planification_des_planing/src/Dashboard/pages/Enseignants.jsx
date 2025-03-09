import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { apiServices } from '../../api';
import './Enseignants.css';

const Enseignants = () => {
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEnseignant, setCurrentEnseignant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const initialFormState = {
    nom: '',
    identifiant: '',
    email: '',
   
  };

  const [formData, setFormData] = useState(initialFormState);

  // Charger les enseignants au chargement du composant
  useEffect(() => {
    fetchEnseignants();
  }, []);

  // Fonction pour récupérer les enseignants
  const fetchEnseignants = async () => {
    try {
      setLoading(true);
      const response = await apiServices.enseignants.list();
      setEnseignants(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des enseignants');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }

    if (!formData.identifiant.trim()) {
      errors.identifiant = 'L\'identifiant est requis';
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (!formData.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis';
    } else if (!/^\d{10}$/.test(formData.telephone)) { // Valider un numéro de 10 chiffres
      errors.telephone = 'Format de téléphone invalide (10 chiffres requis)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        nom: formData.nom,
        identifiant: formData.identifiant,
        email: formData.email,
        
      };

      if (currentEnseignant) {
        await apiServices.enseignants.update(currentEnseignant.id, dataToSend);
      } else {
        await apiServices.enseignants.create(dataToSend);
      }
      await fetchEnseignants();
      resetForm();
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        (currentEnseignant ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentEnseignant(null);
    setShowModal(false);
    setFormErrors({});
  };

  const handleEdit = (enseignant) => {
    setCurrentEnseignant(enseignant);
    setFormData({
      nom: enseignant.nom,
      identifiant: enseignant.identifiant,
      email: enseignant.email,
      
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      try {
        setLoading(true);
        await apiServices.enseignants.delete(id);
        await fetchEnseignants();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredEnseignants = enseignants.filter(enseignant =>
    enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.identifiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    // Ajoutez ce champ
  );

  if (loading && !enseignants.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="enseignants-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="enseignants-header">
        <h1>Gestion des Enseignants</h1>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => navigate("/enseignants/ajouter")}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un enseignant
          </button>
        </div>
      </div>

      <div className="enseignants-table-container">
        <table className="enseignants-table">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom</th>
              <th>Email</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnseignants.map(enseignant => (
              <tr key={enseignant.id}>
                <td>{enseignant.identifiant}</td>
                <td>{enseignant.nom}</td>
                <td>{enseignant.email}</td>
               
                <td className="actions-cell">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(enseignant)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(enseignant.id)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>{currentEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Identifiant</label>
                  <input
                    type="text"
                    name="identifiant"
                    value={formData.identifiant}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  {formErrors.identifiant && (
                    <span className="error-text">{formErrors.identifiant}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  {formErrors.nom && (
                    <span className="error-text">{formErrors.nom}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  {formErrors.email && (
                    <span className="error-text">{formErrors.email}</span>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : currentEnseignant ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enseignants;