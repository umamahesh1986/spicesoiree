// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import "./FreshMeatEggs.css";

// const products = [
//   {
//     id: 1,
//     name: "Fresh Chicken",
//     subtitle: "(Whole)",
//     price: "₹270 / kg",
//     category: "Chicken",
//     image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=700",
//   },
//   {
//     id: 2,
//     name: "Boneless Chicken",
//     subtitle: "(Breast)",
//     price: "₹500 / kg",
//     category: "Boneless Chicken",
//     image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=700",
//   },
//   {
//     id: 3,
//     name: "Fresh Mutton",
//     subtitle: "(Curry Cut)",
//     price: "₹1,100 / kg",
//     category: "Mutton",
//     image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=700",
//   },
//   {
//     id: 4,
//     name: "Mutton Keema",
//     subtitle: "(Minced)",
//     price: "₹1,500 / kg",
//     category: "Mutton Keema",
//     image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=700",
//   },
//   {
//     id: 5,
//     name: "Fresh Eggs",
//     subtitle: "(Tray – 30 Eggs)",
//     price: "₹180 – ₹270",
//     category: "Eggs",
//     image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=700",
//   },
// ];

// /* SIDEBAR CATEGORIES - ORIGINAL */
// const categories = [
//   { name: "Chicken", icon: "🐓" },
//   { name: "Boneless Chicken", icon: "🥩" },
//   { name: "Mutton", icon: "🐐" },
//   { name: "Mutton Keema", icon: "🍲" },
//   { name: "Eggs", icon: "🥚" },
//   { name: "Cutting Options", icon: "✂️" },
// ];

// /* CUTTING OPTIONS - ORIGINAL */
// const cuttingOptions = [
//   {
//     name: "Curry Cut",
//     subtitle: "(Small / Medium)",
//     image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400",
//   },
//   {
//     name: "Biryani Cut",
//     subtitle: "(60g / 120g)",
//     image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400",
//   },
//   {
//     name: "Leg Piece",
//     subtitle: "(Uncut / Cut)",
//     image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
//   },
//   {
//     name: "Breast",
//     subtitle: "(Pieces / Boneless)",
//     image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
//   },
//   {
//     name: "Liver / Gizzards",
//     subtitle: "(As per availability)",
//     image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
//   },
// ];

// export default function FreshMeat() {
//   const location = useLocation();

//   /* HEADER DROPDOWN PATH FILTER */
//   const getCategoryFromPath = () => {
//     const path = location.pathname.toLowerCase();

//     if (path.endsWith("/chicken")) {
//       return "Chicken";
//     }

//     if (path.endsWith("/boneless")) {
//       return "Boneless Chicken";
//     }

//     if (path.endsWith("/mutton")) {
//       return "Mutton";
//     }

//     if (path.endsWith("/keema")) {
//       return "Mutton Keema";
//     }

//     if (path.endsWith("/eggs")) {
//       return "Eggs";
//     }

//     return "All";
//   };

//   const [activeCategory, setActiveCategory] = useState(
//     getCategoryFromPath
//   );

//   /* UPDATE FILTER WHEN HEADER DROPDOWN IS CLICKED */
//   useEffect(() => {
//     setActiveCategory(getCategoryFromPath());
//   }, [location.pathname]);

//   /* FILTER PRODUCTS */
//   const visibleProducts = products.filter((product) => {
//     return (
//       activeCategory === "All" ||
//       product.category === activeCategory
//     );
//   });

//   /* ORDER PRODUCT */
//   const orderProduct = (product) => {
//     const message = `Hello, I want to order ${product.name}. Price: ${product.price}`;

//     window.open(
//       `https://wa.me/919849489900?text=${encodeURIComponent(message)}`,
//       "_blank"
//     );
//   };

//   return (
//     <main className="fresh-meat-page">

//       {/* HERO BANNER */}
//       <section className="fm-hero">

//         <div className="fm-hero-content">

//           <h1>
//             <span>🌿</span> Fresh Meat & Eggs
//           </h1>

//           <p>
//             Farm-Fresh&nbsp; • &nbsp;Hygienic&nbsp; • &nbsp;
//             Cleaned&nbsp; • &nbsp;Cut&nbsp; • &nbsp;Packed
//           </p>

