import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./Dashboard/layouts/DashboardLayout";
import Dashboard from "./Dashboard/pages/Dashboard";
import Matieres from './Dashboard/pages/Matieres';

import Enseignants from './Dashboard/pages/Enseignants';
import AjoutEnseignant from './Dashboard/components/Forms/common/AjoutEnseignant';

import DisponibilitesEnseignants from './Dashboard/pages/DisponibilitesEnseignants';
import ChargesHebdo from './Dashboard/pages/ChargesHebdo';
import Groupes from './Dashboard/pages/Groupes';
import Calendrier from './Dashboard/pages/Calendrier';
import AffectationsEnseignant from './Dashboard/pages/AffectationsEnseignant';
import ContraintesHoraires from './Dashboard/pages/ContraintesHoraires';
import EmploiTemps from './Dashboard/pages/EmploiTemps';
import AffectationForm from './Dashboard/components/Forms/common/AffectationForm';
import GroupeForm from './Dashboard/components/Forms/common/GroupeForm';
import MatiereForm from './Dashboard/components/Forms/common/MatiereForm';
import ContrainteForm from './Dashboard/components/Forms/common/ContrainteForm';
const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/matieres" element={<Matieres />} />

                    
                    <Route path="/dashboard/enseignants" element={<Enseignants />} />
                    <Route path="/enseignants/ajouter" element={<AjoutEnseignant />} />

                    <Route path="/dashboard/enseignants" element={<Enseignants />} />
                    <Route path="/dashboard/enseignants/disponibilites" element={<DisponibilitesEnseignants />} />
                    <Route path="/dashboard/charges-hebdo" element={<ChargesHebdo />} />
                    <Route path="/dashboard/groupes" element={<Groupes />} />
                    <Route path="/dashboard/calendrier" element={<Calendrier />} />
                    <Route path="/dashboard/affectations" element={<AffectationsEnseignant />} />
                    <Route path="/dashboard/contraintes" element={<ContraintesHoraires />} />
                    <Route path="/dashboard/emploi-temps" element={<EmploiTemps />} />
                    <Route path="/affectations/add" element={<AffectationForm />} />
                    <Route path="/groupes/add" element={<GroupeForm />} />
                    <Route path="/groupes/edit/:id" element={<GroupeForm />} />
                    <Route path="/groupes/view/:id" element={<GroupeForm />} />
                    <Route path="/groupes/delete/:id" element={<GroupeForm />} />
                    <Route path="/matieres/add" element={<MatiereForm />} />
                    <Route path="/matieres/edit/:id" element={<MatiereForm />} />
                    <Route path="/matieres/view/:id" element={<MatiereForm />} />
                    <Route path="/matieres/delete/:id" element={<MatiereForm />} />
                    <Route path="/contraintes/add" element={<ContrainteForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routing;