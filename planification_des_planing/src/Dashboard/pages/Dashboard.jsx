import { 
  faUsers, 
  faShoppingBag, 
  faBoxes,
  faUserPlus,
  faChartLine,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  // Données pour les cartes statistiques
  const statsData = [
    {
      title: "Total Revenues",
      value: "3,234,567 MRU",
      trend: "+17% de plus que le mois dernier",
      icon: faShoppingBag,
      color: "pink"
    },
    {
      title: "Total Retards",
      value: "700,000 MRU",
      trend: "+8% des revenue de cette mois",
      icon: faBoxes,
      color: "rouge"

    },
    {
      title: "Products Sold",
      value: "5",
      trend: "+2.3% from yesterday",
      icon: faShoppingBag,
      color: "green"
    },
    {
      title: "New Customers",
      value: "8",
      trend: "+0.5% from yesterday",
      icon: faUserPlus,
      color: "purple"
    }
  ];

  // Données pour les graphiques
  const visitorData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Customers',
        data: [200, 300, 250, 180, 220, 280, 300, 260, 220, 190, 180, 150],
        borderColor: '#FF6B6B',
        tension: 0.4
      },
      {
        label: 'Loyal Customers',
        data: [180, 250, 220, 200, 240, 260, 270, 250, 240, 220, 200, 180],
        borderColor: '#4C6FFF',
        tension: 0.4
      },
      {
        label: 'Unique Customers',
        data: [150, 220, 200, 170, 200, 230, 250, 230, 220, 200, 180, 160],
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ]
  };

  const revenueData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Online Sales',
        data: [15, 18, 10, 15, 12, 15, 18],
        backgroundColor: '#4C6FFF'
      },
      {
        label: 'Offline Sales',
        data: [12, 10, 20, 8, 10, 12, 10],
        backgroundColor: '#4CAF50'
      }
    ]
  };

  const satisfactionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Last Month',
        data: [65, 75, 70, 68, 72, 68, 75, 70],
        borderColor: '#4C6FFF',
        tension: 0.4
      },
      {
        label: 'This Month',
        data: [70, 78, 75, 80, 78, 75, 82, 85],
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="dashboard-content">
      {/* Header Section */}
      <div className="dashboard-header">
        <h2>Today's Sales</h2>
        {/* <button className="export-btn">
          <FontAwesomeIcon icon={faDownload} />
          Export
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Visitor Insights */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Visitor Insights</h3>
          </div>
        </div>

        {/* Revenue Charts */}
        <div className="chart-container">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Total Revenue</h3>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Customer Satisfaction</h3>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Target vs Reality</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
