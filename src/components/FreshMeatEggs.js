import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FreshMeatEggs.css";

const CART_KEY = "spice_soiree_cart";

const products = [
  {
    id: 1,
    name: "Fresh Chicken",
    subtitle: "(Whole)",
    price: 270,
    displayPrice: "₹270 / kg",
    category: "Chicken",
    image: "/images/fresh-chicken.png",
    unit: "kg",
    cuttingAllowed: true,
    cuttingOptions: [
      "Curry Cut - Small",
      "Curry Cut - Medium",
      "Biryani Cut - 60g",
      "Biryani Cut - 120g",
      "Leg Piece - Whole",
      "Leg Piece - Cut",
      "Liver / Gizzards",
    ],
  },
  {
    id: 2,
    name: "Boneless Chicken",
    subtitle: "(Breast)",
    price: 500,
    displayPrice: "₹500 / kg",
    category: "Boneless Chicken",
    image: "/images/boneless-chicken.png",
    unit: "kg",
    cuttingAllowed: true,
    cuttingOptions: [
      "Breast - Pieces",
      "Breast - Boneless",
    ],
  },
  {
    id: 3,
    name: "Fresh Mutton",
    subtitle: "(Curry Cut)",
    price: 1100,
    displayPrice: "₹1,100 / kg",
    category: "Mutton",
    image: "/images/fresh-mutton.png",
    unit: "kg",
    cuttingAllowed: true,
    cuttingOptions: [
      "Curry Cut - Small",
      "Curry Cut - Medium",
      "Biryani Cut - 60g",
      "Biryani Cut - 120g",
      "Leg Piece - Whole",
      "Leg Piece - Cut",
    ],
  },
  {
    id: 4,
    name: "Mutton Keema",
    subtitle: "(Minced)",
    price: 1500,
    displayPrice: "₹1,500 / kg",
    category: "Mutton Keema",
    image: "/images/mutton-keema.png",
    unit: "kg",
    cuttingAllowed: false,
    cuttingOptions: [],
  },
  {
    id: 5,
    name: "Fresh Eggs",
    subtitle: "(Tray – 30 Eggs)",
    price: 180,
    displayPrice: "₹180 – ₹270 / tray",
    category: "Eggs",
    image: "/images/fresh-eggs.png",
    unit: "tray",
    cuttingAllowed: false,
    cuttingOptions: [],
  },
];

const categories = [
  { name: "Chicken", icon: "🐓" },
  { name: "Boneless Chicken", icon: "🥩" },
  { name: "Mutton", icon: "🐐" },
  { name: "Mutton Keema", icon: "🍲" },
  { name: "Eggs", icon: "🥚" },
  { name: "Cutting Options", icon: "✂️" },
];

const cuttingOptions = [
  {
    name: "Curry Cut",
    subtitle: "Small / Medium pieces",
    image: "/images/curry-cut.png",
  },
  {
    name: "Biryani Cut",
    subtitle: "60g / 120g pieces",
    image: "/images/biryani-cut.png",
  },
  {
    name: "Leg Piece",
    subtitle: "Whole / Cut",
    image: "/images/leg-piece.png",
  },
  {
    name: "Breast",
    subtitle: "Pieces / Boneless",
    image: "/images/chicken-breast.png",
  },
  {
    name: "Liver / Gizzards",
    subtitle: "As per availability",
    image: "/images/liver-gizzards.png",
  },
];

