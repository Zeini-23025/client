import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCopy, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './DisponibilitesEnseignants.css';

const DisponibilitesEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [disponibilites, setDisponibilites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5"
  ];

  const jours = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
  ];

  useEffect(() => {
    fetchEnseignants();
  }, []);

  useEffect(() => {
    if (selectedEnseignant && selectedWeek) {
      fetchDisponibilites();
    }
  }, [selectedEnseignant, selectedWeek]);

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

  const fetchEnseignants = async () => {
    try {
      setLoading(true);
      const response = await apiServices.enseignants.list();
      setEnseignants(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des enseignants');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisponibilites = async () => {
    try {
      setLoading(true);
      const weekDate = getWeekDate(selectedWeek.year, selectedWeek.week);
      const response = await apiServices.disponibilites.list();
      const filteredDispos = response.data.filter(dispo => 
        dispo.enseignant === selectedEnseignant.id &&
        dispo.semaine === weekDate
      );
      setDisponibilites(filteredDispos);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des disponibilités');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisponibiliteChange = async (jour, creneau) => {
    try {
      const weekDate = getWeekDate(selectedWeek.year, selectedWeek.week);
      const existingDispo = disponibilites.find(
        d => d.jour === jour && d.creneau === creneau
      );

      if (existingDispo) {
        await apiServices.disponibilites.delete(existingDispo.id);
        setDisponibilites(prev => prev.filter(d => d.id !== existingDispo.id));
      } else {
        const newDispo = {
          enseignant: selectedEnseignant.id,
          jour: jour,
          creneau: creneau,
          semaine: weekDate
        };
        const response = await apiServices.disponibilites.create(newDispo);
        setDisponibilites(prev => [...prev, response.data]);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification des disponibilités');
      console.error('Erreur:', err);
    }
  };

  const copyFromPreviousWeek = async () => {
    try {
      setLoading(true);
      const response = await apiServices.disponibilites.reconduire({
        enseignant: selectedEnseignant.id,
        semaine_actuelle: getWeekDate(selectedWeek.year, selectedWeek.week)
      });
      await fetchDisponibilites();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la copie des disponibilités');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDisponible = (jour, creneau) => {
    return disponibilites.some(d => d.jour === jour && d.creneau === creneau);
  };

  const filteredEnseignants = enseignants.filter(enseignant =>
    enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="disponibilites-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="disponibilites-header">
        <h1>Gestion des Disponibilités</h1>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
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
        </div>
      </div>

      <div className="disponibilites-content">
        <div className="enseignants-list">
          {filteredEnseignants.map(enseignant => (
            <div
              key={enseignant.id}
              className={`enseignant-item ${selectedEnseignant?.id === enseignant.id ? 'selected' : ''}`}
              onClick={() => setSelectedEnseignant(enseignant)}
            >
              {enseignant.nom}
            </div>
          ))}
        </div>

        {selectedEnseignant && (
          <div className="calendar-container">
            <div className="calendar-header">
              <h2>Disponibilités de {selectedEnseignant.nom}</h2>
              <div className="calendar-actions">
                <button className="action-btn" onClick={copyFromPreviousWeek}>
                  <FontAwesomeIcon icon={faCopy} /> Copier semaine précédente
                </button>
              </div>
            </div>

            <table className="calendar-table">
              <thead>
                <tr>
                  <th>Horaire</th>
                  {jours.map(jour => (
                    <th key={jour}>{jour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(creneau => (
                  <tr key={creneau}>
                    <td className="time-slot">{creneau}</td>
                    {jours.map(jour => (
                      <td
                        key={`${jour}-${creneau}`}
                        className={`calendar-cell ${isDisponible(jour, creneau) ? 'available' : ''}`}
                        onClick={() => handleDisponibiliteChange(jour, creneau)}
                      >
                        {isDisponible(jour, creneau) ? '✓' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisponibilitesEnseignants; 