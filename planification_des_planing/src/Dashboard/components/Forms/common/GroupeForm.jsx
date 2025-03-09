import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiServices } from '../../../../api';
import './GroupeForm.css';

const GroupeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupes, setGroupes] = useState([]);

  const initialFormState = {
    nom: '',
    semestre: 1,
    parent: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchGroupes();
    if (id) {
      fetchGroupe();
    }
  }, [id]);

  const fetchGroupes = async () => {
    try {
      setLoading(true);
      const response = await apiServices.groupes.list();
      setGroupes(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupe = async () => {
    try {
      setLoading(true);
      const response = await apiServices.groupes.get(id);
      const groupe = response.data;
      setFormData({
        nom: groupe.nom,
        semestre: groupe.semestre,
        parent: groupe.parent ? groupe.parent.id : ''
      });
    } catch (err) {
      setError('Erreur lors du chargement du groupe');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semestre' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await apiServices.groupes.update(id, formData);
      } else {
        await apiServices.groupes.create(formData);
      }
      navigate('/groupes');
    } catch (err) {
      setError(id ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !groupes.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="groupe-form-container">
      <h2>{id ? 'Modifier le groupe' : 'Ajouter un groupe'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="groupe-form">
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
          <label>Semestre</label>
          <select
            name="semestre"
            value={formData.semestre}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>Semestre {num}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Groupe Parent</label>
          <select
            name="parent"
            value={formData.parent}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">Aucun</option>
            {groupes
              .filter(g => g.id !== id)
              .map(groupe => (
                <option key={groupe.id} value={groupe.id}>
                  {groupe.nom}
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
            onClick={() => navigate('/dashboard/groupes')}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupeForm;
