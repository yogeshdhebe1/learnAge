import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { teacherAPI, authAPI } from '../../services/api';

const AssignHomework = () => {
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!subject || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      
      await teacherAPI.assignHomework({
        class_id: classId,
        subject: subject,
        due_date: dueDate,
        description: description
      }, user.uid);

      alert('Homework assigned successfully!');
      
      // Reset form
      setSubject('');
      setDueDate('');
      setDescription('');
    } catch (error) {
      console.error('Error assigning homework:', error);
      alert('Failed to assign homework. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <h1 style={styles.title}>Assign Homework</h1>
      
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Science, English"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter homework details, instructions, or notes"
              style={styles.textarea}
              rows="5"
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
            {loading ? 'Assigning...' : 'Assign Homework'}
          </button>
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
  textarea: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  submitBtn: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default AssignHomework;
