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
  { label: 'Class Chat', path: '/teacher/class-chat' },  // ← ADD THIS
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

  if (loading) {
    return (
      <Layout role="Teacher" links={teacherLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <h1 style={styles.title}>Mark Attendance</h1>
      
      <div style={styles.dateSection}>
        <label style={styles.label}>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      {students.length === 0 ? (
        <p style={styles.noData}>No students found in your class.</p>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>
                      <div style={styles.radioGroup}>
                        <label style={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="present"
                            checked={attendance[student.id] === 'present'}
                            onChange={() => handleAttendanceChange(student.id, 'present')}
                          />
                          <span style={{color: '#27ae60'}}>Present</span>
                        </label>
                        <label style={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value="absent"
                            checked={attendance[student.id] === 'absent'}
                            onChange={() => handleAttendanceChange(student.id, 'absent')}
                          />
                          <span style={{color: '#e74c3c'}}>Absent</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            onClick={handleSubmit}
            style={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </>
      )}
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  dateSection: {
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '15px',
    color: '#2c3e50',
  },
  dateInput: {
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  noData: {
    fontSize: '16px',
    color: '#7f8c8d',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #ecf0f1',
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  tr: {
    borderBottom: '1px solid #ecf0f1',
  },
  td: {
    padding: '12px',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MarkAttendance;
