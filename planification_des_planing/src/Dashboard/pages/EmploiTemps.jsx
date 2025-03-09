import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faCalendarWeek,
  faDownload,
  faPrint,
  faSync,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './EmploiTemps.css';

const EmploiTemps = () => {
  const [emploiTemps, setEmploiTemps] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    enseignant: '',
    groupe: '',
    matiere: ''
  });

  // Structure des données correspondant au modèle Python
  const groupesData = {
    '1': ['G1', 'G2', 'TP1', 'TP2', 'CNM', 'RSS', 'DSI_CM', 'DIS_TP1', 'DSI_TP2'],
    '2': ['G2', 'TP3', 'TP4', 'CNM', 'RSS', 'DSI_CM', 'DIS_TP1', 'DSI_TP2']
  };

  // Créneaux horaires
  const creneaux = [
    ['P1', '1'],
    ['P2', '2'],
    ['P3', '3'],
    ['P4', '4'],
    ['P5', '5'],
    ['P6', '6']
  ];

  // Jours de la semaine
  const jours = [
    ['B', 'Lundi'],
    ['C', 'Mardi'],
    ['D', 'Mercredi'],
    ['E', 'Jeudi'],
    ['F', 'Vendredi'],
    ['G', 'Samedi']
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedWeek) {
      fetchEmploiTemps();
    }
  }, [selectedWeek, filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [enseignantsRes, groupesRes, matieresRes] = await Promise.all([
        apiServices.enseignants.list(),
        apiServices.groupes.list(),
        apiServices.matieres.list()
      ]);
      setEnseignants(enseignantsRes.data);
      setGroupes(groupesRes.data);
      setMatieres(matieresRes.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmploiTemps = async () => {
    try {
      setLoading(true);
      const params = {
        semaine: selectedWeek,
        ...filters
      };
      const response = await apiServices.emploiTemps.get(params);
      setEmploiTemps(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement de l\'emploi du temps');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      const params = {
        semaine: selectedWeek,
        ...filters,
        format
      };
      const response = await apiServices.emploiTemps.export(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `emploi-du-temps-${selectedWeek}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'export');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Fonction pour obtenir le contenu d'une cellule avec le style approprié
  const getCellContent = (jour, creneau) => {
    const seance = emploiTemps.find(s => 
      s.jour === jour && 
      s.creneau === creneau
    );

    if (!seance) return null;

    return (
      <div className={`cours-content ${seance.type_cours.toLowerCase()}`}>
        <div className="cours-header">
          <span className={`cours-type ${seance.type_cours.toLowerCase()}`}>
            {seance.type_cours}
          </span>
          <span className="cours-matiere">{seance.matiere.nom}</span>
        </div>
        <div className="cours-details">
          <span className="cours-enseignant">{seance.enseignant.nom}</span>
          <span className="cours-groupe">{seance.groupe.nom}</span>
        </div>
      </div>
    );
  };

  if (loading && !emploiTemps.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="emploi-temps-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="emploi-temps-header">
        <h1>Emploi du Temps</h1>
        <div className="header-actions">
          <div className="week-selector">
            <FontAwesomeIcon icon={faCalendarWeek} className="week-icon" />
            <input
              type="date"
              value={selectedWeek}
              onChange={handleWeekChange}
              className="week-input"
            />
          </div>
          <div className="filters">
            <select
              name="enseignant"
              value={filters.enseignant}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les enseignants</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={enseignant.id}>
                  {enseignant.nom}
                </option>
              ))}
            </select>
            <select
              name="groupe"
              value={filters.groupe}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les groupes</option>
              {groupes.map(groupe => (
                <option key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </option>
              ))}
            </select>
            <select
              name="matiere"
              value={filters.matiere}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Toutes les matières</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="actions">
            <button 
              className="action-btn"
              onClick={() => handleExport('pdf')}
              disabled={loading || !selectedWeek}
              title="Exporter en PDF"
            >
              <FontAwesomeIcon icon={faDownload} /> PDF
            </button>
            <button 
              className="action-btn"
              onClick={() => handleExport('xlsx')}
              disabled={loading || !selectedWeek}
              title="Exporter en Excel"
            >
              <FontAwesomeIcon icon={faDownload} /> Excel
            </button>
            <button 
              className="action-btn"
              onClick={handlePrint}
              disabled={loading || !selectedWeek}
              title="Imprimer"
            >
              <FontAwesomeIcon icon={faPrint} />
            </button>
            <button 
              className="action-btn refresh"
              onClick={fetchEmploiTemps}
              disabled={loading || !selectedWeek}
              title="Rafraîchir"
            >
              <FontAwesomeIcon icon={loading ? faSpinner : faSync} spin={loading} />
            </button>
          </div>
        </div>
      </div>

      <div className="timetable-container">
        <table className="timetable">
          <thead>
            <tr>
              <th>Créneaux</th>
              {jours.map(([_, jour]) => (
                <th key={jour}>{jour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creneaux.map(([periode, index]) => (
              <tr key={index}>
                <td className="periode">{periode}</td>
                {jours.map(([col, _]) => (
                  <td key={`${col}${index}`} className="cours-cell">
                    {getCellContent(col, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="cours-type cm">CM</span>
          <span className="legend-text">Cours Magistral</span>
        </div>
        <div className="legend-item">
          <span className="cours-type tp">TP</span>
          <span className="legend-text">Travaux Pratiques</span>
        </div>
        <div className="legend-item">
          <span className="cours-type td">TD</span>
          <span className="legend-text">Travaux Dirigés</span>
        </div>
      </div>
    </div>
  );
};

export default EmploiTemps; 