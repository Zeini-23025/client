import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Matieres.css';

const Matieres = () => {
  const [matieres, setMatieres] = useState([
    {
      id: 1,
      code: 'MAT101',
      nom: 'Mathématiques',
      credits: 4,
      semestres: [1],
      filieres: ['TC', 'DSI']
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [currentMatiere, setCurrentMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    code: '',
    nom: '',
    credits: 0,
    semestres: [],
    filieres: []
  };

  const [formData, setFormData] = useState(initialFormState);

  const semestres = [1, 2, 3, 4, 5, 6];
  const filieres = ['TC', 'DWM', 'DSI', 'RSS'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e, type, value) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMatiere) {
      // Mode édition
      setMatieres(prev => prev.map(matiere => 
        matiere.id === currentMatiere.id 
          ? { ...formData, id: matiere.id }
          : matiere
      ));
    } else {
      // Mode création
      setMatieres(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentMatiere(null);
    setShowModal(false);
  };

  const handleEdit = (matiere) => {
    setCurrentMatiere(matiere);
    setFormData(matiere);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      setMatieres(prev => prev.filter(matiere => matiere.id !== id));
    }
  };

  const filteredMatieres = matieres.filter(matiere =>
    matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matiere.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="matieres-container">
      <div className="matieres-header">
        <h1>Gestion des Matières</h1>
        <div className="header-actions">
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
              <th>Semestres</th>
              <th>Filières</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatieres.map(matiere => (
              <tr key={matiere.id}>
                <td>{matiere.code}</td>
                <td>{matiere.nom}</td>
                <td>{matiere.credits}</td>
                <td>{matiere.semestres.sort().join(', ')}</td>
                <td>{matiere.filieres.join(', ')}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(matiere)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(matiere.id)}
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
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
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
                    />
                  </div>
                  <div className="form-group">
                    <label>Semestres</label>
                    <div className="checkbox-group">
                      {semestres.map(semestre => (
                        <label key={semestre} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.semestres.includes(semestre)}
                            onChange={(e) => handleCheckboxChange(e, 'semestres', semestre)}
                          />
                          S{semestre}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Filières</label>
                    <div className="checkbox-group">
                      {filieres.map(filiere => (
                        <label key={filiere} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.filieres.includes(filiere)}
                            onChange={(e) => handleCheckboxChange(e, 'filieres', filiere)}
                          />
                          {filiere}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="submit-btn">
                      {currentMatiere ? 'Modifier' : 'Ajouter'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={resetForm}>
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Matieres; 