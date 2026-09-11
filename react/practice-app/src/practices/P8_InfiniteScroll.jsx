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

  const styles = {
    container: {
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#00d4ff',
      marginBottom: '30px'
    },
    list: {
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    card: {
      backgroundColor: '#2a2a4a',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    cardTitle: {
      margin: '0 0 10px 0',
      color: '#00d4ff',
      textTransform: 'capitalize'
    },
    cardBody: {
      margin: 0,
      lineHeight: '1.6',
      color: '#aaa'
    },
    loaderContainer: {
      padding: '20px',
      textAlign: 'center',
      color: '#00d4ff'
    },
    endMessage: {
      padding: '20px',
      textAlign: 'center',
      color: '#888',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Infinite Scroll Feed</h2>
      
      <div style={styles.list}>
        {posts.map((post, index) => {
          // If it's the last element, attach the ref to it
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{post.id}. {post.title}</h3>
                <p style={styles.cardBody}>{post.body}</p>
              </div>
            );
          } else {
            return (
              <div key={post.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{post.id}. {post.title}</h3>
                <p style={styles.cardBody}>{post.body}</p>
              </div>
            );
          }
        })}
      </div>

      {loading && (
        <div style={styles.loaderContainer}>
          Loading more posts...
        </div>
      )}
      
      {!hasMore && (
        <div style={styles.endMessage}>
          No more data to load.
        </div>
      )}
    </div>
  );
};

export default P8_InfiniteScroll;
