import React, { useState, useMemo } from 'react';

// Generate 100 mock items
const MOCK_DATA = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `Task or Item ${index + 1}`,
  category: ['Development', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
  status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)]
}));

export default function Pagination() {
  // TODO: 1. Set up state variables:
  // - currentPage: tracks the currently active page (number, default: 1)
  // - pageSize: tracks how many items to display per page (number, default: 10)

  // TODO: 2. Derive pagination metrics:
  // - totalItems: total count of items in MOCK_DATA
  // - totalPages: calculate total number of pages using Math.ceil(totalItems / pageSize)

  // TODO: 3. Handle page size change:
  // - Parse the selected value as a number and update pageSize state
  // - Reset currentPage to 1 so the user starts at the beginning of the newly sized pages

  // TODO: 4. Derive/memoize currentData using useMemo:
  // - Calculate startIndex = (currentPage - 1) * pageSize
  // - Calculate endIndex = startIndex + pageSize
  // - Slice MOCK_DATA from startIndex to endIndex based on currentPage and pageSize

  // TODO: 5. Handlers for navigation buttons:
  // - handlePrev: decrement currentPage by 1, clamped at minimum 1 (Math.max(prev - 1, 1))
  // - handleNext: increment currentPage by 1, clamped at maximum totalPages (Math.min(prev + 1, totalPages))

  // TODO: 6. Implement getPageNumbers() to generate page numbers with ellipsis:
  // - Define delta (e.g. 2) to show a window around currentPage
  // - Always include page 1 and totalPages
  // - Include pages within [currentPage - delta, currentPage + delta]
  // - Insert ellipsis ('...') or intermediate page numbers when gaps exist between numbers

  // TODO: 7. Calculate display range for info text:
  // - startIndex: (currentPage - 1) * pageSize + 1
  // - endIndex: Math.min(currentPage * pageSize, totalItems)

  return (
    <div>
      <div>
        <div>
          <h2>Data Pagination</h2>

          <div>
            <label>Items per page:</label>
            {/* TODO: Bind value to pageSize and onChange to handlePageSizeChange */}
            <select>
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
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
              {/* TODO: Map over currentData and render each row:
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
              */}
            </tbody>
          </table>
        </div>

        <div>
          <div>
            {/* TODO: Display "Showing {startIndex}-{endIndex} of {totalItems} items" */}
            Showing 0-0 of 0 items
          </div>

          <div>
            {/* TODO: Wire up handlePrev and disable if currentPage === 1 */}
            <button>
              Previous
            </button>

            {/* TODO: Map over getPageNumbers() and render page buttons:
            {getPageNumbers().map((pageNumber, idx) => (
              <button
                key={idx}
                onClick={() => typeof pageNumber === 'number' ? setCurrentPage(pageNumber) : null}
                disabled={typeof pageNumber !== 'number'}
              >
                {pageNumber}
              </button>
            ))}
            */}

            {/* TODO: Wire up handleNext and disable if currentPage === totalPages */}
            <button>
              Next
            </button>
          </div>
          <div>
            {/* TODO: Display "Page {currentPage} of {totalPages}" */}
            Page 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
}
