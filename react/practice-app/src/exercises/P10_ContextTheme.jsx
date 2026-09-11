import React, { createContext, useContext, useState } from 'react';

// Key Interview Concepts Demonstrated:
// 1. Context API (createContext, useContext): Avoiding prop drilling for global states like theme/settings.
// 2. Provider Pattern: Wrapping application parts with Context.Provider to supply values to deeply nested children.
// 3. Multi-Context composition: Handling independent contexts (Theme and Preferences).

// 1. Create Contexts
// TODO: Initialize ThemeContext and PreferenceContext using createContext()
const ThemeContext = createContext();
const PreferenceContext = createContext();

// Mock deeply nested component 1
const Card = () => {
  // TODO: Consume theme from ThemeContext and fontSize from PreferenceContext using useContext()

  return (
    <div>
      <h3>Themed Content Card</h3>
      {/* TODO: Display current theme and fontSize from context */}
      <p>Active Theme: {/* theme */} | Active Font Size: {/* fontSize */}</p>
      <p>This component reads from both ThemeContext and PreferenceContext directly, avoiding prop drilling.</p>
    </div>
  );
};

// Mock deeply nested component 2
const ThemedButton = ({ onClick, children }) => {
  // TODO: (Optional) Consume theme from ThemeContext and fontSize from PreferenceContext if needed

  return (
    <button onClick={onClick}>
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
  // TODO: Consume theme and toggleTheme from ThemeContext using useContext()
  // TODO: Consume fontSize and setFontSize from PreferenceContext using useContext()

  return (
    <div>
      <h2>Context API Demo</h2>
      
      <div>
        {/* TODO: Wire up onClick to toggleTheme and display the current theme */}
        <ThemedButton onClick={() => {}}>
          Toggle Theme
        </ThemedButton>
        
        {/* TODO: Set select value to fontSize and wire up onChange to setFontSize(e.target.value) */}
        <select 
          value="" 
          onChange={() => {}}
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
  // TODO: Create state for `theme` (default 'dark') and `fontSize` (default 'medium')

  // TODO: Create a toggleTheme function that toggles theme between 'dark' and 'light'

  // TODO: Wrap <Layout /> with ThemeContext.Provider and PreferenceContext.Provider,
  // passing their respective values: { theme, toggleTheme } and { fontSize, setFontSize }
  return (
    <Layout />
  );
};

export default P10_ContextTheme;
