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
    { label: 'Class Chat', path: '/teacher/class-chat' },
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

  const quickSubjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

  return (
    <Layout role="Teacher" links={teacherLinks}>
      <div style={styles.container} className="homework-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📚 Assign Homework</h1>
            <p style={styles.subtitle}>Create and assign homework to your class</p>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Main Form Card */}
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.formIconCircle}>
                <span style={styles.formIcon}>✏️</span>
              </div>
              <div>
                <h2 style={styles.formTitle}>Homework Details</h2>
                <p style={styles.formSubtitle}>Fill in the information below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Subject Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📖</span>
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Science, English"
                  style={styles.input}
                  className="form-input"
                  required
                />
                
                {/* Quick Subject Pills */}
                <div style={styles.quickPills}>
                  <span style={styles.quickLabel}>Quick select:</span>
                  {quickSubjects.map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setSubject(subj)}
                      style={styles.quickPill}
                      className="quick-pill"
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📅</span>
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={styles.input}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <p style={styles.helpText}>Students will be notified of the deadline</p>
              </div>

              {/* Description Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📝</span>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter homework details, instructions, page numbers, or additional notes..."
                  style={styles.textarea}
                  className="form-textarea"
                  rows="6"
                />
                <p style={styles.charCount}>{description.length} characters</p>
              </div>

              {/* Class Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🎓</span>
                  Class
                </label>
                <div style={styles.classDisplay}>
                  <div style={styles.classIcon}>🏫</div>
                  <div>
                    <span style={styles.classValue}>{classId || 'Loading...'}</span>
                    <span style={styles.classLabel}>Your assigned class</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner} className="button-spinner"></span>
                    Assigning...
                  </>
                ) : (
                  <>
                    <span style={styles.submitIcon}>✓</span>
                    Assign Homework
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div style={styles.sidebar}>
            {/* Tips Card */}
            <div style={styles.tipsCard}>
              <div style={styles.tipsHeader}>
                <span style={styles.tipsIcon}>💡</span>
                <h3 style={styles.tipsTitle}>Assignment Tips</h3>
              </div>
              <div style={styles.tipsList}>
                <div style={styles.tipItem}>
                  <span style={styles.tipBullet}>•</span>
                  <span style={styles.tipText}>Be specific with subject names</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipBullet}>•</span>
                  <span style={styles.tipText}>Set reasonable deadlines</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipBullet}>•</span>
                  <span style={styles.tipText}>Include clear instructions</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipBullet}>•</span>
                  <span style={styles.tipText}>Mention page numbers or chapters</span>
                </div>
              </div>
            </div>

            {/* Example Card */}
            <div style={styles.exampleCard}>
              <div style={styles.exampleHeader}>
                <span style={styles.exampleIcon}>📋</span>
                <h3 style={styles.exampleTitle}>Example</h3>
              </div>
              <div style={styles.exampleContent}>
                <div style={styles.exampleField}>
                  <span style={styles.exampleLabel}>Subject:</span>
                  <span style={styles.exampleValue}>Mathematics</span>
                </div>
                <div style={styles.exampleField}>
                  <span style={styles.exampleLabel}>Due Date:</span>
                  <span style={styles.exampleValue}>Feb 15, 2026</span>
                </div>
                <div style={styles.exampleField}>
                  <span style={styles.exampleLabel}>Description:</span>
                  <span style={styles.exampleValue}>Complete exercises 1-10 from Chapter 5 on Quadratic Equations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f3f4f6',
  },
  formIconCircle: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
  formIcon: {
    fontSize: '28px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  labelIcon: {
    fontSize: '18px',
  },
  input: {
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    color: '#111827',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    color: '#111827',
    lineHeight: '1.6',
  },
  quickPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    marginTop: '8px',
  },
  quickLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  quickPill: {
    padding: '6px 12px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  helpText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  charCount: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'right',
    margin: '4px 0 0 0',
  },
  classDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
  },
  classIcon: {
    fontSize: '24px',
  },
  classValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    display: 'block',
  },
  classLabel: {
    fontSize: '13px',
    color: '#6b7280',
    display: 'block',
  },
  submitBtn: {
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  submitIcon: {
    fontSize: '18px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tipsCard: {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
  },
  tipsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  tipsIcon: {
    fontSize: '24px',
  },
  tipsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tipItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: '20px',
    lineHeight: '1.4',
  },
  tipText: {
    fontSize: '14px',
    lineHeight: '1.6',
    opacity: 0.95,
  },
  exampleCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
  },
  exampleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  exampleIcon: {
    fontSize: '24px',
  },
  exampleTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  exampleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  exampleField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  exampleLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  exampleValue: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .button-spinner {
    animation: spin 1s linear infinite;
  }
  
  .homework-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
  
  .quick-pill:hover {
    background: #e5e7eb !important;
    border-color: #d1d5db !important;
    transform: translateY(-1px);
  }
  
  .submit-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;
  }
  
  .submit-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 968px) {
    .contentGrid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AssignHomework;