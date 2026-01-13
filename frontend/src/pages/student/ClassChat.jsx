import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { auth } from '../../services/firebase';
import { messagesAPI, authAPI } from '../../services/api';

const ClassChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState('');
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const getRoleColor = (role) => {
    if (role === 'teacher') return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
    if (role === 'student') return { bg: '#dcfce7', border: '#22c55e', text: '#15803d' };
    return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
  };

  return (
    <Layout role="Student" links={studentLinks}>
      <div style={styles.container} className="chat-container">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerIconCircle}>
              <span style={styles.headerIcon}>💬</span>
            </div>
            <div>
              <h1 style={styles.title}>Class Chat</h1>
              <p style={styles.subtitle}>
                {classId ? `Class: ${classId} • ${messages.length} messages` : 'Loading...'}
              </p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <span style={styles.statusDot}>●</span>
            <span style={styles.statusText}>Live</span>
          </div>
        </div>

        {/* Chat Container */}
        <div style={styles.chatContainer}>
          {/* Messages Area */}
          <div style={styles.messagesArea}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <h3 style={styles.emptyTitle}>No messages yet</h3>
                <p style={styles.emptyText}>
                  Start the conversation! Ask your teacher a question or share something with your classmates.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const roleColors = getRoleColor(msg.sender_role);
                  const isTeacher = msg.sender_role === 'teacher';
                  
                  return (
                    <div
                      key={msg.id}
                      style={styles.messageWrapper}
                      className="message-wrapper"
                    >
                      <div style={{
                        ...styles.messageCard,
                        background: isTeacher ? '#eff6ff' : 'white',
                        borderLeft: `4px solid ${roleColors.border}`,
                      }}>
                        {/* Message Header */}
                        <div style={styles.messageHeader}>
                          <div style={styles.senderInfo}>
                            <div style={{
                              ...styles.roleIconCircle,
                              background: roleColors.bg,
                              border: `2px solid ${roleColors.border}`,
                            }}>
                              <span style={styles.roleIcon}>
                                {isTeacher ? '👨‍🏫' : '🎓'}
                              </span>
                            </div>
                            <div>
                              <div style={styles.senderName}>{msg.sender_name}</div>
                              <div style={{
                                ...styles.roleBadge,
                                background: roleColors.bg,
                                color: roleColors.text,
                              }}>
                                {msg.sender_role}
                              </div>
                            </div>
                          </div>
                          <div style={styles.timestamp}>
                            <span style={styles.timestampIcon}>🕐</span>
                            {formatTimestamp(msg.timestamp)}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div style={styles.messageContent}>
                          <p style={styles.messageText}>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <div style={styles.inputContainer}>
            <form onSubmit={handleSendMessage} style={styles.inputForm}>
              <div style={styles.inputWrapper}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here... Press Enter to send"
                  style={styles.textarea}
                  className="chat-input"
                  rows="2"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  style={{
                    ...styles.sendBtn,
                    opacity: loading || !newMessage.trim() ? 0.6 : 1,
                    cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                  }}
                  className="send-button"
                  disabled={loading || !newMessage.trim()}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner} className="button-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span style={styles.sendIcon}>📤</span>
                      Send
                    </>
                  )}
                </button>
              </div>
              <div style={styles.inputHint}>
                <span style={styles.hintIcon}>💡</span>
                <span style={styles.hintText}>
                  Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for new line
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerIconCircle: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  headerIcon: {
    fontSize: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#111827',
    margin: '0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#dcfce7',
    border: '1px solid #86efac',
    borderRadius: '10px',
  },
  statusDot: {
    color: '#16a34a',
    fontSize: '12px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#16a34a',
  },
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f3f4f6',
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.6',
    maxWidth: '400px',
  },
  messageWrapper: {
    animation: 'slideIn 0.3s ease-out',
  },
  messageCard: {
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px',
  },
  senderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  roleIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleIcon: {
    fontSize: '20px',
  },
  senderName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '2px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
    flexShrink: 0,
  },
  timestampIcon: {
    fontSize: '14px',
  },
  messageContent: {
    paddingLeft: '52px',
  },
  messageText: {
    fontSize: '15px',
    color: '#374151',
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  },
  inputContainer: {
    borderTop: '2px solid #f3f4f6',
    background: '#f9fafb',
    padding: '20px',
  },
  inputForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    resize: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    color: '#111827',
  },
  sendBtn: {
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
  },
  sendIcon: {
    fontSize: '16px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
  },
  inputHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6b7280',
  },
  hintIcon: {
    fontSize: '14px',
  },
  hintText: {
    lineHeight: '1.4',
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
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .button-spinner {
    animation: spin 1s linear infinite;
  }
  
  .chat-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  .message-wrapper:hover .messageCard {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  .chat-input:focus {
    outline: none;
    border-color: #4F46E5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  .send-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #4338CA 0%, #5B21B6 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35) !important;
  }
  
  .send-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  /* Custom scrollbar */
  .messagesArea::-webkit-scrollbar {
    width: 8px;
  }
  
  .messagesArea::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
  }
  
  .messagesArea::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  
  .messagesArea::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .inputWrapper {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .sendBtn {
      width: 100%;
      justify-content: center;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ClassChat;