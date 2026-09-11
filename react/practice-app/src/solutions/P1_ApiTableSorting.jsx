import React, { useState, useEffect, useMemo } from 'react';

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
  const sortedData = useMemo(() => {
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
    <div>
      <h2>User Directory</h2>

      {loading && <div>Loading...</div>}

      {error && <div>Error: {error}</div>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}>ID{getSortIcon('id')}</th>
              <th onClick={() => requestSort('name')}>Name{getSortIcon('name')}</th>
              <th onClick={() => requestSort('email')}>Email{getSortIcon('email')}</th>
              <th onClick={() => requestSort('address.city')}>City{getSortIcon('address.city')}</th>
              <th onClick={() => requestSort('company.name')}>Company{getSortIcon('company.name')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address.city}</td>
                <td>{user.company.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
