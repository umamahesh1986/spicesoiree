import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!form.name || !form.mobile || !form.subject || !form.message) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const text = `Hello Spice Soirée!

Name: ${form.name}
Mobile: ${form.mobile}
Subject: ${form.subject}
Message: ${form.message}`;

    const url = `https://wa.me/919849489900?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="contact-page">

      {/* CONTACT HERO */}
      <section className="contact-hero">
        <div className="contact-hero-text">
          <div className="contact-hero-icon">☏</div>
          <div>
            <h1>Contact Us</h1>
            <h2>
              We're here to take your Orders, Pre-Orders,
              Catering & Enquiries
            </h2>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-main">

        {/* LEFT INFORMATION */}
        <div className="contact-left">

          <a
            className="contact-whatsapp-card"
            href="https://wa.me/919849489900"
            target="_blank"
            rel="noreferrer"
          >
            <span className="whatsapp-big-icon">◉</span>
            <div>
              <h3>Order on WhatsApp</h3>
              <strong>98494 89900</strong>
              <p>(Message Only)</p>
            </div>
          </a>

          <div className="contact-info-card delivery-card">
            <span>🚚</span>
            <div>
              <h3>Home Delivery</h3>
              <p>in Matrusri Nagar</p>
              <strong>(Within 1.5 km)</strong>
            </div>
          </div>

          <div className="contact-info-card">
            <span>▦</span>
            <div>
              <h3>Pre-Orders & Catering</h3>
              <p>Book in Advance</p>
            </div>
          </div>

          <a
            className="contact-info-card"
            href="mailto:orders@spicesoiree.com"
          >
            <span>✉</span>
            <div>
              <h3>Email</h3>
              <p>orders@spicesoiree.com</p>
            </div>
          </a>

        </div>

        {/* MESSAGE FORM */}
        <div className="contact-form-card">
          <div className="contact-card-heading">
            <span>➤</span>
            <h2>Send us a Message</h2>
          </div>

          <form onSubmit={sendMessage}>

            <label>Your Name <b>*</b></label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={updateForm}
              required
            />

            <label>Mobile Number <b>*</b></label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter 10-digit number"
              value={form.mobile}
              onChange={updateForm}
              maxLength="10"
              required
            />

            <label>Subject <b>*</b></label>
            <select
              name="subject"
              value={form.subject}
              onChange={updateForm}
              required
            >
              <option value="">Select Subject</option>
              <option value="Food Order">Food Order</option>
              <option value="Pre-Order Curries">Pre-Order Curries</option>
              <option value="Catering">Catering</option>
              <option value="Home Delivery">Home Delivery</option>
              <option value="General Enquiry">General Enquiry</option>
              <option value="Feedback">Feedback</option>
            </select>

            <label>Message <b>*</b></label>
            <textarea
              name="message"
              placeholder="Type your message here..."
              value={form.message}
              onChange={updateForm}
              rows="4"
              required
            />

            <button type="submit" className="contact-submit-btn">
              <span>➤</span> Send Message
            </button>

          </form>
        </div>

        {/* RIGHT INFORMATION */}
        <div className="contact-right">

          <div className="contact-visit-card">
            <div className="contact-card-heading">
              <span>📍</span>
              <h2>Visit Us</h2>
            </div>

            <div className="contact-address">
              <div>
                <h3>Spice Soirée Restaurant</h3>
                <p>Matrusri Nagar,</p>
                <p>Hyderabad - 500072</p>
              </div>
              <span className="map-illustration">📍</span>
            </div>

            <a
              className="google-map-btn"
              href="https://www.google.com/maps/search/?api=1&query=Spice+Soiree+Restaurant+Matrusri+Nagar+Hyderabad"
              target="_blank"
              rel="noreferrer"
            >
              📍 View on Google Maps
            </a>
          </div>

          <div className="contact-hours-card">
            <div className="contact-card-heading">
              <span>◷</span>
              <h2>Opening Hours</h2>
            </div>

            <div className="opening-hours">
              <p><strong>Lunch :</strong> 12:00 PM – 03:00 PM</p>
              <p><strong>Dinner :</strong> 05:00 PM – 10:30 PM</p>
            </div>

            <div className="hours-divider"></div>
          </div>

        </div>

      </section>

      {/* BOTTOM SERVICE STRIP */}
      <section className="contact-bottom-strip">
        <div>
          <span>🛵</span>
          <h3>Home Delivery</h3>
          <p>Within 1.5 km</p>
        </div>
        <div>
          <span>♨</span>
          <h3>Pre-Order</h3>
          <p>Curries & Bulk Orders</p>
        </div>
        <div>
          <span>👥</span>
          <h3>Catering</h3>
          <p>For Events & Parties</p>
        </div>
        <div>
          <span>🍽</span>
          <h3>Dine In & Takeaway</h3>
          <p>Limited Seating</p>
        </div>
      </section>

    </main>
  );
};

export default Contact;
