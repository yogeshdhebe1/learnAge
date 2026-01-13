import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Attendance', path: '/student/attendance' },
    { label: 'Homework', path: '/student/homework' },
    { label: 'AI Tutor', path: '/student/ai-tutor' },
    { label: 'Class Chat', path: '/student/class-chat' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await studentAPI.getDashboard(user.uid);
          setDashboardData(response.data);
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
      <Layout role="Student" links={studentLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="dashboard-spinner"></div>
          <p style={styles.loadingText}>Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  const attendanceStatus = dashboardData?.today_attendance;
  const isPresent = attendanceStatus === 'Present';

  return (
    <Layout role="Student" links={studentLinks}>
      <div style={styles.container} className="dashboard-container">
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {dashboardData?.name?.split(' ')[0] || 'Student'}! 👋</h1>
            <p style={styles.subtitle}>Here's your learning overview for today</p>
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
          {/* Welcome Card */}
          <div style={styles.card} className="stat-card">
            <div style={styles.cardIconWrapper}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <span style={styles.cardEmoji}>👤</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Student Profile</h3>
              <p style={styles.cardValue}>{dashboardData?.name || 'N/A'}</p>
              <div style={styles.cardFooter}>
                <span style={styles.cardLabel}>
                  <span style={styles.labelIcon}>🎓</span>
                  Class: {dashboardData?.class_id || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div style={styles.card} className="stat-card">
            <div style={styles.cardIconWrapper}>
              <div style={{
                ...styles.cardIcon, 
                background: isPresent 
                  ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}>
                <span style={styles.cardEmoji}>{isPresent ? '✓' : '✗'}</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Today's Attendance</h3>
              <p style={{
                ...styles.cardValue,
                color: isPresent ? '#22c55e' : '#ef4444'
              }}>
                {attendanceStatus || 'Not Marked'}
              </p>
              <div style={styles.cardFooter}>
                <span style={{
                  ...styles.statusBadge,
                  background: isPresent ? '#dcfce7' : '#fee2e2',
                  color: isPresent ? '#16a34a' : '#dc2626'
                }}>
                  {isPresent ? '● Active' : '● Absent'}
                </span>
              </div>
            </div>
          </div>

          {/* Homework Card */}
          <div style={styles.card} className="stat-card">
            <div style={styles.cardIconWrapper}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                <span style={styles.cardEmoji}>📝</span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>Pending Homework</h3>
              <p style={styles.cardValue}>
                {dashboardData?.pending_homework || 0}
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.cardLabel}>
                  {dashboardData?.pending_homework === 0 
                    ? '🎉 All caught up!' 
                    : `${dashboardData?.pending_homework} assignment${dashboardData?.pending_homework > 1 ? 's' : ''} remaining`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <a href="/student/homework" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#fef3c7'}}>
                <span style={{fontSize: '28px'}}>📚</span>
              </div>
              <span style={styles.actionLabel}>View Homework</span>
            </a>
            
            <a href="/student/ai-tutor" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#dbeafe'}}>
                <span style={{fontSize: '28px'}}>🤖</span>
              </div>
              <span style={styles.actionLabel}>Ask AI Tutor</span>
            </a>
            
            <a href="/student/attendance" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#dcfce7'}}>
                <span style={{fontSize: '28px'}}>📅</span>
              </div>
              <span style={styles.actionLabel}>My Attendance</span>
            </a>
            
            <a href="/student/class-chat" style={styles.actionCard} className="action-card">
              <div style={{...styles.actionIcon, background: '#fce7f3'}}>
                <span style={{fontSize: '28px'}}>💬</span>
              </div>
              <span style={styles.actionLabel}>Class Chat</span>
            </a>
          </div>
        </div>

        {/* Motivational Quote */}
        <div style={styles.quoteCard} className="quote-card">
          <span style={styles.quoteIcon}>💡</span>
          <p style={styles.quote}>
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <p style={styles.quoteAuthor}>— Nelson Mandela</p>
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
    borderTop: '4px solid #4F46E5',
    borderRadius: '50%',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '16px 24px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
    gap: '12px',
    border: '2px solid #f3f4f6',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  actionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  quoteCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
  },
  quoteIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '16px',
  },
  quote: {
    fontSize: '18px',
    fontStyle: 'italic',
    margin: '0 0 12px 0',
    lineHeight: '1.6',
    fontWeight: '500',
  },
  quoteAuthor: {
    fontSize: '14px',
    margin: 0,
    opacity: 0.9,
    fontWeight: '600',
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
    border-color: #4F46E5 !important;
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.15) !important;
  }
  
  .quote-card {
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

export default StudentDashboard;