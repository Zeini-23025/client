import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiServices } from '../../../../api';
import './ContrainteForm.css';

const ContrainteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enseignants, setEnseignants] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const initialFormState = {
    type_contrainte: 'enseignant',
    enseignant_id: '',
    groupe_id: '',
    jour: 'Lundi',
    creneau: 'P1',
    type_indisponibilite: 'permanente',
    date_specifique: '',
    motif: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const creneaux = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  const types_indisponibilite = [
    { value: 'permanente', label: 'Permanente' },
    { value: 'ponctuelle', label: 'Ponctuelle' }
  ];

  useEffect(() => {
    fetchInitialData();
    if (id) {
      fetchContrainte();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [enseignantsRes, groupesRes] = await Promise.all([
        apiServices.enseignants.list(),
        apiServices.groupes.list()
      ]);
      setEnseignants(enseignantsRes.data);
      setGroupes(groupesRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContrainte = async () => {
    try {
      setLoading(true);
      const response = await apiServices.contraintesHoraires.get(id);
      const contrainte = response.data;
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
    } catch (err) {
      setError('Erreur lors du chargement de la contrainte');
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
        await apiServices.contraintesHoraires.update(id, formData);
      } else {
        await apiServices.contraintesHoraires.create(formData);
      }
      navigate('/contraintes');
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
    <div className="contrainte-form-container">
      <h2>{id ? 'Modifier la contrainte' : 'Ajouter une contrainte'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="contrainte-form">
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

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : id ? 'Modifier' : 'Ajouter'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/dashboard/contraintes')}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContrainteForm;
