import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { parentAPI } from '../../services/api';

const ParentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const parentLinks = [
    { label: 'Dashboard', path: '/parent/dashboard' },
    { label: 'Attendance', path: '/parent/attendance' },
    { label: 'Homework', path: '/parent/homework' },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const childId = localStorage.getItem('child_id');
        if (childId) {
          const response = await parentAPI.getChildAttendance(childId);
          setAttendance(response.data.attendance);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <Layout role="Parent" links={parentLinks}>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout role="Parent" links={parentLinks}>
      <h1 style={styles.title}>Child's Attendance</h1>
      
      {attendance.length === 0 ? (
        <p style={styles.noData}>No attendance records found.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{record.date}</td>
                  <td style={{
                    ...styles.td,
                    color: record.status === 'Present' ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  noData: {
    fontSize: '16px',
    color: '#7f8c8d',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #ecf0f1',
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  tr: {
    borderBottom: '1px solid #ecf0f1',
  },
  td: {
    padding: '12px',
  },
};

export default ParentAttendance;
