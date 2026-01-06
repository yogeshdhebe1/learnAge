import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { selectedRole: role } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to LearnAge</h1>
        <p style={styles.subtitle}>Education Platform for Everyone</p>
        
        <div style={styles.cardGrid}>
          {/* Student Card */}
          <div 
            style={{...styles.card, ...styles.studentCard}}
            onClick={() => handleRoleSelect('student')}
          >
            <div style={styles.icon}>🎓</div>
            <h2 style={styles.cardTitle}>Student</h2>
            <p style={styles.cardText}>
              Access your dashboard, view attendance, submit homework, and chat with AI Tutor
            </p>
            <button style={styles.button}>Login as Student</button>
          </div>

          {/* Teacher Card */}
          <div 
            style={{...styles.card, ...styles.teacherCard}}
            onClick={() => handleRoleSelect('teacher')}
          >
            <div style={styles.icon}>👨‍🏫</div>
            <h2 style={styles.cardTitle}>Teacher</h2>
            <p style={styles.cardText}>
              Mark attendance, assign homework, add students, and manage your class
            </p>
            <button style={styles.button}>Login as Teacher</button>
          </div>

          {/* Parent Card */}
          <div 
            style={{...styles.card, ...styles.parentCard}}
            onClick={() => handleRoleSelect('parent')}
          >
            <div style={styles.icon}>👨‍👩‍👧‍👦</div>
            <h2 style={styles.cardTitle}>Parent</h2>
            <p style={styles.cardText}>
              Monitor your child's attendance, homework progress, and academic performance
            </p>
            <button style={styles.button}>Login as Parent</button>
          </div>
        </div>

        <div style={styles.footer}>
          <p>Powered by LearnAge © 2026</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    maxWidth: '1200px',
    width: '100%',
  },
  title: {
    fontSize: '48px',
    color: 'white',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: '50px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '40px 30px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  studentCard: {
    borderTop: '5px solid #3498db',
  },
  teacherCard: {
    borderTop: '5px solid #27ae60',
  },
  parentCard: {
    borderTop: '5px solid #e74c3c',
  },
  icon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  cardText: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '25px',
    lineHeight: '1.6',
  },
  button: {
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    fontSize: '16px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginTop: '40px',
  },
};

export default Landing;