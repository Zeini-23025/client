import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faFilter,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './ContraintesHoraires.css';

const ContraintesHoraires = () => {
  const [contraintes, setContraintes] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentContrainte, setCurrentContrainte] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    enseignant: '',
    groupe: ''
  });

  const initialFormState = {
    type_contrainte: 'enseignant',
    enseignant_id: '',
    groupe_id: '',
    jour: 'Lundi',
    creneau: 'P1',
    type_indisponibilite: 'recurrente',
    date_specifique: '',
    motif: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const creneaux = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  const types_indisponibilite = [
    { value: 'recurrente', label: 'Récurrente' },
    { value: 'ponctuelle', label: 'Ponctuelle' }
  ];

  useEffect(() => {
    fetchContraintes();
    fetchEnseignants();
    fetchGroupes();
  }, []);

  const fetchContraintes = async () => {
    try {
      setLoading(true);
      const response = await apiServices.contraintesHoraires.list();
      setContraintes(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des contraintes');
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
      if (currentContrainte) {
        await apiServices.contraintesHoraires.update(currentContrainte.id, formData);
      } else {
        await apiServices.contraintesHoraires.create(formData);
      }
      await fetchContraintes();
      resetForm();
      setError(null);
    } catch (err) {
      setError(currentContrainte ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentContrainte(null);
    setShowModal(false);
  };

  const handleEdit = (contrainte) => {
    setCurrentContrainte(contrainte);
    setFormData({
      type_contrainte: contrainte.type_contrainte,
      enseignant_id: contrainte.enseignant?.id || '',
      groupe_id: contrainte.groupe?.id || '',
      jour: contrainte.jour,
      creneau: contrainte.creneau,
      type_indisponibilite: contrainte.type_indisponibilite,
      date_specifique: contrainte.date_specifique || '',
      motif: contrainte.motif || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette contrainte ?')) {
      try {
        setLoading(true);
        await apiServices.contraintesHoraires.delete(id);
        await fetchContraintes();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredContraintes = contraintes.filter(contrainte => {
    const matchesSearch = 
      (contrainte.enseignant?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contrainte.groupe?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrainte.motif.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (filters.type === 'all' || contrainte.type_contrainte === filters.type) &&
      (!filters.enseignant || contrainte.enseignant?.id === filters.enseignant) &&
      (!filters.groupe || contrainte.groupe?.id === filters.groupe);

    return matchesSearch && matchesFilters;
  });

  if (loading && !contraintes.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="contraintes-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="contraintes-header">
        <h1>Gestion des Contraintes Horaires</h1>
        <div className="header-actions">
          <div className="filters">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">Tous les types</option>
              <option value="enseignant">Enseignants</option>
              <option value="groupe">Groupes</option>
            </select>
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
            <FontAwesomeIcon icon={faPlus} /> Ajouter une contrainte
          </button>
        </div>
      </div>

      <div className="contraintes-grid">
        {filteredContraintes.map(contrainte => (
          <div key={contrainte.id} className="contrainte-card">
            <div className="card-header">
              <div className="card-title">
                <FontAwesomeIcon 
                  icon={faClock} 
                  className={`type-icon ${contrainte.type_contrainte}`} 
                />
                <h3>
                  {contrainte.type_contrainte === 'enseignant' 
                    ? contrainte.enseignant.nom 
                    : contrainte.groupe.nom}
                </h3>
              </div>
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEdit(contrainte)}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDelete(contrainte.id)}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            <div className="card-content">
              <p className="contrainte-detail">
                <strong>Jour :</strong> {contrainte.jour}
              </p>
              <p className="contrainte-detail">
                <strong>Créneau :</strong> {contrainte.creneau}
              </p>
              <p className="contrainte-detail">
                <strong>Type :</strong> {contrainte.type_indisponibilite}
              </p>
              {contrainte.date_specifique && (
                <p className="contrainte-detail">
                  <strong>Date :</strong> {new Date(contrainte.date_specifique).toLocaleDateString()}
                </p>
              )}
              {contrainte.motif && (
                <p className="contrainte-detail">
                  <strong>Motif :</strong> {contrainte.motif}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>{currentContrainte ? 'Modifier la contrainte' : 'Ajouter une contrainte'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type de contrainte</label>
                  <select
                    name="type_contrainte"
                    value={formData.type_contrainte}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="enseignant">Enseignant</option>
                    <option value="groupe">Groupe</option>
                  </select>
                </div>
                {formData.type_contrainte === 'enseignant' ? (
                  <div className="form-group">
                    <label>Enseignant</label>
                    <select
                      name="enseignant_id"
                      value={formData.enseignant_id}
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
                ) : (
                  <div className="form-group">
                    <label>Groupe</label>
                    <select
                      name="groupe_id"
                      value={formData.groupe_id}
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
                )}
                <div className="form-group">
                  <label>Type d'indisponibilité</label>
                  <select
                    name="type_indisponibilite"
                    value={formData.type_indisponibilite}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {types_indisponibilite.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.type_indisponibilite === 'ponctuelle' && (
                  <div className="form-group">
                    <label>Date spécifique</label>
                    <input
                      type="date"
                      name="date_specifique"
                      value={formData.date_specifique}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                )}
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
                <div className="form-group">
                  <label>Motif</label>
                  <textarea
                    name="motif"
                    value={formData.motif}
                    onChange={handleInputChange}
                    placeholder="Motif de l'indisponibilité..."
                    rows="3"
                    disabled={loading}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : currentContrainte ? 'Modifier' : 'Ajouter'}
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

export default ContraintesHoraires; 