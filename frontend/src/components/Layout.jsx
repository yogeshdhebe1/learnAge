import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { authAPI } from '../services/api';
import Sidebar from './Sidebar';
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
      {/* Use the new Sidebar component */}
      <Sidebar role={role} links={links} />

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
    backgroundColor: '#f8f9fa',
  },
  mainWrapper: {
    marginLeft: '280px', // Match new sidebar width
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
    backgroundColor: '#f8f9fa',
  },
};

export default Layout;