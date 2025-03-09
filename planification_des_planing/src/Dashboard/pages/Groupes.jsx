import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './Groupes.css';
import { useNavigate } from 'react-router-dom';

const Groupes = () => {
  const navigate = useNavigate();
  const [groupes, setGroupes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMatieres, setShowMatieres] = useState(false);
  const [selectedGroupeMatieres, setSelectedGroupeMatieres] = useState([]);

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

  const handleEdit = (groupe) => {
    navigate(`/groupes/edit/${groupe.id}`);
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
          <button 
            className="add-btn" 
            onClick={() => navigate('/groupes/add')}
          >
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