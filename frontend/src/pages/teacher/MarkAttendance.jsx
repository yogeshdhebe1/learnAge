import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { teacherAPI, authAPI } from '../../services/api';

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const teacherLinks = [
    { label: 'Dashboard', path: '/teacher/dashboard' },
    { label: 'Mark Attendance', path: '/teacher/mark-attendance' },
    { label: 'Assign Homework', path: '/teacher/assign-homework' },
    { label: 'Add Student', path: '/teacher/add-student' },
    { label: 'Class Chat', path: '/teacher/class-chat' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Get teacher's class
          const token = await user.getIdToken();
          const userResponse = await authAPI.verifyToken(token);
          const teacherClassId = userResponse.data.class_id;
          setClassId(teacherClassId);
          
          // Get students in class
          const studentsResponse = await teacherAPI.getStudents(teacherClassId);
          setStudents(studentsResponse.data.students);
          
          // Initialize attendance state
          const initialAttendance = {};
          studentsResponse.data.students.forEach(student => {
            initialAttendance[student.id] = 'present';
          });
          setAttendance(initialAttendance);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    setSubmitting(true);

    try {
      const user = auth.currentUser;
      
      // Prepare attendance records
      const attendanceRecords = students.map(student => ({
        student_id: student.id,
        student_name: student.name,
        status: attendance[student.id]
      }));

      await teacherAPI.markAttendance({
        class_id: classId,
        date: date,
        attendance_records: attendanceRecords
      }, user.uid);

      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate statistics
  const totalStudents = students.length;
  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  if (loading) {
    return (
      <Layout role="Teacher" links={teacherLinks}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} className="attendance-spinner"></div>
          <p style={styles.loadingText}>Loading students...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <div style={styles.container} className="attendance-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📋 Mark Attendance</h1>
            <p style={styles.subtitle}>Record student attendance for your class</p>
          </div>
        </div>

        {/* Date Selection Card */}
        <div style={styles.dateCard}>
          <div style={styles.dateIconWrapper}>
            <div style={styles.dateIcon}>📅</div>
          </div>
          <div style={styles.dateContent}>
            <label style={styles.dateLabel}>Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
              className="date-input"
            />
          </div>
          <div style={styles.todayBadge}>
            {date === new Date().toISOString().split('T')[0] ? 'Today' : 'Custom Date'}
          </div>
        </div>

        {/* Statistics Cards */}
        {students.length > 0 && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'}}>
                  <span style={styles.statEmoji}>👥</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Total Students</p>
                <p style={styles.statValue}>{totalStudents}</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
                  <span style={styles.statEmoji}>✓</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Present</p>
                <p style={styles.statValue}>{presentCount}</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
                  <span style={styles.statEmoji}>✗</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Absent</p>
                <p style={styles.statValue}>{absentCount}</p>
              </div>
            </div>

            <div style={styles.statCard} className="stat-card">
              <div style={styles.statIconWrapper}>
                <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                  <span style={styles.statEmoji}>📊</span>
                </div>
              </div>
              <div style={styles.statContent}>
                <p style={styles.statLabel}>Attendance Rate</p>
                <p style={styles.statValue}>{attendanceRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Students List */}
        {students.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <h3 style={styles.emptyTitle}>No Students Found</h3>
            <p style={styles.emptyText}>
              There are no students in your class yet. Add students to start marking attendance.
            </p>
            <a href="/teacher/add-student" style={styles.addButton}>
              ➕ Add Student
            </a>
          </div>
        ) : (
          <>
            <div style={styles.tableSection}>
              <div style={styles.tableTitleRow}>
                <h2 style={styles.tableTitle}>Student List</h2>
                <span style={styles.recordCount}>{students.length} students</span>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          <span style={styles.thIcon}>👤</span>
                          Student Name
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          <span style={styles.thIcon}>📧</span>
                          Email
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
                    {students.map((student) => (
                      <tr key={student.id} style={styles.tr} className="table-row">
                        <td style={styles.td}>
                          <div style={styles.studentCell}>
                            <div style={styles.studentAvatar}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={styles.studentName}>{student.name}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.emailText}>{student.email}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.radioGroup}>
                            <label
                              style={{
                                ...styles.radioButton,
                                ...(attendance[student.id] === 'present' ? styles.radioButtonActive : {}),
                                borderColor: attendance[student.id] === 'present' ? '#22c55e' : '#e5e7eb',
                                background: attendance[student.id] === 'present' ? '#dcfce7' : 'white',
                              }}
                              className="radio-button"
                            >
                              <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                value="present"
                                checked={attendance[student.id] === 'present'}
                                onChange={() => handleAttendanceChange(student.id, 'present')}
                                style={styles.radioInput}
                              />
                              <span style={{
                                ...styles.radioText,
                                color: attendance[student.id] === 'present' ? '#16a34a' : '#6b7280'
                              }}>
                                ✓ Present
                              </span>
                            </label>

                            <label
                              style={{
                                ...styles.radioButton,
                                ...(attendance[student.id] === 'absent' ? styles.radioButtonActive : {}),
                                borderColor: attendance[student.id] === 'absent' ? '#ef4444' : '#e5e7eb',
                                background: attendance[student.id] === 'absent' ? '#fee2e2' : 'white',
                              }}
                              className="radio-button"
                            >
                              <input
                                type="radio"
                                name={`attendance-${student.id}`}
                                value="absent"
                                checked={attendance[student.id] === 'absent'}
                                onChange={() => handleAttendanceChange(student.id, 'absent')}
                                style={styles.radioInput}
                              />
                              <span style={{
                                ...styles.radioText,
                                color: attendance[student.id] === 'absent' ? '#dc2626' : '#6b7280'
                              }}>
                                ✗ Absent
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Button */}
            <div style={styles.submitSection}>
              <button
                onClick={handleSubmit}
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span style={styles.spinner} className="button-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span style={styles.submitIcon}>✓</span>
                    Submit Attendance
                  </>
                )}
              </button>
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
    borderTop: '4px solid #10b981',
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
  dateCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  dateIconWrapper: {
    flexShrink: 0,
  },
  dateIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
  },
  dateContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dateLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dateInput: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontWeight: '600',
    color: '#111827',
    maxWidth: '200px',
    transition: 'all 0.2s ease',
  },
  todayBadge: {
    padding: '8px 16px',
    background: '#dcfce7',
    color: '#16a34a',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid #86efac',
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
    alignItems: 'center',
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
    margin: '0 0 6px 0',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
  },
  tableSection: {
    marginBottom: '32px',
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
  studentCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  studentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
  },
  studentName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
  },
  emailText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
  },
  radioButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  radioInput: {
    display: 'none',
  },
  radioText: {
    fontSize: '14px',
    fontWeight: '600',
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
    margin: '0 auto 24px',
  },
  addButton: {
    display: 'inline-block',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  submitSection: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  submitIcon: {
    fontSize: '18px',
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
  
  .attendance-spinner, .button-spinner {
    animation: spin 1s linear infinite;
  }
  
  .button-spinner {
    width: '16px';
    height: '16px';
    border: '2px solid rgba(255, 255, 255, 0.3)';
    border-top: '2px solid white';
    border-radius: '50%';
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
  
  .date-input:focus {
    outline: none;
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  .radio-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;
  }
  
  .submit-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    .statsGrid {
      grid-template-columns: 1fr !important;
    }
    
    .dateCard {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    
    .radioGroup {
      flex-direction: column !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default MarkAttendance;