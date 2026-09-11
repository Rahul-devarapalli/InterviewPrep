import React, { useState, useEffect, useRef, useCallback } from 'react';

// Key Interview Concepts Demonstrated:
// 1. IntersectionObserver API: Efficiently detecting when an element enters the viewport without scroll event listeners.
// 2. useCallback for ref callbacks: Passing a callback ref to a component and ensuring we can attach the observer when the node mounts.
// 3. Pagination/Infinite loading: Managing loading states, appending data, and tracking offsets/pages.

const P8_InfiniteScroll = () => {
  // TODO: Declare state:
  // - `posts`: array of fetched posts (default: [])
  // - `page`: current page number for pagination (default: 1)
  // - `loading`: boolean flag for loading status (default: false)
  // - `hasMore`: boolean flag indicating if more posts are available (default: true)

  // TODO: Declare a ref `observerRef` using useRef(null) to store the IntersectionObserver instance

  // TODO: Implement `lastPostElementRef` callback ref using useCallback:
  // - If `loading` is true, return early (don't trigger when already fetching)
  // - If `observerRef.current` exists, disconnect it
  // - Instantiate a new IntersectionObserver callback:
  //   - If the first entry is intersecting (`entries[0].isIntersecting`) and `hasMore` is true:
  //     - Increment `page` by 1
  // - If `node` exists, observe it (`observerRef.current.observe(node)`)
  // - Dependencies: [loading, hasMore]

  // TODO: Implement useEffect to fetch posts when `page` or `hasMore` changes:
  // - Guard: only fetch if `hasMore` is true
  // - Set `loading` to true
  // - Fetch from: `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
  // - If returned data is empty, set `hasMore` to false
  // - Otherwise, append new items to `posts` state
  // - Set `loading` to false in finally block

  return (
    <div>
      <h2>Infinite Scroll Feed</h2>
      
      <div>
        {/* TODO: Map over `posts`:
            - If it's the last element in `posts` (posts.length === index + 1), attach `ref={lastPostElementRef}`
            - Render each post card with key={post.id}, title (<h3>), and body (<p>)
        */}
      </div>

      {/* TODO: Conditionally display loader when `loading` is true */}
      {/* <div>Loading more posts...</div> */}
      
      {/* TODO: Conditionally display end message when `hasMore` is false */}
      {/* <div>No more data to load.</div> */}
    </div>
  );
};

export default P8_InfiniteScroll;
