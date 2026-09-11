import React, { useState, useEffect } from 'react';

const styles = {
  container: { backgroundColor: '#1a1a2e', color: '#e0e0e0', padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh' },
  header: { color: '#00d4ff', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { padding: '12px', borderBottom: '2px solid #00d4ff', cursor: 'pointer', textAlign: 'left', userSelect: 'none' },
  td: { padding: '12px', borderBottom: '1px solid #333' },
  spinner: { border: '4px solid #333', borderTop: '4px solid #00d4ff', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '20px auto' },
  error: { color: '#ff4c4c', padding: '10px', backgroundColor: 'rgba(255, 76, 76, 0.1)', borderRadius: '4px' }
};

export default function ApiTableSorting() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Key concept: useEffect dependency array. Empty array means this runs once on mount.
  useEffect(() => {
    let isMounted = true; // Key concept: useEffect cleanup to prevent state updates on unmounted component

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Key concept: controlled sorting. We derive sorted data from state rather than mutating data directly.
  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Extract nested values if needed (e.g. address.city)
        const getVal = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
        const aVal = getVal(a, sortConfig.key);
        const bVal = getVal(b, sortConfig.key);
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <h2 style={styles.header}>User Directory</h2>
      
      {loading && <div style={styles.spinner}></div>}
      
      {error && <div style={styles.error}>Error: {error}</div>}
      
      {!loading && !error && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => requestSort('id')}>ID{getSortIcon('id')}</th>
              <th style={styles.th} onClick={() => requestSort('name')}>Name{getSortIcon('name')}</th>
              <th style={styles.th} onClick={() => requestSort('email')}>Email{getSortIcon('email')}</th>
              <th style={styles.th} onClick={() => requestSort('address.city')}>City{getSortIcon('address.city')}</th>
              <th style={styles.th} onClick={() => requestSort('company.name')}>Company{getSortIcon('company.name')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(user => (
              <tr key={user.id}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.address.city}</td>
                <td style={styles.td}>{user.company.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
