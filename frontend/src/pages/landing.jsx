import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { selectedRole: role } });
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      emoji: '🎓',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      shadowColor: 'rgba(102, 126, 234, 0.4)',
      description: 'Learn, grow, and explore with AI-powered education',
      features: ['AI Tutor 24/7', 'Track Progress', 'Interactive Learning', 'Class Chat']
    },
    {
      id: 'teacher',
      title: 'Teacher',
      emoji: '👨‍🏫',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
      shadowColor: 'rgba(240, 147, 251, 0.4)',
      description: 'Empower students with smart teaching tools',
      features: ['Manage Classes', 'Track Attendance', 'Assign Work', 'Meet Parents']
    },
    {
      id: 'parent',
      title: 'Parent',
      emoji: '👨‍👩‍👧‍👦',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe',
      shadowColor: 'rgba(79, 172, 254, 0.4)',
      description: 'Stay connected with your child\'s learning journey',
      features: ['Monitor Progress', 'View Reports', 'Schedule Meetings', 'Stay Updated']
    },
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background Shapes */}
      <div style={styles.bgShapes}>
        <div style={{...styles.circle, ...styles.circle1}}></div>
        <div style={{...styles.circle, ...styles.circle2}}></div>
        <div style={{...styles.circle, ...styles.circle3}}></div>
      </div>

      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.badge}>
            <span style={styles.badgeText}>🚀 Built for Education</span>
          </div>
          
          <h1 style={styles.title}>
            Welcome to <span style={styles.brandName}>LearnAge</span>
          </h1>
          
          <p style={styles.subtitle}>
            AI-Powered Education Platform Connecting Students, Teachers & Parents
          </p>

          <div style={styles.features}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🤖</span>
              <span style={styles.featureText}>AI-Powered</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>⚡</span>
              <span style={styles.featureText}>Real-time</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🎯</span>
              <span style={styles.featureText}>Role-Based</span>
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div style={styles.cardsSection}>
          <h2 style={styles.sectionTitle}>Choose Your Role to Continue</h2>
          
          <div style={styles.cardGrid}>
            {roles.map((role) => (
              <div
                key={role.id}
                style={{
                  ...styles.card,
                  transform: hoveredCard === role.id ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: hoveredCard === role.id 
                    ? `0 20px 40px ${role.shadowColor}` 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => handleRoleSelect(role.id)}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{...styles.cardIconCircle, background: role.gradient}}>
                  <span style={styles.cardEmoji}>{role.emoji}</span>
                </div>

                <h3 style={styles.cardTitle}>{role.title}</h3>
                <p style={styles.cardDescription}>{role.description}</p>

                <div style={styles.cardFeatures}>
                  {role.features.map((feature, i) => (
                    <div key={i} style={styles.cardFeature}>
                      <span style={{...styles.checkIcon, color: role.color}}>✓</span>
                      <span style={styles.featureLabel}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  style={{...styles.cardButton, background: role.gradient}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Continue as {role.title} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <h3 style={styles.infoTitle}>Why Choose LearnAge?</h3>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🎨</div>
              <h4 style={styles.infoCardTitle}>Beautiful Design</h4>
              <p style={styles.infoCardText}>Modern, intuitive interface designed for all ages</p>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🤖</div>
              <h4 style={styles.infoCardTitle}>AI-Powered Tutor</h4>
              <p style={styles.infoCardText}>24/7 intelligent assistance powered by Gemini AI</p>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📊</div>
              <h4 style={styles.infoCardTitle}>Real-time Tracking</h4>
              <p style={styles.infoCardText}>Monitor progress, attendance, and performance</p>
            </div>
            
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🔒</div>
              <h4 style={styles.infoCardTitle}>Secure & Safe</h4>
              <p style={styles.infoCardText}>Protected with Firebase authentication</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Built with ❤️ using <strong>React</strong> • <strong>FastAPI</strong> • <strong>Firebase</strong> • <strong>Gemini AI</strong>
          </p>
          <p style={styles.copyright}>© 2026 LearnAge • Empowering Education Through Technology</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  bgShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: '500px',
    height: '500px',
    top: '-200px',
    right: '-150px',
    animation: 'float 8s ease-in-out infinite',
  },
  circle2: {
    width: '400px',
    height: '400px',
    bottom: '-150px',
    left: '-100px',
    animation: 'float 10s ease-in-out infinite',
  },
  circle3: {
    width: '300px',
    height: '300px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 12s ease-in-out infinite',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-block',
    padding: '10px 25px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    marginBottom: '30px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '56px',
    fontWeight: '900',
    color: 'white',
    marginBottom: '20px',
    lineHeight: '1.2',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  brandName: {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '40px',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto 40px',
  },
  features: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: '24px',
  },
  featureText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
  },
  cardsSection: {
    marginBottom: '80px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: '50px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px 30px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  cardIconCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  },
  cardEmoji: {
    fontSize: '48px',
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '12px',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '24px',
    textAlign: 'center',
  },
  cardFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  cardFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIcon: {
    fontSize: '18px',
    fontWeight: '900',
  },
  featureLabel: {
    fontSize: '15px',
    color: '#374151',
    fontWeight: '500',
  },
  cardButton: {
    width: '100%',
    padding: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  infoSection: {
    marginBottom: '60px',
  },
  infoTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px 24px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  infoIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  infoCardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '10px',
  },
  infoCardText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '40px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    marginBottom: '10px',
  },
  copyright: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  .infoCard:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Landing;