//           <div className="fm-hero-features">

//             <div>
//               <span>🐓</span>
//               <strong>Fresh<br />Chicken</strong>
//             </div>

//             <div>
//               <span>🥩</span>
//               <strong>Boneless<br />Chicken</strong>
//             </div>

//             <div>
//               <span>🐐</span>
//               <strong>Fresh<br />Mutton</strong>
//             </div>

//             <div>
//               <span>🍲</span>
//               <strong>Mutton<br />Keema</strong>
//             </div>

//             <div>
//               <span>🥚</span>
//               <strong>Fresh<br />Eggs</strong>
//             </div>

//           </div>

//         </div>

//         <div className="fm-hero-image">
//           <img
//             src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200"
//             alt="Fresh meat and chicken"
//           />
//         </div>

//       </section>

//       {/* MAIN CONTENT */}
//       <section className="fm-layout">

//         {/* SIDEBAR - ORIGINAL SECTION UNCHANGED */}
//         <aside className="fm-sidebar">

//           <h2>Categories</h2>

//           <div className="fm-category-list">

//             {categories.map((category) => (
//               <button
//                 key={category.name}
//                 className={
//                   activeCategory === category.name
//                     ? "fm-category selected"
//                     : "fm-category"
//                 }
//                 onClick={() =>
//                   setActiveCategory(
//                     activeCategory === category.name
//                       ? "All"
//                       : category.name
//                   )
//                 }
//               >
//                 <span>{category.icon}</span>
//                 <strong>{category.name}</strong>
//               </button>
//             ))}

//           </div>

//           <div className="fm-delivery-card">
//             <div className="fm-delivery-icon">🚚</div>
//             <h2>Daily Delivery</h2>
//             <h3>in Matrusri Nagar</h3>
//             <p>(Within 1.5 km)</p>
//           </div>

//         </aside>

//         {/* PRODUCTS */}
//         <div className="fm-main">

//           <div className="fm-product-grid">

//             {visibleProducts.map((product) => (
//               <article
//                 className="fm-product-card"
//                 key={product.id}
//               >

//                 <div className="fm-product-image">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     loading="lazy"
//                   />
//                 </div>

//                 <div className="fm-product-info">

//                   <h3>{product.name}</h3>

//                   <p>{product.subtitle}</p>

//                   <strong className="fm-price">
//                     {product.price}
//                   </strong>

//                   <button
//                     className="fm-order-btn"
//                     onClick={() => orderProduct(product)}
//                   >
//                     🛒 Order Now
//                   </button>

//                 </div>

//               </article>
//             ))}

//           </div>

//           {/* CUTTING OPTIONS - ORIGINAL SECTION */}
//           {(activeCategory === "All" ||
//             activeCategory === "Chicken" ||
//             activeCategory === "Boneless Chicken" ||
//             activeCategory === "Cutting Options") && (

//             <section className="fm-cutting-section">

//               <h2>
//                 <span>✂️</span> Cutting Options (Chicken)
//               </h2>

//               <div className="fm-cutting-grid">

//                 {cuttingOptions.map((option, index) => (
//                   <div
//                     className="fm-cutting-card"
//                     key={index}
//                   >

//                     <div className="fm-cutting-image">
//                       <img
//                         src={option.image}
//                         alt={option.name}
//                         loading="lazy"
//                       />
//                     </div>

//                     <h3>{option.name}</h3>
//                     <p>{option.subtitle}</p>

//                   </div>
//                 ))}

//               </div>

//             </section>
//           )}

//           {/* BOTTOM FEATURES */}
//           <div className="fm-bottom-features">

//             <div>🌿 <strong>Farm Sourced</strong></div>
//             <div>🛡️ <strong>Hygienic Processing</strong></div>
//             <div>❄️ <strong>Fresh & Chilled</strong></div>
//             <div>📦 <strong>Cleaned & Packed</strong></div>
//             <div>▦ <strong>Pre-Book & Pickup</strong></div>

//           </div>

//         </div>

//       </section>

//     </main>
//   );
// }


