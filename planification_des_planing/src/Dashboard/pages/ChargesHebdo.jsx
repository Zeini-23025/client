import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy, faSave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './ChargesHebdo.css';

const ChargesHebdo = () => {
  const [matieres, setMatieres] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [charges, setCharges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatieres();
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      fetchCharges();
    }
  }, [selectedWeek]);

  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return {
      year: now.getFullYear(),
      week: weekNumber
    };
  }

  function getWeekDate(year, week) {
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    return date.toISOString().split('T')[0];
  }

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
      const weekDate = getWeekDate(selectedWeek.year, selectedWeek.week);
      const response = await apiServices.chargesHebdo.list();
      const filteredCharges = response.data.filter(charge => 
        charge.semaine === weekDate
      );
      setCharges(filteredCharges);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des charges');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChargeChange = async (matiereId, type, value) => {
    try {
      const weekDate = getWeekDate(selectedWeek.year, selectedWeek.week);
      const existingCharge = charges.find(c => c.matiere === matiereId);
      const newValue = parseInt(value) || 0;

      if (existingCharge) {
        const updatedCharge = {
          ...existingCharge,
          [`heures_${type.toLowerCase()}`]: newValue
        };
        const response = await apiServices.chargesHebdo.update(existingCharge.id, updatedCharge);
        setCharges(prev => prev.map(c => c.id === existingCharge.id ? response.data : c));
      } else {
        const newCharge = {
          matiere: matiereId,
          semaine: weekDate,
          heures_cm: type === 'cm' ? newValue : 0,
          heures_td: type === 'td' ? newValue : 0,
          heures_tp: type === 'tp' ? newValue : 0
        };
        const response = await apiServices.chargesHebdo.create(newCharge);
        setCharges(prev => [...prev, response.data]);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification des charges');
      console.error('Erreur:', err);
    }
  };

  const copyFromPreviousWeek = async () => {
    try {
      setLoading(true);
      await apiServices.chargesHebdo.copyPreviousWeek(
        selectedWeek.year,
        selectedWeek.week
      );
      await fetchCharges();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la copie des charges');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChargeValue = (matiereId, type) => {
    const charge = charges.find(c => c.matiere === matiereId);
    return charge ? charge[`heures_${type.toLowerCase()}`] : 0;
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
        </div>
      </div>

      <div className="charges-table-container">
        <table className="charges-table">
          <thead>
            <tr>
              <th>Matière</th>
              <th>CM</th>
              <th>TD</th>
              <th>TP</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatieres.map(matiere => (
              <tr key={matiere.id}>
                <td>{matiere.nom}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={getChargeValue(matiere.id, 'cm')}
                    onChange={(e) => handleChargeChange(matiere.id, 'cm', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={getChargeValue(matiere.id, 'td')}
                    onChange={(e) => handleChargeChange(matiere.id, 'td', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={getChargeValue(matiere.id, 'tp')}
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
