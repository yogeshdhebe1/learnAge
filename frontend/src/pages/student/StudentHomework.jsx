import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { studentAPI } from '../../services/api';

const StudentHomework = () => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Attendance', path: '/student/attendance' },
    { label: 'Homework', path: '/student/homework' },
    { label: 'AI Tutor', path: '/student/ai-tutor' },
    { label: 'Class Chat', path: '/student/class-chat' },
  ];

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const response = await studentAPI.getHomework(user.uid);
        setHomework(response.data.homework);
      }
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (homeworkId) => {
    try {
      const user = auth.currentUser;
      await studentAPI.submitHomework(homeworkId, user.uid);
      // Refresh homework list
      fetchHomework();
    } catch (error) {
      console.error('Error submitting homework:', error);
      alert('Failed to submit homework');
    }
  };

  // Calculate statistics
  const totalHomework = homework.length;
  const submittedHomework = homework.filter(hw => hw.submitted).length;
  const pendingHomework = totalHomework - submittedHomework;
  const completionRate = totalHomework > 0 ? Math.round((submittedHomework / totalHomework) * 100) : 0;

  if (loading) {
    return (
      <Layout role="Student" links={studentLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="homework-spinner"></div>
          <p style={styles.loadingText}>Loading homework assignments...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="Student" links={studentLinks}>
      <div style={styles.container} className="homework-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📚 My Homework</h1>
            <p style={styles.subtitle}>Track and submit your assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        {homework.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <span style={styles.statEmoji}>📊</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Completion Rate</p>
                <p style={styles.statValue}>{completionRate}%</p>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${completionRate}%`,
                    background: completionRate >= 75 
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                      : 'linear-gradient(90deg, #f59e0b, #d97706)'
                  }}></div>
                </div>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
                  <span style={styles.statEmoji}>✓</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Submitted</p>
                <p style={styles.statValue}>{submittedHomework}</p>
                <p style={styles.statSubtext}>Keep going!</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <span style={styles.statEmoji}>⏰</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Pending</p>
                <p style={styles.statValue}>{pendingHomework}</p>
                <p style={styles.statSubtext}>To complete</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'}}>
                  <span style={styles.statEmoji}>📝</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Total</p>
                <p style={styles.statValue}>{totalHomework}</p>
                <p style={styles.statSubtext}>Assignments</p>
              </div>
            </div>
          </div>
        )}

        {/* Homework Grid */}
        {homework.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎉</div>
            <h3 style={styles.emptyTitle}>No Homework Yet!</h3>
            <p style={styles.emptyText}>You don't have any homework assignments right now. Check back later or ask your teacher!</p>
          </div>
        ) : (
          <div style={styles.homeworkSection}>
            <div style={styles.sectionTitleRow}>
              <h2 style={styles.sectionTitle}>All Assignments</h2>
              <span style={styles.recordCount}>{homework.length} total</span>
            </div>
            
            <div style={styles.grid}>
              {homework.map((hw) => (
                <div 
                  key={hw.id} 
                  style={{
                    ...styles.card,
                    borderLeft: hw.submitted 
                      ? '4px solid #22c55e' 
                      : '4px solid #f59e0b'
                  }} 
                  className="homework-card"
                >
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <span style={styles.subjectBadge}>
                      <span style={styles.subjectIcon}>📖</span>
                      {hw.subject}
                    </span>
                    {hw.submitted ? (
                      <span style={styles.submittedTag}>
                        <span style={styles.tagIcon}>✓</span>
                        Done
                      </span>
                    ) : (
                      <span style={styles.pendingTag}>
                        <span style={styles.tagIcon}>⏰</span>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Due Date */}
                  <div style={styles.dueDateWrapper}>
                    <span style={styles.dueDateIcon}>📅</span>
                    <span style={styles.dueDate}>Due: {hw.due_date}</span>
                  </div>

                  {/* Description */}
                  {hw.description && (
                    <div style={styles.descriptionWrapper}>
                      <p style={styles.description}>{hw.description}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div style={styles.cardFooter}>
                    {hw.submitted ? (
                      <div style={styles.submittedBadge}>
                        <span style={styles.badgeIcon}>✓</span>
                        <span style={styles.badgeText}>Submitted Successfully</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubmit(hw.id)}
                        style={styles.submitBtn}
                        className="submit-button"
                      >
                        Mark as Submitted
                        <span style={styles.buttonArrow}>→</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    marginBottom: '32px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s ease',
  },
  statIconWrapper: {
    marginBottom: '16px',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  statEmoji: {
    fontSize: '28px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: 0,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
  },
  statSubtext: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: 0,
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#f3f4f6',
    borderRadius: '999px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.6s ease',
  },
  homeworkSection: {
    marginTop: '40px',
  },
  sectionTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  recordCount: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
    padding: '6px 12px',
    background: '#f3f4f6',
    borderRadius: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  subjectBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
  },
  subjectIcon: {
    fontSize: '16px',
  },
  submittedTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: '#dcfce7',
    color: '#16a34a',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #86efac',
  },
  pendingTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: '#fef3c7',
    color: '#d97706',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #fcd34d',
  },
  tagIcon: {
    fontSize: '12px',
  },
  dueDateWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '10px',
  },
  dueDateIcon: {
    fontSize: '18px',
  },
  dueDate: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '600',
  },
  descriptionWrapper: {
    paddingTop: '8px',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6',
  },
  submittedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #86efac',
  },
  badgeIcon: {
    fontSize: '16px',
  },
  badgeText: {
    flex: 1,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
  },
  buttonArrow: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
  },
  emptyState: {
    background: 'white',
    borderRadius: '16px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto',
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
  
  .homework-spinner {
    animation: spin 1s linear infinite;
  }
  
  .homework-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
  
  .homework-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
  
  .submit-button:hover {
    background-color: #4338CA !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35) !important;
  }
  
  .submit-button:hover .buttonArrow {
    transform: translateX(4px);
  }
  
  .submit-button:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    .statsGrid {
      grid-template-columns: 1fr !important;
    }
    
    .grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StudentHomework;