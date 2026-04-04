import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { book } from '../types/book';

interface NewBookFormProps {
  initialBook?: book | null;
  onSubmit: (bookData: book) => Promise<void>;
  onCancel: () => void;
}

const emptyBook: book = {
  bookId: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 1,
  price: 0,
};

function NewBookForm({ initialBook, onSubmit, onCancel }: NewBookFormProps) {
  const [formData, setFormData] = useState<book>(initialBook ?? emptyBook);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialBook ?? emptyBook);
  }, [initialBook]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pageCount' || name === 'price' || name === 'bookId'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setSubmitError((err as Error).message || 'Unable to save book');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm">
      <div className="card-header text-bg-dark">
        <h2 className="h5 mb-0">
          {initialBook ? 'Edit Book' : 'Add New Book'}
        </h2>
      </div>
      <div className="card-body">
        {submitError && (
          <div className="alert alert-danger py-2" role="alert">
            {submitError}
          </div>
        )}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Author</label>
            <input
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Publisher</label>
            <input
              name="publisher"
              className="form-control"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">ISBN</label>
            <input
              name="isbn"
              className="form-control"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Classification</label>
            <input
              name="classification"
              className="form-control"
              value={formData.classification}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <input
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Page Count</label>
            <input
              type="number"
              name="pageCount"
              min={1}
              className="form-control"
              value={formData.pageCount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              min={0}
              step="0.01"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : initialBook ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}

export default NewBookForm;
