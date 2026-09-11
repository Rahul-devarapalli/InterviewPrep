import React, { createContext, useContext, useState } from 'react';

// Key Interview Concepts Demonstrated:
// 1. Context API (createContext, useContext): Avoiding prop drilling for global states like theme/settings.
// 2. Provider Pattern: Wrapping application parts with Context.Provider to supply values to deeply nested children.
// 3. Multi-Context composition: Handling independent contexts (Theme and Preferences).

// 1. Create Contexts
const ThemeContext = createContext();
const PreferenceContext = createContext();

// Mock deeply nested component 1
const Card = () => {
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useContext(PreferenceContext);

  const styles = {
    card: {
      padding: '20px',
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: theme === 'dark' ? '#2a2a4a' : '#ffffff',
      color: theme === 'dark' ? '#e0e0e0' : '#333333',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '20px' : '16px'
    }
  };

  return (
    <div style={styles.card}>
      <h3>Themed Content Card</h3>
      <p>This component reads from both ThemeContext and PreferenceContext directly, avoiding prop drilling.</p>
    </div>
  );
};

// Mock deeply nested component 2
const ThemedButton = ({ onClick, children }) => {
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useContext(PreferenceContext);
  
  const styles = {
    btn: {
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      backgroundColor: theme === 'dark' ? '#00d4ff' : '#0056b3',
      color: theme === 'dark' ? '#1a1a2e' : '#ffffff',
      fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '18px' : '14px',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <button style={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
};

// Mock nested container to show depth
const DashboardContent = () => {
  return (
    <div style={{ marginTop: '20px' }}>
      <Card />
      <Card />
    </div>
  );
};

// Layout component combining UI controls
const Layout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { fontSize, setFontSize } = useContext(PreferenceContext);

  const containerStyle = {
    minHeight: '100vh',
    padding: '40px',
    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f0f2f5',
    color: theme === 'dark' ? '#e0e0e0' : '#111',
    transition: 'all 0.3s ease',
    fontFamily: 'system-ui, sans-serif'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: theme === 'dark' ? '#2a2a4a' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`
  };

  return (
    <div style={containerStyle}>
      <h2>Context API Demo</h2>
      
      <div style={controlsStyle}>
        <ThemedButton onClick={toggleTheme}>
          Toggle Theme ({theme})
        </ThemedButton>
        
        <select 
          style={selectStyle}
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="small">Small Font</option>
          <option value="medium">Medium Font</option>
          <option value="large">Large Font</option>
        </select>
      </div>

      {/* Deeply nested component tree */}
      <DashboardContent />
    </div>
  );
};

// Root Component / Provider Wrapper
const P10_ContextTheme = () => {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PreferenceContext.Provider value={{ fontSize, setFontSize }}>
        <Layout />
      </PreferenceContext.Provider>
    </ThemeContext.Provider>
  );
};

export default P10_ContextTheme;
