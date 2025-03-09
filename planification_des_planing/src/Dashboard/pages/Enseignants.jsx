import React from "react";
import { useNavigate } from "react-router-dom";
import "./Enseignants.css";

const Enseignants = () => {
    const navigate = useNavigate();

    return (
        <div className="enseignants-page">
            <div className="page-header">
                <h2>Gestion des Enseignants</h2>
                <button 
                    className="add-button" 
                    onClick={() => navigate('/enseignants/ajouter')}
                >
                    Ajouter un enseignant
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Grade</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dupont</td>
                            <td>Jean</td>
                            <td>Professeur</td>
                            <td>jean.dupont@email.com</td>
                            <td>0123456789</td>
                            <td>
                                <button className="edit-btn">Modifier</button>
                                <button className="delete-btn">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Enseignants;