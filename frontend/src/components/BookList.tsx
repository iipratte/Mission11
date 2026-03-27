import { useEffect, useMemo, useState } from 'react';
import { type book } from '../types/book';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState<string>('asc');

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/api/Bookstore/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${
          selectedCategories.length > 0 ? `&${categoryParams}` : ''
        }`
      );
      const data = await response.json();
      setBooks(data.books);
      const totalBooks = data.totalNumBooks ?? data.totalBooks ?? 0;
      setTotalItems(totalBooks);
      setTotalPages(Math.ceil(totalBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, selectedCategories, sortOrder]);

  useEffect(() => {
    // If filters change, always jump back to page 1.
    setPageNum(1);
  }, [selectedCategories]);

  const sortedBooks = useMemo(() => {
    // Keep a client-side sort too so the dropdown always feels instant.
    const booksCopy = [...books];
    booksCopy.sort((a, b) =>
      sortOrder === 'desc'
        ? b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })
        : a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
    return booksCopy;
  }, [books, sortOrder]);

  return (
    <div className="mt-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header text-bg-dark py-3 px-4 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <h2 className="mb-0 h4">Bookstore Inventory</h2>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="input-group input-group-sm w-auto">
              <span className="input-group-text">Sort</span>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPageNum(1);
                }}
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
            <span className="badge text-bg-primary px-3 py-2">
              {totalItems} total books
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th className="text-end">Price</th>
                  <th className="text-center pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedBooks.length > 0 ? (
                  sortedBooks.map((b) => (
                    <tr key={b.bookId}>
                      <td className="fw-bold ps-3">{b.title}</td>
                      <td>{b.author}</td>
                      <td>
                        <span className="badge rounded-pill bg-info text-dark">
                          {b.category}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-success">
                        ${b.price.toFixed(2)}
                      </td>
                      <td className="text-center pe-3">
                        <button
                          className="btn btn-success btn-sm text-nowrap"
                          onClick={() =>
                            navigate(
                              `/buy/${encodeURIComponent(b.title)}/${b.bookId}`,
                              {
                                state: { book: b },
                              }
                            )
                          }
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-light py-3">
          <div className="row align-items-center">
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
                    className={`page-item ${
                      pageNum === totalPages ? 'disabled' : ''
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(pageNum + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
              <label className="me-2 text-muted small mb-0">
                Items per page:
              </label>
              <select
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageNum(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Page progress</span>
              <span>
                {totalPages === 0 ? 0 : pageNum} / {totalPages}
              </span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Page progress"
            >
              <div
                className="progress-bar"
                style={{
                  width: `${totalPages === 0 ? 0 : (pageNum / totalPages) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
