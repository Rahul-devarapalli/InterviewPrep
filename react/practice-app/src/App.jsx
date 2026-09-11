import { useState, Suspense, lazy } from 'react'
import './App.css'

// Lazy load all practice components
const practices = [
  { id: 'p1', title: 'API Table + Sorting', file: lazy(() => import('./practices/P1_ApiTableSorting')), tag: 'useEffect · fetch · sort' },
  { id: 'p2', title: 'useReducer Shopping Cart', file: lazy(() => import('./practices/P2_UseReducer')), tag: 'useReducer · dispatch · actions' },
  { id: 'p3', title: 'Debounce Search', file: lazy(() => import('./practices/P3_DebounceSearch')), tag: 'custom hook · debounce · AbortController' },
  { id: 'p4', title: 'User Search Filter (2+ chars)', file: lazy(() => import('./practices/P4_UserSearchFilter')), tag: 'filter · controlled input · autocomplete' },
  { id: 'p5', title: 'Client-Side Pagination', file: lazy(() => import('./practices/P5_Pagination')), tag: 'pagination · useMemo · page size' },
  { id: 'p6', title: 'Todo CRUD App', file: lazy(() => import('./practices/P6_TodoApp')), tag: 'CRUD · localStorage · filter' },
  { id: 'p7', title: 'Stopwatch + Laps', file: lazy(() => import('./practices/P7_StopWatch')), tag: 'useRef · setInterval · cleanup' },
  { id: 'p8', title: 'Infinite Scroll', file: lazy(() => import('./practices/P8_InfiniteScroll')), tag: 'IntersectionObserver · useCallback · pagination' },
  { id: 'p9', title: 'Multi-Step Form', file: lazy(() => import('./practices/P9_MultiStepForm')), tag: 'validation · state lifting · steps' },
  { id: 'p10', title: 'Context API Theme', file: lazy(() => import('./practices/P10_ContextTheme')), tag: 'createContext · useContext · provider' },
]

function App() {
  const [activeId, setActiveId] = useState(null)
  const activePractice = practices.find(p => p.id === activeId)
  const ActiveComponent = activePractice?.file

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚛️ React Interview Practice</h1>
        <p className="subtitle">10 runnable coding challenges · single-page components</p>
      </header>

      {!activeId ? (
        <div className="practice-grid">
          {practices.map((p, i) => (
            <button key={p.id} className="practice-card" onClick={() => setActiveId(p.id)}>
              <span className="card-number">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <span className="card-tag">{p.tag}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="practice-view">
          <button className="back-btn" onClick={() => setActiveId(null)}>
            ← Back to All Practices
          </button>
          <div className="practice-title-bar">
            <span className="practice-number">#{practices.findIndex(p => p.id === activeId) + 1}</span>
            <h2>{activePractice.title}</h2>
          </div>
          <div className="practice-container">
            <Suspense fallback={<div className="loader">Loading component...</div>}>
              <ActiveComponent />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
