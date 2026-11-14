
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const slides = [
  {
    image: '/images/Malai Chicken Tikka.png',
    title: <>Biryani, Curries,<br />Starters & More...</>,
    subtitle: 'Fresh Ingredients • Authentic Taste • Hygienic Kitchen',
  },
  {
    image: '/images/Butter Chicken.png',
    title: <>Delicious Curries,<br />Made With Love...</>,
    subtitle: 'Fresh Ingredients • Rich Flavours • Best Quality',
  },
  {
    image: '/images/fresh-chicken.png',
    title: <>Fresh Meat & Eggs,<br />Quality Guaranteed...</>,
    subtitle: 'Fresh Products • Quality Meat • Daily Fresh',
  },
  {
    image: '/images/Chicken 65 Biryani.png',
    title: <>Party & Catering,<br />Celebrate With Us...</>,
    subtitle: 'Birthdays • Family Functions • Bulk Orders',
  },
];

const services = [
  {
    image: '/images/Malai Chicken Tikka.png',
    title: 'Restaurant Menu',
    description: <>Biryani, Starters, BBQ, Chinese<br />Breads & More</>,
    button: 'View Menu',
    link: '/menu',
  },
  {
    image: '/images/Butter Chicken.png',
    title: 'Pre-Order Curries',
    description: <>Veg & Non-Veg Curries<br />(Min. 1 kg)</>,
    button: 'Pre-Order Now',
    link: '/PreOrderCurries',
  },
  {
    image: '/images/fresh-chicken.png',
    title: 'Fresh Meat & Eggs',
    description: <>Chicken, Boneless, Mutton,<br />Mutton Keema & Eggs</>,
    button: 'Book Now',
    link: '/FreshMeatEggs',
  },
  {
    image: '/images/Chicken 65 Biryani.png',
    title: 'Catering & Party Orders',
    description: <>Birthdays, Family Functions,<br />Events & Bulk Orders</>,
    button: 'Book Catering',
    link: '/catering',
  },
];

const features = [
  { icon: '🛡️', title: <>Fresh &<br />Quality Ingredients</> },
  { icon: '👨‍🍳', title: <>Hygienic<br />Preparation</> },
  { icon: '✂️', title: <>Custom<br />Cutting Options</> },
  { icon: '📋', title: <>100%<br />Advance Booking</> },
  { icon: '🚚', title: <>On-Time<br />Delivery</> },
  { icon: '👥', title: <>Bulk Orders<br />& Catering</> },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // AUTOMATIC SLIDER
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // PREVIOUS SLIDE
  const previousSlide = () => {
    setCurrentSlide((prev) =>
      (prev - 1 + slides.length) % slides.length
    );
  };

  // NEXT SLIDE
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      (prev + 1) % slides.length
    );
  };

  const slide = slides[currentSlide];

  return (
    <main className="home-page">

      {/* HERO SLIDER */}

      <section className="hero-section">

        <img
          key={slide.image}
          src={slide.image}
          alt="Spice Soiree Food"
          className="hero-slide-image"
        />

        <div className="hero-overlay"></div>

        {/* LEFT ARROW */}

        <button
          className="slider-arrow left-arrow"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* HERO CONTENT */}

        <div className="hero-content">

          <h1>{slide.title}</h1>

          <p className="hero-subtitle">
            {slide.subtitle}
          </p>

          <div className="hero-divider"></div>

          {/* QUICK ACTIONS */}

          <div className="quick-actions">

            <div className="quick-action">
              <span>🍃</span>
              <strong>Dine In</strong>
              <small>(Takeaway)</small>
            </div>

            <div className="quick-action">
              <span>🛵</span>
              <strong>Home</strong>
              <small>Delivery</small>
            </div>

            <div className="quick-action">
              <span>▦</span>
              <strong>Pre-Order</strong>
              <small>Curries</small>
            </div>

            <div className="quick-action">
              <span>♨</span>
              <strong>Party &</strong>
              <small>Catering</small>
            </div>

          </div>

          {/* HERO BUTTONS */}

          <div className="hero-buttons">

            <Link to="/menu" className="hero-btn order-btn">
              🍴 Order Food Online
            </Link>

            <Link to="/PreOrderCurries" className="hero-btn preorder-btn">
              🍲 Pre-Order Curries
            </Link>

            <Link to="/catering" className="hero-btn catering-btn">
              👥 Book Party / Catering
            </Link>

          </div>

        </div>

        {/* RIGHT ARROW */}

        <button
          className="slider-arrow right-arrow"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* SLIDER DOTS */}

        <div className="slider-dots">

          {slides.map((item, index) => (
            <button
              key={index}
              className={
                currentSlide === index ? 'active' : ''
              }
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}

        </div>

      </section>

      {/* FOUR SERVICE CARDS */}

      <section className="services-section">

        <div className="services-grid">

          {services.map((service, index) => (
            <article className="service-card" key={index}>

              <img
                src={service.image}
                alt={service.title}
                className="service-image"
              />

              <div className="service-info">

                <h2>{service.title}</h2>

                <p>{service.description}</p>

                <Link
                  to={service.link}
                  className="service-button"
                >
                  {service.button}
                  <span>›</span>
                </Link>

              </div>

            </article>
          ))}

        </div>

      </section>

      {/* BOTTOM FEATURES */}

      <section className="features-section">

        <div className="features-grid">

          {features.map((feature, index) => (
            <div className="feature-item" key={index}>

              <span className="feature-icon">
                {feature.icon}
              </span>

              <h3>{feature.title}</h3>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;
