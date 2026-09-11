import React, { useState, useRef, useEffect } from 'react';

// Key Interview Concepts Demonstrated:
// 1. useRef for mutable values: We use useRef for the interval ID because changing it shouldn't trigger re-renders.
//    If we used useState, stopping/starting the timer might cause unnecessary renders.
// 2. Cleanup intervals: useEffect cleanup function or explicit stop function to prevent memory leaks.
// 3. Time formatting: Handling calculations for minutes, seconds, and milliseconds correctly.
// 4. Drift prevention: Using Date.now() timestamp calculation rather than simple incrementing.

const P7_StopWatch = () => {
  // TODO: 1. State Management
  // - time: number in milliseconds (initial: 0)
  // - isRunning: boolean indicating timer active status (initial: false)
  // - laps: array of lap timestamps in milliseconds (initial: [])

  // TODO: 2. Mutable Ref
  // - Use useRef to store interval ID across renders without causing re-renders

  // TODO: 3. Cleanup on Unmount
  // - Use useEffect to clear the interval when the component unmounts

  // TODO: 4. handleStart
  // - Prevent multiple running intervals if already running
  // - Set isRunning to true
  // - Calculate start reference point (Date.now() - time) to prevent drift
  // - Start setInterval to update time every 10ms and save ID to ref

  // TODO: 5. handleStop
  // - Set isRunning to false
  // - Clear the interval from ref and reset ref value to null

  // TODO: 6. handleReset
  // - Stop timer, reset time to 0, and clear laps array

  // TODO: 7. handleLap
  // - If running, append current elapsed time to laps array

  // TODO: 8. formatTime Helper
  // - Convert milliseconds into "MM:SS:ms" string format (padded to 2 digits)

  // TODO: 9. (Optional) getLapStats Helper
  // - Calculate lap diffs and determine fastest and slowest lap indices

  return (
    <div>
      <h2>Stopwatch</h2>
      
      <div>
        {/* TODO: Display formatted time */}
        00:00:00
      </div>

      <div>
        {/* TODO: Render Start button if not running, or Stop button if running */}
        <button>Start</button>
        
        {/* TODO: Render Lap button if running, or Reset button if not running */}
        <button>Reset</button>
      </div>

      {/* TODO: Render list of recorded laps */}
      <ul>
        {/* Example lap item:
        <li>
          <span>Lap 01</span>
          <span>00:01:23</span>
        </li>
        */}
      </ul>
    </div>
  );
};

export default P7_StopWatch;
