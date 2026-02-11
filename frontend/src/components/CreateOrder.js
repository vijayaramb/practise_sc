import React, { useState, useEffect } from 'react';
import './CreateOrder.css';
import { productService } from '../services/orderService';

function CreateOrder({ onOrderCreated, customer }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchProducts = async (category = '') => {
    try {
      const data = await productService.getProducts(category);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product_id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cart.length === 0) {
      setError('Please add at least one item to cart');
      return;
    }

    setLoading(true);
    try {
      await onOrderCreated({
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_mobile: customer.mobile,
        items: cart
      });

      // Reset cart
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="create-order">
      <div className="customer-info-header">
        <div>
          <h2>Create New Order</h2>
          <p className="customer-details">
            <strong>{customer.name}</strong> | {customer.email} | {customer.mobile}
          </p>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="products-section">
          <div className="section-header">
            <h3>Select Products</h3>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-icon">{product.image_url}</div>
                <h4>{product.name}</h4>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h3>Shopping Cart ({cart.length} items)</h3>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-info">
                    <strong>{item.product_name}</strong>
                    <span className="cart-item-price">${item.price.toFixed(2)} each</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                    <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      type="button"
                      className="remove-btn-small"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="total">
          <strong>Total: ${calculateTotal()}</strong>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || cart.length === 0}>
          {loading ? 'Creating...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;
