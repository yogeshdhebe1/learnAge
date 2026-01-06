import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { parentAPI } from '../../services/api';

const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const parentLinks = [
    { label: 'Dashboard', path: '/parent/dashboard' },
    { label: 'Attendance', path: '/parent/attendance' },
    { label: 'Homework', path: '/parent/homework' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await parentAPI.getDashboard(user.uid);
          setDashboardData(response.data);
          // Store child_id in localStorage for other pages
          localStorage.setItem('child_id', response.data.child_id);
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
      <Layout role="Parent" links={parentLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <p style={styles.error}>No child found linked to this parent account.</p>
      </Layout>
    );
  }

  return (
    <Layout role="Parent" links={parentLinks}>
      <h1 style={styles.title}>Parent Dashboard</h1>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Child's Name</h3>
          <p style={styles.cardValue}>{dashboardData.child_name}</p>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Class</h3>
          <p style={styles.cardValue}>{dashboardData.class_id}</p>
        </div>
      </div>
      
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>Monitor Your Child's Progress</h3>
        <p style={styles.infoText}>• View attendance records</p>
        <p style={styles.infoText}>• Track homework completion</p>
        <p style={styles.infoText}>• Stay updated on academic progress</p>
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
  error: {
    fontSize: '16px',
    color: '#e74c3c',
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

export default ParentDashboard;
