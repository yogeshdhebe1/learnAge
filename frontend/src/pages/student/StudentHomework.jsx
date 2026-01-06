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
  { label: 'Class Chat', path: '/student/class-chat' },  // ← ADD THIS
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

  if (loading) {
    return (
      <Layout role="Student" links={studentLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Student" links={studentLinks}>
      <h1 style={styles.title}>My Homework</h1>
      
      {homework.length === 0 ? (
        <p style={styles.noData}>No homework assigned yet.</p>
      ) : (
        <div style={styles.grid}>
          {homework.map((hw) => (
            <div key={hw.id} style={styles.card}>
              <h3 style={styles.subject}>{hw.subject}</h3>
              <p style={styles.dueDate}>Due: {hw.due_date}</p>
              {hw.description && (
                <p style={styles.description}>{hw.description}</p>
              )}
              
              <div style={styles.status}>
                {hw.submitted ? (
                  <span style={styles.submittedBadge}>✓ Submitted</span>
                ) : (
                  <button
                    onClick={() => handleSubmit(hw.id)}
                    style={styles.submitBtn}
                  >
                    Mark as Submitted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
  noData: {
    fontSize: '16px',
    color: '#7f8c8d',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subject: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    color: '#2c3e50',
  },
  dueDate: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  description: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#34495e',
  },
  status: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #ecf0f1',
  },
  submittedBadge: {
    display: 'inline-block',
    padding: '8px 15px',
    backgroundColor: '#27ae60',
    color: 'white',
    borderRadius: '5px',
    fontSize: '14px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default StudentHomework;
