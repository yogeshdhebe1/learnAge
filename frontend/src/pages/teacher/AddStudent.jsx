import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { teacherAPI, authAPI } from '../../services/api';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

 const teacherLinks = [
  { label: 'Dashboard', path: '/teacher/dashboard' },
  { label: 'Mark Attendance', path: '/teacher/mark-attendance' },
  { label: 'Assign Homework', path: '/teacher/assign-homework' },
  { label: 'Add Student', path: '/teacher/add-student' },
  { label: 'Class Chat', path: '/teacher/class-chat' },  // ← ADD THIS
];

  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const response = await authAPI.verifyToken(token);
          setClassId(response.data.class_id);
        }
      } catch (error) {
        console.error('Error fetching class:', error);
      }
    };

    fetchClassId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const user = auth.currentUser;
      
      const studentData = {
        name: name,
        email: email,
        password: password,
        class_id: classId
      };

      const response = await teacherAPI.addStudent(studentData, user.uid);
      
      setMessage({ 
        type: 'success', 
        text: `Student "${response.data.student_name}" added successfully!` 
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error adding student:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to add student';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <h1 style={styles.title}>Add New Student</h1>
      
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
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
            <label style={styles.label}>Student Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rahul Kumar"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., rahul@test.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              style={styles.input}
              minLength="6"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Class</label>
            <input
              type="text"
              value={classId}
              style={styles.inputDisabled}
              disabled
            />
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </form>

        <div style={styles.infoBox}>
          <h3>📝 Instructions:</h3>
          <ul>
            <li>Enter the student's full name</li>
            <li>Use a valid email address</li>
            <li>Password must be at least 6 characters</li>
            <li>Student will be added to your class automatically</li>
          </ul>
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
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
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
    borderRadius: '5px',
  },
  inputDisabled: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
  },
  submitBtn: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#ecf0f1',
    padding: '20px',
    borderRadius: '5px',
  },
};

export default AddStudent;
