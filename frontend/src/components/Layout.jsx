import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { authAPI } from '../services/api';
import ProfileDropdown from './ProfileDropdown';

const Layout = ({ children, role, links }) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await authAPI.verifyToken(token);
        setUserName(response.data.name);
        setUserRole(response.data.role);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>LearnAge</h2>
          <p style={styles.roleLabel}>{role}</p>
        </div>

        <nav style={styles.nav}>
          {links.map((link, index) => (
            <Link key={index} to={link.path} style={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content with Header */}
      <div style={styles.mainWrapper}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>LearnAge Platform</h1>
          </div>
          <div style={styles.headerRight}>
            <ProfileDropdown userName={userName} userRole={userRole} />
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ecf0f1',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarHeader: {
    borderBottom: '1px solid #34495e',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  logo: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  roleLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#95a5a6',
    textTransform: 'capitalize',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  navLink: {
    display: 'block',
    padding: '12px 15px',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    backgroundColor: '#34495e',
    transition: 'background 0.3s',
  },
  mainWrapper: {
    marginLeft: '250px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  content: {
    padding: '30px',
    flex: 1,
  },
};

export default Layout;