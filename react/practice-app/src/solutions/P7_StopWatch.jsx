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

  const { fastest, slowest } = getLapStats();

  return (
    <div>
      <h2>Stopwatch</h2>
      
      <div>
        {formatTime(time)}
      </div>

      <div>
        {isRunning ? (
          <button onClick={handleStop}>Stop</button>
        ) : (
          <button onClick={handleStart}>Start</button>
        )}
        
        <button onClick={isRunning ? handleLap : handleReset}>
          {isRunning ? 'Lap' : 'Reset'}
        </button>
      </div>

      <ul>
        {laps.map((lapTime, index) => {
          const diff = index === 0 ? lapTime : lapTime - laps[index - 1];
          const isFastest = index === fastest && laps.length > 1;
          const isSlowest = index === slowest && laps.length > 1;
          
          return (
            <li key={index}>
              <span>Lap {String(index + 1).padStart(2, '0')}</span>
              <span>{formatTime(diff)}</span>
              {isFastest && <span> (Fastest)</span>}
              {isSlowest && <span> (Slowest)</span>}
            </li>
          );
        }).reverse()}
      </ul>
    </div>
  );
};

export default P7_StopWatch;
