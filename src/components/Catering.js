import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Catering.css";

const packages = [
  {
    name: "Standard Menu",
    description: "Ideal for Small Gatherings",
    people: "10 – 20 People",
   image: "/images/standard-menu.jpg",
    button: "View Menu",
  },
  {
    name: "Premium Menu",
    description: "Perfect for Family Functions",
    people: "20 – 50 People",
    image: "/images/standard-menu.jpg",
    button: "View Menu",
    badge: "👑",
  },
  {
    name: "Custom Menu",
    description: "Choose your own items & quantities",
    people: "50+ People",
   image: "/images/standard-menu.jpg",
    button: "Get Quote",
    badge: "♨",
  },
];

const services = [
  "Biryani & Rice Varieties",
  "Starters & Appetizers",
  "Veg & Non-Veg Curries",
  "BBQ & Tandoori",
  "Breads & Sides",
  "Custom Menus",
  "Bulk & Event Orders",
];

const benefits = [
  { icon: "🌿", title: "Fresh", subtitle: "Ingredients" },
  { icon: "♨", title: "Authentic", subtitle: "Taste" },
  { icon: "🏅", title: "Customizable", subtitle: "Menus" },
  { icon: "🛡️", title: "Hygienic", subtitle: "Preparation" },
  { icon: "🤝", title: "On-Time", subtitle: "Delivery" },
  { icon: "⭐", title: "Quality &", subtitle: "Reliable Service" },
];

export default function Catering() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventType: "",
    eventDate: "",
    people: "",
    preference: "",
    requirements: "",
  });

  const [selectedPackage, setSelectedPackage] = useState("");

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // OPEN MENU WHEN PACKAGE BUTTON IS CLICKED
  const choosePackage = (name) => {
    setSelectedPackage(name);

    setForm((prev) => ({
      ...prev,
      preference: name,
    }));

    navigate(`/menu?package=${encodeURIComponent(name)}`, {
      state: {
        cateringPackage: name,
      },
    });
  };

  const sendInquiry = (e) => {
    e.preventDefault();

    if (
      !form.eventType ||
      !form.eventDate ||
      !form.people ||
      !form.preference
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const message = `
Catering Booking Inquiry

Event Type: ${form.eventType}
Event Date: ${form.eventDate}
Number of People: ${form.people}
Menu Preference: ${form.preference}
Selected Package: ${selectedPackage || "Not selected"}
Additional Requirements: ${form.requirements || "None"}
    `;

    window.open(
      `https://wa.me/919849489900?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="catering-page">

      {/* HERO BANNER */}

      <section className="cat-hero">

        <div className="cat-hero-content">

          <h1>
            <span>♙</span> Catering & Party Orders
          </h1>

          <p>Delicious Food for Your Special Occasions</p>

          <div className="cat-hero-features">

            <div>
              <span>👨‍👩‍👧‍👦</span>
              <strong>Family Functions</strong>
            </div>

            <div>
              <span>🎂</span>
              <strong>Birthday Parties</strong>
            </div>

            <div>
              <span>🥂</span>
              <strong>Celebrations</strong>
            </div>

            <div>
              <span>👥</span>
              <strong>Corporate Events</strong>
            </div>

            <div>
              <span>♨</span>
              <strong>Bulk Orders</strong>
            </div>

          </div>

        </div>

        <div className="cat-hero-image">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200"
            alt="Catering food buffet"
          />
        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="cat-layout">

        {/* LEFT SIDEBAR */}

        <aside className="cat-sidebar">

          <h2>Our Catering Services</h2>

          <div className="cat-service-list">

            {services.map((service, index) => (
              <div className="cat-service" key={index}>
                <span>✔</span>
                <strong>{service}</strong>
              </div>
            ))}

          </div>

          <div className="cat-delivery-card">
            <div>🚚</div>
            <h2>Delivery & Setup</h2>
            <h3>Available</h3>
            <p>(Within Hyderabad)</p>
          </div>

        </aside>

        {/* CENTER CONTENT */}

        <div className="cat-main">

          <h2 className="cat-packages-heading">
            <span>🌿</span>
            Popular Catering Packages
            <span>🌿</span>
          </h2>

          <div className="cat-package-grid">

            {packages.map((item) => (
              <article className="cat-package-card" key={item.name}>

                {item.badge && (
                  <div className="cat-package-badge">
                    {item.badge}
                  </div>
                )}

                <div className="cat-package-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                <h3>{item.name}</h3>

                <p>{item.description}</p>

                <strong className="cat-people">
                  👥 {item.people}
                </strong>

                <button
                  type="button"
                  className="cat-package-btn"
                  onClick={() => choosePackage(item.name)}
                >
                  {item.button} <span>›</span>
                </button>

              </article>
            ))}

          </div>

          {/* WHY CHOOSE US */}

          <section className="cat-why">

            <h2>Why Choose Spice Soirée for Your Events?</h2>

            <div className="cat-benefits">

              {benefits.map((item, index) => (
                <div className="cat-benefit" key={index}>
                  <span>{item.icon}</span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </div>
              ))}

            </div>

          </section>

        </div>

        {/* RIGHT BOOKING FORM */}

        <aside className="cat-booking" id="catering-booking">

          <h2>▦ &nbsp; Book Your Catering</h2>

          <form onSubmit={sendInquiry}>

            <label>Event Type <span>*</span></label>

            <select
              name="eventType"
              value={form.eventType}
              onChange={updateForm}
              required
            >
              <option value="">Select Event</option>
              <option>Wedding</option>
              <option>Birthday Party</option>
              <option>Engagement</option>
              <option>Family Function</option>
              <option>Corporate Event</option>
              <option>House Party</option>
              <option>Other</option>
            </select>

            <label>Event Date <span>*</span></label>

            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={updateForm}
              min={new Date().toISOString().split("T")[0]}
              required
            />

            <label>No. of People <span>*</span></label>

            <input
              type="number"
              name="people"
              placeholder="e.g., 50"
              min="1"
              value={form.people}
              onChange={updateForm}
              required
            />

            <label>Menu Preference <span>*</span></label>

            <select
              name="preference"
              value={form.preference}
              onChange={updateForm}
              required
            >
              <option value="">Select Menu</option>
              <option>Standard Menu</option>
              <option>Premium Menu</option>
              <option>Custom Menu</option>
              <option>Veg Menu</option>
              <option>Non-Veg Menu</option>
              <option>Veg & Non-Veg Menu</option>
            </select>

            <label>Additional Requirements</label>

            <textarea
              name="requirements"
              placeholder="e.g., Live counters, serving, etc."
              value={form.requirements}
              onChange={updateForm}
            />

            <button type="submit" className="cat-submit">
              ➤ &nbsp; Send Inquiry
            </button>

          </form>

        </aside>

      </section>

      {/* BOTTOM CONTACT BAR */}

      <section className="cat-contact-strip">

        <a
          href="https://wa.me/919849489900"
          target="_blank"
          rel="noreferrer"
          className="cat-contact-whatsapp"
        >
          <span>◉</span>
          <div>
            <small>Discuss on WhatsApp</small>
            <strong>98494 89900</strong>
          </div>
        </a>

        <a href="tel:9849489900" className="cat-contact-call">
          <span>☎</span>
          <div>
            <strong>Message Only</strong>
            <small>(No Calls)</small>
          </div>
        </a>

        <div className="cat-booking-note">
          🍴 &nbsp; Advance Booking Recommended
          <small>(At least 1 Day in Advance)</small>
        </div>

      </section>

    </div>
  );
}
