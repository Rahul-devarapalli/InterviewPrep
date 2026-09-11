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
    <div>
      <div>
        <div>
          <h2>Data Pagination</h2>

          <div>
            <label>Items per page:</label>
            <select value={pageSize} onChange={handlePageSizeChange}>
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>
                    <span>{item.category}</span>
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div>
            Showing {startIndex}-{endIndex} of {totalItems} items
          </div>

          <div>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {getPageNumbers().map((pageNumber, idx) => (
              <button
                key={idx}
                onClick={() => typeof pageNumber === 'number' ? setCurrentPage(pageNumber) : null}
                disabled={typeof pageNumber !== 'number'}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
}
