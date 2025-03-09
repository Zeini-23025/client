import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiServices } from '../../../../api';
import './AffectationForm.css';

const AffectationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [groupes, setGroupes] = useState([]);

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
    fetchInitialData();
    if (id) {
      fetchAffectation();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [enseignantsRes, matieresRes, groupesRes] = await Promise.all([
        apiServices.enseignants.list(),
        apiServices.matieres.list(),
        apiServices.groupes.list()
      ]);
      setEnseignants(enseignantsRes.data);
      setMatieres(matieresRes.data);
      setGroupes(groupesRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAffectation = async () => {
    try {
      setLoading(true);
      const response = await apiServices.affectationsEnseignant.get(id);
      const affectation = response.data;
      setFormData({
        enseignant: affectation.enseignant.id,
        matiere: affectation.matiere.id,
        groupe: affectation.groupe.id,
        type_cours: affectation.type_cours,
        jour: affectation.jour,
        creneau: affectation.creneau
      });
    } catch (err) {
      setError('Erreur lors du chargement de l\'affectation');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await apiServices.affectationsEnseignant.update(id, formData);
      } else {
        await apiServices.affectationsEnseignant.create(formData);
      }
      navigate('/affectations');
    } catch (err) {
      setError(id ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !enseignants.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="affectation-form-container">
      <h2>{id ? 'Modifier l\'affectation' : 'Ajouter une affectation'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="affectation-form">
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

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : id ? 'Modifier' : 'Ajouter'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/dashboard/affectations')}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AffectationForm;
