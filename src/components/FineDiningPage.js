import { Link } from 'react-router-dom'
import './FineDiningPage.css'

const menuItems = [
  {
    category: 'Lunch & Twilight Dinner',
    title: 'Artisanal Hyderabadi Dining',
    description:
      'Signature Gosht Dum Biryani, clay oven seekh kebabs, warqi parathas, and rich Mirchi ka Salan gravies.',
    detail: 'Kitchen dispatch: 30–45 mins',
    action: 'View Restaurant Menu',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2duHTX-y9IP1B5Cux2Ezm9qnkR29y17aZjWNssjY3iaM7TpMXI6VYLi34JYUPPRbyePDoDWRJ4UJd3-Ic8ZVqdMSuVSw2Vl-LEn9EQxL1z7OiJXg-ru4Ydvp6kMMPSnnKLl6_aFU9dFqnOgqbh7LDhq79uVkd8F8Co5M1rsAcOeHLJfWYn5zs5bRukYk-WxmJ-I7aQ21ylSYDYHn6SmgYP3QL3kzDiFs0bDtvO8Io',
  },
  {
    category: 'Morning Sunrise Ritual',
    title: 'Signature Morning Tiffins',
    description:
      'Fresh stone-ground batter, melt-in-mouth ghee idlis, crispy dosas, podi sambar, and traditional degree filter kaapi.',
    detail: 'Pre-book by 6:00 PM previous eve',
    action: 'Select Tiffin Dates',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDn0JJqrsznAe3Kms2DY8P5mduFBphq4JKnnvX_Q7vbmhVYNMVQCcYqEaz45kEGZ99cbKws9cmUNPJrp_ac_keRqtAqDkqXDBwQ_BReCbGp34uu9dwFY9mqo-GoVm_IfAX5BhYO_8zB1mmL7OkWqqs-RlcgHSVxEOjYh42zjK-I74QV7bVVyYEWigSW6r095Qk35QClDOvvVHDEHrMHWuGfyA0_uNey0To1phx_IzYA',
  },
  {
    category: 'Weekend Family Feast',
    title: 'Weekend Handi Curries',
    description:
      'Slow-simmered handi rogan josh, Gongura mamsam, Dum ka Murgh, and velvet Paneer pasanda in family pots.',
    detail: 'Min 1 kg • Book by 11 PM',
    action: 'Plan Custom Feast',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGqBJ0xA85xtPlvVEcwM0pmwrVacpM4Ya2E0sUXFCsJSufulZv8NYqRnFSJdhufnV3cOzNmthcWmUISEMBUDG_ESc6aHso9nDTeRC3lG3ftmq52zOm2wLmFUchmL29LvqnBR1_2C5GiDAR9G8gwxc46bfL4VLQkjxBlLtKpbcI7U8JTlSMxMkrfjl_ysnrBPbF12wAMAVLQYGRYe-AE0PjYTHXO7pi3lfzUX6HickC',
  },
  {
    category: 'Sunday Fresh Pantry',
    title: 'Sunday Artisanal Butchery',
    description:
      'Pasture-raised tender mutton cuts, authentic country chicken (Natu Kodi), and nutrient-dense brown eggs.',
    detail: 'Sunrise delivery 7:00 AM Sunday',
    action: 'Reserve Sunday Cut',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVPyd6Vf5C57NXpObdgWiXbXuD-VBDahwCAfE1NiguRjKSOvq2xVESXJ6BUDNxpxM_nuHk0l09A9xMVcbEPiU5hAx1dj0mnYZH9uvWx5wv3r0niujESSo5ZJ8R17e1xNqY-21G9_g9cpbrCQ-Y8_Dt_ZPl26P45BgkgnTRSrLH6LyiiE9er5BVPyAzUjJ-K4Le_2NJU6-knQMYCOsS-UwZOPP1M30ZRJAATASYm_zl',
  },
]

export const mealCategories = [
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

function FineDiningPage({ compact = false }) {
  return (
    <section className={`content-section dining-section${compact ? ' compact-section' : ''}`} id="dining">
      <div className="section-heading">
        <span className="eyebrow">Signature Gastronomy</span>
        <h2>Bespoke Culinary Offerings</h2>
        <p>Four avenues of epicurean dedication curated for your residence, banquets, and weekday indulgence.</p>
      </div>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <article className="menu-card" key={item.title}>
            {item.category === 'Sunday Fresh Pantry' ? <span className="menu-experience-anchor" id="experiences" /> : null}
            <div className="menu-image">
              <img src={item.image} alt={item.title} loading="lazy" />
              <span className="image-label">{item.category}</span>
            </div>
            <div className="menu-card-copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="menu-detail">{item.detail}</span>
              <Link
                className="menu-link"
                to={item.action === 'View Restaurant Menu' ? '/restaurant-menu' : '/booking'}
              >
                {item.action} <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      {compact ? <Link className="section-more" to="/fine-dining">Explore fine dining <span>→</span></Link> : null}
    </section>
  )
}

export default FineDiningPage
