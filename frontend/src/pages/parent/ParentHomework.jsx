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

  if (loading) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Parent" links={parentLinks}>
      <h1 style={styles.title}>Child's Homework</h1>
      
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
                  <span style={styles.pendingBadge}>⏳ Pending</span>
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
  pendingBadge: {
    display: 'inline-block',
    padding: '8px 15px',
    backgroundColor: '#f39c12',
    color: 'white',
    borderRadius: '5px',
    fontSize: '14px',
  },
};

export default ParentHomework;
