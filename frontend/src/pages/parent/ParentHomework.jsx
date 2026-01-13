import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { parentAPI } from '../../services/api';

const ParentHomework = () => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  const parentLinks = [
    { label: 'Dashboard', path: '/parent/dashboard' },
    { label: 'Attendance', path: '/parent/attendance' },
    { label: 'Homework', path: '/parent/homework' },
  ];

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const childId = localStorage.getItem('child_id');
        if (childId) {
          const response = await parentAPI.getChildHomework(childId);
          setHomework(response.data.homework);
        }
      } catch (error) {
        console.error('Error fetching homework:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, []);

  // Calculate statistics
  const totalHomework = homework.length;
  const submittedHomework = homework.filter(hw => hw.submitted).length;
  const pendingHomework = totalHomework - submittedHomework;
  const completionRate = totalHomework > 0 ? Math.round((submittedHomework / totalHomework) * 100) : 0;

  if (loading) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="homework-spinner"></div>
          <p style={styles.loadingText}>Loading homework...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="Parent" links={parentLinks}>
      <div style={styles.container} className="homework-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📚 Child's Homework</h1>
            <p style={styles.subtitle}>Monitor your child's assignments and progress</p>
          </div>
        </div>

        {/* Statistics Cards */}
        {homework.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <span style={styles.statEmoji}>📊</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Completion Rate</p>
                <p style={styles.statValue}>{completionRate}%</p>
                <div style={styles.progressBarContainer}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${completionRate}%`,
                    background: completionRate >= 75 
                      ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
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
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <span style={styles.statEmoji}>⏳</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Pending</p>
                <p style={styles.statValue}>{pendingHomework}</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'}}>
                  <span style={styles.statEmoji}>📚</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Total Assignments</p>
                <p style={styles.statValue}>{totalHomework}</p>
              </div>
            </div>
          </div>
        )}

        {/* Homework Cards */}
        {homework.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎉</div>
            <h3 style={styles.emptyTitle}>No Homework Yet!</h3>
            <p style={styles.emptyText}>
              Your child has no homework assignments at the moment. Check back later for new assignments from the teacher.
            </p>
          </div>
        ) : (
          <>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Assignments</h2>
              <span style={styles.recordCount}>{homework.length} assignments</span>
            </div>

            <div style={styles.grid}>
              {homework.map((hw) => {
                const isSubmitted = hw.submitted;
                return (
                  <div
                    key={hw.id}
                    style={{
                      ...styles.card,
                      borderLeft: `4px solid ${isSubmitted ? '#22c55e' : '#f59e0b'}`
                    }}
                    className="homework-card"
                  >
                    {/* Subject Badge */}
                    <div style={styles.cardHeader}>
                      <div style={styles.subjectBadge}>
                        <span style={styles.subjectIcon}>📖</span>
                        <span style={styles.subjectText}>{hw.subject}</span>
                      </div>
                      <span style={{
                        ...styles.statusTag,
                        background: isSubmitted ? '#dcfce7' : '#fef3c7',
                        color: isSubmitted ? '#16a34a' : '#d97706',
                        border: `1px solid ${isSubmitted ? '#86efac' : '#fde68a'}`
                      }}>
                        {isSubmitted ? 'Done' : 'Pending'}
                      </span>
                    </div>

                    {/* Due Date */}
                    <div style={styles.dueDateBox}>
                      <span style={styles.dueDateIcon}>📅</span>
                      <div>
                        <span style={styles.dueDateLabel}>Due Date</span>
                        <span style={styles.dueDateValue}>{hw.due_date}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {hw.description && (
                      <div style={styles.descriptionBox}>
                        <p style={styles.descriptionLabel}>Assignment Details:</p>
                        <p style={styles.descriptionText}>{hw.description}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div style={styles.cardFooter}>
                      {isSubmitted ? (
                        <div style={styles.submittedBadge}>
                          <span style={styles.badgeIcon}>✓</span>
                          <span style={styles.badgeText}>Submitted Successfully</span>
                        </div>
                      ) : (
                        <div style={styles.pendingBadge}>
                          <span style={styles.badgeIcon}>⏳</span>
                          <span style={styles.badgeText}>Awaiting Submission</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
    borderTop: '4px solid #f59e0b',
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
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  statIconWrapper: {
    flexShrink: 0,
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
    flex: 1,
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: '#f3f4f6',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '12px',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  sectionHeader: {
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
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  subjectBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
  },
  subjectIcon: {
    fontSize: '18px',
  },
  subjectText: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'white',
  },
  statusTag: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  dueDateBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: '#f9fafb',
    borderRadius: '10px',
    marginBottom: '16px',
  },
  dueDateIcon: {
    fontSize: '24px',
  },
  dueDateLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: '2px',
  },
  dueDateValue: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
  },
  descriptionBox: {
    marginBottom: '20px',
  },
  descriptionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  descriptionText: {
    margin: 0,
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
  },
  cardFooter: {
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6',
  },
  submittedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: '#dcfce7',
    borderRadius: '10px',
    border: '1px solid #86efac',
  },
  pendingBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: '#fef3c7',
    borderRadius: '10px',
    border: '1px solid #fde68a',
  },
  badgeIcon: {
    fontSize: '16px',
  },
  badgeText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
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

export default ParentHomework;