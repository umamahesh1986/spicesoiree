import React from 'react';
import { motion } from 'framer-motion';
import './RestaurantMenu.css';

const menuPages = [
  {
    page: '01 / 04',
    heading: 'SIGNATURE BIRYANIS & CHICKEN STARTERS',
    sections: [
      {
        title: 'SIGNATURE BIRYANIS',
        sizeLabel: 'SINGLE / REGULAR / FAMILY (₹)',
        sizes: ['SINGLE', 'REGULAR', 'FAMILY'],
        items: [
          { name: 'Chicken Dum Biryani', prices: [169, 319, 629] },
          { name: 'Chicken Fry Piece Biryani', prices: [199, 379, 749] },
          { name: 'Chicken 65 Biryani', prices: [249, 479, 939] },
          { name: 'Paneer Biryani', prices: [239, 459, 899] },
          { name: 'Mushroom Biryani', prices: [229, 439, 859] },
          { name: 'Gongura Chicken Biryani', prices: [249, 479, 929] }
        ]
      },
      {
        title: 'CHICKEN STARTERS',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Chicken – 65 / Manchurian', prices: [169, 299] },
          { name: 'Chicken – Chilli / Ginger', prices: [179, 319] },
          { name: 'Chicken – Majestic / Pepper / Dragon / 555', prices: [189, 329] },
          { name: 'Chicken Lollipop (3 pcs / 6 pcs)', prices: [189, 349] }
        ]
      },
      {
        title: 'CHICKEN PAKODA',
        sizeLabel: '250g / 500g RAW CHICKEN (₹)',
        sizes: ['250g', '500g'],
        items: [
          { name: 'Bone-in Chicken Pakoda', prices: [200, 360] },
          { name: 'Boneless Chicken Pakoda', prices: [250, 460] }
        ]
      }
    ]
  },
  {
    page: '02 / 04',
    heading: 'VEGETARIAN STARTERS',
    sections: [
      {
        title: 'GOBI SPECIALS',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Gobi Manchurian', prices: [109, 189] },
          { name: 'Gobi – Chilli / 65', prices: [119, 199] },
          { name: 'Gobi – Crispy / Schezwan / Pepper', prices: [129, 209] }
        ]
      },
      {
        title: 'PANEER SPECIALS',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Paneer – Chilli / 65 / Manchurian', prices: [189, 329] },
          { name: 'Paneer – Pepper / Crispy / Schezwan', prices: [199, 339] }
        ]
      },
      {
        title: 'MUSHROOM SPECIALS',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Mushroom – Chilli / 65 / Manchurian', prices: [159, 279] },
          { name: 'Mushroom – Pepper / Crispy / Schezwan', prices: [169, 289] }
        ]
      },
      {
        title: 'VEG MANCHURIAN SPECIALS',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Veg Manchurian', prices: [119, 199] },
          { name: 'Chilli / Schezwan Veg Manchurian', prices: [129, 209] },
          { name: 'Pepper / Garlic Veg Manchurian', prices: [129, 209] }
        ]
      },
      {
        title: 'CORN SPECIAL',
        sizeLabel: 'SMALL / LARGE (₹)',
        sizes: ['SMALL', 'LARGE'],
        items: [
          { name: 'Crispy Corn', prices: [139, 239] }
        ]
      }
    ]
  },
  {
    page: '03 / 04',
    heading: 'FRIED RICE, NOODLES & BARBECUE',
    sections: [
      {
        title: 'FRIED RICE • BASMATI',
        sizeLabel: 'SINGLE / FULL (₹)',
        sizes: ['SINGLE', 'FULL'],
        items: [
          { name: 'Veg Fried Rice', prices: [109, 159] },
          { name: 'Egg Fried Rice', prices: [129, 179] },
          { name: 'Chicken Fried Rice', prices: [159, 219] },
          { name: 'Schezwan Chicken Fried Rice', prices: [179, 249] }
        ]
      },
      {
        title: 'CHICKEN BBQ & TANDOORI',
        sizeLabel: 'PORTION PRICES (₹)',
        sizes: ['PORTION 1', 'PORTION 2'],
        items: [
          { name: 'Tandoori Chicken • Half / Full', prices: [299, 549] },
          { name: 'Spicy Chicken Tikka • 6 / 12 pcs', prices: [149, 279] },
          { name: 'Malai Chicken Tikka • 6 / 12 pcs', prices: [149, 279] },
          { name: 'Spicy BBQ Leg • 1 / 3 pcs', prices: [99, 279] },
          { name: 'Spicy BBQ Wings • 3 / 6 pcs', prices: [149, 289] }
        ]
      },
      {
        title: 'NOODLES',
        sizeLabel: 'SINGLE / FULL (₹)',
        sizes: ['SINGLE', 'FULL'],
        items: [
          { name: 'Veg Noodles', prices: [99, 159] },
          { name: 'Egg Noodles', prices: [119, 179] },
          { name: 'Chicken Noodles', prices: [129, 189] },
          { name: 'Schezwan Chicken Noodles', prices: [139, 199] }
        ]
      },
      {
        title: 'VEG BBQ',
        sizeLabel: '6 PCS / 12 PCS (₹)',
        sizes: ['6 PCS', '12 PCS'],
        items: [
          { name: 'Paneer Tikka', prices: [199, 379] },
          { name: 'Malai Paneer Tikka', prices: [219, 399] },
          { name: 'Hariyali Paneer Tikka', prices: [209, 389] },
          { name: 'Mushroom Tikka', prices: [159, 299] },
          { name: 'Malai Mushroom Tikka', prices: [169, 319] },
          { name: 'Gobi Tikka', prices: [129, 239] },
          { name: 'Hariyali Gobi Tikka', prices: [139, 259] }
        ]
      }
    ]
  },
  {
    page: '04 / 04',
    heading: 'INDIAN CURRIES & BREADS',
    sections: [
      {
        title: 'VEGETARIAN CURRIES',
        sizeLabel: 'HALF / FULL (₹)',
        sizes: ['HALF', 'FULL'],
        items: [
          { name: 'Paneer Butter Masala', prices: [169, 289] },
          { name: 'Kadai Paneer', prices: [179, 299] },
          { name: 'Mushroom Masala', prices: [149, 249] },
          { name: 'Kadai Mushroom', prices: [159, 269] },
          { name: 'Kaju Masala', prices: [189, 329] }
        ]
      },
      {
        title: 'NON-VEGETARIAN CURRIES',
        sizeLabel: 'HALF / FULL (₹)',
        sizes: ['HALF', 'FULL'],
        items: [
          { name: 'Andhra Chicken Curry', prices: [179, 299] },
          { name: 'Butter Chicken / Kadai Chicken', prices: [199, 349] },
          { name: 'Gongura Chicken Curry', prices: [199, 349] },
          { name: 'Mutton Curry', prices: [299, 499] },
          { name: 'Gongura Mutton Curry', prices: [329, 549] },
          { name: 'Egg Masala', prices: [119, 199] }
        ]
      },
      {
        title: 'INDIAN BREADS',
        sizeLabel: 'PRICE (₹)',
        sizes: ['PRICE'],
        items: [
          { name: 'Plain Naan', prices: [39] },
          { name: 'Butter Naan', prices: [49] },
          { name: 'Garlic Naan', prices: [59] },
          { name: 'Tandoori Roti', prices: [29] },
          { name: 'Butter Tandoori Roti', prices: [39] },
          { name: 'Pulka', prices: [15] }
        ]
      }
    ]
  }
];

