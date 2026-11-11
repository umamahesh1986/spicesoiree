import { Link } from 'react-router-dom'
import './WeekOffersPage.css'

const menuCategories = [
  {
    category: 'Veg Biryanis',
    image: '/images/karthika-veg-biryani.png',
    items: [
      'Veg Biryani',
      'Paneer Biryani',
      'Mushroom Biryani',
      'Kaju Biryani',
      'Gongura Paneer Biryani',
    ],
  },
  {
    category: 'Veg Starters',
    image: '/images/karthika-veg-starters.png',
    items: [
      'Mushroom Pakoda',
      'Paneer Pakoda',
      'Gobi Pakoda',
      'Paneer 65',
      'Chilli Mushroom',
      'Veg Manchurian',
    ],
  },
  {
    category: 'Veg BBQ & Tandoori',
    image: '/images/karthika-veg-tandoori.png',
    items: [
      'Paneer Tikka',
      'Malai Paneer Tikka',
      'Mushroom Tikka',
      'Tandoori Gobi',
      'Veg Seekh Kebab',
    ],
  },
  {
    category: 'Veg Curries',
    image: '/images/karthika-veg-curries.png',
    items: [
      'Paneer Butter Masala',
      'Kadai Paneer',
      'Mushroom Masala',
      'Kaju Masala',
      'Mixed Veg Curry',
      'Gongura Paneer Curry',
    ],
  },
]

function WeekOffersPage() {
  return (
    <section className="week-offers-section" id="week-offers">
      <section aria-labelledby="karthika-menu-title" className="week-offers-menu">
        <div className="section-heading">
          <h2 id="karthika-menu-title">Spice Soirée – Karthika Masam Veg Specials</h2>
        </div>
        <div className="week-offers-grid">
          {menuCategories.map(({ category, image, items }, index) => (
            <Link
              aria-label={`Book ${category}`}
              className="week-offers-card"
              key={category}
              to="/booking"
            >
              <img alt={`${category} dishes`} loading="lazy" src={image} />
              <div>
                <h3>{index + 1}. {category}</h3>
                <ul>
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  )
}

export default WeekOffersPage
