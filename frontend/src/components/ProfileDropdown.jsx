import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ProfileDropdown = ({ userName, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/${userRole}/profile`);
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    navigate(`/${userRole}/edit-profile`);
    setIsOpen(false);
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button 
        style={styles.profileButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.icon}>👤</span>
        <span style={styles.name}>{userName}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <button style={styles.menuItem} onClick={handleViewProfile}>
            <span style={styles.menuIcon}>👁️</span>
            View Profile
          </button>
          <button style={styles.menuItem} onClick={handleEditProfile}>
            <span style={styles.menuIcon}>✏️</span>
            Edit Profile
          </button>
          <div style={styles.divider}></div>
          <button style={styles.menuItem} onClick={handleLogout}>
            <span style={styles.menuIcon}>🚪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50',
    transition: 'all 0.3s',
  },
  icon: {
    fontSize: '18px',
  },
  name: {
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  arrow: {
    fontSize: '10px',
    color: '#7f8c8d',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 1000,
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#2c3e50',
    textAlign: 'left',
    transition: 'background 0.2s',
  },
  menuIcon: {
    fontSize: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ecf0f1',
    margin: '4px 0',
  },
};

export default ProfileDropdown;