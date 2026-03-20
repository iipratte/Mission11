import { useEffect, useState } from 'react';
import { type book } from './types/book';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/api/Bookstore/GetBookstore?pageSize=${pageSize}&pageNum=${pageNum}`
        );
        const data = await response.json();

        // Match the casing from your C# Controller (Books and TotalBooks)
        setBooks(data.books || []);
        const total = data.totalBooks || 0;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / pageSize));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBook();
  }, [pageNum, pageSize]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg mb-5">
        {/* Header Section */}
        <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
          <h2 className="mb-0 h4">Bookstore Inventory</h2>
          <span className="badge bg-primary px-3 py-2">
            Total Results: {totalItems}
          </span>
        </div>

        {/* Table Section */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Classification</th>
                  <th>Category</th>
                  <th className="text-center">Pages</th>
                  <th className="text-end pe-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((b) => (
                    <tr key={b.bookId}>
                      <td className="fw-bold ps-3">{b.title}</td>
                      <td>{b.author}</td>
                      <td>{b.publisher}</td>
                      <td>
                        <code className="small text-secondary">{b.isbn}</code>
                      </td>
                      <td>{b.classification}</td>
                      <td>
                        <span className="badge rounded-pill bg-info text-dark">
                          {b.category}
                        </span>
                      </td>
                      <td className="text-center">{b.pageCount}</td>
                      <td className="text-end pe-3 fw-bold text-success">
                        ${b.price.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with Controls */}
        <div className="card-footer bg-light py-3">
          <div className="row align-items-center">
            {/* Pagination Links */}
            <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(pageNum - 1)}
                    >
                      &laquo; Previous
                    </button>
                  </li>

                  {totalPages > 0 &&
                    [...Array(totalPages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPageNum(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                  <li
                    className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(pageNum + 1)}
                    >
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Results Per Page Dropdown */}
            <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
              <label className="me-2 text-muted small mb-0">
                Items per page:
              </label>
              <select
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1); // Reset to page 1 to avoid index errors
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
