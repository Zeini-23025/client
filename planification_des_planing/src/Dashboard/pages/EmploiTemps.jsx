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

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const creneaux = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

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

  const getSeance = (jour, creneau) => {
    return emploiTemps.find(seance => 
      seance.jour === jour && 
      seance.creneau === creneau
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

      {selectedWeek ? (
        <div className="emploi-temps-grid-container">
          <div className="semaine-info">
            Semaine du {formatDate(selectedWeek)}
          </div>
          <div className="emploi-temps-grid">
            <div className="grid-header">
              <div className="grid-cell header"></div>
              {creneaux.map(creneau => (
                <div key={creneau} className="grid-cell header">
                  {creneau}
                </div>
              ))}
            </div>
            {jours.map(jour => (
              <div key={jour} className="grid-row">
                <div className="grid-cell jour">
                  {jour}
                </div>
                {creneaux.map(creneau => {
                  const seance = getSeance(jour, creneau);
                  return (
                    <div 
                      key={`${jour}-${creneau}`} 
                      className={`grid-cell seance ${seance ? 'has-seance' : ''}`}
                    >
                      {seance && (
                        <div className="seance-content">
                          <div className="seance-matiere">
                            {seance.matiere.nom}
                          </div>
                          <div className="seance-enseignant">
                            {seance.enseignant.nom}
                          </div>
                          <div className="seance-groupe">
                            {seance.groupe.nom}
                          </div>
                          <div className="seance-type">
                            {seance.type_cours}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-week-selected">
          <FontAwesomeIcon icon={faCalendarWeek} className="calendar-icon" />
          <p>Veuillez sélectionner une semaine pour afficher l'emploi du temps</p>
        </div>
      )}
    </div>
  );
};

export default EmploiTemps; 