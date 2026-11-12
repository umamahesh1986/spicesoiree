import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PreOrderCurries.css";

/* NON-VEG CURRIES */
const nonVegCurries = [
  {
    name: "Chicken Curry",
    description: "Classic home-style chicken curry",
    price: "₹300 / kg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
    category: "Chicken Curries",
  },
  {
    name: "Chicken Dry Curry",
    description: "Spicy & flavourful semi-dry chicken",
    price: "₹320 / kg",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600",
    category: "Chicken Curries",
  },
  {
    name: "Mutton Curry",
    description: "Traditional mutton curry with rich spices",
    price: "₹300 – 350 / kg",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600",
    category: "Mutton Curries",
  },
  {
    name: "Mutton Keema Curry",
    description: "Minced mutton cooked with aromatic spices",
    price: "₹350 / kg",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    category: "Keema Curries",
  },
  {
    name: "Chicken Fry Curry",
    description: "Fried chicken in gravy masala",
    price: "₹330 / kg",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600",
    category: "Chicken Curries",
  },
  {
    name: "Chicken Masala Curry",
    description: "Rich & spicy chicken masala",
    price: "₹320 / kg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
    category: "Chicken Curries",
  },
  {
    name: "Mutton Fry Curry",
    description: "Roasted mutton in special masala",
    price: "₹380 / kg",
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600",
    category: "Mutton Curries",
  },
  {
    name: "Egg Curry",
    description: "Eggs in flavourful spicy gravy",
    price: "₹220 / kg",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    category: "Chicken Curries",
  },
];

/* VEG CURRIES */
const vegCurries = [
  {
    name: "Paneer Butter Masala",
    description: "Paneer cooked in creamy tomato gravy",
    price: "₹300 / kg",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
    category: "Veg Curries",
  },
  {
    name: "Veg Curry",
    description: "Fresh vegetables cooked with Indian spices",
    price: "₹250 / kg",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    category: "Veg Curries",
  },
  {
    name: "Mushroom Masala",
    description: "Mushrooms in rich masala gravy",
    price: "₹280 / kg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
    category: "Veg Curries",
  },
  {
    name: "Kaju Curry",
    description: "Cashews in creamy Indian gravy",
    price: "₹350 / kg",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
    category: "Special Curries",
  },
];

/* SIDEBAR CATEGORIES */
const curryCategories = [
  { name: "Chicken Curries", icon: "🍗" },
  { name: "Mutton Curries", icon: "🐐" },
  { name: "Keema Curries", icon: "🍲" },
  { name: "Veg Curries", icon: "🥗" },
  { name: "Special Curries", icon: "⭐" },
];

export default function PreOrderCurries() {
  const location = useLocation();

  const getTypeFromPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.endsWith("/veg")) {
      return "Veg Curries";
    }

    return "Non-Veg Curries";
  };

  const [type, setType] = useState(getTypeFromPath);
  const [activeCategory, setActiveCategory] = useState("All");

  /* HEADER DROPDOWN FILTER */
  useEffect(() => {
    setType(getTypeFromPath());
    setActiveCategory("All");
  }, [location.pathname]);

  /* SELECT PRODUCTS */
  const curries =
    type === "Non-Veg Curries"
      ? nonVegCurries
      : vegCurries;

  /* CATEGORY FILTER */
  const filteredCurries = curries.filter((item) => {
    return (
      activeCategory === "All" ||
      item.category === activeCategory
    );
  });

  /* TYPE CHANGE */
  const changeType = (selectedType) => {
    setType(selectedType);
    setActiveCategory("All");
  };

  /* ORDER NOW */
  const orderNow = (item) => {
    const message = `Hello, I want to pre-order ${item.name}. Price: ${item.price}`;

    window.open(
      `https://wa.me/919849489900?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="preorder-page">

      {/* HERO BANNER */}
      <section className="curry-hero">

        <div className="curry-hero-content">

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
            src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200"
            alt="Traditional Indian chicken curry"
          />
        </div>

      </section>

      {/* CURRIES SECTION */}
      <section className="curries-layout">

        {/* LEFT SIDEBAR - ORIGINAL SECTION UNCHANGED */}
        <aside className="curry-sidebar">

          <h2>Curries Categories</h2>

          <div className="curry-category-list">

            <button
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
                key={category.name}
                className={
                  activeCategory === category.name
                    ? "curry-category selected"
                    : "curry-category"
                }
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.name
                      ? "All"
                      : category.name
                  )
                }
              >
                <span>{category.icon}</span>
                <strong>{category.name}</strong>
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

            {/* ONLY VEG AND NON-VEG BUTTONS */}
            <div className="curry-type-tabs">

              <button
                className={
                  type === "Non-Veg Curries" ? "type-active" : ""
                }
                onClick={() => changeType("Non-Veg Curries")}
              >
                Non-Veg Curries
              </button>

              <button
                className={
                  type === "Veg Curries" ? "type-active" : ""
                }
                onClick={() => changeType("Veg Curries")}
              >
                Veg Curries
              </button>

            </div>

            <div className="advance-notice">
              ▦ &nbsp; Pre-Order at least 4 Hours in Advance
            </div>

          </div>

          {/* SECTION HEADING */}
          <div className="curry-section-heading">
            <h2>
              {activeCategory !== "All"
                ? activeCategory
                : type}
            </h2>
          </div>

          {/* CURRY CARDS */}
          <div className="curry-grid">

            {filteredCurries.length > 0 ? (
              filteredCurries.map((item) => (

                <article className="curry-card" key={item.name}>

                  <div className="curry-card-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="curry-card-content">

                    <h3>{item.name}</h3>

                    <p>{item.description}</p>

                    <strong className="curry-price">
                      {item.price}
                    </strong>

                    <button
                      className="order-curry-btn"
                      onClick={() => orderNow(item)}
                    >
                      🛒 Order Now
                    </button>

                  </div>

                </article>

              ))
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

