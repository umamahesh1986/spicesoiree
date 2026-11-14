import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Menu.css";

const h = React.createElement;

const CART_KEY = "spice_soiree_cart";

// MENU CATEGORIES
const categories = [
  { name: "Biryani", icon: "🍛" },
  { name: "Starters", icon: "🍗" },
  { name: "BBQ & Tandoori", icon: "🥘" },
  { name: "Chinese", icon: "🍜" },
  { name: "Indian Curries", icon: "🍲" },
  { name: "Breads", icon: "🫓" },
  { name: "All Items", icon: "▦" },
];

// INDIVIDUAL PRODUCT IMAGES
const images = {
  // BIRYANI
  "Chicken Dum Biryani": "/images/Chicken Dum Biryani.png",
  "Chicken Fry Piece Biryani": "/images/Chicken Fry Piece Biryani.png",
  "Chicken 65 Biryani": "/images/Chicken 65 Biryani.png",
  "Paneer Biryani": "/images/Paneer Biryani.png",
  "Mushroom Biryani": "/images/Mushroom Biryani.png",
  "Gongura Chicken Biryani": "/images/Gongura Chicken Biryani.png",

  // CHICKEN STARTERS
  "Chicken – 65 / Manchurian": "/images/Chicken 65.png",
  "Chicken – Chilli / Ginger": "/images/Chicken Chilli.png",
  "Chicken – Majestic / Pepper / Dragon / 555": "/images/Chicken Majestic.png",
  "Chicken Lollipop (3 pcs / 6 pcs)": "/images/Chicken Lollipop.png",

  // CHICKEN PAKODA
  "Bone-in Chicken Pakoda": "/images/Bone-in Chicken Pakoda.png",
  "Boneless Chicken Pakoda": "/images/Boneless Chicken Pakoda.png",

  // GOBI
  "Gobi Manchurian": "/images/Gobi Manchurian.png",
  "Gobi – Chilli / 65": "/images/Gobi Chilli.png",
  "Gobi – Crispy / Schezwan / Pepper": "/images/Crispy Gobi.png",

  // MUSHROOM STARTERS
  "Mushroom – Chilli / 65 / Manchurian": "/images/Mushroom Chilli.png",
  "Mushroom – Pepper / Crispy / Schezwan": "/images/Mushroom Pepper.png",

  // CORN
  "Crispy Corn": "/images/Crispy Corn.png",

  // PANEER STARTERS
  "Paneer – Chilli / 65 / Manchurian": "/images/Paneer Chilli.png",
  "Paneer – Pepper / Crispy / Schezwan": "/images/Paneer Pepper.png",

  // VEG MANCHURIAN
  "Veg Manchurian": "/images/Veg Manchurian.png",
  "Chilli / Schezwan Veg Manchurian": "/images/Chilli Veg Manchurian.png",
  "Pepper / Garlic Veg Manchurian": "/images/Pepper Veg Manchurian.png",

  // CHICKEN BBQ
  "Tandoori Chicken": "/images/Tandoori Chicken.png",
  "Spicy Chicken Tikka": "/images/Spicy Chicken Tikka.png",
  "Malai Chicken Tikka": "/images/Malai Chicken Tikka.png",
  "Spicy BBQ Leg": "/images/Spicy BBQ Leg.png",
  "Spicy BBQ Wings": "/images/Spicy BBQ Wings.png",

  // VEG BBQ
  "Paneer Tikka": "/images/Paneer Tikka.png",
  "Malai Paneer Tikka": "/images/Malai Paneer Tikka.png",
  "Hariyali Paneer Tikka": "/images/Hariyali Paneer Tikka.png",
  "Mushroom Tikka": "/images/Mushroom Tikka.png",
  "Malai Mushroom Tikka": "/images/Malai Mushroom Tikka.png",
  "Gobi Tikka": "/images/Gobi Tikka.png",
  "Hariyali Gobi Tikka": "/images/Hariyali Gobi Tikka.png",

  // FRIED RICE
  "Veg Fried Rice": "/images/Veg Fried Rice.png",
  "Egg Fried Rice": "/images/Egg Fried Rice.png",
  "Chicken Fried Rice": "/images/Chicken Fried Rice.png",
  "Schezwan Chicken Fried Rice": "/images/Schezwan Chicken Fried Rice.png",

  // NOODLES
  "Veg Noodles": "/images/Veg Noodles.png",
  "Egg Noodles": "/images/Egg Noodles.png",
  "Chicken Noodles": "/images/Chicken Noodles.png",
  "Schezwan Chicken Noodles": "/images/Schezwan Chicken Noodles.png",

  // VEGETARIAN CURRIES
  "Paneer Butter Masala": "/images/Paneer Butter Masala.png",
  "Kadai Paneer": "/images/Kadai Paneer.png",
  "Mushroom Masala": "/images/Mushroom Masala.png",
  "Kadai Mushroom": "/images/Kadai Mushroom.png",
  "Kaju Masala": "/images/Kaju Masala.png",

  // NON-VEGETARIAN CURRIES
  "Andhra Chicken Curry": "/images/Andhra Chicken Curry.png",
  "Butter Chicken / Kadai Chicken": "/images/Butter Chicken.png",
  "Gongura Chicken Curry": "/images/Gongura Chicken Curry.png",
  "Mutton Curry": "/images/Mutton Curry.png",
  "Gongura Mutton Curry": "/images/Gongura Mutton Curry.png",
  "Egg Masala": "/images/Egg Masala.png",

  // BREADS
  "Plain Naan": "/images/Plain Naan.png",
  "Butter Naan": "/images/Butter Naan.png",
  "Garlic Naan": "/images/Garlic Naan.png",
  "Tandoori Roti": "/images/Tandoori Roti.png",
  "Butter Tandoori Roti": "/images/Butter Tandoori Roti.png",
  "Pulka": "/images/Pulka.png",
};

