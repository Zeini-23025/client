import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./Dashboard/layouts/DashboardLayout";
import Dashboard from "./Dashboard/pages/Dashboard";
import Matieres from './Dashboard/pages/Matieres';

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/matieres" element={<Matieres />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routing;