import React, { useState, useEffect } from 'react';

// Custom hook: Debounces a given value by specified delay in milliseconds
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

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

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
        const users = await res.json();

        const filtered = users.filter(
          (user) =>
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

    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]);

  return (
    <div>
      <h2>User Search (Debounced)</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        <div>
          <strong>Raw Value:</strong> "{searchTerm}"
        </div>
        <div>
          <strong>Debounced Value:</strong> "{debouncedSearchTerm}"
        </div>
        <div>
          <strong>Status:</strong> {isSearching ? 'Searching...' : 'Idle'}
        </div>
      </div>

      {error && <div>Error: {error}</div>}

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            <div><strong>{user.name}</strong></div>
            <div>
              {user.email} | {user.company?.name}
            </div>
          </li>
        ))}
        {debouncedSearchTerm && !isSearching && results.length === 0 && !error && (
          <li>No results found.</li>
        )}
      </ul>
    </div>
  );
}
