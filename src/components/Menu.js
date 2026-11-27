import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readCart, saveCart, useApi } from "../api";
import "./Menu.css";

const h = React.createElement;

// MENU COMPONENT
function Menu() {
  const location = useLocation();

  const { data, loading, error } = useApi("/menu");
  const categories = [...(data?.categories || []), { name: "All Items", icon: "▦" }];
  const products = data?.items || [];
  const [activeCategory, setActiveCategory] = useState(location.state?.category || "Biryani");

  const [selectedSizes, setSelectedSizes] = useState({});
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    const syncCart = () => setCart(readCart());
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

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
  }, [location.key, location.state, data]);

  useEffect(() => {
    if (data && activeCategory !== "All Items" && !data.categories.some((category) => category.name === activeCategory)) {
      setActiveCategory("All Items");
    }
  }, [data, activeCategory]);

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
      selectedSizes[product.id] ||
      Object.keys(product.prices)[0];

    if (!product.inStock || !size) return;
    const price = product.prices[size];

    const previousCart = readCart();

    const existing = previousCart.find(
      (item) =>
        item.itemType === "menu" && item.itemId === product.id && item.size === size
    );

    let updatedCart;

    if (existing) {
      updatedCart = previousCart.map((item) =>
        item.itemType === "menu" && item.itemId === product.id && item.size === size
          ? {
              ...item,
              quantity: Number(item.quantity || 0) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...previousCart,
        {
          itemType: "menu",
          itemId: product.id,
          name: product.name,
          size,
          price,
          quantity: 1,
          image: product.image,
        },
      ];
    }

    saveCart(updatedCart);
  }

  function decreaseQuantity(product, size) {
    const updatedCart = readCart()
      .map((item) =>
        item.itemType === "menu" && item.itemId === product.id && item.size === size
          ? { ...item, quantity: Number(item.quantity || 0) - 1 }
          : item
      )
      .filter((item) =>
        item.itemType !== "menu" || item.itemId !== product.id || item.size !== size || Number(item.quantity) > 0
      );
    saveCart(updatedCart);
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
      selectedSizes[product.id] || sizeNames[0];
    const cartItem = cart.find(
      (item) => item.itemType === "menu" && item.itemId === product.id && item.size === selectedSize
    );
    const quantity = Number(cartItem?.quantity || 0);

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
                    [product.id]: size,
                  })),
              },

              h("span", null, size),
              h("strong", null, "₹" + price)
            )
          )
        ),

        !product.inStock ? h("button", { className: "menu-add-cart", disabled: true }, "Out of Stock") : quantity > 0 ? h(
          "div",
          { className: "menu-quantity", "aria-label": `${product.name}, ${selectedSize} quantity` },
          h("button", { type: "button", onClick: () => decreaseQuantity(product, selectedSize), "aria-label": `Remove one ${product.name}, ${selectedSize}` }, "−"),
          h("span", { "aria-live": "polite" }, quantity),
          h("button", { type: "button", onClick: () => addToCart(product), "aria-label": `Add one ${product.name}, ${selectedSize}` }, "+")
        ) : h(
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

          categories.filter((category) => category.name !== "All Items").map((category) =>
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
            activeCategory === "All Items" ? "ALL RESTAURANT ITEMS" : (categories.find((category) => category.name === activeCategory)?.pageHeading || activeCategory)
          ),

          h("span", null, "〰")
        ),

        h(
          "div",
          { className: "menu-authentic-label" },
          "🍂 Authentic Flavours • Freshly Prepared"
        ),

        // PRODUCT GROUPS
        loading ? h("p", { className: "menu-empty" }, "Loading menu...") : error ? h("p", { className: "menu-empty", role: "alert" }, "Unable to load the menu. Please try again later.") : filteredProducts.length
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
