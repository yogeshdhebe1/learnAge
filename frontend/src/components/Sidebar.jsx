import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ role, links }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>LearnAge</h2>
        <p style={styles.role}>{role}</p>
      </div>
      
      <nav style={styles.nav}>
        {links.map((link, index) => (
          <Link key={index} to={link.path} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>
      
      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  header: {
    borderBottom: '1px solid #34495e',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
  },
  role: {
    margin: 0,
    fontSize: '14px',
    color: '#95a5a6',
    textTransform: 'capitalize',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px 15px',
    borderRadius: '5px',
    transition: 'background 0.3s',
    backgroundColor: '#34495e',
  },
  logoutBtn: {
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Sidebar;
