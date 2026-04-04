import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { book } from '../types/book';
import { addBook, deleteBook, fetchBooks, updateBook } from '../api/BooksAPI';
import NewBookForm from '../components/NewBookForm';

function AdminBooksPage() {
  const [books, setBooks] = useState<book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<book | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBooks(500, 1, [], 'asc');
      setBooks(data.books);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (bookData: book) => {
    if (editingBook) {
      await updateBook(editingBook.bookId, {
        ...bookData,
        bookId: editingBook.bookId,
      });
    } else {
      await addBook({
        ...bookData,
        bookId: 0,
      });
    }

    setShowForm(false);
    setEditingBook(null);
    await loadBooks();
  };

  const handleDelete = async (bookId: number) => {
    const shouldDelete = window.confirm(
      'Delete this book? This action cannot be undone.'
    );
    if (!shouldDelete) {
      return;
    }

    await deleteBook(bookId);
    await loadBooks();
  };

  if (loading) {
    return <p className="container py-4">Loading admin books...</p>;
  }

  if (error) {
    return (
      <p className="container py-4 text-danger">
        Unable to load admin books: {error}
      </p>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Admin - Books</h1>
        <div className="d-flex gap-2">
          <Link to="/books" className="btn btn-outline-secondary">
            Back to Store
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingBook(null);
              setShowForm(true);
            }}
          >
            Add Book
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <NewBookForm
            initialBook={editingBook}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        </div>
      )}

      <div className="table-responsive card border-0 shadow-sm">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th className="text-end">Price</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId}>
                <td>{b.bookId}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td className="text-end">${b.price.toFixed(2)}</td>
                <td className="text-end">
                  <div className="d-inline-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setEditingBook(b);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(b.bookId)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBooksPage;