export const restaurantMenuCategories = menuPages;

function MenuSection({ section, index }) {
  return (
    <motion.section
      className="menu-section"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay: index * 0.09,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -3 }}
    >
      <div className="menu-section-heading">
        <h2 className="menu-section-title">
          <span className="menu-star">✦</span>
          {section.title}
        </h2>

        <div className="menu-size-label">
          {section.sizeLabel}
        </div>
      </div>

      <div className="menu-table-scroll">
        <table className="menu-pricing-table">
          <thead>
            <tr>
              <th className="menu-item-heading">ITEM NAME</th>
              {section.sizes.map((size, index) => (
                <th key={`${size}-${index}`}>{size}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {section.items.map((item, itemIndex) => (
              <motion.tr
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: itemIndex * 0.035
                }}
              >
                <td className="menu-item-name">{item.name}</td>
                {item.prices.map((price, priceIndex) => (
                  <td className="menu-price" key={priceIndex}>
                    ₹{price}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function MenuPage({ pageData, pageIndex }) {
  return (
    <motion.article
      className={`spice-menu-page menu-page-${pageIndex + 1}`}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className="menu-topline">
        <span>SPICE SOIRÉE</span>
        <span>MENU {pageData.page}</span>
      </div>

      <motion.header
        className="menu-main-heading"
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.12 }}
      >
        <h1>{pageData.heading}</h1>
        <div className="menu-heading-decoration">✦</div>
      </motion.header>

      <div className="menu-sections-container">
        {pageData.sections.map((section, index) => (
          <MenuSection
            key={section.title}
            section={section}
            index={index}
          />
        ))}
      </div>

      <footer className="menu-footer">
        <div className="menu-footer-title">
          HOME DELIVERY • MATRUSRI NAGAR
        </div>

        <div className="menu-footer-contact">
          CALL &amp; WHATSAPP 9849489900
        </div>
      </footer>

      <div className="menu-page-number">
        {pageData.page}
      </div>
    </motion.article>
  );
}

function RestaurantMenu() {
  return (
    <main className="restaurant-menu-wrapper">
      {menuPages.map((pageData, index) => (
        <MenuPage
          key={pageData.page}
          pageData={pageData}
          pageIndex={index}
        />
      ))}
    </main>
  );
}

export default RestaurantMenu;
