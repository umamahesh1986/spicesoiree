import { Link } from 'react-router-dom'
import './HospitalityPage.css'

const venues = [
  {
    title: 'The Saffron Grand Ballroom',
    capacity: 'Capacity: 100 – 450 Guests',
    description:
      'A grand celebration setting with bespoke amber chandeliers, integrated acoustics, and live tandoor stations.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeTbS3adXR_k3ZPBvExrUpPs6QdXFjbGqPNahRiNBfatv9P-XYM-bX0Q6oATK984yIoLChPO6RglUSbiwsxhUpos1ie9iRu898UDS-T0Gv4Hq-A36SkdPtrG8mB-vOIVZF83QPwsPFjkxAgdOlQJ2FM9aGiz1_XckqyvHjJFO0Q4Zuvh4r49yxsE7v4svyzIsMmTE8RDm7gO3McdiPt34JtJNzlCYEgqOTXTWZ2-fz',
  },
  {
    title: 'Private Dining Salons',
    capacity: 'Intimate: 12 – 30 Guests',
    description:
      'Acoustically secluded salons with a dedicated chef, custom tasting menus, and personal butler service.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFhPLS-aKPfcw5Zgw9n15JBwcd3HBX3V5_V5OsdZIk8GQjhDPwqpwq0cry6zTG-VdVlFMwr7rbA6qNYCfC1G69aGspZYuVsmu4U3c3twUBIGGbYszyWdp27sQt1qW86uxiZmPY2XliAdVYyE5jhmK8Qs1Vq-rhDq9RsPJhbAFQlCLgNmU6DhlmmI56_nO41cP-5Bv2Lzdp2E7MWNmiYPUcywf6xiA2_tb5Fs6rDgqo',
  },
  {
    title: 'Heritage Guest Suites',
    capacity: '24-Hour Room Service',
    description:
      'Refined luxury bedrooms for wedding guests and business patrons, with smart workspaces and 24-hour in-room tiffin service.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4K3HkmxYFd-KRZRDYd0ysrVPWxP0l9Zn_wX_MTm0L6Pcco2XjKN-qfIx6POHB1Y_fLKA8JfX18zxd5eMd5fu_QcIiWDxtmkt_oYnh6JeM6xd3DqPvqVQStdsGyOIZ5cMIrD-7sxkN1sX7EYtPcWjJuhu-00e6zcMt9F4SjDzoHaS-Xk0oN7NsKUYIoGzaunLxinCzLO7z-O55ENunffadnvG79covTY3c5BMU3TwC',
  },
]

function HospitalityPage({ compact = false }) {
  return (
    <section className={`hospitality-section${compact ? ' compact-section' : ''}`} id="hospitality">
      <div className="hospitality-heading">
        <div className="section-heading">
          <span className="eyebrow">Spice Soirée Hospitality Wing</span>
          <h2>Luxury Suites & The Saffron Grand Ballroom</h2>
        </div>
        <p>For grand celebrations, executive retreats, and visiting family, experience bespoke Nizami hospitality.</p>
      </div>
      <div className="venue-grid">
        {venues.map((venue) => (
          <article className="venue-card" key={venue.title}>
            <div className="venue-image">
              <img alt={venue.title} loading="lazy" src={venue.image} />
              <span>{venue.capacity}</span>
            </div>
            <div className="venue-copy">
              <h3>{venue.title}</h3>
              <p>{venue.description}</p>
              <Link to="/booking">Enquire about availability <span>→</span></Link>
            </div>
          </article>
        ))}
      </div>
      {compact ? <Link className="section-more" to="/hospitality">Explore hospitality <span>→</span></Link> : null}
    </section>
  )
}

export default HospitalityPage
