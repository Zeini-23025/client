import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AjoutEnseignant.css";

const AjoutEnseignant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        grade: '',
        email: '',
        telephone: '',
        specialite: ''
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

                            <div className="form-group">
                                <label>Prénom</label>
                                <input 
                                    type="text" 
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                    required
                                    placeholder="Entrez le prénom"
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

                            <div className="form-group">
                                <label>Téléphone</label>
                                <input 
                                    type="tel" 
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                                    placeholder="0123456789"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Grade</label>
                                <select 
                                    value={formData.grade}
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                    required
                                >
                                    <option value="">Sélectionner un grade</option>
                                    <option value="Professeur">Professeur</option>
                                    <option value="Maître de conférences">Maître de conférences</option>
                                    <option value="Assistant">Assistant</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Spécialité</label>
                                <input 
                                    type="text" 
                                    value={formData.specialite}
                                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                                    placeholder="Entrez la spécialité"
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