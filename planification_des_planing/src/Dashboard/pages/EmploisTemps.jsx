import React, { useState, useEffect } from 'react';
import './Emplois.css';

const EmploisTemps = () => {
    // États pour les données du modèle
    const [emploiData, setEmploiData] = useState({
        groupe1: {},
        groupe2: {}
    });
    const [selectedGroupe, setSelectedGroupe] = useState('1');
    
    // Structure des données correspondant au modèle Python
    const groupes = {
        '1': ['G1', 'G2', 'TP1', 'TP2', 'CNM', 'RSS', 'DSI_CM', 'DIS_TP1', 'DSI_TP2'],
        '2': ['G2', 'TP3', 'TP4', 'CNM', 'RSS', 'DSI_CM', 'DIS_TP1', 'DSI_TP2']
    };

    // Créneaux horaires définis dans le modèle
    const creneaux = [
        ['8h-9h30', '4'],
        ['9h45-11h15', '5'],
        ['11h30-13h', '6'],
        ['15h-16h30', '8'],
        ['16h45-18h15', '9']
    ];

    // Colonnes Excel correspondant aux jours
    const jours = [
        ['B', 'Lundi'],
        ['C', 'Mardi'],
        ['D', 'Mercredi'],
        ['E', 'Jeudi'],
        ['F', 'Vendredi']
    ];

    useEffect(() => {
        // Fonction pour charger les données depuis les fichiers générés par le modèle
        const loadEmploiData = async () => {
            try {
                const response = await fetch(`/api/emploi/groupe${selectedGroupe}`);
                const data = await response.json();
                setEmploiData(prevData => ({
                    ...prevData,
                    [`groupe${selectedGroupe}`]: data
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };

        loadEmploiData();
    }, [selectedGroupe]);

    // Fonction pour obtenir le contenu d'une cellule
    const getCellContent = (jour, creneau) => {
        const cellKey = `${jour}${creneau}`;
        const currentData = emploiData[`groupe${selectedGroupe}`];
        return currentData?.[cellKey] || '';
    };

    return (
        <div className="emplois-container">
            {/* Sélecteur de groupe */}
            <div className="controls">
                <div className="groupe-selector">
                    <select 
                        value={selectedGroupe}
                        onChange={(e) => setSelectedGroupe(e.target.value)}
                    >
                        <option value="1">Groupe 1</option>
                        <option value="2">Groupe 2</option>
                    </select>
                </div>
                
                <button 
                    className="generate-btn"
                    onClick={() => {/* Fonction pour déclencher la génération */}}
                >
                    Générer l'emploi du temps
                </button>

                <button 
                    className="export-btn"
                    onClick={() => {/* Fonction pour exporter en Excel */}}
                >
                    Exporter en Excel
                </button>
            </div>

            {/* Affichage de l'emploi du temps */}
            <div className="timetable-container">
                <h2>Emploi du temps - Groupe {selectedGroupe}</h2>
                <div className="group-info">
                    Sous-groupes : {groupes[selectedGroupe].join(', ')}
                </div>
                
                <table className="timetable">
                    <thead>
                        <tr>
                            <th>Horaires</th>
                            {jours.map(([_, jour]) => (
                                <th key={jour}>{jour}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {creneaux.map(([horaire, index], i) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="horaire">{horaire}</td>
                                    {jours.map(([col, _]) => (
                                        <td key={`${col}${index}`} className="cours-cell">
                                            {getCellContent(col, index)}
                                        </td>
                                    ))}
                                </tr>
                                {index === '6' && (
                                    <tr className="pause-row">
                                        <td colSpan="6">PAUSE</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Légende */}
            <div className="legend">
                <div className="legend-item">
                    <span className="cm-indicator">CM</span> Cours Magistral
                </div>
                <div className="legend-item">
                    <span className="tp-indicator">TP</span> Travaux Pratiques
                </div>
                <div className="legend-item">
                    <span className="td-indicator">TD</span> Travaux Dirigés
                </div>
            </div>
        </div>
    );
};

export default EmploisTemps;