import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { studentAPI } from '../../services/api';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Attendance', path: '/student/attendance' },
    { label: 'Homework', path: '/student/homework' },
    { label: 'AI Tutor', path: '/student/ai-tutor' },
    { label: 'Class Chat', path: '/student/class-chat' },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await studentAPI.getAttendance(user.uid);
          setAttendance(response.data.attendance);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Calculate statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => record.status === 'Present').length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  if (loading) {
    return (
      <Layout role="Student" links={studentLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="attendance-spinner"></div>
          <p style={styles.loadingText}>Loading attendance records...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="Student" links={studentLinks}>
      <div style={styles.container} className="attendance-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📅 My Attendance</h1>
            <p style={styles.subtitle}>Track your attendance history and performance</p>
          </div>
        </div>

        {/* Stats Cards */}
        {attendance.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <span style={styles.statEmoji}>📊</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Attendance Rate</p>
                <p style={styles.statValue}>{attendancePercentage}%</p>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${attendancePercentage}%`,
                    background: attendancePercentage >= 75 
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
                <p style={styles.statLabel}>Present Days</p>
                <p style={styles.statValue}>{presentDays}</p>
                <p style={styles.statSubtext}>Keep it up!</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
                  <span style={styles.statEmoji}>✗</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Absent Days</p>
                <p style={styles.statValue}>{absentDays}</p>
                <p style={styles.statSubtext}>Try to improve</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <span style={styles.statEmoji}>📅</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Total Days</p>
                <p style={styles.statValue}>{totalDays}</p>
                <p style={styles.statSubtext}>Recorded</p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        {attendance.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No Attendance Records</h3>
            <p style={styles.emptyText}>Your attendance records will appear here once marked by your teacher.</p>
          </div>
        ) : (
          <div style={styles.tableSection}>
            <div style={styles.tableTitleRow}>
              <h2 style={styles.tableTitle}>Attendance History</h2>
              <span style={styles.recordCount}>{attendance.length} records</span>
            </div>
            
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <span style={styles.thIcon}>📅</span>
                        Date
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <span style={styles.thIcon}>📊</span>
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => {
                    const isPresent = record.status === 'Present';
                    return (
                      <tr 
                        key={index} 
                        style={styles.tr} 
                        className="table-row"
                      >
                        <td style={styles.td}>
                          <div style={styles.dateCell}>
                            <span style={styles.dateText}>{record.date}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            background: isPresent ? '#dcfce7' : '#fee2e2',
                            color: isPresent ? '#16a34a' : '#dc2626',
                            border: `1px solid ${isPresent ? '#86efac' : '#fca5a5'}`
                          }}>
                            <span style={styles.statusIcon}>
                              {isPresent ? '✓' : '✗'}
                            </span>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
  tableSection: {
    marginTop: '40px',
  },
  tableTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tableTitle: {
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    background: '#f9fafb',
  },
  th: {
    textAlign: 'left',
    padding: '16px 20px',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#6b7280',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  thIcon: {
    fontSize: '16px',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '16px 20px',
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
  },
  dateText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#374151',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  statusIcon: {
    fontSize: '14px',
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
  
  .attendance-spinner {
    animation: spin 1s linear infinite;
  }
  
  .attendance-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
  
  .table-row:hover {
    background: #f9fafb !important;
  }
  
  @media (max-width: 768px) {
    .statsGrid {
      grid-template-columns: 1fr !important;
    }
    
    .tableContainer {
      overflow-x: auto;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StudentAttendance;