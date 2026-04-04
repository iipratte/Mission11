import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import { Link } from 'react-router-dom';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb bg-body-tertiary rounded px-3 py-2 mb-0">
          <li className="breadcrumb-item active" aria-current="page">
            Home
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Books
          </li>
        </ol>
      </nav>
      <div className="row">
        <WelcomeBand />
      </div>
      <div className="d-flex justify-content-end my-3">
        <Link to="/adminbooks" className="btn btn-outline-dark btn-sm">
          Admin Books
        </Link>
      </div>
      <div className="row g-3">
        <div className="col-12 col-lg-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-12 col-lg-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
