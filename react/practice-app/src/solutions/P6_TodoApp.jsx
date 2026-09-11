import React, { useState, useEffect, useRef } from 'react';

// Key concept: localStorage sync for persistence
const LOCAL_STORAGE_KEY = 'practice_todo_app';

export default function TodoApp() {
  // Key concept: Initialization from localStorage
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('All'); // 'All', 'Active', 'Completed'
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const editInputRef = useRef(null);

  // Sync to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Key concept: Array immutability when adding
  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // Key concept: Array immutability when updating
  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Key concept: Array immutability when deleting
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      handleDelete(editingId); // delete if empty
    } else {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      ));
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') setEditingId(null);
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Key concept: Derived state for filtering and counting
  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div>
      <div>
        <h1>todos</h1>
        
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        <ul>
          {filteredTodos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
              />
              
              {editingId === todo.id ? (
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleEditKeyDown}
                />
              ) : (
                <span onDoubleClick={() => handleStartEdit(todo)}>
                  {todo.text}
                </span>
              )}
              
              <button 
                onClick={() => handleDelete(todo.id)}
                title="Delete"
              >
                ×
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <li>No todos yet. Add one above!</li>
          )}
        </ul>

        {todos.length > 0 && (
          <div>
            <span>
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </span>
            
            <div>
              {['All', 'Active', 'Completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            
            {todos.some(t => t.completed) && (
              <button onClick={handleClearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