// PRODUCT HELPER
const makeProducts = (
  category,
  mainHeading,
  section,
  sizeNames,
  rows,
  description
) =>
  rows.map(([name, prices], index) => ({
    name,
    category,
    mainHeading,
    section,
    description:
      description ||
      `Freshly prepared ${name.toLowerCase()} with authentic Spice Soirée flavours.`,
    image: images[name] || "",
    prices: Object.fromEntries(
      sizeNames.map((size, sizeIndex) => [
        size,
        Number(prices[sizeIndex]),
      ])
    ),
    bestseller: category === "Biryani" && index === 0,
  }));

// ALL MENU PRODUCTS
const products = [
  // 1. BIRYANI
  ...makeProducts(
    "Biryani",
    "",
    "SIGNATURE BIRYANIS",
    ["Single", "Regular", "Family"],
    [
      ["Chicken Dum Biryani", [169, 319, 629]],
      ["Chicken Fry Piece Biryani", [199, 379, 749]],
      ["Chicken 65 Biryani", [249, 479, 939]],
      ["Paneer Biryani", [239, 459, 899]],
      ["Mushroom Biryani", [229, 439, 859]],
      ["Gongura Chicken Biryani", [249, 479, 929]],
    ],
    "Aromatic basmati rice prepared with authentic spices."
  ),

  // 2. STARTERS - CHICKEN STARTERS
  ...makeProducts(
    "Starters",
    "",
    "CHICKEN STARTERS",
    ["Small", "Large"],
    [
      ["Chicken – 65 / Manchurian", [169, 299]],
      ["Chicken – Chilli / Ginger", [179, 319]],
      ["Chicken – Majestic / Pepper / Dragon / 555", [189, 329]],
      ["Chicken Lollipop (3 pcs / 6 pcs)", [189, 349]],
    ]
  ),

  // CHICKEN PAKODA
  ...makeProducts(
    "Starters",
    "",
    "CHICKEN PAKODA",
    ["250g", "500g RAW CHICKEN"],
    [
      ["Bone-in Chicken Pakoda", [200, 360]],
      ["Boneless Chicken Pakoda", [250, 460]],
    ]
  ),

  // VEGETARIAN STARTERS - GOBI
  ...makeProducts(
    "Starters",
    "VEGETARIAN STARTERS",
    "GOBI SPECIALS",
    ["Small", "Large"],
    [
      ["Gobi Manchurian", [109, 189]],
      ["Gobi – Chilli / 65", [119, 199]],
      ["Gobi – Crispy / Schezwan / Pepper", [129, 209]],
    ]
  ),

  // MUSHROOM SPECIALS
  ...makeProducts(
    "Starters",
    "VEGETARIAN STARTERS",
    "MUSHROOM SPECIALS",
    ["Small", "Large"],
    [
      ["Mushroom – Chilli / 65 / Manchurian", [159, 279]],
      ["Mushroom – Pepper / Crispy / Schezwan", [169, 289]],
    ]
  ),

  // CORN SPECIAL
  ...makeProducts(
    "Starters",
    "VEGETARIAN STARTERS",
    "CORN SPECIAL",
    ["Small", "Large"],
    [
      ["Crispy Corn", [139, 239]],
    ]
  ),

  // PANEER SPECIALS
  ...makeProducts(
    "Starters",
    "VEGETARIAN STARTERS",
    "PANEER SPECIALS",
    ["Small", "Large"],
    [
      ["Paneer – Chilli / 65 / Manchurian", [189, 329]],
      ["Paneer – Pepper / Crispy / Schezwan", [199, 339]],
    ]
  ),

  // VEG MANCHURIAN SPECIALS
  ...makeProducts(
    "Starters",
    "VEGETARIAN STARTERS",
    "VEG MANCHURIAN SPECIALS",
    ["Small", "Large"],
    [
      ["Veg Manchurian", [119, 199]],
      ["Chilli / Schezwan Veg Manchurian", [129, 209]],
      ["Pepper / Garlic Veg Manchurian", [129, 209]],
    ]
  ),

  // 3. BBQ & TANDOORI - CHICKEN
  ...makeProducts(
    "BBQ & Tandoor",
    "CHICKEN BBQ & TANDOORI",
    "CHICKEN BBQ & TANDOORI",
    ["Half", "Full"],
    [
      ["Tandoori Chicken", [299, 549]],
    ]
  ),

  ...makeProducts(
    "BBQ & Tandoori",
    "",
    "CHICKEN BBQ & TANDOORI",
    ["6 pcs", "12 pcs"],
    [
      ["Spicy Chicken Tikka", [149, 279]],
      ["Malai Chicken Tikka", [149, 279]],
    ]
  ),

  ...makeProducts(
    "BBQ & Tandoori",
    "CHICKEN BBQ & TANDOORI",
    "CHICKEN BBQ & TANDOORI",
    ["1 pc", "3 pcs"],
    [
      ["Spicy BBQ Leg", [99, 279]],
    ]
  ),

  ...makeProducts(
    "BBQ & Tandoori",
    "CHICKEN BBQ & TANDOORI",
    "CHICKEN BBQ & TANDOORI",
    ["3 pcs", "6 pcs"],
    [
      ["Spicy BBQ Wings", [149, 289]],
    ]
  ),

  // VEG BBQ
  ...makeProducts(
    "BBQ & Tandoori",
    "VEG BBQ",
    "VEG BBQ",
    ["6 PCS", "12 PCS"],
    [
      ["Paneer Tikka", [199, 379]],
      ["Malai Paneer Tikka", [219, 399]],
      ["Hariyali Paneer Tikka", [209, 389]],
      ["Mushroom Tikka", [159, 299]],
      ["Malai Mushroom Tikka", [169, 319]],
      ["Gobi Tikka", [129, 239]],
      ["Hariyali Gobi Tikka", [139, 259]],
    ]
  ),

  // 4. CHINESE - FRIED RICE
  ...makeProducts(
    "Chinese",
    "",
    "FRIED RICE • BASMATI",
    ["Single", "Full"],
    [
      ["Veg Fried Rice", [109, 159]],
      ["Egg Fried Rice", [129, 179]],
      ["Chicken Fried Rice", [159, 219]],
      ["Schezwan Chicken Fried Rice", [179, 249]],
    ]
  ),

  // NOODLES
  ...makeProducts(
    "Chinese",
    "",
    "NOODLES",
    ["Single", "Full"],
    [
      ["Veg Noodles", [99, 159]],
      ["Egg Noodles", [119, 179]],
      ["Chicken Noodles", [129, 189]],
      ["Schezwan Chicken Noodles", [139, 199]],
    ]
  ),

  // 5. INDIAN CURRIES - VEGETARIAN
  ...makeProducts(
    "Indian Curries",
    "",
    "VEGETARIAN CURRIES",
    ["Half", "Full"],
    [
      ["Paneer Butter Masala", [169, 289]],
      ["Kadai Paneer", [179, 299]],
      ["Mushroom Masala", [149, 249]],
      ["Kadai Mushroom", [159, 269]],
      ["Kaju Masala", [189, 329]],
    ]
  ),

  // NON-VEGETARIAN CURRIES
  ...makeProducts(
    "Indian Curries",
    "",
    "NON-VEGETARIAN CURRIES",
    ["Half", "Full"],
    [
      ["Andhra Chicken Curry", [179, 299]],
      ["Butter Chicken / Kadai Chicken", [199, 349]],
      ["Gongura Chicken Curry", [199, 349]],
      ["Mutton Curry", [299, 499]],
      ["Gongura Mutton Curry", [329, 549]],
      ["Egg Masala", [119, 199]],
    ]
  ),

  // 6. BREADS
  ...makeProducts(
    "Breads",
    "",
    "",
    ["Price"],
    [
      ["Plain Naan", [39]],
      ["Butter Naan", [49]],
      ["Garlic Naan", [59]],
      ["Tandoori Roti", [29]],
      ["Butter Tandoori Roti", [39]],
      ["Pulka", [15]],
    ]
  ),
];

