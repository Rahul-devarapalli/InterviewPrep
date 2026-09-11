import React, { useState, useEffect, useRef } from 'react';

// Key concept: localStorage sync for persistence
const LOCAL_STORAGE_KEY = 'practice_todo_app';

export default function TodoApp() {
  // TODO: Initialize `todos` state from localStorage (or fallback to empty array [])
  // Each todo item should have the shape: { id: string, text: string, completed: boolean }

  // TODO: State for new todo input (`inputValue`)

  // TODO: State for current filter (`filter`), e.g., 'All' | 'Active' | 'Completed'

  // TODO: State for editing: `editingId` (id of todo being edited or null) and `editValue` (string)

  // TODO: Ref for the edit input element (`editInputRef`) to focus when editing starts

  // TODO: useEffect to persist `todos` into localStorage whenever `todos` changes

  // TODO: useEffect to auto-focus `editInputRef` when `editingId` starts

  // TODO: Implement `handleAdd(e)`:
  // - Prevent default form submission
  // - Ensure input text is not empty (after trimming)
  // - Append new todo with unique id (e.g. crypto.randomUUID()), text, and completed: false
  // - Reset `inputValue` to empty string

  // TODO: Implement `handleToggle(id)` to toggle completed state of a todo immutably

  // TODO: Implement `handleDelete(id)` to remove a todo by id immutably

  // TODO: Implement `handleStartEdit(todo)` to set `editingId` and initialize `editValue`

  // TODO: Implement `handleSaveEdit()`:
  // - If trimmed `editValue` is empty, delete the todo
  // - Otherwise, update todo text immutably
  // - Reset `editingId` to null

  // TODO: Implement `handleEditKeyDown(e)`:
  // - Save on 'Enter'
  // - Cancel editing on 'Escape'

  // TODO: Implement `handleClearCompleted()` to remove all completed todos

  // TODO: Derive `filteredTodos` from `todos` based on `filter` ('All', 'Active', 'Completed')

  // TODO: Derive `activeCount` representing the number of incomplete todos

  return (
    <div>
      <div>
        <h1>todos</h1>
        
        {/* Form to add new todo */}
        <form /* onSubmit={handleAdd} */>
          <input
            type="text"
            placeholder="What needs to be done?"
            // TODO: Wire up value and onChange
          />
          <button type="submit">Add</button>
        </form>

        {/* Todo list */}
        <ul>
          {/* TODO: Map over filteredTodos to render each todo item:
              <li key={todo.id}>
                - Checkbox input: checked={todo.completed}, onChange={() => handleToggle(todo.id)}
                - Conditional rendering based on editingId === todo.id:
                    If editing:
                      <input
                        ref={editInputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleEditKeyDown}
                      />
                    Else:
                      <span onDoubleClick={() => handleStartEdit(todo)}>
                        {todo.text}
                      </span>
                - Delete button: onClick={() => handleDelete(todo.id)}
              </li>
          */}

          {/* TODO: If todos is empty, display:
              <li>No todos yet. Add one above!</li>
          */}
        </ul>

        {/* Footer controls: Active count, Filter buttons, and Clear Completed button */}
        {/* TODO: Conditionally render footer when todos.length > 0 */}
        <div>
          <span>
            {/* TODO: Display active count, e.g. `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left` */}
            0 items left
          </span>
          
          <div>
            {['All', 'Active', 'Completed'].map(f => (
              <button
                key={f}
                // TODO: Wire up onClick to setFilter(f)
              >
                {f}
              </button>
            ))}
          </div>
          
          {/* TODO: Conditionally render clear button if any todo is completed */}
          {/* <button onClick={handleClearCompleted}>Clear completed</button> */}
        </div>
      </div>
    </div>
  );
}
