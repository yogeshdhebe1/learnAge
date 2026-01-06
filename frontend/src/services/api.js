import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: (token) => api.post('/auth/verify-token', null, { params: { token } }),
  getUser: (uid) => api.get(`/auth/user/${uid}`),
};

// Student API
export const studentAPI = {
  getDashboard: (studentId) => api.get(`/student/dashboard/${studentId}`),
  getAttendance: (studentId) => api.get(`/student/attendance/${studentId}`),
  getHomework: (studentId) => api.get(`/student/homework/${studentId}`),
  submitHomework: (homeworkId, studentId) => 
    api.put(`/student/homework/${homeworkId}/submit`, null, { params: { student_id: studentId } }),
};

// Teacher API
export const teacherAPI = {
  getDashboard: (teacherId) => api.get(`/teacher/dashboard/${teacherId}`),
  getStudents: (classId) => api.get(`/teacher/students/${classId}`),
  markAttendance: (attendanceData, teacherId) => 
    api.post('/teacher/attendance', attendanceData, { params: { teacher_id: teacherId } }),
  assignHomework: (homeworkData, teacherId) => 
    api.post('/teacher/homework', homeworkData, { params: { teacher_id: teacherId } }),
  // ADD THIS NEW LINE:
  addStudent: (studentData, teacherId) =>
    api.post('/teacher/add-student', studentData, { params: { teacher_id: teacherId } }),
};

// Parent API
export const parentAPI = {
  getDashboard: (parentId) => api.get(`/parent/dashboard/${parentId}`),
  getChildAttendance: (childId) => api.get(`/parent/attendance/${childId}`),
  getChildHomework: (childId) => api.get(`/parent/homework/${childId}`),
};

// AI API
export const aiAPI = {
  chat: (question, context = null) => api.post('/ai/chat', { question, context }),
};
// Messages API
export const messagesAPI = {
  getClassMessages: (classId, limit = 50) => 
    api.get(`/messages/class/${classId}`, { params: { limit } }),
  sendMessage: (messageData) => 
    api.post('/messages/send', messageData),
  deleteMessage: (messageId, userId) => 
    api.delete(`/messages/${messageId}`, { params: { user_id: userId } }),
};

export default api;
