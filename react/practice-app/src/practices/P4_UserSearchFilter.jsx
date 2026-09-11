import React, { useState, useMemo } from 'react';

// Hardcoded array of 20+ users
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Moderator' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'User' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'User' },
  { id: 7, name: 'George Miller', email: 'george@example.com', role: 'User' },
  { id: 8, name: 'Hannah Abbott', email: 'hannah@example.com', role: 'Moderator' },
  { id: 9, name: 'Ian McKellen', email: 'ian@example.com', role: 'User' },
  { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'Admin' },
  { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', role: 'User' },
  { id: 12, name: 'Laura Dern', email: 'laura@example.com', role: 'User' },
  { id: 13, name: 'Michael Scott', email: 'michael@example.com', role: 'Manager' },
  { id: 14, name: 'Nina Simone', email: 'nina@example.com', role: 'User' },
  { id: 15, name: 'Oscar Isaac', email: 'oscar@example.com', role: 'User' },
  { id: 16, name: 'Paul Rudd', email: 'paul@example.com', role: 'User' },
  { id: 17, name: 'Quentin Tarantino', email: 'quentin@example.com', role: 'Director' },
  { id: 18, name: 'Rachel Green', email: 'rachel@example.com', role: 'User' },
  { id: 19, name: 'Steve Carell', email: 'steve@example.com', role: 'User' },
  { id: 20, name: 'Tina Fey', email: 'tina@example.com', role: 'Writer' },
  { id: 21, name: 'Uma Thurman', email: 'uma@example.com', role: 'User' }
];

export default function UserSearchFilter() {
  // Key concept: Controlled input state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Key concept: Derived state using useMemo for performance.
  // We only filter if the search term is 2 or more characters.
  const filteredUsers = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return USERS.filter(user => 
      user.name.toLowerCase().includes(lowercasedTerm) ||
      user.email.toLowerCase().includes(lowercasedTerm) ||
      user.role.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedUser(null);
  };

  // Helper to highlight matching text
  const highlightMatch = (text, term) => {
    if (!term || term.length < 2) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? 
        <span key={index} style={styles.highlight}>{part}</span> : part
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Directory</h2>
        
        {/* Search Input Area */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          {(searchTerm || selectedUser) && (
            <button onClick={handleClear} style={styles.clearBtn}>Clear</button>
          )}
        </div>

        {/* Selected User Details */}
        {selectedUser && (
          <div style={styles.selectedCard}>
            <h3 style={styles.selectedTitle}>Selected User</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> <span style={styles.roleBadge}>{selectedUser.role}</span></p>
          </div>
        )}

        {/* Key concept: Conditional rendering based on search term length and results */}
        <div style={styles.resultsContainer}>
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p style={styles.message}>Type at least 2 characters to search...</p>
          )}
          
          {searchTerm.length >= 2 && filteredUsers.length === 0 && (
            <p style={styles.message}>No results found for "{searchTerm}"</p>
          )}

          {searchTerm.length >= 2 && filteredUsers.length > 0 && (
            <ul style={styles.list}>
              {filteredUsers.map(user => (
                <li 
                  key={user.id} 
                  style={styles.listItem}
                  onClick={() => handleSelect(user)}
                >
                  <div style={styles.userInfo}>
                    <div style={styles.userName}>{highlightMatch(user.name, searchTerm)}</div>
                    <div style={styles.userEmail}>{highlightMatch(user.email, searchTerm)}</div>
                  </div>
                  <div style={styles.roleBadge}>
                    {highlightMatch(user.role, searchTerm)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  title: {
    marginTop: 0,
    color: '#00d4ff',
    marginBottom: '1.5rem'
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '1rem',
    position: 'relative'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #0f3460',
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    fontSize: '1rem',
    outline: 'none'
  },
  clearBtn: {
    padding: '0 16px',
    backgroundColor: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  resultsContainer: {
    marginTop: '1rem'
  },
  message: {
    color: '#8892b0',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #0f3460',
    borderRadius: '4px'
  },
  listItem: {
    padding: '12px',
    borderBottom: '1px solid #0f3460',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: '#1a1a2e'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  userEmail: {
    fontSize: '0.85rem',
    color: '#8892b0'
  },
  roleBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    backgroundColor: '#0f3460',
    color: '#00d4ff',
    borderRadius: '12px',
    textTransform: 'uppercase'
  },
  highlight: {
    backgroundColor: '#00d4ff33',
    color: '#00d4ff',
    fontWeight: 'bold'
  },
  selectedCard: {
    padding: '1rem',
    backgroundColor: '#0f3460',
    borderRadius: '4px',
    marginBottom: '1rem',
    borderLeft: '4px solid #00d4ff'
  },
  selectedTitle: {
    marginTop: 0,
    color: '#00d4ff',
    fontSize: '1.1rem',
    marginBottom: '0.5rem'
  }
};
