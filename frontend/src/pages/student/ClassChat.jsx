import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { messagesAPI, authAPI } from '../../services/api';

const ClassChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState('');
  const [userName, setUserName] = useState('');

  const studentLinks = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Attendance', path: '/student/attendance' },
    { label: 'Homework', path: '/student/homework' },
    { label: 'AI Tutor', path: '/student/ai-tutor' },
    { label: 'Class Chat', path: '/student/class-chat' },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [classId]);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await authAPI.verifyToken(token);
        setClassId(response.data.class_id);
        setUserName(response.data.name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getClassMessages(classId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      await messagesAPI.sendMessage({
        class_id: classId,
        sender_id: user.uid,
        sender_name: userName,
        sender_role: 'student',
        message: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout role="Student" links={studentLinks}>
      <h1 style={styles.title}>Class Chat 💬</h1>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.length === 0 ? (
            <div style={styles.noMessages}>
              <p>📢 No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageCard,
                  backgroundColor: msg.sender_role === 'teacher' ? '#e3f2fd' : '#f5f5f5'
                }}
              >
                <div style={styles.messageHeader}>
                  <div>
                    <strong style={styles.senderName}>
                      {msg.sender_role === 'teacher' ? '👨‍🏫' : '🎓'} {msg.sender_name}
                    </strong>
                    <span style={styles.role}> ({msg.sender_role})</span>
                  </div>
                  <span style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
                </div>
                <p style={styles.messageText}>{msg.message}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} style={styles.inputForm}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question or reply to your teacher..."
            style={styles.textarea}
            rows="3"
            disabled={loading}
          />
          <button
            type="submit"
            style={styles.sendBtn}
            disabled={loading || !newMessage.trim()}
          >
            {loading ? 'Sending...' : '📤 Send Message'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  noMessages: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '40px',
    fontSize: '16px',
  },
  messageCard: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  senderName: {
    fontSize: '16px',
    color: '#2c3e50',
  },
  role: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  timestamp: {
    fontSize: '12px',
    color: '#95a5a6',
  },
  messageText: {
    fontSize: '15px',
    color: '#34495e',
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
  },
  inputForm: {
    borderTop: '1px solid #ecf0f1',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  textarea: {
    padding: '12px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  sendBtn: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
};

export default ClassChat;