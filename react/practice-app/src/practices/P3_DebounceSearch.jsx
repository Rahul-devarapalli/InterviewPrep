import React, { useState, useEffect } from 'react';

const styles = {
  container: { backgroundColor: '#1a1a2e', color: '#e0e0e0', padding: '30px', fontFamily: 'sans-serif', minHeight: '100vh', maxWidth: '600px', margin: '0 auto' },
  header: { color: '#00d4ff', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #00d4ff', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
  debugBox: { backgroundColor: '#252542', padding: '15px', borderRadius: '8px', marginTop: '20px', fontFamily: 'monospace' },
  resultList: { listStyleType: 'none', padding: 0, marginTop: '20px' },
  resultItem: { padding: '15px', borderBottom: '1px solid #333', backgroundColor: '#252542', marginBottom: '5px', borderRadius: '4px' },
  spinner: { border: '3px solid #333', borderTop: '3px solid #00d4ff', borderRadius: '50%', width: '15px', height: '15px', animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }
};

// Key concept: custom hooks. Encapsulating logic for reuse.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Key concept: closures in setTimeout. The timeout callback captures the `value`.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Key concept: cleanup in useEffect. Cancels the previous timeout if value changes before delay completes.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function DebounceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    // Key concept: AbortController to cancel stale network requests
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
        const users = await res.json();
        
        // Simulating search on the client side since the dummy API doesn't support generic text search well
        const filtered = users.filter(user => 
          user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        
        setResults(filtered);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsSearching(false);
      }
    };

    fetchUsers();

    // Cleanup aborts the fetch if debouncedSearchTerm changes while fetching
    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <h2 style={styles.header}>User Search (Debounced)</h2>
      
      <input
        type="text"
        style={styles.input}
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={styles.debugBox}>
        <div><strong>Raw Value:</strong> "{searchTerm}"</div>
        <div><strong>Debounced Value:</strong> "{debouncedSearchTerm}"</div>
        <div><strong>Status:</strong> {isSearching ? <><span style={styles.spinner}></span> Searching...</> : 'Idle'}</div>
      </div>

      {error && <div style={{ color: '#ff4c4c', marginTop: '20px' }}>Error: {error}</div>}

      <ul style={styles.resultList}>
        {results.map(user => (
          <li key={user.id} style={styles.resultItem}>
            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
            <div style={{ color: '#aaa', fontSize: '0.9em' }}>{user.email} | {user.company.name}</div>
          </li>
        ))}
        {debouncedSearchTerm && !isSearching && results.length === 0 && !error && (
          <li style={styles.resultItem}>No results found.</li>
        )}
      </ul>
    </div>
  );
}
