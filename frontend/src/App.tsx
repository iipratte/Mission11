import './App.css';
import BooksPage from './pages/BooksPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BuyPage from './pages/BuyPage';
import CartPage from './pages/CartPage';
import CartSummary from './context/CartSummary';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Global cart pill so users can jump to cart anytime */}
        <CartSummary />
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/buy/:bookName/:bookId" element={<BuyPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