// MENU COMPONENT
function Menu() {
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState(
    categories.some(
      (category) => category.name === location.state?.category
    )
      ? location.state.category
      : "Biryani"
  );

  const [selectedSizes, setSelectedSizes] = useState({});

  // HEADER CATEGORY NAVIGATION
  useEffect(() => {
    const selectedCategory = location.state?.category;

    if (
      selectedCategory &&
      categories.some(
        (category) => category.name === selectedCategory
      )
    ) {
      setActiveCategory(selectedCategory);
    }
  }, [location.key, location.state]);

  // FILTER PRODUCTS
  const filteredProducts =
    activeCategory === "All Items"
      ? products
      : products.filter(
          (item) => item.category === activeCategory
        );

  // ADD TO HEADER CART
  function addToCart(product) {
    const size =
      selectedSizes[product.name] ||
      Object.keys(product.prices)[0];

    const price = product.prices[size];

    let previousCart = [];

    try {
      previousCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(previousCart)) {
        previousCart = [];
      }
    } catch {
      previousCart = [];
    }

    const existing = previousCart.find(
      (item) =>
        item.name === product.name &&
        item.size === size
    );

    let updatedCart;

    if (existing) {
      updatedCart = previousCart.map((item) =>
        item.name === product.name &&
        item.size === size
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...previousCart,
        {
          name: product.name,
          size,
          price,
          quantity: 1,
          image: product.image,
        },
      ];
    }

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(updatedCart)
    );

    // UPDATE HEADER CART COUNT
    window.dispatchEvent(new Event("cartUpdated"));
  }

  // CATEGORY TABS
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

  // PRODUCT CARD
  function renderProduct(product) {
    const sizeNames = Object.keys(product.prices);

    const selectedSize =
      selectedSizes[product.name] || sizeNames[0];

    return h(
      "article",
      {
        className: "menu-product-card",
        key: `${product.mainHeading}-${product.section}-${product.name}`,
      },

      product.bestseller
        ? h("span", { className: "menu-bestseller" }, "♛ Bestseller")
        : null,

      h(
        "div",
        { className: "menu-product-image" },

        product.image
          ? h("img", {
              src: product.image,
              alt: product.name,
              loading: "lazy",
              onError: (event) => {
                event.currentTarget.style.display = "none";
              },
            })
          : h(
              "div",
              { className: "menu-image-placeholder" },
              "Add Image"
            )
      ),

      h(
        "div",
        { className: "menu-product-details" },

        h("h3", null, product.name),

        h(
          "p",
          { className: "menu-product-description" },
          product.description
        ),

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

  // GROUP PRODUCTS BY MAIN HEADING AND SUBHEADING
  function renderProductGroups() {
    const mainGroups = [];

    filteredProducts.forEach((product) => {
      let mainGroup = mainGroups.find(
        (item) => item.heading === product.mainHeading
      );

      if (!mainGroup) {
        mainGroup = {
          heading: product.mainHeading,
          sections: [],
        };
        mainGroups.push(mainGroup);
      }

      let sectionGroup = mainGroup.sections.find(
        (item) => item.section === product.section
      );

      if (!sectionGroup) {
        sectionGroup = {
          section: product.section,
          products: [],
        };
        mainGroup.sections.push(sectionGroup);
      }

      sectionGroup.products.push(product);
    });

    return mainGroups.map((mainGroup) =>
      h(
        "section",
        {
          className: "menu-main-group",
          key: mainGroup.heading,
        },

        // MAIN HEADING
        h(
          "h2",
          {
            className: "menu-main-heading",
            style: {
              color: "#a64f17",
              fontSize: "22px",
              fontStyle: "italic",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textAlign: "center",
              margin: "30px 0 22px",
              paddingBottom: "13px",
              borderBottom: "2px solid #d99a60",
            },
          },
          mainGroup.heading
        ),

        // SUBSECTIONS
        mainGroup.sections.map((sectionGroup) =>
          h(
            "div",
            {
              className: "menu-product-group",
              key: sectionGroup.section,
            },

            h(
              "h3",
              {
                className: "menu-subsection-heading",
                style: {
                  margin: "22px 0 15px",
                  paddingBottom: "9px",
                  borderBottom: "1px solid #e8c8a9",
                  color: "#a64f17",
                  fontSize: "17px",
                  fontStyle: "italic",
                  letterSpacing: "0.7px",
                },
              },
              sectionGroup.section
            ),

            h(
              "div",
              { className: "menu-product-grid" },
              sectionGroup.products.map(renderProduct)
            )
          )
        )
      )
    );
  }

  // MAIN MENU UI
  return h(
    "main",
    { className: "restaurant-menu-page" },

    // HERO SECTION
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
            "Biryani, Starters, BBQ, Chinese, Indian Curries, Breads & More..."
          )
        )
      ),

      // TOP CATEGORY TABS
      h(
        "div",
        { className: "menu-category-tabs" },
        categories.map(renderCategory)
      )
    ),

    // MENU CONTENT
    h(
      "section",
      { className: "menu-content" },

      // SIDEBAR
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

      // PRODUCTS AREA
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
              ? "ALL RESTAURANT ITEMS"
              : activeCategory === "Biryani"
              ? "SIGNATURE BIRYANIS"
              : activeCategory === "Starters"
              ? "OUR STARTERS"
              : activeCategory === "BBQ & Tandoori"
              ? "BBQ & TANDOORI"
              : activeCategory === "Chinese"
              ? "FRIED RICE & NOODLES"
              : activeCategory === "Indian Curries"
              ? "INDIAN CURRIES"
              : "INDIAN BREADS"
          ),

          h("span", null, "〰")
        ),

        h(
          "div",
          { className: "menu-authentic-label" },
          "🍂 Authentic Flavours • Freshly Prepared"
        ),

        // PRODUCT GROUPS
        filteredProducts.length
          ? renderProductGroups()
          : h(
              "p",
              { className: "menu-empty" },
              "Items coming soon."
            )
      )
    ),

    // FOOTER
    h(
      "div",
      {
        className: "menu-footer-delivery",
        style: {
          textAlign: "center",
          padding: "20px 10px",
          color: "#a64f17",
          fontWeight: 600,
          letterSpacing: "1px",
        },
      },
      
    )
  );
}

export default Menu;