export default function FreshMeat() {
  const location = useLocation();

  const getCategoryFromPath = () => {
    const path = location.pathname.toLowerCase();

    if (path.endsWith("/chicken")) return "Chicken";
    if (path.endsWith("/boneless")) return "Boneless Chicken";
    if (path.endsWith("/mutton")) return "Mutton";
    if (path.endsWith("/keema")) return "Mutton Keema";
    if (path.endsWith("/eggs")) return "Eggs";

    if (path.endsWith("/cutting-options")) {
      return "Cutting Options";
    }

    return "All";
  };

  const [activeCategory, setActiveCategory] = useState(
    getCategoryFromPath
  );

  const [selectedCuts, setSelectedCuts] = useState({});
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    setActiveCategory(getCategoryFromPath());
    setSelectedCuts({});
  }, [location.pathname]);

  const visibleProducts = products.filter((product) => {
    return (
      activeCategory !== "Cutting Options" &&
      (activeCategory === "All" ||
        product.category === activeCategory)
    );
  });

  const showCuttingOptions =
    activeCategory === "All" ||
    activeCategory === "Chicken" ||
    activeCategory === "Boneless Chicken" ||
    activeCategory === "Mutton" ||
    activeCategory === "Cutting Options";

  const handleCutChange = (productId, value) => {
    setSelectedCuts((previous) => ({
      ...previous,
      [productId]: value,
    }));

    setAddedMessage("");
  };

  const addToCart = (product) => {
    const selectedCut = selectedCuts[product.id] || "";

    if (product.cuttingAllowed && !selectedCut) {
      setAddedMessage(
        `Please select a cutting option for ${product.name}.`
      );
      return;
    }

    let cart = [];

    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      cart = Array.isArray(savedCart) ? savedCart : [];
    } catch {
      cart = [];
    }

    const newItem = {
      name: product.name,
      size: product.subtitle.replace(/[()]/g, ""),
      price: Number(product.price),
      quantity: 1,
      image: product.image,
      unit: product.unit,
      cuttingOption: selectedCut,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.name === newItem.name &&
        item.size === newItem.size &&
        (item.cuttingOption || "") === newItem.cuttingOption
    );

    if (existingIndex !== -1) {
      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity:
          Number(cart[existingIndex].quantity || 1) + 1,
      };
    } else {
      cart.push(newItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    setAddedMessage(
      `${product.name} - ${selectedCut || "Regular"} added to cart!`
    );
  };

  return (
    <main className="fresh-meat-page">

      {/* HERO BANNER */}
      <section className="fm-hero">

        <div className="fm-hero-content">

          <h1>
            <span>🌿</span> Fresh Meat & Eggs
          </h1>

          <p>
            Farm-Fresh • Hygienic • Cleaned • Cut • Packed
          </p>

          <div className="fm-hero-features">

            <div>
              <span>🐓</span>
              <strong>Fresh<br />Chicken</strong>
            </div>

            <div>
              <span>🥩</span>
              <strong>Boneless<br />Chicken</strong>
            </div>

            <div>
              <span>🐐</span>
              <strong>Fresh<br />Mutton</strong>
            </div>

            <div>
              <span>🍲</span>
              <strong>Mutton<br />Keema</strong>
            </div>

            <div>
              <span>🥚</span>
              <strong>Fresh<br />Eggs</strong>
            </div>

          </div>
        </div>

        <div className="fm-hero-image">
          <img
            src="/images/fresh-meat-banner.png"
            alt="Fresh meat and chicken"
          />
        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="fm-layout">

        {/* SIDEBAR */}
        <aside className="fm-sidebar">

          <h2>Categories</h2>

          <div className="fm-category-list">

            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                className={
                  activeCategory === category.name
                    ? "fm-category selected"
                    : "fm-category"
                }
                onClick={() => {
                  setActiveCategory(
                    activeCategory === category.name
                      ? "All"
                      : category.name
                  );

                  setAddedMessage("");
                }}
              >
                <span>{category.icon}</span>
                <strong>{category.name}</strong>
              </button>
            ))}

          </div>

          <div className="fm-delivery-card">
            <div className="fm-delivery-icon">🚚</div>
            <h2>Daily Delivery</h2>
            <h3>in Matrusri Nagar</h3>
            <p>(Within 1.5 km)</p>
          </div>

        </aside>

        {/* PRODUCTS */}
        <div className="fm-main">

          {addedMessage && (
            <div className="fm-cart-message">
              <span>{addedMessage}</span>

              <button
                type="button"
                onClick={() => setAddedMessage("")}
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          {activeCategory !== "Cutting Options" && (
            <div className="fm-product-grid">

              {visibleProducts.map((product) => (
                <article
                  className="fm-product-card"
                  key={product.id}
                >

                  <div className="fm-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="fm-product-info">

                    <h3>{product.name}</h3>

                    <p>{product.subtitle}</p>

                    <strong className="fm-price">
                      {product.displayPrice}
                    </strong>

                    {product.cuttingAllowed && (
                      <div className="fm-cutting-dropdown">

                        <label htmlFor={`cut-${product.id}`}>
                          Select Cutting Option
                        </label>

                        <select
                          id={`cut-${product.id}`}
                          value={selectedCuts[product.id] || ""}
                          onChange={(e) =>
                            handleCutChange(
                              product.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Choose Cutting
                          </option>

                          {product.cuttingOptions.map((option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}

                        </select>

                      </div>
                    )}

                    <button
                      className="fm-order-btn"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      🛒 Add to Cart
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

          {/* CUTTING OPTIONS SECTION - RESTORED */}
          {showCuttingOptions && (

            <section className="fm-cutting-section">

              <h2>
                <span>✂️</span> Cutting Options
              </h2>

              <p className="fm-cutting-description">
                Choose from our available fresh meat cutting styles.
              </p>

              <div className="fm-cutting-grid">

                {cuttingOptions.map((option) => (
                  <div
                    className="fm-cutting-card"
                    key={option.name}
                  >

                    <div className="fm-cutting-image">
                      <img
                        src={option.image}
                        alt={option.name}
                        loading="lazy"
                      />
                    </div>

                    <h3>{option.name}</h3>
                    <p>{option.subtitle}</p>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* BOTTOM FEATURES */}
          <div className="fm-bottom-features">

            <div>🌿 <strong>Farm Sourced</strong></div>
            <div>🛡️ <strong>Hygienic Processing</strong></div>
            <div>❄️ <strong>Fresh & Chilled</strong></div>
            <div>📦 <strong>Cleaned & Packed</strong></div>
            <div>▦ <strong>Pre-Book & Pickup</strong></div>

          </div>

        </div>

      </section>

    </main>
  );
}
