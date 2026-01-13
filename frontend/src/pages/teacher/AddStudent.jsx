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
  const [showPassword, setShowPassword] = useState(false);

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
      <div style={styles.container} className="add-student-container">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>➕ Add New Student</h1>
            <p style={styles.subtitle}>Register a new student to your class</p>
          </div>
        </div>

        <div style={styles.contentGrid}>
          {/* Main Form Card */}
          <div style={styles.formCard}>
            {/* Success/Error Message */}
            {message.text && (
              <div
                style={{
                  ...styles.message,
                  ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
                }}
                className="message-banner"
              >
                <span style={styles.messageIcon}>
                  {message.type === 'success' ? '✓' : '⚠'}
                </span>
                <span style={styles.messageText}>{message.text}</span>
              </div>
            )}

            <div style={styles.formHeader}>
              <div style={styles.formIconCircle}>
                <span style={styles.formIcon}>👤</span>
              </div>
              <div>
                <h2 style={styles.formTitle}>Student Information</h2>
                <p style={styles.formSubtitle}>Enter student details below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Name Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📝</span>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rahul Kumar"
                  style={styles.input}
                  className="form-input"
                  required
                />
                <p style={styles.helpText}>Enter the student's complete name</p>
              </div>

              {/* Email Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>📧</span>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., rahul@test.com"
                  style={styles.input}
                  className="form-input"
                  required
                />
                <p style={styles.helpText}>This will be used for login</p>
              </div>

              {/* Password Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔒</span>
                  Password *
                </label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={styles.passwordInput}
                    className="form-input"
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.showPasswordBtn}
                    className="show-password-btn"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBars}>
                    <div style={{
                      ...styles.strengthBar,
                      background: password.length >= 2 ? '#22c55e' : '#e5e7eb'
                    }}></div>
                    <div style={{
                      ...styles.strengthBar,
                      background: password.length >= 4 ? '#22c55e' : '#e5e7eb'
                    }}></div>
                    <div style={{
                      ...styles.strengthBar,
                      background: password.length >= 6 ? '#22c55e' : '#e5e7eb'
                    }}></div>
                  </div>
                  <p style={styles.strengthText}>
                    {password.length < 6 ? 'Minimum 6 characters required' : 'Strong password ✓'}
                  </p>
                </div>
              </div>

              {/* Class Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🎓</span>
                  Assigned Class
                </label>
                <div style={styles.classDisplay}>
                  <div style={styles.classIcon}>🏫</div>
                  <div>
                    <span style={styles.classValue}>{classId || 'Loading...'}</span>
                    <span style={styles.classLabel}>Student will be added to this class</span>
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
                    Adding Student...
                  </>
                ) : (
                  <>
                    <span style={styles.submitIcon}>✓</span>
                    Add Student to Class
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div style={styles.sidebar}>
            {/* Instructions Card */}
            <div style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <span style={styles.infoIcon}>📋</span>
                <h3 style={styles.infoTitle}>Instructions</h3>
              </div>
              <div style={styles.infoContent}>
                <div style={styles.infoItem}>
                  <span style={styles.infoBullet}>1</span>
                  <span style={styles.infoText}>Enter the student's full name</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoBullet}>2</span>
                  <span style={styles.infoText}>Provide a valid email address</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoBullet}>3</span>
                  <span style={styles.infoText}>Create a secure password (min 6 chars)</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoBullet}>4</span>
                  <span style={styles.infoText}>Student will be added automatically</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div style={styles.tipsCard}>
              <div style={styles.tipsHeader}>
                <span style={styles.tipsIcon}>💡</span>
                <h3 style={styles.tipsTitle}>Best Practices</h3>
              </div>
              <div style={styles.tipsList}>
                <div style={styles.tipItem}>
                  <span style={styles.tipDot}>•</span>
                  <span style={styles.tipText}>Use school email if available</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipDot}>•</span>
                  <span style={styles.tipText}>Share login credentials securely</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipDot}>•</span>
                  <span style={styles.tipText}>Verify email spelling carefully</span>
                </div>
                <div style={styles.tipItem}>
                  <span style={styles.tipDot}>•</span>
                  <span style={styles.tipText}>Keep a record of accounts created</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={styles.statsCard}>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>👥</span>
                <div>
                  <span style={styles.statLabel}>Current Class</span>
                  <span style={styles.statValue}>{classId}</span>
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
  message: {
    padding: '16px 20px',
    borderRadius: '10px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '600',
    animation: 'slideDown 0.3s ease-out',
  },
  messageSuccess: {
    background: '#dcfce7',
    color: '#16a34a',
    border: '1px solid #86efac',
  },
  messageError: {
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
  },
  messageIcon: {
    fontSize: '20px',
  },
  messageText: {
    fontSize: '14px',
    flex: 1,
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
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
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
  helpText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    padding: '14px 50px 14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    color: '#111827',
    fontFamily: 'inherit',
    width: '100%',
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    padding: '4px',
    transition: 'transform 0.2s ease',
  },
  passwordStrength: {
    marginTop: '8px',
  },
  strengthBars: {
    display: 'flex',
    gap: '6px',
    marginBottom: '6px',
  },
  strengthBar: {
    height: '4px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background 0.3s ease',
  },
  strengthText: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
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
  infoCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  infoIcon: {
    fontSize: '24px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  infoBullet: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  infoText: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
  },
  tipsCard: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
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
    fontSize: '16px',
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
  tipDot: {
    fontSize: '20px',
    lineHeight: '1.4',
  },
  tipText: {
    fontSize: '14px',
    lineHeight: '1.6',
    opacity: 0.95,
  },
  statsCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    fontSize: '32px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'block',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    display: 'block',
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
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
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
  
  .add-student-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  .show-password-btn:hover {
    transform: scale(1.1);
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

export default AddStudent;