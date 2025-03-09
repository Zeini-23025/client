import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy, faSave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './ChargesHebdo.css';

const ChargesHebdo = () => {
  const [matieres, setMatieres] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [charges, setCharges] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disponibiliteChanges, setDisponibiliteChanges] = useState([]);

  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return {
      year: now.getFullYear(),
      week: weekNumber
    };
  }

  useEffect(() => {
    fetchMatieres();
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      fetchCharges();
      fetchDisponibiliteChanges();
    }
  }, [selectedWeek]);

  const fetchMatieres = async () => {
    try {
      setLoading(true);
      const response = await apiServices.matieres.list();
      setMatieres(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des matières');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const response = await apiServices.charges.getByWeek(
        selectedWeek.year,
        selectedWeek.week
      );
      setCharges(response.data || {});
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des charges');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisponibiliteChanges = async () => {
    try {
      const response = await apiServices.disponibilites.getChangesForWeek(
        selectedWeek.year,
        selectedWeek.week
      );
      setDisponibiliteChanges(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des changements de disponibilité:', err);
    }
  };

  const handleChargeChange = (matiereId, type, value) => {
    setCharges(prev => ({
      ...prev,
      [matiereId]: {
        ...prev[matiereId],
        [type]: parseInt(value) || 0
      }
    }));
  };

  const copyFromPreviousWeek = async () => {
    try {
      setLoading(true);
      const prevWeek = selectedWeek.week - 1;
      const year = selectedWeek.year;
      const response = await apiServices.charges.getByWeek(year, prevWeek);
      setCharges(response.data || {});
      setError(null);
    } catch (err) {
      setError('Erreur lors de la copie des charges');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCharges = async () => {
    try {
      setLoading(true);
      await apiServices.charges.save(
        selectedWeek.year,
        selectedWeek.week,
        charges
      );
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des charges');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatieres = matieres.filter(matiere =>
    matiere.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="charges-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="charges-header">
        <h1>Gestion des Charges Hebdomadaires</h1>
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
          <div className="week-selector">
            <input
              type="week"
              value={`${selectedWeek.year}-W${String(selectedWeek.week).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, week] = e.target.value.split('-W');
                setSelectedWeek({ year: parseInt(year), week: parseInt(week) });
              }}
            />
          </div>
          <button className="action-btn" onClick={copyFromPreviousWeek}>
            <FontAwesomeIcon icon={faCopy} /> Copier semaine précédente
          </button>
          <button className="action-btn save" onClick={saveCharges}>
            <FontAwesomeIcon icon={faSave} /> Enregistrer
          </button>
        </div>
      </div>

      {disponibiliteChanges.length > 0 && (
        <div className="disponibilite-alerts">
          <h3>
            <FontAwesomeIcon icon={faExclamationTriangle} /> Changements de disponibilité
          </h3>
          <ul>
            {disponibiliteChanges.map((change, index) => (
              <li key={index}>
                {change.enseignant_nom} - {change.jour} {change.creneau}:
                {change.status === 'removed' ? ' N\'est plus disponible' : ' Est maintenant disponible'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="charges-table-container">
        <table className="charges-table">
          <thead>
            <tr>
              <th>Matière</th>
              <th>Enseignant</th>
              <th>CM</th>
              <th>TD</th>
              <th>TP</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatieres.map(matiere => (
              <tr key={matiere.id}>
                <td>{matiere.nom}</td>
                <td>{matiere.enseignant_nom}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={charges[matiere.id]?.cm || 0}
                    onChange={(e) => handleChargeChange(matiere.id, 'cm', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={charges[matiere.id]?.td || 0}
                    onChange={(e) => handleChargeChange(matiere.id, 'td', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={charges[matiere.id]?.tp || 0}
                    onChange={(e) => handleChargeChange(matiere.id, 'tp', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChargesHebdo; 