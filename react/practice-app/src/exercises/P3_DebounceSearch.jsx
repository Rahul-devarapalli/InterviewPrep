import React, { useState, useEffect } from 'react';

// TODO: Implement custom useDebounce hook
// 1. Maintain a state 'debouncedValue' initialized to 'value'.
// 2. Set up a useEffect with dependencies [value, delay].
// 3. Inside the effect, set up a timer using setTimeout to update 'debouncedValue' after 'delay' milliseconds.
// 4. Return a cleanup function (clearTimeout) to cancel the pending timer if 'value' or 'delay' changes before the timer completes.
// 5. Return 'debouncedValue'.
function useDebounce(value, delay) {
  // TODO: Implement debounce logic
}

export default function DebounceSearch() {
  // TODO: 1. Declare state for search term: 'searchTerm' (string, default: '')
  // TODO: 2. Get debounced search term using useDebounce(searchTerm, 300)
  // TODO: 3. Declare state for fetched users: 'results' (array, default: [])
  // TODO: 4. Declare state for loading indicator: 'isSearching' (boolean, default: false)
  // TODO: 5. Declare state for errors: 'error' (null or string, default: null)

  // TODO: 6. Implement useEffect triggered when 'debouncedSearchTerm' changes:
  //   - If debouncedSearchTerm is empty or whitespace-only:
  //       reset results to [] and isSearching to false, then return early.
  //   - Set isSearching to true and error to null.
  //   - Instantiate an AbortController and get its signal to handle request cancellation.
  //   - Fetch users from 'https://jsonplaceholder.typicode.com/users' with { signal }.
  //   - Filter the returned users where user.name or user.email includes debouncedSearchTerm (case-insensitive).
  //   - Update results state with filtered users.
  //   - Catch errors: ignore 'AbortError', otherwise set error state to err.message.
  //   - In finally block, set isSearching to false.
  //   - Return cleanup function that calls controller.abort().

  return (
    <div>
      <h2>User Search (Debounced)</h2>

      {/* TODO: Bind value to searchTerm and onChange to update searchTerm */}
      <input
        type="text"
        placeholder="Search by name or email..."
      />

      <div>
        <div>
          <strong>Raw Value:</strong> {/* TODO: Display searchTerm */}
        </div>
        <div>
          <strong>Debounced Value:</strong> {/* TODO: Display debouncedSearchTerm */}
        </div>
        <div>
          <strong>Status:</strong> {/* TODO: Display 'Searching...' if isSearching, else 'Idle' */}
        </div>
      </div>

      {/* TODO: Render error message if error exists */}

      <ul>
        {/* TODO: Map over results and render user items */}
        {/*
          <li key={user.id}>
            <div><strong>{user.name}</strong></div>
            <div>
              {user.email} | {user.company?.name}
            </div>
          </li>
        */}

        {/* TODO: Display "No results found." when debouncedSearchTerm is not empty, not searching, results is empty, and no error */}
      </ul>
    </div>
  );
}
