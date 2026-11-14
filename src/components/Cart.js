import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const CART_KEY = "spice_soiree_cart";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();

    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  function loadCart() {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }

  function saveCart(updatedCart) {
    setCart(updatedCart);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  }

  function increaseQuantity(index) {
    const updatedCart = cart.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity: Number(item.quantity || 0) + 1,
          }
        : item
    );

    saveCart(updatedCart);
  }

  function decreaseQuantity(index) {
    const updatedCart = cart
      .map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Number(item.quantity || 0) - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  }

  function removeItem(index) {
    const updatedCart = cart.filter(
      (_, i) => i !== index
    );

    saveCart(updatedCart);
  }

  function clearCart() {
    saveCart([]);
  }

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  function handleCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items first.");
      return;
    }

    navigate("/booking", {
      state: {
        cartItems: cart,
      },
    });
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h2>Your Cart is Empty</h2>

            <p>
              Looks like you haven't added any delicious food yet.
            </p>

            <Link
              to="/menu"
              className="continue-shopping"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            <section className="cart-items-section">

              <div className="cart-items-heading">
                <h2>Cart Items ({cartCount})</h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item, index) => (
                <article
                  className="cart-item"
                  key={`${item.name}-${item.size}-${index}`}
                >
                  <div className="cart-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>

                    {item.cuttingOption && (
                      <p className="cart-cutting-option">
                        {item.cuttingOption}
                      </p>
                    )}

                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(index)}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <strong>
                      ₹
                      {Number(item.price) *
                        Number(item.quantity)}
                    </strong>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}

              <Link
                to="/menu"
                className="continue-menu"
              >
                ← Continue Shopping
              </Link>

            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Total Items</span>
                <strong>{cartCount}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>₹{cartTotal}</strong>
              </div>

              <div className="cart-summary-total">
                <span>Total Amount</span>
                <strong>₹{cartTotal}</strong>
              </div>

              <p className="cart-summary-note">
                Taxes and other charges, if applicable,
                will be calculated at checkout.
              </p>

              <button
                type="button"
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </aside>

          </div>
        )}

      </div>
    </main>
  );
}

export default Cart;
