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
  { label: 'Class Chat', path: '/student/class-chat' },  // ← ADD THIS
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
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Student" links={studentLinks}>
      <h1 style={styles.title}>Student Dashboard</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Welcome</h3>
          <p style={styles.cardValue}>{dashboardData?.name}</p>
          <p style={styles.cardLabel}>Class: {dashboardData?.class_id}</p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Today's Attendance</h3>
          <p style={{
            ...styles.cardValue,
            color: dashboardData?.today_attendance === 'Present' ? '#27ae60' : '#e74c3c'
          }}>
            {dashboardData?.today_attendance}
          </p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Pending Homework</h3>
          <p style={styles.cardValue}>{dashboardData?.pending_homework}</p>
          <p style={styles.cardLabel}>assignments</p>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#7f8c8d',
  },
  cardValue: {
    margin: '0 0 5px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#95a5a6',
  },
};

export default StudentDashboard;
