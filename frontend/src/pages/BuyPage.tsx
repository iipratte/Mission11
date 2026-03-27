import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { useMemo, useState } from 'react';
import type { CartItem } from '../types/CartItem';
import type { book } from '../types/book';

function BuyPage() {
  const navigate = useNavigate();
  const { bookName, bookId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  // Grab full book info when user comes from the list page.
  const bookFromState = (location.state as { book?: book } | null)?.book;
  const unitPrice = bookFromState?.price ?? 0;
  const safeBookName = decodeURIComponent(bookName || 'Unknown Book');

  const totalPrice = useMemo(
    () => Number((unitPrice * quantity).toFixed(2)),
    [unitPrice, quantity]
  );

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      bookName: safeBookName,
      unitPrice,
      quantity,
    };
    addToCart(newItem);
    // We came from list -> buy -> cart, so -2 returns to the list context.
    navigate('/cart', { state: { returnToBrowse: true } });
  };

  return (
    <div className="container py-4">
      <div className="row">
        <WelcomeBand />
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header text-bg-dark">
              <h2 className="h5 mb-0">Buy Book</h2>
            </div>
            <div className="card-body">
              <h3 className="h6 text-muted">Selected title</h3>
              <p className="fw-semibold mb-3">{safeBookName}</p>

              <div className="row g-3 align-items-end">
                <div className="col-12 col-sm-6">
                  <label htmlFor="quantityInput" className="form-label">
                    Quantity
                  </label>
                  <input
                    id="quantityInput"
                    type="number"
                    min={1}
                    className="form-control"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <p className="mb-1 text-muted">Unit price</p>
                  <p className="h5 mb-0">${unitPrice.toFixed(2)}</p>
                </div>
              </div>

              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">Total</span>
                <span className="h5 mb-0 text-success">${totalPrice.toFixed(2)}</span>
              </div>
              {unitPrice === 0 && (
                <p className="small text-warning mt-2 mb-0">
                  Price unavailable from direct link. Add from the books list for full pricing.
                </p>
              )}
            </div>
            <div className="card-footer d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                Go Back
              </button>
              <button
                className="btn btn-success"
                onClick={handleAddToCart}
                disabled={!bookId || quantity < 1}
              >
                Add {quantity} to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyPage;
