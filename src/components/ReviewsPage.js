import { Link } from 'react-router-dom'
import './ReviewsPage.css'

const reviews = [
  {
    quote: '“The Dum Biryani is an absolute masterclass.”',
    text: 'Saffron basmati and meltingly tender lamb remind me of vintage royal banquets. Their morning filter coffee delivery is now our family ritual.',
    name: 'Vikramaditya Rao',
    role: 'Resident, Miyapur',
  },
  {
    quote: '“Our anniversary banquet was flawless.”',
    text: 'From the live tandoor starters to the warm Shahi Tukda, the culinary hospitality was truly exemplary.',
    name: 'Dr. Sunita Malani',
    role: 'Patron & Food Connoisseur',
  },
  {
    quote: '“Sunday pre-order is a lifesaver.”',
    text: 'Waking up knowing clean, prime cuts of country chicken and organic brown eggs are waiting at our apartment entrance has transformed our weekends.',
    name: 'Anand Kulkarni',
    role: 'Tech Executive, Hitec City',
  },
]

function ReviewsPage({ compact = false }) {
  return (
    <section className={`reviews-section${compact ? ' compact-section' : ''}`} id="reviews">
      <div className="section-heading">
        <span className="eyebrow">Patron Testimonials</span>
        <h2>Praise from Discerning Palates</h2>
        <p>Honest reflections from Hyderabad families, epicureans, and corporate hosts.</p>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <span aria-label="5 out of 5 stars" className="review-stars">★★★★★</span>
            <blockquote>{review.quote}</blockquote>
            <p>{review.text}</p>
            <div className="review-author">
              <span aria-hidden="true">{review.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
              <div><strong>{review.name}</strong><small>{review.role}</small></div>
            </div>
          </article>
        ))}
      </div>
      {compact ? <Link className="section-more" to="/reviews">Read guest stories <span>→</span></Link> : null}
    </section>
  )
}

export default ReviewsPage
