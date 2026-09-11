import React, { useState, useMemo } from 'react';

// Generate 100 mock items
const MOCK_DATA = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `Task or Item ${index + 1}`,
  category: ['Development', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
  status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)]
}));

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Key concept: Derived state
  const totalItems = MOCK_DATA.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Reset to page 1 when page size changes
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Key concept: useMemo for slicing data to avoid recalculation on unrelated renders
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return MOCK_DATA.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  // Handlers for prev/next
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const delta = 2; // how many pages to show around current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Data Pagination</h2>
          
          <div style={styles.controls}>
            <label style={styles.label}>Items per page:</label>
            <select value={pageSize} onChange={handlePageSizeChange} style={styles.select}>
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{item.category}</span>
                  </td>
                  <td style={styles.td}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.footer}>
          <div style={styles.info}>
            Showing {startIndex}-{endIndex} of {totalItems} items
          </div>
          
          <div style={styles.pagination}>
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1}
              style={{...styles.pageBtn, ...(currentPage === 1 ? styles.disabledBtn : {})}}
            >
              Previous
            </button>
            
            {getPageNumbers().map((pageNumber, idx) => (
              <button
                key={idx}
                onClick={() => typeof pageNumber === 'number' ? setCurrentPage(pageNumber) : null}
                style={{
                  ...styles.pageBtn,
                  ...(pageNumber === currentPage ? styles.activePageBtn : {}),
                  ...(typeof pageNumber !== 'number' ? styles.dotsBtn : {})
                }}
                disabled={typeof pageNumber !== 'number'}
              >
                {pageNumber}
              </button>
            ))}

            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
              style={{...styles.pageBtn, ...(currentPage === totalPages ? styles.disabledBtn : {})}}
            >
              Next
            </button>
          </div>
          <div style={styles.pageIndicator}>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    margin: 0,
    color: '#00d4ff'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  label: {
    color: '#8892b0'
  },
  select: {
    padding: '6px 12px',
    backgroundColor: '#1a1a2e',
    color: '#00d4ff',
    border: '1px solid #0f3460',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer'
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
    border: '1px solid #0f3460',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '12px 16px',
    backgroundColor: '#0f3460',
    color: '#00d4ff',
    fontWeight: 'bold',
    borderBottom: '2px solid #1a1a2e'
  },
  tr: {
    borderBottom: '1px solid #0f3460',
    backgroundColor: '#16213e',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '12px 16px'
  },
  badge: {
    padding: '4px 8px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #0f3460',
    borderRadius: '12px',
    fontSize: '0.85rem'
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  info: {
    color: '#8892b0',
    fontSize: '0.9rem'
  },
  pagination: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  pageBtn: {
    padding: '6px 12px',
    backgroundColor: '#1a1a2e',
    border: '1px solid #0f3460',
    color: '#e0e0e0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '36px'
  },
  activePageBtn: {
    backgroundColor: '#00d4ff',
    color: '#1a1a2e',
    borderColor: '#00d4ff',
    fontWeight: 'bold'
  },
  disabledBtn: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  dotsBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'default'
  },
  pageIndicator: {
    color: '#8892b0',
    fontSize: '0.85rem'
  }
};
