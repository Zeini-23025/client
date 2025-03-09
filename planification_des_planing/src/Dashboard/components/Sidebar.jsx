import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBook,
  faClipboardList,
  faCalendarAlt,
  faChalkboardTeacher,
  faSearch,
  faUsers,
  faClock,
  faListCheck,
  faTableCells,
  faBars,
  faCode,
  faMoneyBillTransfer,
  

} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import './Sidebar.css';

function Sidebar({ isOpen, setIsOpen }) {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleSubmenuClick = (index, e) => {
    e.preventDefault();
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const menuItems = [
    {
      icon: faHome,
      text: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: faBook,
      text: 'Gestion des matières',
      path: '/dashboard/matieres',
    },
    
    // { 
    //   icon: faCalendarAlt,
    //   text: 'Gestion des enseignants',
    //   path: '/dashboard/enseignants',
    // },  
    // { icon: faCog, text: 'Setting', path: '/dashboard/settings' },
    {
      icon: faChalkboardTeacher,
      text: 'Gestion des enseignants',
      path: '/dashboard/enseignants',
      subItems: [
        { text: 'Enseignants', path: '/dashboard/enseignants' },
        { text: 'Disponibilités', path: '/dashboard/enseignants/disponibilites', icon: faCalendarAlt },
      ],
    },
    { text: 'Charges hebdomadaires', path: '/dashboard/charges-hebdo', icon: faClipboardList },
    {
      icon: faUsers,
      text: 'Gestion des groupes',
      path: '/dashboard/groupes',
    },
    {
      icon: faCalendarAlt,
      text: 'Calendrier',
      path: '/dashboard/calendrier',
    },
    {
      icon: faListCheck,
      text: 'Affectations',
      path: '/dashboard/affectations',
    },
    {
      icon: faClock,
      text: 'Contraintes horaires',
      path: '/dashboard/contraintes',
    },
    {
      icon: faTableCells,
      text: 'Emploi du temps',
      path: '/dashboard/emploi-temps',
    },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-details">
        <div className={`logo-content ${!isOpen ? 'hidden' : ''}`}>
          <span className="logo-name">Planning</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-btn"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="nav-list-container">
        <ul className="nav-list">
          <li className="search-box">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder={isOpen ? "Search..." : ""}
                className="search-input"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="search-icon"
              />
            </div>
          </li>

          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                to={item.path}
                className="nav-link"
                onClick={(e) => item.subItems && handleSubmenuClick(index, e)}
              >
                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                <span className={`nav-text ${!isOpen && 'hidden'}`}>
                  {item.text}
                </span>
                {!isOpen && <span className="tooltip">{item.text}</span>}
              </Link>
              {item.subItems && (
                <ul className={`sub-menu ${activeSubmenu === index ? 'active' : ''}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link to={subItem.path} className="sub-link">
                        {subItem.icon && <FontAwesomeIcon icon={subItem.icon} className="sub-icon" />}
                        {subItem.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;