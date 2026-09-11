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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>todos</h1>
        
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            type="text"
            style={styles.input}
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" style={styles.addBtn}>Add</button>
        </form>

        <ul style={styles.list}>
          {filteredTodos.map(todo => (
            <li key={todo.id} style={styles.listItem}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                style={styles.checkbox}
              />
              
              {editingId === todo.id ? (
                <input
                  ref={editInputRef}
                  style={styles.editInput}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleEditKeyDown}
                />
              ) : (
                <span 
                  style={{
                    ...styles.todoText, 
                    ...(todo.completed ? styles.completedText : {})
                  }}
                  onDoubleClick={() => handleStartEdit(todo)}
                >
                  {todo.text}
                </span>
              )}
              
              <button 
                onClick={() => handleDelete(todo.id)}
                style={styles.deleteBtn}
                title="Delete"
              >
                ×
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <li style={styles.emptyMessage}>No todos yet. Add one above!</li>
          )}
        </ul>

        {todos.length > 0 && (
          <div style={styles.footer}>
            <span style={styles.count}>
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </span>
            
            <div style={styles.filters}>
              {['All', 'Active', 'Completed'].map(f => (
                <button
                  key={f}
                  style={{
                    ...styles.filterBtn,
                    ...(filter === f ? styles.activeFilter : {})
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            
            {todos.some(t => t.completed) && (
              <button onClick={handleClearCompleted} style={styles.clearBtn}>
                Clear completed
              </button>
            )}
          </div>
        )}
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
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    width: '100%',
    maxWidth: '550px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
  },
  title: {
    textAlign: 'center',
    color: '#00d4ff',
    fontSize: '3rem',
    fontWeight: '200',
    margin: '0 0 1.5rem 0',
    letterSpacing: '2px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '16px',
    fontSize: '1.2rem',
    backgroundColor: '#1a1a2e',
    border: '1px solid #0f3460',
    borderRadius: '4px',
    color: '#e0e0e0',
    outline: 'none'
  },
  addBtn: {
    padding: '0 24px',
    fontSize: '1rem',
    backgroundColor: '#00d4ff',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    borderTop: '1px solid #0f3460'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 8px',
    borderBottom: '1px solid #0f3460',
    gap: '12px'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#00d4ff'
  },
  todoText: {
    flex: 1,
    fontSize: '1.2rem',
    wordBreak: 'break-all',
    transition: 'color 0.2s'
  },
  completedText: {
    color: '#8892b0',
    textDecoration: 'line-through'
  },
  editInput: {
    flex: 1,
    fontSize: '1.2rem',
    padding: '8px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #00d4ff',
    color: '#e0e0e0',
    borderRadius: '4px',
    outline: 'none'
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e94560',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0 8px',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '2rem',
    color: '#8892b0',
    fontStyle: 'italic'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 8px 0',
    fontSize: '0.9rem',
    color: '#8892b0',
    flexWrap: 'wrap',
    gap: '10px'
  },
  count: {
    minWidth: '60px'
  },
  filters: {
    display: 'flex',
    gap: '8px'
  },
  filterBtn: {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: '#8892b0',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  activeFilter: {
    borderColor: '#00d4ff',
    color: '#00d4ff'
  },
  clearBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#8892b0',
    cursor: 'pointer',
    padding: '4px 8px'
  }
};
