import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-sm mb-0 shadow-sm rounded-pill bg-white p-1 border">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button
            className="page-item-btn rounded-circle border-0 me-1"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            style={{ width: '32px', height: '32px' }}
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {pageNumbers.map((num) => (
          <li className="page-item" key={num}>
            <button
              className={`btn btn-sm rounded-circle me-1 fw-bold ${
                num === page ? 'btn-primary text-white' : 'btn-light text-dark'
              }`}
              onClick={() => onPageChange(num)}
              style={{ width: '32px', height: '32px' }}
            >
              {num}
            </button>
          </li>
        ))}

        <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
          <button
            className="page-item-btn rounded-circle border-0 ms-1"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            style={{ width: '32px', height: '32px' }}
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
