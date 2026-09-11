import React, { useState, useRef, useEffect } from 'react';

// Key Interview Concepts Demonstrated:
// 1. useRef for mutable values: We use useRef for the interval ID because changing it shouldn't trigger re-renders.
//    If we used useState, stopping/starting the timer might cause unnecessary renders.
// 2. Cleanup intervals: useEffect cleanup function or explicit stop function to prevent memory leaks.
// 3. Time formatting: Handling calculations for minutes, seconds, and milliseconds correctly.

const P7_StopWatch = () => {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  
  // useRef keeps its value between renders without causing a re-render when it changes.
  const intervalRef = useRef(null);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    // Use Date.now() to track exact time elapsed to prevent drift
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10); // Update every 10ms for smooth ms display
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleReset = () => {
    handleStop();
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    setLaps(prev => [...prev, time]);
  };

  // Format time helper: MM:SS:ms
  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const ms = Math.floor((timeInMs % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  // Find min and max laps for highlighting
  const getLapStats = () => {
    if (laps.length < 2) return { fastest: -1, slowest: -1 };
    
    let lapDiffs = [];
    for (let i = 0; i < laps.length; i++) {
      const diff = i === 0 ? laps[0] : laps[i] - laps[i-1];
      lapDiffs.push(diff);
    }
    
    let fastestIdx = 0;
    let slowestIdx = 0;
    
    for (let i = 1; i < lapDiffs.length; i++) {
      if (lapDiffs[i] < lapDiffs[fastestIdx]) fastestIdx = i;
      if (lapDiffs[i] > lapDiffs[slowestIdx]) slowestIdx = i;
    }
    
    return { fastest: fastestIdx, slowest: slowestIdx, lapDiffs };
  };

  const { fastest, slowest, lapDiffs } = getLapStats();

  const styles = {
    container: {
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    },
    display: {
      fontSize: '4rem',
      fontWeight: 'bold',
      fontVariantNumeric: 'tabular-nums',
      marginBottom: '30px',
      color: '#00d4ff',
      textShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
    },
    buttonContainer: {
      display: 'flex',
      gap: '15px',
      marginBottom: '40px'
    },
    button: (type) => ({
      padding: '12px 24px',
      fontSize: '1.1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      backgroundColor: type === 'primary' ? '#00d4ff' : '#2a2a4a',
      color: type === 'primary' ? '#1a1a2e' : '#e0e0e0',
      transition: 'all 0.2s ease'
    }),
    lapList: {
      width: '100%',
      maxWidth: '400px',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    lapItem: (isFastest, isSlowest) => ({
      display: 'flex',
      justifyContent: 'space-between',
      padding: '15px',
      borderBottom: '1px solid #2a2a4a',
      color: isFastest ? '#4ade80' : isSlowest ? '#f87171' : '#e0e0e0',
      fontWeight: isFastest || isSlowest ? '600' : '400'
    })
  };

  return (
    <div style={styles.container}>
      <h2>Stopwatch</h2>
      
      <div style={styles.display}>
        {formatTime(time)}
      </div>

      <div style={styles.buttonContainer}>
        {isRunning ? (
          <button style={styles.button('secondary')} onClick={handleStop}>Stop</button>
        ) : (
          <button style={styles.button('primary')} onClick={handleStart}>Start</button>
        )}
        
        <button 
          style={styles.button('secondary')} 
          onClick={isRunning ? handleLap : handleReset}
        >
          {isRunning ? 'Lap' : 'Reset'}
        </button>
      </div>

      <ul style={styles.lapList}>
        {laps.map((lapTime, index) => {
          const diff = index === 0 ? lapTime : lapTime - laps[index - 1];
          const isFastest = index === fastest && laps.length > 1;
          const isSlowest = index === slowest && laps.length > 1;
          
          return (
            <li key={index} style={styles.lapItem(isFastest, isSlowest)}>
              <span>Lap {String(index + 1).padStart(2, '0')}</span>
              <span>{formatTime(diff)}</span>
            </li>
          );
        }).reverse()}
      </ul>
    </div>
  );
};

export default P7_StopWatch;
