import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  // Show quick totals so users can sanity-check cart at a glance.
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1080,
        background: '#f8f9fa',
        padding: '10px  15px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        fontSize: '16px',
      }}
      onClick={() => navigate('/cart')}
    >
      <span className="me-2">🛒</span>
      <strong className="me-2">{totalItems}</strong>
      <span>${totalAmount.toFixed(2)}</span>
    </div>
  );
};

export default CartSummary;
