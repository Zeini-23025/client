import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './DashboardLayout.css';

function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Configuration des largeurs du drawer pour différentes tailles d'écran
  const drawerWidth = {
    lg: 280,
    md: 240,
    sm: 90
  };

  // Générer le chemin de navigation
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    return paths.map((path, index) => {
      const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      return {
        name: formattedPath,
        url: url,
        isLast: index === paths.length - 1
      };
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className={`main-content ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-navbar">
          <Navbar onToggleSidebar={() => setIsOpen(!isOpen)} />
        </div>

        <div className="dashboard-breadcrumb">
          <div className="breadcrumb-content">
            <div className="breadcrumb-path">
              <Link to="/dashboard" className="breadcrumb-item">Accueil</Link>
              {generateBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={crumb.url}>
                  <span className="breadcrumb-separator">»</span>
                  {crumb.isLast ? (
                    <span className="breadcrumb-item active">{crumb.name}</span>
                  ) : (
                    <Link to={crumb.url} className="breadcrumb-item">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-main">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;
