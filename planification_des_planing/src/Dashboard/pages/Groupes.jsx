import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './Groupes.css';

const Groupes = () => {
  const [groupes, setGroupes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentGroupe, setCurrentGroupe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMatieres, setShowMatieres] = useState(false);
  const [selectedGroupeMatieres, setSelectedGroupeMatieres] = useState([]);

  const initialFormState = {
    nom: '',
    semestre: 1,
    parent: null
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchGroupes();
  }, []);

  const fetchGroupes = async () => {
    try {
      setLoading(true);
      const response = await apiServices.groupes.list();
      setGroupes(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des groupes');
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
      if (currentGroupe) {
        await apiServices.groupes.update(currentGroupe.id, formData);
      } else {
        await apiServices.groupes.create(formData);
      }
      await fetchGroupes();
      resetForm();
      setError(null);
    } catch (err) {
      setError(currentGroupe ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentGroupe(null);
    setShowModal(false);
  };

  const handleEdit = (groupe) => {
    setCurrentGroupe(groupe);
    setFormData({
      nom: groupe.nom,
      semestre: groupe.semestre,
      parent: groupe.parent
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        setLoading(true);
        await apiServices.groupes.delete(id);
        await fetchGroupes();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewMatieres = async (groupe) => {
    try {
      setLoading(true);
      const response = await apiServices.groupes.getMatieres(groupe.id);
      setSelectedGroupeMatieres(response.data);
      setShowMatieres(true);
    } catch (err) {
      setError('Erreur lors de la récupération des matières');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroupes = groupes.filter(groupe =>
    groupe.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !groupes.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="groupes-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="groupes-header">
        <h1>Gestion des Groupes</h1>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un groupe
          </button>
        </div>
      </div>

      <div className="groupes-table-container">
        <table className="groupes-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Semestre</th>
              <th>Groupe Parent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroupes.map(groupe => (
              <tr key={groupe.id}>
                <td>{groupe.nom}</td>
                <td>S{groupe.semestre}</td>
                <td>{groupe.parent ? groupe.parent.nom : '-'}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewMatieres(groupe)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faBook} />
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(groupe)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(groupe.id)}
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
              <h2>{currentGroupe ? 'Modifier le groupe' : 'Ajouter un groupe'}</h2>
              <form onSubmit={handleSubmit}>
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
                    value={formData.parent || ''}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Aucun</option>
                    {groupes
                      .filter(g => g.id !== currentGroupe?.id)
                      .map(groupe => (
                        <option key={groupe.id} value={groupe.id}>
                          {groupe.nom}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : currentGroupe ? 'Modifier' : 'Ajouter'}
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

      {showMatieres && (
        <div className="modal-overlay" onClick={() => setShowMatieres(false)}>
          <div className="modal">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Matières du groupe</h2>
              <div className="matieres-list">
                {selectedGroupeMatieres.length > 0 ? (
                  <ul>
                    {selectedGroupeMatieres.map((matiere, index) => (
                      <li key={index}>{matiere}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune matière associée à ce groupe</p>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowMatieres(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groupes; 