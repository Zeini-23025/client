import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faExclamationTriangle,
  faCalendarXmark
} from '@fortawesome/free-solid-svg-icons';
import { apiServices } from '../../api';
import './Calendrier.css';

const Calendrier = () => {
  const [calendriers, setCalendriers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [currentCalendrier, setCurrentCalendrier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const initialFormState = {
    semaine: '',
    jour: 'Lundi',
    nb_creneaux: 5,
    exception: false,
    creneaux_exceptionnels: []
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCalendriers();
  }, []);

  const fetchCalendriers = async () => {
    try {
      setLoading(true);
      const response = await apiServices.calendrier.list();
      setCalendriers(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du calendrier');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiServices.calendrier.create(formData);
      await fetchCalendriers();
      resetForm();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la création');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExceptionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiServices.calendrier.ajouterException({
        semaine: currentCalendrier.semaine,
        jour: currentCalendrier.jour,
        creneaux_exceptionnels: formData.creneaux_exceptionnels
      });
      await fetchCalendriers();
      setShowExceptionModal(false);
      resetForm();
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'exception');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (calendrier) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette journée ?')) {
      try {
        setLoading(true);
        await apiServices.calendrier.supprimerJour({
          semaine: calendrier.semaine,
          jour: calendrier.jour
        });
        await fetchCalendriers();
        setError(null);
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentCalendrier(null);
    setShowModal(false);
    setShowExceptionModal(false);
  };

  const handleAddException = (calendrier) => {
    setCurrentCalendrier(calendrier);
    setFormData(prev => ({
      ...prev,
      creneaux_exceptionnels: []
    }));
    setShowExceptionModal(true);
  };

  if (loading && !calendriers.length) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="calendrier-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendrier-header">
        <h1>Gestion du Calendrier</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une journée
        </button>
      </div>

      <div className="calendrier-grid">
        {calendriers.map(calendrier => (
          <div key={`${calendrier.semaine}-${calendrier.jour}`} className="calendrier-card">
            <div className="card-header">
              <h3>{calendrier.jour}</h3>
              <p>Semaine du {new Date(calendrier.semaine).toLocaleDateString()}</p>
            </div>
            <div className="card-content">
              <p>Nombre de créneaux : {calendrier.nb_creneaux}</p>
              {calendrier.exception && (
                <div className="exception-tag">
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Exception
                </div>
              )}
            </div>
            <div className="card-actions">
              <button 
                className="action-btn exception"
                onClick={() => handleAddException(calendrier)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faCalendarXmark} />
              </button>
              <button 
                className="action-btn delete"
                onClick={() => handleDelete(calendrier)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Ajouter une journée</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Semaine</label>
                  <input
                    type="date"
                    name="semaine"
                    value={formData.semaine}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Jour</label>
                  <select
                    name="jour"
                    value={formData.jour}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    {jours.map(jour => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre de créneaux</label>
                  <input
                    type="number"
                    name="nb_creneaux"
                    value={formData.nb_creneaux}
                    onChange={handleInputChange}
                    min="1"
                    max="6"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : 'Ajouter'}
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

      {showExceptionModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowExceptionModal(false)}>
          <div className="modal">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Ajouter une exception</h2>
              <form onSubmit={handleExceptionSubmit}>
                <div className="form-group">
                  <label>Créneaux exceptionnels</label>
                  <div className="creneaux-grid">
                    {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((creneau, index) => (
                      <label key={creneau} className="creneau-checkbox">
                        <input
                          type="checkbox"
                          name="creneaux_exceptionnels"
                          value={creneau}
                          checked={formData.creneaux_exceptionnels.includes(creneau)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              creneaux_exceptionnels: e.target.checked
                                ? [...prev.creneaux_exceptionnels, value]
                                : prev.creneaux_exceptionnels.filter(c => c !== value)
                            }));
                          }}
                          disabled={loading}
                        />
                        {creneau}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : 'Ajouter l\'exception'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setShowExceptionModal(false)}
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

export default Calendrier; 