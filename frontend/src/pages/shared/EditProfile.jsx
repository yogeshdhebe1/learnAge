import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { authAPI } from '../../services/api';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const EditProfile = () => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const db = getFirestore();

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
        setName(response.data.name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const user = auth.currentUser;
      
      // Update in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name.trim()
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/${userData.role}/profile`);
      }, 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
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
      <h1 style={styles.title}>Edit Profile</h1>

      <div style={styles.card}>
        <form onSubmit={handleSave} style={styles.form}>
          {message.text && (
            <div style={{
              ...styles.message,
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
            }}>
              {message.text}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={userData.email}
              style={styles.inputDisabled}
              disabled
            />
            <p style={styles.hint}>Email cannot be changed</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={userData.role}
              style={styles.inputDisabled}
              disabled
            />
            <p style={styles.hint}>Role cannot be changed</p>
          </div>

          {userData.class_id && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Class</label>
              <input
                type="text"
                value={userData.class_id}
                style={styles.inputDisabled}
                disabled
              />
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => navigate(`/${userData.role}/profile`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
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
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '40px',
    maxWidth: '600px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  message: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#2c3e50',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  inputDisabled: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
    cursor: 'not-allowed',
  },
  hint: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '5px',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '1px solid #ecf0f1',
  },
  cancelButton: {
    padding: '12px 30px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default EditProfile;