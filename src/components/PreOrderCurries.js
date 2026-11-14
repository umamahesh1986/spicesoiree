import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PreOrderCurries.css";

// ALL CURRY IMAGES
const images = {
  "Paneer Butter Masala": "/images/Paneer Butter Masala.png",
  "Kadai Paneer": "/images/Kadai Paneer.png",
  "Mushroom Masala": "/images/Mushroom Masala.png",
  "Kadai Mushroom": "/images/Kadai Mushroom.png",
  "Kaju Masala": "/images/Kaju Masala.png",

  "Andhra Chicken Curry": "/images/Andhra Chicken Curry.png",
  "Butter Chicken / Kadai Chicken": "/images/Butter Chicken.png",
  "Gongura Chicken Curry": "/images/Gongura Chicken Curry.png",
  "Mutton Curry": "/images/Mutton Curry.png",
  "Gongura Mutton Curry": "/images/Gongura Mutton Curry.png",
  "Egg Masala": "/images/Egg Masala.png",
};

// NON-VEG CURRIES
const nonVegCurries = [
  {
    name: "Andhra Chicken Curry",
    description: "Freshly prepared Andhra-style chicken curry.",
    prices: { Half: 179, Full: 299 },
    category: "Chicken Curries",
    image: images["Andhra Chicken Curry"],
  },
  {
    name: "Butter Chicken / Kadai Chicken",
    description: "Rich and flavourful chicken curry.",
    prices: { Half: 199, Full: 349 },
    category: "Chicken Curries",
    image: images["Butter Chicken / Kadai Chicken"],
  },
  {
    name: "Gongura Chicken Curry",
    description: "Traditional chicken curry with gongura flavours.",
    prices: { Half: 199, Full: 349 },
    category: "Chicken Curries",
    image: images["Gongura Chicken Curry"],
  },
  {
    name: "Mutton Curry",
    description: "Traditional mutton curry with rich spices.",
    prices: { Half: 299, Full: 499 },
    category: "Mutton Curries",
    image: images["Mutton Curry"],
  },
  {
    name: "Gongura Mutton Curry",
    description: "Mutton curry prepared with gongura.",
    prices: { Half: 329, Full: 549 },
    category: "Mutton Curries",
    image: images["Gongura Mutton Curry"],
  },
  {
    name: "Egg Masala",
    description: "Eggs cooked in flavourful masala gravy.",
    prices: { Half: 119, Full: 199 },
    category: "Egg Curries",
    image: images["Egg Masala"],
  },
];

// VEG CURRIES
const vegCurries = [
  {
    name: "Paneer Butter Masala",
    description: "Paneer cooked in creamy tomato gravy.",
    prices: { Half: 169, Full: 289 },
    category: "Veg Curries",
    image: images["Paneer Butter Masala"],
  },
  {
    name: "Kadai Paneer",
    description: "Paneer cooked with aromatic kadai spices.",
    prices: { Half: 179, Full: 299 },
    category: "Veg Curries",
    image: images["Kadai Paneer"],
  },
  {
    name: "Mushroom Masala",
    description: "Mushrooms cooked in rich masala gravy.",
    prices: { Half: 149, Full: 249 },
    category: "Veg Curries",
    image: images["Mushroom Masala"],
  },
  {
    name: "Kadai Mushroom",
    description: "Mushrooms prepared with kadai spices.",
    prices: { Half: 159, Full: 269 },
    category: "Veg Curries",
    image: images["Kadai Mushroom"],
  },
];

// SPECIAL CURRIES
const specialCurries = [
  {
    name: "Kaju Masala",
    description: "Cashews cooked in delicious masala gravy.",
    prices: { Half: 189, Full: 329 },
    category: "Special Curries",
    image: images["Kaju Masala"],
  },
];

// SIDEBAR CATEGORIES
const curryCategories = [
  { name: "Chicken Curries", icon: "🍗" },
  { name: "Mutton Curries", icon: "🍖" },
  { name: "Egg Curries", icon: "🥚" },
  { name: "Veg Curries", icon: "🥗" },
  { name: "Special Curries", icon: "⭐" },
];

