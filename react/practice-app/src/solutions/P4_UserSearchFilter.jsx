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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

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

  const highlightMatch = (text, term) => {
    if (!term || term.length < 2) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? 
        <mark key={index}>{part}</mark> : part
    );
  };

  return (
    <div>
      <div>
        <h2>User Directory</h2>
        
        {/* Search Input Area */}
        <div>
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(searchTerm || selectedUser) && (
            <button onClick={handleClear}>Clear</button>
          )}
        </div>

        {/* Selected User Details */}
        {selectedUser && (
          <div>
            <h3>Selected User</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> <span>{selectedUser.role}</span></p>
          </div>
        )}

        {/* Results Area */}
        <div>
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p>Type at least 2 characters to search...</p>
          )}
          
          {searchTerm.length >= 2 && filteredUsers.length === 0 && (
            <p>No results found for "{searchTerm}"</p>
          )}

          {searchTerm.length >= 2 && filteredUsers.length > 0 && (
            <ul>
              {filteredUsers.map(user => (
                <li 
                  key={user.id} 
                  onClick={() => handleSelect(user)}
                >
                  <div>
                    <div>{highlightMatch(user.name, searchTerm)}</div>
                    <div>{highlightMatch(user.email, searchTerm)}</div>
                  </div>
                  <div>
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
