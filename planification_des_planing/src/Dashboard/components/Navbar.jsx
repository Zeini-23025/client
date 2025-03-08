import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars,
  faBell, 
  faCog, 
  faEnvelopeOpen, 
  faSearch, 
  faSignOutAlt, 
  faUserShield,
  faUser,
  faWallet,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  // Récupérer les informations de l'utilisateur depuis le localStorage
  const userInfo = {
    name: localStorage.getItem('username') || "Utilisateur",
    email: localStorage.getItem('email') || "",
    role: localStorage.getItem('role') || "Utilisateur",
    is_superuser: localStorage.getItem('is_superuser') === 'true',
    notifications: [
      { id: 1, message: "Nouvelle demande de location", read: false, time: "2 min ago" },
      { id: 2, message: "Paiement reçu", read: false, time: "1 hour ago" },
      { id: 3, message: "Mise à jour du système", read: true, time: "2 hours ago" }
    ]
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // Supprimer les informations de l'utilisateur du localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('is_superuser');
    
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        {/* Menu Toggle Button */}
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Search Bar */}
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="nav-item">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} />
            {userInfo.notifications.some(n => !n.read) && (
              <span className="notification-badge"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-menu">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Tout marquer comme lu</button>
              </div>
              <div className="notifications-list">
                {userInfo.notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="nav-item dropdown">
          <button 
            className="profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            <div className="profile-info">
              <span className="profile-name">{userInfo.name}</span>
              <span className="profile-role">{userInfo.role}</span>
            </div>
          </button>
          <div className={`dropdown-menu ${showUserMenu ? 'show' : ''}`}>
            <div className="user-header">
              <FontAwesomeIcon icon={faUserCircle} className="user-avatar" />
              <div>
                <h4>{userInfo.name}</h4>
                <p>{userInfo.email}</p>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <Link to="/profile" className="dropdown-item">
              <FontAwesomeIcon icon={faUser} />
              Mon Profil
            </Link>
            {userInfo.is_superuser && (
              <Link to="/admin" className="dropdown-item">
                <FontAwesomeIcon icon={faUserShield} />
                Administration
              </Link>
            )}
            <Link to="/settings" className="dropdown-item">
              <FontAwesomeIcon icon={faCog} />
              Paramètres
            </Link>
            <div className="dropdown-divider"></div>
            <button onClick={handleLogout} className="dropdown-item logout-link">
              <FontAwesomeIcon icon={faSignOutAlt} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
