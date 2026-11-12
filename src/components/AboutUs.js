
import React from "react";
import "./AboutUs.css";

const images = {
  biryani:
    "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_400/RX_THUMBNAIL/IMAGES/VENDOR/2026/5/25/df19afc8-7d66-4912-aa14-4c2695e6a44c_1330325.jpg",
  restaurant:
    "https://www.restroworks.com/blog/wp-content/uploads/2025/07/Cost-of-Opening-a-Restaurant-in-India.webp",
};

const features = [
  { icon: "♨", title: "Authentic Recipes", desc: "Rich & traditional flavours" },
  { icon: "❀", title: "Fresh Ingredients", desc: "Sourced with care" },
  { icon: "🛡", title: "Quality & Hygiene", desc: "Clean, safe & reliable" },
  { icon: "♧", title: "Customer First", desc: "Great taste & service" },
];

const services = [
  { icon: "🍴", title: "Dine In", desc: "(Limited Seating)" },
  { icon: "🛍", title: "Takeaway / Counter Orders" },
  { icon: "🛵", title: "Home Delivery", desc: "(Matrusri Nagar & Nearby)" },
  { icon: "🍲", title: "Pre-Order Curries", desc: "(For Home & Events)" },
  { icon: "👥", title: "Catering & Party Orders", desc: "(Small & Large Gatherings)" },
];

const benefits = [
  { icon: "▦", title: "Freshly Prepared Daily" },
  { icon: "🏅", title: "Quality You Can Trust" },
  { icon: "🌿", title: "Hygienic & Safe Kitchen" },
  { icon: "👨‍👩‍👧", title: "Local & Family Friendly" },
];

function AboutUs() {
  return (
    <main className="about-page">

      <section className="about-hero">
        <div className="about-hero-text">
          <h1>About Spice Soirée</h1>
          <h2>A Modern Kitchen with Traditional Flavours</h2>
          <p>
            Spice Soirée is a Hyderabad-based restaurant serving
            fresh, flavourful and high-quality food. We blend
            traditional recipes with a modern touch to bring you
            a memorable dining and takeaway experience.
          </p>
        </div>

        <div className="about-hero-image">
          <img src={images.biryani} alt="Hyderabadi chicken biryani" />
        </div>
      </section>

      <section className="about-features">
        {features.map((item, index) => (
          <div className="about-feature" key={index}>
            <div className="about-feature-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="about-main-grid">

        <div className="about-restaurant-photo">
          <img src={images.restaurant} alt="Restaurant interior" />
        </div>

        <div className="about-vision-mission">

          <div className="about-vision">
            <div className="about-heading">
              <span>🎯</span>
              <h2>Our Vision</h2>
            </div>
            <p>
              To be a trusted and preferred food brand for
              delicious, hygienic and value-for-money meals
              in our community.
            </p>
          </div>

          <div className="about-mission">
            <div className="about-heading">
              <span>🚩</span>
              <h2>Our Mission</h2>
            </div>
            <ul>
              <li>Serve fresh and quality food every day</li>
              <li>Maintain high standards of hygiene</li>
              <li>Offer a variety of authentic and modern dishes</li>
              <li>Ensure great taste, service and customer satisfaction</li>
            </ul>
          </div>

        </div>

        <div className="about-services">
          <div className="about-services-title">
            <span>♨</span>
            <h2>Our Services</h2>
          </div>

          <div className="about-services-list">
            {services.map((item, index) => (
              <div className="about-service" key={index}>
                <span>{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  {item.desc && <p>{item.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="about-bottom-benefits">
        {benefits.map((item, index) => (
          <div className="about-bottom-item" key={index}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>

    </main>
  );
}

export default AboutUs;