import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./FreshMeatEggs.css";

const products = [
  {
    id: 1,
    name: "Fresh Chicken",
    subtitle: "(Whole)",
    price: "₹270 / kg",
    category: "Chicken",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=700",
  },
  {
    id: 2,
    name: "Boneless Chicken",
    subtitle: "(Breast)",
    price: "₹500 / kg",
    category: "Boneless Chicken",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=700",
  },
  {
    id: 3,
    name: "Fresh Mutton",
    subtitle: "(Curry Cut)",
    price: "₹1,100 / kg",
    category: "Mutton",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=700",
  },
  {
    id: 4,
    name: "Mutton Keema",
    subtitle: "(Minced)",
    price: "₹1,500 / kg",
    category: "Mutton Keema",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=700",
  },
  {
    id: 5,
    name: "Fresh Eggs",
    subtitle: "(Tray – 30 Eggs)",
    price: "₹180 – ₹270",
    category: "Eggs",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=700",
  },
];

/* SIDEBAR CATEGORIES */
const categories = [
  { name: "Chicken", icon: "🐓" },
  { name: "Boneless Chicken", icon: "🥩" },
  { name: "Mutton", icon: "🐐" },
  { name: "Mutton Keema", icon: "🍲" },
  { name: "Eggs", icon: "🥚" },
  { name: "Cutting Options", icon: "✂️" },
];

/* CUTTING OPTIONS */
const cuttingOptions = [
  {
    name: "Curry Cut",
    subtitle: "(Small / Medium)",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400",
  },
  {
    name: "Biryani Cut",
    subtitle: "(60g / 120g)",
    image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400",
  },
  {
    name: "Leg Piece",
    subtitle: "(Uncut / Cut)",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
  },
  {
    name: "Breast",
    subtitle: "(Pieces / Boneless)",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
  },
  {
    name: "Liver / Gizzards",
    subtitle: "(As per availability)",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
  },
];

export default function FreshMeat() {
  const location = useLocation();

  /* HEADER DROPDOWN PATH FILTER */
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

  /* UPDATE FILTER WHEN HEADER DROPDOWN IS CLICKED */
  useEffect(() => {
    setActiveCategory(getCategoryFromPath());
  }, [location.pathname]);

  /* FILTER PRODUCTS */
  const visibleProducts = products.filter((product) => {
    return (
      activeCategory !== "Cutting Options" &&
      (activeCategory === "All" ||
        product.category === activeCategory)
    );
  });

  /* SHOW CUTTING SECTION */
  const showCuttingOptions =
    activeCategory === "All" ||
    activeCategory === "Chicken" ||
    activeCategory === "Boneless Chicken" ||
    activeCategory === "Cutting Options";

  /* ORDER PRODUCT */
  const orderProduct = (product) => {
    const message = `Hello, I want to order ${product.name}. Price: ${product.price}`;

    window.open(
      `https://wa.me/919849489900?text=${encodeURIComponent(message)}`,
      "_blank"
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
            Farm-Fresh&nbsp; • &nbsp;Hygienic&nbsp; • &nbsp;
            Cleaned&nbsp; • &nbsp;Cut&nbsp; • &nbsp;Packed
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
            src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200"
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
                className={
                  activeCategory === category.name
                    ? "fm-category selected"
                    : "fm-category"
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

          <div className="fm-delivery-card">
            <div className="fm-delivery-icon">🚚</div>
            <h2>Daily Delivery</h2>
            <h3>in Matrusri Nagar</h3>
            <p>(Within 1.5 km)</p>
          </div>

        </aside>

        {/* PRODUCTS */}
        <div className="fm-main">

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
                      {product.price}
                    </strong>

                    <button
                      className="fm-order-btn"
                      onClick={() => orderProduct(product)}
                    >
                      🛒 Order Now
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

          {/* CUTTING OPTIONS */}
          {showCuttingOptions && (

            <section className="fm-cutting-section">

              <h2>
                <span>✂️</span> Cutting Options (Chicken)
              </h2>

              <div className="fm-cutting-grid">

                {cuttingOptions.map((option, index) => (
                  <div
                    className="fm-cutting-card"
                    key={index}
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
