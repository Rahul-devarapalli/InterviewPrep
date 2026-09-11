import React, { useState, useEffect, useMemo } from 'react';

export default function ApiTableSorting() {
  // TODO: 1. Set up state variables:
  // - data: array to hold the list of users (default: [])
  // - loading: boolean indicating whether data is being fetched (default: true)
  // - error: string or null to store any error message (default: null)
  // - sortConfig: object to track sorting state (default: { key: null, direction: 'asc' })

  // TODO: 2. Fetch user data on mount using useEffect:
  // - Endpoint: 'https://jsonplaceholder.typicode.com/users'
  // - Set loading to true initially, fetch data, update data state, and handle errors
  // - Include cleanup logic (e.g., isMounted flag or AbortController) to avoid updating state on an unmounted component

  // TODO: 3. Derive/memoize sortedData using useMemo based on data and sortConfig:
  // - If sortConfig.key is null, return data as-is
  // - Support nested keys (e.g., 'address.city', 'company.name')
  // - Sort ascending or descending based on sortConfig.direction

  // TODO: 4. Implement requestSort(key) handler:
  // - If the clicked column is already the active sort key and direction is 'asc', change direction to 'desc'
  // - Otherwise, set the sort key to the clicked column and direction to 'asc'

  // TODO: 5. Implement getSortIcon(key) helper:
  // - Return ' ↕' if the column is not currently sorted
  // - Return ' ▲' if sorted 'asc', or ' ▼' if sorted 'desc'

  return (
    <div>
      <h2>User Directory</h2>

      {/* TODO: Conditionally display loading indicator (e.g. <div>Loading...</div>) when loading */}

      {/* TODO: Conditionally display error message (e.g. <div>Error: {error}</div>) if error occurs */}

      {/* TODO: Wire up table: onClick to requestSort(key) and getSortIcon(key) on headers, and map over sortedData in tbody */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Map over sortedData and render rows:
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
              <td>{user.company.name}</td>
            </tr>
          */}
        </tbody>
      </table>
    </div>
  );
}
