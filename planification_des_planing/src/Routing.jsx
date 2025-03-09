import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./Dashboard/layouts/DashboardLayout";
import Dashboard from "./Dashboard/pages/Dashboard";
import Matieres from './Dashboard/pages/Matieres';
import EmploisTemps from './Dashboard/pages/EmploisTemps';
import Enseignants from './Dashboard/pages/Enseignants';
import AjoutEnseignant from './Dashboard/components/Forms/common/AjoutEnseignant';

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/matieres" element={<Matieres />} />
                    <Route path="/dashboard/emplois" element={<EmploisTemps />} />
                    <Route path="/dashboard/enseignants" element={<Enseignants />} />
                    <Route path="/enseignants/ajouter" element={<AjoutEnseignant />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routing;