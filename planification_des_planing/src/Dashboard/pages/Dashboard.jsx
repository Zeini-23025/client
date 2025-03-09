import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBook,
  faChalkboardTeacher,
  faCalendarAlt,
  faClipboardList,
  faCog,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

import Matieres from './Matieres';
import Enseignants from './Enseignants';
import DisponibilitesEnseignants from './DisponibilitesEnseignants';
import ChargesHebdo from './ChargesHebdo';

const Dashboard = () => {
  const handleLogout = () => {
    // Logique de déconnexion
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<h1>Tableau de bord</h1>} />
          <Route path="/matieres" element={<Matieres />} />
          <Route path="/enseignants" element={<Enseignants />} />
          <Route path="/disponibilites" element={<DisponibilitesEnseignants />} />
          <Route path="/charges" element={<ChargesHebdo />} />
          <Route path="/settings" element={<h1>Paramètres</h1>} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
