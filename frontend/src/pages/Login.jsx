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
      <div style={styles.card}>
        {selectedRole && (
          <button onClick={handleBackToHome} style={styles.backButton}>
            ← Back to Home
          </button>
        )}
        
        <h1 style={styles.title}>LearnAge</h1>
        <p style={styles.subtitle}>
          {selectedRole 
            ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login` 
            : 'Education Platform'}
        </p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={styles.demoAccounts}>
          <p style={styles.demoTitle}>Demo Accounts:</p>
          {selectedRole === 'student' || !selectedRole ? (
            <p>Student: student@test.com / password123</p>
          ) : null}
          {selectedRole === 'teacher' || !selectedRole ? (
            <p>Teacher: teacher@test.com / password123</p>
          ) : null}
          {selectedRole === 'parent' || !selectedRole ? (
            <p>Parent: parent@test.com / password123</p>
          ) : null}
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
    backgroundColor: '#34495e',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '400px',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'none',
    border: 'none',
    color: '#3498db',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '5px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    textAlign: 'center',
    color: '#2c3e50',
  },
  subtitle: {
    margin: '0 0 30px 0',
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    margin: 0,
    fontSize: '14px',
  },
  demoAccounts: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    fontSize: '14px',
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

export default Login;