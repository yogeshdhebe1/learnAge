import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ role, links }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleColor = (role) => {
    const roleLower = role?.toLowerCase() || '';
    if (roleLower.includes('student')) return '#0ea5e9';
    if (roleLower.includes('teacher')) return '#10b981';
    if (roleLower.includes('parent')) return '#f59e0b';
    return '#0ea5e9';
  };

  const getRoleIcon = (role) => {
    const roleLower = role?.toLowerCase() || '';
    if (roleLower.includes('student')) return '🎓';
    if (roleLower.includes('teacher')) return '👨‍🏫';
    if (roleLower.includes('parent')) return '👨‍👩‍👧‍👦';
    return '👤';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={styles.sidebar} className="sidebar">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <div style={{
            ...styles.logoCircle,
            background: `linear-gradient(135deg, ${getRoleColor(role)}, ${getRoleColor(role)}dd)`
          }}>
            <span style={styles.logoIcon}>🎓</span>
          </div>
          <div>
            <h2 style={styles.title}>LearnAge</h2>
            <div style={{
              ...styles.roleBadge,
              background: `${getRoleColor(role)}20`,
              color: getRoleColor(role),
              border: `1px solid ${getRoleColor(role)}40`
            }}>
              <span style={styles.roleIcon}>{getRoleIcon(role)}</span>
              <span style={styles.roleText}>{role}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav style={styles.nav}>
        {links.map((link, index) => {
          const active = isActive(link.path);
          const hovered = hoveredLink === index;
          
          return (
            <Link
              key={index}
              to={link.path}
              style={{
                ...styles.link,
                background: active 
                  ? `${getRoleColor(role)}15`
                  : hovered 
                    ? '#ffffff'
                    : 'transparent',
                borderLeft: active 
                  ? `3px solid ${getRoleColor(role)}`
                  : '3px solid transparent',
                color: active ? getRoleColor(role) : '#0c4a6e',
                fontWeight: active ? '600' : '500',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: hovered ? '0 2px 8px rgba(14, 165, 233, 0.1)' : 'none',
              }}
              className="sidebar-link"
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span style={styles.linkText}>{link.label}</span>
              {active && (
                <span style={{
                  ...styles.activeIndicator,
                  color: getRoleColor(role)
                }}>
                  ●
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Section */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={{
            ...styles.userAvatar,
            background: `linear-gradient(135deg, ${getRoleColor(role)}, ${getRoleColor(role)}dd)`
          }}>
            <span style={styles.avatarIcon}>{getRoleIcon(role)}</span>
          </div>
          <div style={styles.userDetails}>
            <p style={styles.userName}>{auth.currentUser?.displayName || 'User'}</p>
            <p style={styles.userEmail}>
              {auth.currentUser?.email?.substring(0, 20) || 'user@example.com'}
              {auth.currentUser?.email?.length > 20 ? '...' : ''}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          style={styles.logoutBtn}
          className="logout-button"
        >
          <span style={styles.logoutIcon}>🚪</span>
          <span style={styles.logoutText}>Logout</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)',
    color: '#0c4a6e',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '2px 0 16px rgba(14, 165, 233, 0.15)',
    borderRight: '1px solid #bae6fd',
    zIndex: 1000,
  },
  header: {
    paddingBottom: '24px',
    marginBottom: '24px',
    borderBottom: '1px solid #bae6fd',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
  },
  logoIcon: {
    fontSize: '24px',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#0c4a6e',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  roleIcon: {
    fontSize: '14px',
  },
  roleText: {
    textTransform: 'capitalize',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  link: {
    color: '#0c4a6e',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  linkText: {
    flex: 1,
  },
  activeIndicator: {
    fontSize: '8px',
    marginLeft: '8px',
  },
  footer: {
    paddingTop: '20px',
    marginTop: '20px',
    borderTop: '1px solid #bae6fd',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #bae6fd',
    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarIcon: {
    fontSize: '20px',
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    margin: '0 0 2px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0c4a6e',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userEmail: {
    margin: 0,
    fontSize: '11px',
    color: '#0369a1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    padding: '12px 16px',
    background: '#ffffff',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)',
  },
  logoutIcon: {
    fontSize: '16px',
  },
  logoutText: {
    fontSize: '14px',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .sidebar {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .sidebar-link:hover {
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15) !important;
  }
  
  .logout-button:hover {
    background: #fef2f2 !important;
    border-color: #fca5a5 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(220, 38, 38, 0.15) !important;
  }
  
  .logout-button:active {
    transform: translateY(0);
  }
  
  /* Custom scrollbar for nav */
  .sidebar nav::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar nav::-webkit-scrollbar-track {
    background: rgba(186, 230, 253, 0.3);
    border-radius: 10px;
  }
  
  .sidebar nav::-webkit-scrollbar-thumb {
    background: rgba(14, 165, 233, 0.3);
    border-radius: 10px;
  }
  
  .sidebar nav::-webkit-scrollbar-thumb:hover {
    background: rgba(14, 165, 233, 0.5);
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;