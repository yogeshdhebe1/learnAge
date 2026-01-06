import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { authAPI } from '../../services/api';

const ViewProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getLinks = (role) => {
    const baseLinks = {
      student: [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Attendance', path: '/student/attendance' },
        { label: 'Homework', path: '/student/homework' },
        { label: 'AI Tutor', path: '/student/ai-tutor' },
        { label: 'Class Chat', path: '/student/class-chat' },
      ],
      teacher: [
        { label: 'Dashboard', path: '/teacher/dashboard' },
        { label: 'Mark Attendance', path: '/teacher/mark-attendance' },
        { label: 'Assign Homework', path: '/teacher/assign-homework' },
        { label: 'Add Student', path: '/teacher/add-student' },
        { label: 'Class Chat', path: '/teacher/class-chat' },
      ],
      parent: [
        { label: 'Dashboard', path: '/parent/dashboard' },
        { label: 'Child Attendance', path: '/parent/attendance' },
        { label: 'Child Homework', path: '/parent/homework' },
      ],
    };
    return baseLinks[role] || [];
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await authAPI.verifyToken(token);
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!userData) {
    return <div style={styles.error}>User data not found</div>;
  }

  return (
    <Layout 
      role={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} 
      links={getLinks(userData.role)}
    >
      <h1 style={styles.title}>My Profile</h1>

      <div style={styles.profileCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.name}>{userData.name}</h2>
          <p style={styles.role}>{userData.role.toUpperCase()}</p>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{userData.email}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>User ID:</span>
            <span style={styles.value}>{userData.uid}</span>
          </div>

          {userData.class_id && (
            <div style={styles.infoRow}>
              <span style={styles.label}>Class:</span>
              <span style={styles.value}>{userData.class_id}</span>
            </div>
          )}

          <div style={styles.infoRow}>
            <span style={styles.label}>Role:</span>
            <span style={styles.badge}>
              {userData.role === 'student' && '🎓 Student'}
              {userData.role === 'teacher' && '👨‍🏫 Teacher'}
              {userData.role === 'parent' && '👨‍👩‍👧‍👦 Parent'}
            </span>
          </div>
        </div>

        <div style={styles.actions}>
          <button 
            style={styles.editButton}
            onClick={() => navigate(`/${userData.role}/edit-profile`)}
          >
            ✏️ Edit Profile
          </button>
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#e74c3c',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  avatarSection: {
    textAlign: 'center',
    borderBottom: '1px solid #ecf0f1',
    paddingBottom: '30px',
    marginBottom: '30px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  name: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#2c3e50',
  },
  role: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '14px',
  },
  value: {
    color: '#34495e',
    fontSize: '14px',
  },
  badge: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #ecf0f1',
  },
  editButton: {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default ViewProfile;