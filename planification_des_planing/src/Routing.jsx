import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./Dashboard/layouts/DashboardLayout";
import Dashboard from "./Dashboard/pages/Dashboard";
import Matieres from './Dashboard/pages/Matieres';
import Enseignants from './Dashboard/pages/Enseignants';
import DisponibilitesEnseignants from './Dashboard/pages/DisponibilitesEnseignants';
import ChargesHebdo from './Dashboard/pages/ChargesHebdo';
import Groupes from './Dashboard/pages/Groupes';
import Calendrier from './Dashboard/pages/Calendrier';
import AffectationsEnseignant from './Dashboard/pages/AffectationsEnseignant';
import ContraintesHoraires from './Dashboard/pages/ContraintesHoraires';
import EmploiTemps from './Dashboard/pages/EmploiTemps';

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/matieres" element={<Matieres />} />
                    <Route path="/dashboard/enseignants" element={<Enseignants />} />
                    <Route path="/dashboard/enseignants/disponibilites" element={<DisponibilitesEnseignants />} />
                    <Route path="/dashboard/charges-hebdo" element={<ChargesHebdo />} />
                    <Route path="/dashboard/groupes" element={<Groupes />} />
                    <Route path="/dashboard/calendrier" element={<Calendrier />} />
                    <Route path="/dashboard/affectations" element={<AffectationsEnseignant />} />
                    <Route path="/dashboard/contraintes" element={<ContraintesHoraires />} />
                    <Route path="/dashboard/emploi-temps" element={<EmploiTemps />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routing;