import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './AffectationsEnseignant.css';

const AffectationsEnseignant = () => {
  const [affectations, setAffectations] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAffectation, setCurrentAffectation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    enseignant: '',
    matiere: '',
    groupe: ''
  });

  const initialFormState = {
    enseignant: '',
    matiere: '',
    groupe: '',
    type_cours: 'CM',
    jour: 'Lundi',
    creneau: 'P1'
  };

  const [formData, setFormData] = useState(initialFormState);

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const creneaux = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  const types_cours = [
    { value: 'CM', label: 'Cours Magistral' },
    { value: 'TD', label: 'Travaux Dirigés' },
    { value: 'TP', label: 'Travaux Pratiques' }
  ];

  useEffect(() => {
    fetchAffectations();
    fetchEnseignants();
    fetchMatieres();
    fetchGroupes();
  }, []);

  const fetchAffectations = async () => {
    try {
      setLoading(true);
      const response = await apiServices.affectationsEnseignant.list();
      setAffectations(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des affectations');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const response = await apiServices.enseignants.list();
      setEnseignants(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des enseignants:', err);
    }
  };

  const fetchMatieres = async () => {
    try {
      const response = await apiServices.matieres.list();
      setMatieres(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des matières:', err);
    }
  };

  const fetchGroupes = async () => {
    try {
      const response = await apiServices.groupes.list();
      setGroupes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des groupes:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentAffectation) {
        await apiServices.affectationsEnseignant.update(currentAffectation.id, formData);
      } else {
        await apiServices.affectationsEnseignant.create(formData);
      }
      await fetchAffectations();
      resetForm();
      setError(null);
    } catch (err) {
      setError(currentAffectation ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentAffectation(null);
    setShowModal(false);
  };

  const handleEdit = (affectation) => {
    setCurrentAffectation(affectation);
    setFormData({
      enseignant: affectation.enseignant.id,
      matiere: affectation.matiere.id,
      groupe: affectation.groupe.id,
      type_cours: affectation.type_cours,
      jour: affectation.jour,
      creneau: affectation.creneau
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
      try {
        setLoading(true);
        await apiServices.affectationsEnseignant.delete(id);
        await fetchAffectations();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAffectations = affectations.filter(affectation => {
    // Vérifier si les objets et leurs propriétés existent
    const enseignantNom = affectation?.enseignant?.nom || '';
    const matiereNom = affectation?.matiere?.nom || '';
    const groupeNom = affectation?.groupe?.nom || '';
    
    const matchesSearch = searchTerm === '' || (
        enseignantNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matiereNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groupeNom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = (
        (!filters.enseignant || affectation?.enseignant?.id === filters.enseignant) &&
        (!filters.matiere || affectation?.matiere?.id === filters.matiere) &&
        (!filters.groupe || affectation?.groupe?.id === filters.groupe)
    );

    return matchesSearch && matchesFilters;
  });

  if (loading && !affectations.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="affectations-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="affectations-header">
        <h1>Gestion des Affectations</h1>
        <div className="header-actions">
          <div className="filters">
            <select
              name="enseignant"
              value={filters.enseignant}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les enseignants</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={enseignant.id}>
                  {enseignant.nom}
                </option>
              ))}
            </select>
            <select
              name="matiere"
              value={filters.matiere}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </option>
              ))}
            </select>
            <select
              name="groupe"
              value={filters.groupe}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les groupes</option>
              {groupes.map(groupe => (
                <option key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter une affectation
          </button>
        </div>
      </div>

      <div className="affectations-table-container">
        <table className="affectations-table">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Matière</th>
              <th>Groupe</th>
              <th>Type</th>
              <th>Jour</th>
              <th>Créneau</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAffectations.map(affectation => (
              <tr key={affectation.id}>
                <td>{affectation.enseignant.nom}</td>
                <td>{affectation.matiere.nom}</td>
                <td>{affectation.groupe.nom}</td>
                <td>{affectation.type_cours}</td>
                <td>{affectation.jour}</td>
                <td>{affectation.creneau}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(affectation)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(affectation.id)}
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
              <h2>{currentAffectation ? 'Modifier l\'affectation' : 'Ajouter une affectation'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Enseignant</label>
                  <select
                    name="enseignant"
                    value={formData.enseignant}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner un enseignant</option>
                    {enseignants.map(enseignant => (
                      <option key={enseignant.id} value={enseignant.id}>
                        {enseignant.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Matière</label>
                  <select
                    name="matiere"
                    value={formData.matiere}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner une matière</option>
                    {matieres.map(matiere => (
                      <option key={matiere.id} value={matiere.id}>
                        {matiere.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Groupe</label>
                  <select
                    name="groupe"
                    value={formData.groupe}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupes.map(groupe => (
                      <option key={groupe.id} value={groupe.id}>
                        {groupe.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type de cours</label>
                  <select
                    name="type_cours"
                    value={formData.type_cours}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {types_cours.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Jour</label>
                  <select
                    name="jour"
                    value={formData.jour}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {jours.map(jour => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Créneau</label>
                  <select
                    name="creneau"
                    value={formData.creneau}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {creneaux.map(creneau => (
                      <option key={creneau} value={creneau}>{creneau}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : currentAffectation ? 'Modifier' : 'Ajouter'}
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

export default AffectationsEnseignant; 