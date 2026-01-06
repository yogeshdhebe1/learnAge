import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { teacherAPI } from '../../services/api';

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

const teacherLinks = [
  { label: 'Dashboard', path: '/teacher/dashboard' },
  { label: 'Mark Attendance', path: '/teacher/mark-attendance' },
  { label: 'Assign Homework', path: '/teacher/assign-homework' },
  { label: 'Add Student', path: '/teacher/add-student' },
  { label: 'Class Chat', path: '/teacher/class-chat' },  // ← ADD THIS
];
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await teacherAPI.getDashboard(user.uid);
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
      <Layout role="Teacher" links={teacherLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <h1 style={styles.title}>Teacher Dashboard</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Welcome</h3>
          <p style={styles.cardValue}>{dashboardData?.name}</p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Class Handling</h3>
          <p style={styles.cardValue}>{dashboardData?.class_id}</p>
        </div>
      </div>
      
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>Quick Actions</h3>
        <p style={styles.infoText}>• Mark student attendance for today</p>
        <p style={styles.infoText}>• Assign homework to your class</p>
        <p style={styles.infoText}>• View student list</p>
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
    marginBottom: '30px',
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
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  infoTitle: {
    margin: '0 0 15px 0',
    fontSize: '20px',
    color: '#2c3e50',
  },
  infoText: {
    margin: '10px 0',
    fontSize: '16px',
    color: '#34495e',
  },
};

export default TeacherDashboard;
