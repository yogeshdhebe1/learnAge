import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.selectedRole || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token
      const token = await userCredential.user.getIdToken();
      
      // Verify token and get user role
      const response = await authAPI.verifyToken(token);
      const { role } = response.data;
      
      // Check if role matches selected role (if any)
      if (selectedRole && role !== selectedRole) {
        setError(`This account is not a ${selectedRole} account`);
        await auth.signOut();
        setLoading(false);
        return;
      }
      
      // Redirect based on role
      navigate(`/${role}/dashboard`);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="login-card">
        {selectedRole && (
          <button onClick={handleBackToHome} style={styles.backButton} className="back-button">
            <span style={styles.backArrow}>←</span> Back to Home
          </button>
        )}
        
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <span style={styles.logoEmoji}>🎓</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            {selectedRole 
              ? `Login to your ${selectedRole} account` 
              : 'Login to continue to LearnAge'}
          </p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              className="input-field"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="input-field"
              required
            />
          </div>
          
          {error && (
            <div style={styles.errorBox} className="error-box">
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.error}>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner} className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        {selectedRole && (
          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>
        )}
        
        <div style={styles.demoAccounts}>
          <p style={styles.demoTitle}>
            <span style={styles.demoIcon}>ℹ️</span>
            Demo Accounts
          </p>
          <div style={styles.demoList}>
            {(selectedRole === 'student' || !selectedRole) && (
              <div style={styles.demoItem}>
                <span style={styles.demoRole}>👤 Student:</span>
                <span style={styles.demoCredential}>student@test.com</span>
              </div>
            )}
            {(selectedRole === 'teacher' || !selectedRole) && (
              <div style={styles.demoItem}>
                <span style={styles.demoRole}>👨‍🏫 Teacher:</span>
                <span style={styles.demoCredential}>teacher@test.com</span>
              </div>
            )}
            {(selectedRole === 'parent' || !selectedRole) && (
              <div style={styles.demoItem}>
                <span style={styles.demoRole}>👪 Parent:</span>
                <span style={styles.demoCredential}>parent@test.com</span>
              </div>
            )}
            <p style={styles.demoPassword}>Password: <strong>password123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", sans-serif',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '48px 40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    animation: 'fadeInUp 0.5s ease-out',
  },
  backButton: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  backArrow: {
    fontSize: '16px',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
  },
  logoEmoji: {
    fontSize: '36px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '0',
    color: '#6B7280',
    fontSize: '15px',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    fontFamily: 'inherit',
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    display: 'inline-block',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'shake 0.3s ease',
  },
  errorIcon: {
    fontSize: '18px',
  },
  error: {
    color: '#EF4444',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontWeight: '500',
  },
  demoAccounts: {
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #E5E7EB',
  },
  demoTitle: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  demoIcon: {
    fontSize: '16px',
  },
  demoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  demoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
  },
  demoRole: {
    color: '#6B7280',
    fontWeight: '500',
  },
  demoCredential: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: '14px',
  },
  demoPassword: {
    fontSize: '13px',
    color: '#6B7280',
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #E5E7EB',
  },
};

// Add CSS animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .spinner {
    animation: spin 0.8s linear infinite;
  }
  
  .login-card {
    animation: fadeInUp 0.5s ease-out;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #4F46E5;
    background-color: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  .input-field::placeholder {
    color: #9CA3AF;
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #4338CA;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
  }
  
  .login-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .back-button:hover {
    background-color: #F3F4F6;
    color: #4F46E5;
  }
  
  .error-box {
    animation: shake 0.3s ease;
  }
  
  /* Responsive Design */
  @media (max-width: 480px) {
    .login-card {
      padding: 32px 24px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Login;