const CART_KEY = "spiceSoireeCart";

export default function PreOrderCurries() {
  const location = useLocation();

  const getTypeFromPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.endsWith("/veg")) return "Veg Curries";
    if (path.endsWith("/special")) return "Special Curries";

    
  };

  const [type, setType] = useState(getTypeFromPath);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    setType(getTypeFromPath());
    setActiveCategory("All");
    setSelectedSizes({});
  }, [location.pathname]);

  // SIDEBAR CATEGORY FILTER
  const getCurries = () => {
    if (activeCategory === "Special Curries") {
      return specialCurries;
    }

    if (activeCategory === "Veg Curries") {
      return vegCurries;
    }

    if (
      activeCategory === "Chicken Curries" ||
      activeCategory === "Mutton Curries" ||
      activeCategory === "Egg Curries"
    ) {
      return nonVegCurries.filter(
        (item) => item.category === activeCategory
      );
    }

    if (type === "Special Curries") {
      return specialCurries;
    }

    if (type === "Veg Curries") {
      return vegCurries;
    }

    return nonVegCurries;
  };

  const filteredCurries = getCurries();

  // CHANGE TYPE
  const changeType = (selectedType) => {
    setType(selectedType);
    setActiveCategory("All");
  };

  // CHANGE SIDEBAR CATEGORY
  const selectCategory = (category) => {
    setActiveCategory(category);

    if (
      category === "Chicken Curries" ||
      category === "Mutton Curries" ||
      category === "Egg Curries"
    ) {
      setType("Non-Veg Curries");
    }

    if (category === "Veg Curries") {
      setType("Veg Curries");
    }

    if (category === "Special Curries") {
      setType("Special Curries");
    }
  };

  // ADD TO CART
  const addToCart = (item) => {
    const selectedSize = selectedSizes[item.name] || "Half";
    const selectedPrice = item.prices[selectedSize];

    let existingCart = [];

    try {
      existingCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(existingCart)) {
        existingCart = [];
      }
    } catch {
      existingCart = [];
    }

    const existingItem = existingCart.find(
      (cartItem) =>
        cartItem.name === item.name &&
        cartItem.size === selectedSize
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem.name === item.name &&
        cartItem.size === selectedSize
          ? {
              ...cartItem,
              quantity: (cartItem.quantity || 1) + 1,
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          name: item.name,
          size: selectedSize,
          price: selectedPrice,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setCartMessage(`${item.name} added to cart`);

    window.clearTimeout(window.curryCartMessageTimer);

    window.curryCartMessageTimer = window.setTimeout(() => {
      setCartMessage("");
    }, 2500);
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
            src={images["Andhra Chicken Curry"]}
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
              onClick={() => setActiveCategory("All")}
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
                onClick={() =>
                  selectCategory(
                    activeCategory === category.name
                      ? "All"
                      : category.name
                  )
                }
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
              <button
                type="button"
                className={
                  type === "Non-Veg Curries" ? "type-active" : ""
                }
                onClick={() => changeType("Non-Veg Curries")}
              >
                🍗 Non-Veg Curries
              </button>

              <button
                type="button"
                className={
                  type === "Veg Curries" ? "type-active" : ""
                }
                onClick={() => changeType("Veg Curries")}
              >
                🥗 Veg Curries
              </button>
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
                  : type}
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
            {filteredCurries.length > 0 ? (
              filteredCurries.map((item) => {
                const selectedSize =
                  selectedSizes[item.name] || "Half";

                return (
                  <article className="curry-card" key={item.name}>
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
                                  [item.name]: size,
                                }))
                              }
                            >
                              <span>{size}</span>
                              <strong>₹{price}</strong>
                            </button>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        className="order-curry-btn"
                        onClick={() => addToCart(item)}
                      >
                        <span>🛒</span>
                        Add to Cart
                        <span className="add-cart-arrow">→</span>
                      </button>
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
