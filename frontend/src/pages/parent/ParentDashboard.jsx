import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { parentAPI } from '../../services/api';

const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const parentLinks = [
    { label: 'Dashboard', path: '/parent/dashboard' },
    { label: 'Attendance', path: '/parent/attendance' },
    { label: 'Homework', path: '/parent/homework' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await parentAPI.getDashboard(user.uid);
          setDashboardData(response.data);
          // Store child_id in localStorage for other pages
          localStorage.setItem('child_id', response.data.child_id);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="dashboard-spinner"></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>No Child Found</h2>
          <p style={styles.errorText}>
            No child is currently linked to this parent account. Please contact the school administrator.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="Parent" links={parentLinks}>
      <div style={styles.container} className="dashboard-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, Parent! 👋</h1>
            <p style={styles.subtitle}>Monitor your child's academic progress</p>
          </div>
          <div style={styles.dateCard}>
            <span style={styles.dateLabel}>TODAY</span>
            <span style={styles.dateValue}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div style={styles.grid}>
          {/* Child Info Card */}
          <div style={styles.card} className="stat-card">
            <div style={styles.cardIconWrapper}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                <span style={styles.cardEmoji}>👶</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Child's Name</h3>
              <p style={styles.cardValue}>{dashboardData.child_name}</p>
              <div style={styles.cardFooter}>
                <span style={styles.cardLabel}>
                  <span style={styles.labelIcon}>✨</span>
                  Your child
                </span>
              </div>
            </div>
          </div>

          {/* Class Card */}
          <div style={styles.card} className="stat-card">
            <div style={styles.cardIconWrapper}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'}}>
                <span style={styles.cardEmoji}>🎓</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Class</h3>
              <p style={styles.cardValue}>{dashboardData.class_id}</p>
              <div style={styles.cardFooter}>
                <span style={{
                  ...styles.statusBadge,
                  background: '#dcfce7',
                  color: '#16a34a'
                }}>
                  ● Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Access</h2>
          <div style={styles.actionsGrid}>
            <a href="/parent/attendance" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#dbeafe'}}>
                <span style={{fontSize: '32px'}}>📋</span>
              </div>
              <div style={styles.actionContent}>
                <span style={styles.actionLabel}>View Attendance</span>
                <span style={styles.actionDescription}>Check attendance records</span>
              </div>
            </a>
            
            <a href="/parent/homework" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#fef3c7'}}>
                <span style={{fontSize: '32px'}}>📚</span>
              </div>
              <div style={styles.actionContent}>
                <span style={styles.actionLabel}>Track Homework</span>
                <span style={styles.actionDescription}>Monitor assignments</span>
              </div>
            </a>
          </div>
        </div>

        {/* Info Card */}
        <div style={styles.infoCard} className="info-card">
          <div style={styles.infoHeader}>
            <div style={styles.infoIconCircle}>
              <span style={styles.infoIcon}>💡</span>
            </div>
            <h3 style={styles.infoTitle}>Parent Features</h3>
          </div>
          <div style={styles.infoContent}>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>✓</span>
              <div>
                <span style={styles.tipTitle}>Real-time Attendance Tracking</span>
                <span style={styles.tipText}>Monitor your child's daily attendance and punctuality</span>
              </div>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>✓</span>
              <div>
                <span style={styles.tipTitle}>Homework Progress</span>
                <span style={styles.tipText}>Stay updated on assignments and completion status</span>
              </div>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>✓</span>
              <div>
                <span style={styles.tipTitle}>Academic Overview</span>
                <span style={styles.tipText}>Get insights into your child's educational journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    animation: 'fadeIn 0.5s ease-out',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #f59e0b',
    borderRadius: '50%',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center',
    padding: '40px',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '12px',
  },
  errorText: {
    fontSize: '16px',
    color: '#6b7280',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  },
  dateCard: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    padding: '16px 24px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  dateLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  dateValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  cardIconWrapper: {
    marginBottom: '16px',
  },
  cardIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  cardEmoji: {
    fontSize: '28px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '800',
    color: '#111827',
  },
  cardFooter: {
    marginTop: '8px',
  },
  cardLabel: {
    fontSize: '14px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    fontSize: '14px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '20px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  actionCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    border: '2px solid #f3f4f6',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  actionIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  actionLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
  },
  actionDescription: {
    fontSize: '13px',
    color: '#6b7280',
  },
  infoCard: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderRadius: '16px',
    padding: '32px',
    color: 'white',
    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  infoIconCircle: {
    width: '48px',
    height: '48px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: '24px',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  tipIcon: {
    fontSize: '20px',
    marginTop: '2px',
    flexShrink: 0,
  },
  tipTitle: {
    fontSize: '16px',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
  },
  tipText: {
    fontSize: '14px',
    lineHeight: '1.6',
    opacity: 0.95,
    display: 'block',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .dashboard-spinner {
    animation: spin 1s linear infinite;
  }
  
  .dashboard-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
  
  .action-card:hover {
    transform: translateY(-4px);
    border-color: #f59e0b !important;
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.15) !important;
  }
  
  .info-card {
    animation: fadeIn 0.5s ease-out 0.3s backwards;
  }
  
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start !important;
    }
    
    .dateCard {
      align-self: stretch;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ParentDashboard;