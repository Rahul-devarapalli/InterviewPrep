import React, { useState, useEffect, useRef, useCallback } from 'react';

// Key Interview Concepts Demonstrated:
// 1. IntersectionObserver API: Efficiently detecting when an element enters the viewport without scroll event listeners.
// 2. useCallback for ref callbacks: Passing a callback ref to a component and ensuring we can attach the observer when the node mounts.
// 3. Pagination/Infinite loading: Managing loading states, appending data, and tracking offsets/pages.

const P8_InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Keep track of the observer so we can disconnect it
  const observerRef = useRef(null);

  // useCallback used here so it doesn't get recreated every render,
  // preventing unnecessary re-attachments of the observer.
  const lastPostElementRef = useCallback((node) => {
    if (loading) return; // Don't trigger if already loading
    
    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      // If the target element is visible and we have more data to load
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const limit = 10;
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
        const data = await response.json();

        if (data.length === 0) {
          setHasMore(false);
        } else {
          // Append new data to existing list
          setPosts((prevPosts) => [...prevPosts, ...data]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }, [page, hasMore]);

  return (
    <div>
      <h2>Infinite Scroll Feed</h2>
      
      <div>
        {posts.map((post, index) => {
          // If it's the last element, attach the ref to it
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <h3>{post.id}. {post.title}</h3>
                <p>{post.body}</p>
              </div>
            );
          } else {
            return (
              <div key={post.id}>
                <h3>{post.id}. {post.title}</h3>
                <p>{post.body}</p>
              </div>
            );
          }
        })}
      </div>

      {loading && (
        <div>
          Loading more posts...
        </div>
      )}
      
      {!hasMore && (
        <div>
          No more data to load.
        </div>
      )}
    </div>
  );
};

export default P8_InfiniteScroll;
