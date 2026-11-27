import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CartQuantity, { useCartItems } from "./CartQuantity";
import { readCart, saveCart, useApi } from "../api";
import "./PreOrderCurries.css";


export default function PreOrderCurries() {
  const location = useLocation();

  const getTypeFromPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.endsWith("/veg")) return "Veg Curries";
    if (path.endsWith("/special")) return "Special Curries";
    return "Non-Veg Curries";
  };

  const [type, setType] = useState(getTypeFromPath);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const cart = useCartItems();
  const [cartMessage, setCartMessage] = useState("");
  const { data, loading, error } = useApi("/preorder");
  const curryCategories = data?.categories || [];
  const items = data?.items || [];
  const curryTypes = [...new Set(curryCategories.map((c) => c.curryType).filter(Boolean))];

  useEffect(() => {
    setType(getTypeFromPath());
    setActiveCategory("All");
    setSelectedSizes({});
  }, [location.pathname]);

  const filteredCurries = items.filter((item) => activeCategory === "All" ? type === "All" || item.curryType === type : item.category === activeCategory);
  const changeType = (value) => { setType(value); setActiveCategory("All"); };
  const selectCategory = (category) => { setActiveCategory(category.name); setType(category.curryType); };
  const addToCart = (item) => {
    const size = selectedSizes[item.id] || Object.keys(item.prices)[0];
    if (!item.inStock || !size) return;
    const cart = readCart();
    const index = cart.findIndex((line) => line.itemType === "preorder" && line.itemId === item.id && line.size === size);
    if (index >= 0) cart[index] = { ...cart[index], quantity: Number(cart[index].quantity || 0) + 1 };
    else cart.push({ itemType: "preorder", itemId: item.id, name: item.name, size, price: item.prices[size], quantity: 1, image: item.image });
    saveCart(cart);
    setCartMessage(item.name + " added to cart");
    window.clearTimeout(window.curryCartMessageTimer);
    window.curryCartMessageTimer = window.setTimeout(() => setCartMessage(""), 2500);
  };

  return (
    <div className="preorder-page">

      {/* HERO BANNER */}
      <section className="curry-hero">
        <div className="curry-hero-content">
          <span className="curry-hero-tag">MADE WITH LOVE</span>

          <h1>Pre-Order Curries</h1>

          <p>
            Home-style Curries for Your Meals, Events & Occasions
          </p>

          <div className="hero-features">
            <div>
              <span>♨</span>
              <strong>Veg & Non-Veg Curries</strong>
            </div>

            <div>
              <span>🛵</span>
              <strong>
                Minimum Order
                <br />
                1 kg
              </strong>
            </div>

            <div>
              <span>▦</span>
              <strong>Book in Advance</strong>
            </div>

            <div>
              <span>♙</span>
              <strong>
                For Home, Events
                <br />
                & Functions
              </strong>
            </div>
          </div>
        </div>

        <div className="curry-hero-image">
          <img
            src="/images/Andhra Chicken Curry.png"
            alt="Andhra Chicken Curry"
          />
        </div>
      </section>

      {/* CURRIES SECTION */}
      <section className="curries-layout">

        {/* LEFT SIDEBAR */}
        <aside className="curry-sidebar">
          <h2>Curries Categories</h2>

          <div className="curry-category-list">
            <button
              type="button"
              className={
                activeCategory === "All"
                  ? "curry-category selected"
                  : "curry-category"
              }
              onClick={() => { setActiveCategory("All"); setType("All"); }}
            >
              <span>▦</span>
              <strong>All Categories</strong>
            </button>

            {curryCategories.map((category) => (
              <button
                type="button"
                key={category.name}
                className={
                  activeCategory === category.name
                    ? "curry-category selected"
                    : "curry-category"
                }
                onClick={() => { if (activeCategory === category.name) setActiveCategory("All"); else selectCategory(category); }}
              >
                <span>{category.icon}</span>
                <strong>{category.name}</strong>
                <span className="category-arrow">›</span>
              </button>
            ))}
          </div>

          <div className="custom-curry-card">
            <div className="custom-chef">♙</div>

            <h3>Need a Custom Curry?</h3>

            <p>Let us know your requirement.</p>

            <a
              href="https://wa.me/919849489900"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="curries-main">

          <div className="curry-controls">
            <div className="curry-type-tabs">
              {curryTypes.map((curryType) => (
                <button type="button" key={curryType} className={type === curryType ? "type-active" : ""} onClick={() => changeType(curryType)}>{curryType}</button>
              ))}
            </div>

            <div className="advance-notice">
              ▦ &nbsp; Pre-Order at least 4 Hours in Advance
            </div>
          </div>

          {/* SECTION HEADING */}
          <div className="curry-section-heading">
            <div>
              
              <h2>
                {activeCategory !== "All"
                  ? activeCategory
                  : type === "All" ? "All Curries" : type}
              </h2>
            </div>
          </div>

          {/* CART MESSAGE */}
          {cartMessage && (
            <div className="cart-success-message">
              <span>✓</span>
              {cartMessage}
            </div>
          )}

          {/* CURRY CARDS */}
          <div className="curry-grid">
            {loading ? <p className="no-curries">Loading curries...</p> : error ? <p className="no-curries" role="alert">Unable to load curries. Please try again later.</p> : filteredCurries.length > 0 ? (
              filteredCurries.map((item) => {
                const selectedSize =
                  selectedSizes[item.id] || Object.keys(item.prices)[0];
                const cartItem = cart.find((line) =>
                  line.itemType === "preorder" && line.itemId === item.id && line.size === selectedSize
                );

                return (
                  <article className="curry-card" key={item.id}>
                    <div className="curry-card-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.parentElement.classList.add(
                            "image-missing"
                          );
                        }}
                      />
                    </div>

                    <div className="curry-card-content">
                      <h3>{item.name}</h3>

                      <p>{item.description}</p>

                      {/* PRICE OPTIONS - DISPLAYED ONLY ONCE */}
                      <div className="curry-price-options">
                        {Object.entries(item.prices).map(
                          ([size, price]) => (
                            <button
                              type="button"
                              key={size}
                              className={
                                selectedSize === size
                                  ? "price-option selected-price"
                                  : "price-option"
                              }
                              onClick={() =>
                                setSelectedSizes((previous) => ({
                                  ...previous,
                                  [item.id]: size,
                                }))
                              }
                            >
                              <span>{size}</span>
                              <strong>₹{price}</strong>
                            </button>
                          )
                        )}
                      </div>

                      {!item.inStock ? (
                        <button type="button" className="order-curry-btn" disabled>Out of Stock</button>
                      ) : cartItem && Number(cartItem.quantity) > 0 ? (
                        <CartQuantity item={cartItem} onIncrease={() => addToCart(item)} />
                      ) : <button
                        type="button"
                        className="order-curry-btn"
                        onClick={() => addToCart(item)}
                      >
                        <span>🛒</span>
                        Add to Cart
                        <span className="add-cart-arrow">→</span>
                      </button>}
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="no-curries">
                No curries available in this category.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
