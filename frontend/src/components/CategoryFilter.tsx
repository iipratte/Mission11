import { useEffect, useState } from 'react';
import { fetchBookCategories } from '../api/BooksAPI';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchBookCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="card border-0 shadow-sm sticky-top" style={{ top: '1rem' }}>
      <div className="card-header text-bg-light">
        <h5 className="mb-0">Filter by Category</h5>
      </div>
      <div className="list-group list-group-flush">
        {categories.map((c) => (
          <label
            key={c}
            htmlFor={c}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{c}</span>
            <div className="form-check form-switch m-0">
              <input
                type="checkbox"
                className="form-check-input"
                id={c}
                value={c}
                checked={selectedCategories.includes(c)}
                onChange={handleCheckboxChange}
              />
            </div>
          </label>
        ))}
      </div>
      <div className="card-footer bg-white">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={() => setSelectedCategories([])}
          disabled={selectedCategories.length === 0}
        >
          Clear Filters
        </button>
      </div>
      {categories.length === 0 && (
        <div className="card-body">
          <p className="text-muted small mb-0">Loading categories...</p>
        </div>
      )}
    </div>
  );
}

export default CategoryFilter;
