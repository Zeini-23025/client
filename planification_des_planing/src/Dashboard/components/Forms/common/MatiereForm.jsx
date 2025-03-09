import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiServices } from '../../../../api';
import './MatiereForm.css';

const MatiereForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialFormState = {
    code: '',
    nom: '',
    credits: 1,
    semestre: 1,
    filiere: 'TC'
  };

  const [formData, setFormData] = useState(initialFormState);

  const semestres = [1, 2, 3, 4, 5, 6];
  const filieres = ['TC', 'DWM', 'DSI', 'RSS'];

  useEffect(() => {
    if (id) {
      fetchMatiere();
    }
  }, [id]);

  const fetchMatiere = async () => {
    try {
      setLoading(true);
      const response = await apiServices.matieres.get(id);
      const matiere = response.data;
      setFormData({
        code: matiere.code,
        nom: matiere.nom,
        credits: parseInt(matiere.credits),
        semestre: parseInt(matiere.semestre),
        filiere: matiere.filiere
      });
    } catch (err) {
      setError('Erreur lors du chargement de la matière');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'semestre' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        code: formData.code,
        nom: formData.nom,
        credits: parseInt(formData.credits),
        semestre: parseInt(formData.semestre),
        filiere: formData.filiere
      };

      if (id) {
        await apiServices.matieres.update(id, dataToSend);
      } else {
        await apiServices.matieres.create(dataToSend);
      }
      navigate('/matieres');
    } catch (err) {
      setError(id ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="matiere-form-container">
      <h2>{id ? 'Modifier la matière' : 'Ajouter une matière'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="matiere-form">
        <div className="form-group">
          <label>Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
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
        </div>

        <div className="form-group">
          <label>Crédits</label>
          <input
            type="number"
            name="credits"
            value={formData.credits}
            onChange={handleInputChange}
            required
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Semestre</label>
          <select
            name="semestre"
            value={formData.semestre}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            {semestres.map(sem => (
              <option key={sem} value={sem}>
                Semestre {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Filière</label>
          <select
            name="filiere"
            value={formData.filiere}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            {filieres.map(fil => (
              <option key={fil} value={fil}>
                {fil}
              </option>
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
            onClick={() => navigate('/dashboard/matieres')}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatiereForm;
