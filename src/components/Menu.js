import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Menu.css";

const h = React.createElement;

const categories = [
  { name: "Biryani", icon: "🍛" },
  { name: "Starters", icon: "🍗" },
  { name: "BBQ & Tandoori", icon: "🥘" },
  { name: "Chinese", icon: "🍜" },
  { name: "Breads", icon: "🫓" },
  { name: "Veg Specials", icon: "🌿" },
  { name: "All Items", icon: "▦" },
];

const products = [
  {
    name: "Chicken Dum Biryani",
    category: "Biryani",
    description: "Aromatic basmati rice with traditional dum chicken",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto%2Cq_auto%2Cfl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2026/4/11/9177c71f-8c13-4fc1-b12b-635bf0f7e198_137705.jpg",
    prices: { Single: 169, Regular: 299, Family: 569 },
    bestseller: true,
  },
  {
    name: "Chicken Fry Biryani",
    category: "Biryani",
    description: "Spicy fried chicken with flavourful biryani rice",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/FOOD_CATALOG/IMAGES/CMS/2025/5/25/d82ca88c-3b63-4397-82f2-2b3be054d68d_cb919127-5a2a-4fe5-abf7-53c3287ea6c8.jpg",
    prices: { Single: 199, Regular: 379, Family: 749 },
  },
  {
    name: "Chicken 65 Biryani",
    category: "Biryani",
    description: "Classic Chicken 65 with aromatic biryani",
    image: "https://154630363.cdn6.editmysite.com/uploads/1/5/4/6/154630363/NRI3NI3GVO5ZIK2Q7ON4PWTA.png",
    prices: { Single: 249, Regular: 479, Family: 939 },
  },
  {
    name: "Boneless Fry Biryani",
    category: "Biryani",
    description: "Tender boneless chicken in special spices",
    image: "https://bfactory.app/_next/image?q=75&url=%2Fchicken_fry_piece_biryani.png&w=3840",
    prices: { Single: 249, Regular: 449, Family: 849 },
  },
  {
    name: "Mutton Dum Biryani",
    category: "Biryani",
    description: "Slow-cooked mutton with fragrant basmati rice",
    image: "https://b.zmtcdn.com/data/pictures/chains/6/19260706/8615d93d35f826990e5497544823071f.jpg",
    prices: { Single: 349, Regular: 649, Family: 1249 },
  },
  {
    name: "Veg Biryani",
    category: "Veg Specials",
    description: "Aromatic basmati rice with fresh vegetables & spices",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/12/1fdfb861-c78c-4bbc-90ee-87b1c9286d92_27693696-34b3-45ab-9384-b128939183d1.jpg",
    prices: { Single: 159, Regular: 279, Family: 519 },
  },
  {
    name: "Chicken Tikka",
    category: "Starters",
    description: "Juicy chicken tikka grilled with Indian spices",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/f_auto%2Cq_auto%2Cfl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2026/4/11/9177c71f-8c13-4fc1-b12b-635bf0f7e198_137705.jpg",
    prices: { Single: 179, Regular: 329, Family: 599 },
  },
  {
    name: "Chicken BBQ",
    category: "BBQ & Tandoori",
    description: "Smoky grilled chicken with traditional masala",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/12/1fdfb861-c78c-4bbc-90ee-87b1c9286d92_27693696-34b3-45ab-9384-b128939183d1.jpg",
    prices: { Single: 199, Regular: 379, Family: 699 },
  },
  {
    name: "Veg Fried Rice",
    category: "Chinese",
    description: "Fresh vegetables tossed with flavourful rice",
    image: "https://spicerange.com/cdn/shop/collections/Indian_Spices_Masalas_Online_Herbs_Spice_Range.jpg?v=1625602065",
    prices: { Single: 129, Regular: 229, Family: 429 },
  },
  {
    name: "Butter Naan",
    category: "Breads",
    description: "Soft Indian bread topped with butter",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/11/12/1fdfb861-c78c-4bbc-90ee-87b1c9286d92_27693696-34b3-45ab-9384-b128939183d1.jpg",
    prices: { Single: 40, Regular: 80, Family: 150 },
  },
];

