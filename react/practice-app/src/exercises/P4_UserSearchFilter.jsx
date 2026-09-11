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
  // TODO: Declare state for `searchTerm` (string) and `selectedUser` (object or null)

  // TODO: Derive `filteredUsers` from `USERS` and `searchTerm`:
  // - Return empty array if `searchTerm.length < 2`
  // - Filter case-insensitively across name, email, and role
  // - Wrap with `useMemo` for performance optimization

  // TODO: Implement `handleSelect(user)` to update `selectedUser` and reset `searchTerm`

  // TODO: Implement `handleClear()` to reset both `searchTerm` and `selectedUser`

  // TODO: (Optional) Implement `highlightMatch(text, term)` helper to highlight matched text using <mark>

  return (
    <div>
      <div>
        <h2>User Directory</h2>
        
        {/* Search Input Area */}
        <div>
          <input
            type="text"
            placeholder="Search by name, email or role..."
            // TODO: Wire up value and onChange
          />
          {/* TODO: Conditionally display Clear button if searchTerm or selectedUser exists */}
          <button /* onClick={handleClear} */>Clear</button>
        </div>

        {/* Selected User Details */}
        {/* TODO: Conditionally render selected user card when selectedUser is present */}
        <div>
          <h3>Selected User</h3>
          <p><strong>Name:</strong> {/* display selectedUser.name */}</p>
          <p><strong>Email:</strong> {/* display selectedUser.email */}</p>
          <p><strong>Role:</strong> <span>{/* display selectedUser.role */}</span></p>
        </div>

        {/* Results Area */}
        <div>
          {/* TODO: If 0 < searchTerm.length < 2, display: "Type at least 2 characters to search..." */}
          
          {/* TODO: If searchTerm.length >= 2 and filteredUsers is empty, display: "No results found for ..." */}

          {/* TODO: If searchTerm.length >= 2 and filteredUsers has matches, render the list of users */}
          <ul>
            {/* Map over filteredUsers to render <li> items:
                - Add onClick handler to select the user
                - Display user name, email, and role (optionally wrapped in highlightMatch)
            */}
          </ul>
        </div>
      </div>
    </div>
  );
}
