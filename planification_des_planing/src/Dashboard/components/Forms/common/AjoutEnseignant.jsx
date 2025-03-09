import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiServices } from '../../../../api';
import "./AjoutEnseignant.css";

const AjoutEnseignant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enseignants, setEnseignants] = useState([]);
    
    const [formData, setFormData] = useState({
        id: '',
        id: '',
        nom: '',
        
        email: '',
        
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique d'ajout
        navigate('/enseignants');
    };

    return (
        <div className="ajout-enseignant-page">
            <div className="form-container">
                <div className="form-header">
                    <h2>Ajouter un enseignant</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nom</label>
                                <input 
                                    type="text" 
                                    value={formData.nom}
                                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                    required
                                    placeholder="Entrez le nom"
                                />
                            </div>

                            
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    placeholder="exemple@email.com"
                                />
                            </div>

                            
                        </div>

                        
                    </div>

                    <div className="form-footer">
                        <button 
                             type="button" 
                            className="cancel-btn"
                            onClick={() => navigate('/dashboard/enseignants')}
                        >
                            Annuler
                        </button>
                        <button type="submit" className="submit-btn">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjoutEnseignant;