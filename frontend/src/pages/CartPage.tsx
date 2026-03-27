import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="container py-4">
      <h2 className="mb-3">Your Cart</h2>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {cart.length === 0 ? (
            <p className="mb-0 text-muted">Your cart is empty.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Book</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item: CartItem) => (
                    <tr key={item.bookId}>
                      <td>{item.bookName}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-end">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.bookId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <h3 className="h5 mb-0">Total: ${total.toFixed(2)}</h3>
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              // If user came from BuyPage, go back to where they were browsing.
              location.state?.returnToBrowse ? navigate(-2) : navigate('/books')
            }
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