function Menu() {
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "Biryani"
  );

  const [cart, setCart] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  // Header dropdown nundi category select chesthe update avuthundi
  useEffect(() => {
    const selectedCategory = location.state?.category;

    if (
      selectedCategory &&
      categories.some((category) => category.name === selectedCategory)
    ) {
      setActiveCategory(selectedCategory);
    }
  }, [location.key, location.state]);

  const filteredProducts =
    activeCategory === "All Items"
      ? products
      : products.filter(
          (item) => item.category === activeCategory
        );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function addToCart(product) {
    const size = selectedSizes[product.name] || "Single";
    const price = product.prices[size];

    setCart((previous) => {
      const existing = previous.find(
        (item) =>
          item.name === product.name && item.size === size
      );

      if (existing) {
        return previous.map((item) =>
          item.name === product.name && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previous,
        {
          name: product.name,
          size,
          price,
          quantity: 1,
        },
      ];
    });
  }

  function renderCategory(category) {
    return h(
      "button",
      {
        key: category.name,
        className:
          "menu-category-tab" +
          (activeCategory === category.name ? " active" : ""),
        onClick: () => setActiveCategory(category.name),
      },
      h("span", { className: "menu-tab-icon" }, category.icon),
      h("span", { className: "menu-tab-name" }, category.name)
    );
  }

  function renderProduct(product) {
    const selectedSize = selectedSizes[product.name] || "Single";

    return h(
      "article",
      { className: "menu-product-card", key: product.name },

      product.bestseller
        ? h("span", { className: "menu-bestseller" }, "♛ Bestseller")
        : null,

      h(
        "div",
        { className: "menu-product-image" },
        h("img", {
          src: product.image,
          alt: product.name,
          loading: "lazy",
          onError: (event) => {
            event.currentTarget.src =
              "https://media-assets.swiggy.com/swiggy/image/upload/f_auto%2Cq_auto%2Cfl_lossy/RX_THUMBNAIL/IMAGES/VENDOR/2026/4/11/9177c71f-8c13-4fc1-b12b-635bf0f7e198_137705.jpg";
          },
        })
      ),

      h(
        "div",
        { className: "menu-product-details" },

        h("h3", null, product.name),
        h("p", { className: "menu-product-description" }, product.description),

        h(
          "div",
          { className: "menu-price-options" },
          Object.entries(product.prices).map(([size, price]) =>
            h(
              "button",
              {
                key: size,
                className:
                  "menu-price-option" +
                  (selectedSize === size ? " selected" : ""),
                onClick: () =>
                  setSelectedSizes((previous) => ({
                    ...previous,
                    [product.name]: size,
                  })),
              },
              h("span", null, size),
              h("strong", null, "₹" + price)
            )
          )
        ),

        h(
          "button",
          {
            className: "menu-add-cart",
            onClick: () => addToCart(product),
          },
          h("span", null, "🛒"),
          " Add to Cart"
        )
      )
    );
  }

  return h(
    "main",
    { className: "restaurant-menu-page" },

    h(
      "section",
      { className: "menu-hero" },

      h(
        "div",
        { className: "menu-hero-heading" },
        h("span", { className: "menu-chef-icon" }, "♨"),
        h(
          "div",
          null,
          h("h1", null, "Our Restaurant Menu"),
          h(
            "p",
            null,
            "Biryani, Starters, BBQ, Chinese, Breads & More..."
          )
        )
      ),

      h(
        "div",
        { className: "menu-category-tabs" },
        categories.map(renderCategory)
      )
    ),

    h(
      "section",
      { className: "menu-content" },

      h(
        "aside",
        { className: "menu-sidebar" },

        h("h2", null, "Menu Categories"),

        h(
          "div",
          { className: "menu-sidebar-list" },
          categories.slice(0, 6).map((category) =>
            h(
              "button",
              {
                key: category.name,
                className:
                  "menu-sidebar-item" +
                  (activeCategory === category.name ? " active" : ""),
                onClick: () => setActiveCategory(category.name),
              },
              h("span", null, category.icon),
              h("strong", null, category.name),
              h("b", null, "›")
            )
          )
        ),

        h(
          "div",
          { className: "menu-dine-card" },
          h("span", null, "♨"),
          h("h3", null, "Dine In • Takeaway"),
          h("p", null, "Home Delivery"),
          h("span", { className: "menu-delivery-icon" }, "🛵")
        )
      ),

      h(
        "div",
        { className: "menu-products-area" },

        h(
          "div",
          { className: "menu-section-heading" },
          h("span", null, "〰"),
          h(
            "h2",
            null,
            activeCategory === "All Items"
              ? "All Restaurant Items"
              : activeCategory === "Biryani"
              ? "Biryani Varieties"
              : activeCategory
          ),
          h("span", null, "〰")
        ),

        h(
          "div",
          { className: "menu-authentic-label" },
          "🍂 Authentic Biryani • Rich Flavours • Freshly Prepared"
        ),

        h(
          "div",
          { className: "menu-product-grid" },
          filteredProducts.length
            ? filteredProducts.map(renderProduct)
            : h("p", { className: "menu-empty" }, "Items coming soon.")
        )
      )
    ),

    h(
      "div",
      { className: "menu-cart-status" },
      h("span", null, "🛒"),
      h("strong", null, "Cart: " + cartCount + " items"),
      h(
        "span",
        null,
        " • Total: ₹" +
          cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )
      )
    )
  );
}

export default Menu;
