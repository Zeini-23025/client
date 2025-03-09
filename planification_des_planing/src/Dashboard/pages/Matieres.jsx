import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './Matieres.css';

const Matieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMatiere, setCurrentMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterSemestre, setFilterSemestre] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');

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

  // Charger les matières au chargement du composant
  useEffect(() => {
    fetchMatieres();
  }, []);

  // Fonction pour récupérer les matières
  const fetchMatieres = async () => {
    try {
      setLoading(true);
      const response = await apiServices.matieres.list();
      const emploiTemps = await apiServices.emploiTemps.generer();
      console.log(emploiTemps.data);
      setMatieres(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des matières');
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

      if (currentMatiere) {
        await apiServices.matieres.update(currentMatiere.id, dataToSend);
      } else {
        await apiServices.matieres.create(dataToSend);
      }
      await fetchMatieres();
      resetForm();
      setError(null);
    } catch (err) {
      setError(currentMatiere ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentMatiere(null);
    setShowModal(false);
  };

  const handleEdit = (matiere) => {
    setCurrentMatiere(matiere);
    setFormData({
      code: matiere.code,
      nom: matiere.nom,
      credits: parseInt(matiere.credits),
      semestre: parseInt(matiere.semestre),
      filiere: matiere.filiere
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        setLoading(true);
        await apiServices.matieres.delete(id);
        await fetchMatieres();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredMatieres = matieres.filter(matiere => {
    const matchesSearch = matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matiere.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemestre = !filterSemestre || matiere.semestre === parseInt(filterSemestre);
    const matchesFiliere = !filterFiliere || matiere.filiere === filterFiliere;
    
    return matchesSearch && matchesSemestre && matchesFiliere;
  });

  if (loading && !matieres.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="matieres-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="matieres-header">
        <h1>Gestion des Matières</h1>
        <div className="header-actions">
          <div className="filters">
            <select
              value={filterSemestre}
              onChange={(e) => {
                setFilterSemestre(e.target.value);
                setFilterFiliere('');
              }}
            >
              <option value="">Tous les semestres</option>
              {semestres.map(sem => (
                <option key={sem} value={sem}>Semestre {sem}</option>
              ))}
            </select>
            <select
              value={filterFiliere}
              onChange={(e) => {
                setFilterFiliere(e.target.value);
                setFilterSemestre('');
              }}
            >
              <option value="">Toutes les filières</option>
              {filieres.map(fil => (
                <option key={fil} value={fil}>{fil}</option>
              ))}
            </select>
          </div>
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter une matière
          </button>
        </div>
      </div>

      <div className="matieres-table-container">
        <table className="matieres-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Crédits</th>
              <th>Semestre</th>
              <th>Filière</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatieres.map(matiere => (
              <tr key={matiere.id}>
                <td>{matiere.code}</td>
                <td>{matiere.nom}</td>
                <td>{matiere.credits}</td>
                <td>S{matiere.semestre}</td>
                <td>{matiere.filiere}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(matiere)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(matiere.id)}
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
              <h2>{currentMatiere ? 'Modifier la matière' : 'Ajouter une matière'}</h2>
              <form onSubmit={handleSubmit}>
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
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : currentMatiere ? 'Modifier' : 'Ajouter'}
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

export default Matieres; 