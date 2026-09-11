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

  return (
    <div>
      <h3>Themed Content Card</h3>
      <p>Active Theme: {theme} | Active Font Size: {fontSize}</p>
      <p>This component reads from both ThemeContext and PreferenceContext directly, avoiding prop drilling.</p>
    </div>
  );
};

// Mock deeply nested component 2
const ThemedButton = ({ onClick, children }) => {
  const { theme } = useContext(ThemeContext);
  const { fontSize } = useContext(PreferenceContext);

  return (
    <button onClick={onClick} title={`Theme: ${theme}, Size: ${fontSize}`}>
      {children}
    </button>
  );
};

// Mock nested container to show depth
const DashboardContent = () => {
  return (
    <div>
      <Card />
      <Card />
    </div>
  );
};

// Layout component combining UI controls
const Layout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { fontSize, setFontSize } = useContext(PreferenceContext);

  return (
    <div>
      <h2>Context API Demo</h2>
      
      <div>
        <ThemedButton onClick={toggleTheme}>
          Toggle Theme ({theme})
        </ThemedButton>
        
        <select 
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
