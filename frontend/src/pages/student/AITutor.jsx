import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { aiAPI } from '../../services/api';

const AITutor = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

 const studentLinks = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Attendance', path: '/student/attendance' },
  { label: 'Homework', path: '/student/homework' },
  { label: 'AI Tutor', path: '/student/ai-tutor' },
  { label: 'Class Chat', path: '/student/class-chat' },  // ← ADD THIS
];

  const handleAsk = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await aiAPI.chat(question);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAnswer('Sorry, I could not process your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="Student" links={studentLinks}>
      <h1 style={styles.title}>AI Tutor</h1>
      <p style={styles.subtitle}>Ask me anything about your studies!</p>
      
      <div style={styles.container}>
        <form onSubmit={handleAsk} style={styles.form}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here... (e.g., Explain photosynthesis)"
            style={styles.textarea}
            rows="4"
          />
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask AI Tutor'}
          </button>
        </form>
        
        {answer && (
          <div style={styles.answerCard}>
            <h3 style={styles.answerTitle}>Answer:</h3>
            <p style={styles.answerText}>{answer}</p>
          </div>
        )}
        
        {!answer && !loading && (
          <div style={styles.placeholder}>
            <p>💡 Try asking questions like:</p>
            <ul style={styles.exampleList}>
              <li>Explain the Pythagorean theorem</li>
              <li>What is photosynthesis?</li>
              <li>How do I solve quadratic equations?</li>
              <li>What are Newton's laws of motion?</li>
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  container: {
    maxWidth: '800px',
  },
  form: {
    marginBottom: '30px',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginBottom: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  answerCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  answerTitle: {
    margin: '0 0 15px 0',
    fontSize: '20px',
    color: '#2c3e50',
  },
  answerText: {
    margin: 0,
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#34495e',
    whiteSpace: 'pre-wrap',
  },
  placeholder: {
    backgroundColor: '#ecf0f1',
    padding: '25px',
    borderRadius: '10px',
  },
  exampleList: {
    marginTop: '15px',
    paddingLeft: '20px',
  },
};

export default AITutor;