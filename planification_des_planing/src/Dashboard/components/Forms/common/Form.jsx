import { useNavigate } from 'react-router-dom';
import { apiServices } from '../../../../api';
import React, { useState, useEffect } from 'react';
import './Forms.css';
const Form = ({ fields, actions, endpoint, id, title }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialiser formData avec les champs vides
    const initialData = {};
    fields.forEach(field => {
      initialData[field.field] = '';
    });
    setFormData(initialData);

    // Si on a un ID, charger les données existantes
    if (id) {
      const fetchData = async () => {
        try {
          const response = await apiServices[endpoint].get(id);
          setFormData(response.data.data[endpoint.slice(0, -1)]);
        } catch (err) {
          setError(`Erreur lors du chargement des données`);
        }
      };
      fetchData();
    }
  }, [id, fields, endpoint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await apiServices[endpoint].update(id, formData);
      } else {
        await apiServices[endpoint].create(formData);
      }
      navigate(`/dashboard/gestion-des-tables/${endpoint}`);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Modifier' : 'Créer'} {title}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        {fields.map((field) => (
          <div className="form-group" key={field.field}>
            <label htmlFor={field.field}>{field.label}</label>
            {field.type === "select" ? (
              <select
                id={field.field}
                name={field.field}
                value={formData[field.field] || ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner {field.label}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.field}
                name={field.field}
                value={formData[field.field] || ''}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate(`/dashboard/gestion-des-tables/${endpoint}`)}
            className="button-secondary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : (id ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
