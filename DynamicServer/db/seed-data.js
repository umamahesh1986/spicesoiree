// Initial data for the Spice Soiree database.
// This was moved out of the React client's hard-coded arrays. After seeding, the
// database is the source of truth. Edit rows in MySQL (or a future admin panel), not here.

// ---------------------------------------------------------------------------
// Settings (key/value)
// ---------------------------------------------------------------------------
const settings = {
  restaurant_name: 'Spice Soirée',
  whatsapp_number: '919849489900', // used for all wa.me order / enquiry links
  whatsapp_display: '98494 89900',
  phone_primary: '+919642498490',
  phone_primary_display: '96424 98490',
  phone_secondary: '+919849489900',
  phone_secondary_display: '98494 89900',
  email_general: 'spicesoiree@gmail.com',
  email_orders: 'orders@spicesoiree.com',
  address_full: 'Plot No. 1031, Road No. 2/5, Matrusree Nagar, Miyapur, Hyderabad 500049',
  location_label: 'Matrusi Nagar, Hyderabad',
  hours_display: '12:00 PM – 10:30 PM',
  hours_lunch: '12:00 PM – 03:00 PM',
  hours_dinner: '05:00 PM – 10:30 PM',
  delivery_area: 'Matrusri Nagar',
  delivery_radius: 'Within 1.5 km',
};

// ---------------------------------------------------------------------------
// Restaurant menu
// ---------------------------------------------------------------------------
const menuCategories = [
  { name: 'Biryani', icon: '🍛', pageHeading: 'SIGNATURE BIRYANIS' },
  { name: 'Starters', icon: '🍗', pageHeading: 'OUR STARTERS' },
  { name: 'BBQ & Tandoori', icon: '🥘', pageHeading: 'BBQ & TANDOORI' },
  { name: 'Chinese', icon: '🍜', pageHeading: 'FRIED RICE & NOODLES' },
  { name: 'Indian Curries', icon: '🍲', pageHeading: 'INDIAN CURRIES' },
  { name: 'Breads', icon: '🫓', pageHeading: 'INDIAN BREADS' },
];

const menuImages = {
  'Chicken Dum Biryani': '/uploads/chicken-dum-biryani.webp',
  'Chicken Fry Piece Biryani': '/uploads/chicken-fry-piece-biryani.webp',
  'Chicken 65 Biryani': '/uploads/chicken-65-biryani.webp',
  'Paneer Biryani': '/uploads/paneer-biryani.webp',
  'Mushroom Biryani': '/uploads/mushroom-biryani.webp',
  'Gongura Chicken Biryani': '/uploads/gongura-chicken-biryani.webp',
  'Chicken – 65 / Manchurian': '/uploads/chicken-65.webp',
  'Chicken – Chilli / Ginger': '/uploads/chicken-chilli.webp',
  'Chicken – Majestic / Pepper / Dragon / 555': '/uploads/chicken-majestic.webp',
  'Chicken Lollipop (3 pcs / 6 pcs)': '/uploads/chicken-lollipop.webp',
  'Bone-in Chicken Pakoda': '/uploads/bone-in-chicken-pakoda.webp',
  'Boneless Chicken Pakoda': '/uploads/boneless-chicken-pakoda.webp',
  'Gobi Manchurian': '/uploads/gobi-manchurian.webp',
  'Gobi – Chilli / 65': '/uploads/gobi-chilli.webp',
  'Gobi – Crispy / Schezwan / Pepper': '/uploads/crispy-gobi.webp',
  'Mushroom – Chilli / 65 / Manchurian': '/uploads/mushroom-chilli.webp',
  'Mushroom – Pepper / Crispy / Schezwan': '/uploads/mushroom-pepper.webp',
  'Crispy Corn': '/uploads/crispy-corn.webp',
  'Paneer – Chilli / 65 / Manchurian': '/uploads/paneer-chilli.webp',
  'Paneer – Pepper / Crispy / Schezwan': '/uploads/paneer-pepper.webp',
  'Veg Manchurian': '/uploads/veg-manchurian.webp',
  'Chilli / Schezwan Veg Manchurian': '/uploads/chilli-veg-manchurian.webp',
  'Pepper / Garlic Veg Manchurian': '/uploads/pepper-veg-manchurian.webp',
  'Tandoori Chicken': '/uploads/tandoori-chicken.webp',
  'Spicy Chicken Tikka': '/uploads/spicy-chicken-tikka.webp',
  'Malai Chicken Tikka': '/uploads/malai-chicken-tikka.webp',
  'Spicy BBQ Leg': '/uploads/spicy-bbq-leg.webp',
  'Spicy BBQ Wings': '/uploads/spicy-bbq-wings.webp',
  'Paneer Tikka': '/uploads/paneer-tikka.webp',
  'Malai Paneer Tikka': '/uploads/malai-paneer-tikka.webp',
  'Hariyali Paneer Tikka': '/uploads/hariyali-paneer-tikka.webp',
  'Mushroom Tikka': '/uploads/mushroom-tikka.webp',
  'Malai Mushroom Tikka': '/uploads/malai-mushroom-tikka.webp',
  'Gobi Tikka': '/uploads/gobi-tikka.webp',
  'Hariyali Gobi Tikka': '/uploads/hariyali-gobi-tikka.webp',
  'Veg Fried Rice': '/uploads/veg-fried-rice.webp',
  'Egg Fried Rice': '/uploads/egg-fried-rice.webp',
  'Chicken Fried Rice': '/uploads/chicken-fried-rice.webp',
  'Schezwan Chicken Fried Rice': '/uploads/schezwan-chicken-fried-rice.webp',
  'Veg Noodles': '/uploads/veg-noodles.webp',
  'Egg Noodles': '/uploads/egg-noodles.webp',
  'Chicken Noodles': '/uploads/chicken-noodles.webp',
  'Schezwan Chicken Noodles': '/uploads/schezwan-chicken-noodles.webp',
  'Paneer Butter Masala': '/uploads/paneer-butter-masala.webp',
  'Kadai Paneer': '/uploads/kadai-paneer.webp',
  'Mushroom Masala': '/uploads/mushroom-masala.webp',
  'Kadai Mushroom': '/uploads/kadai-mushroom.webp',
  'Kaju Masala': '/uploads/kaju-masala.webp',
  'Andhra Chicken Curry': '/uploads/andhra-chicken-curry.webp',
  'Butter Chicken / Kadai Chicken': '/uploads/butter-chicken.webp',
  'Gongura Chicken Curry': '/uploads/gongura-chicken-curry.webp',
  'Mutton Curry': '/uploads/mutton-curry.webp',
  'Gongura Mutton Curry': '/uploads/gongura-mutton-curry.webp',
  'Egg Masala': '/uploads/egg-masala.webp',
  'Plain Naan': '/uploads/plain-naan.webp',
  'Butter Naan': '/uploads/butter-naan.webp',
  'Garlic Naan': '/uploads/garlic-naan.webp',
  'Tandoori Roti': '/uploads/tandoori-roti.webp',
  'Butter Tandoori Roti': '/uploads/butter-tandoori-roti.webp',
  'Pulka': '/uploads/pulka.webp',
};

// Each group shares a category, headings and size labels. rows = [name, [prices per size]]
const menuGroups = [
  {
    category: 'Biryani', mainHeading: '', section: 'SIGNATURE BIRYANIS',
    sizes: ['Single', 'Regular', 'Family'],
    description: 'Aromatic basmati rice prepared with authentic spices.',
    rows: [
      ['Chicken Dum Biryani', [169, 319, 629]],
      ['Chicken Fry Piece Biryani', [199, 379, 749]],
      ['Chicken 65 Biryani', [249, 479, 939]],
      ['Paneer Biryani', [239, 459, 899]],
      ['Mushroom Biryani', [229, 439, 859]],
      ['Gongura Chicken Biryani', [249, 479, 929]],
    ],
  },
  {
    category: 'Starters', mainHeading: '', section: 'CHICKEN STARTERS', sizes: ['Small', 'Large'],
    rows: [
      ['Chicken – 65 / Manchurian', [169, 299]],
      ['Chicken – Chilli / Ginger', [179, 319]],
      ['Chicken – Majestic / Pepper / Dragon / 555', [189, 329]],
      ['Chicken Lollipop (3 pcs / 6 pcs)', [189, 349]],
    ],
  },
  {
    category: 'Starters', mainHeading: '', section: 'CHICKEN PAKODA', sizes: ['250g', '500g RAW CHICKEN'],
    rows: [
      ['Bone-in Chicken Pakoda', [200, 360]],
      ['Boneless Chicken Pakoda', [250, 460]],
    ],
  },
  {
    category: 'Starters', mainHeading: 'VEGETARIAN STARTERS', section: 'GOBI SPECIALS', sizes: ['Small', 'Large'],
    rows: [
      ['Gobi Manchurian', [109, 189]],
      ['Gobi – Chilli / 65', [119, 199]],
      ['Gobi – Crispy / Schezwan / Pepper', [129, 209]],
    ],
  },
  {
    category: 'Starters', mainHeading: 'VEGETARIAN STARTERS', section: 'MUSHROOM SPECIALS', sizes: ['Small', 'Large'],
    rows: [
      ['Mushroom – Chilli / 65 / Manchurian', [159, 279]],
      ['Mushroom – Pepper / Crispy / Schezwan', [169, 289]],
    ],
  },
  {
    category: 'Starters', mainHeading: 'VEGETARIAN STARTERS', section: 'CORN SPECIAL', sizes: ['Small', 'Large'],
    rows: [['Crispy Corn', [139, 239]]],
  },
  {
    category: 'Starters', mainHeading: 'VEGETARIAN STARTERS', section: 'PANEER SPECIALS', sizes: ['Small', 'Large'],
    rows: [
      ['Paneer – Chilli / 65 / Manchurian', [189, 329]],
      ['Paneer – Pepper / Crispy / Schezwan', [199, 339]],
    ],
  },
  {
    category: 'Starters', mainHeading: 'VEGETARIAN STARTERS', section: 'VEG MANCHURIAN SPECIALS', sizes: ['Small', 'Large'],
    rows: [
      ['Veg Manchurian', [119, 199]],
      ['Chilli / Schezwan Veg Manchurian', [129, 209]],
      ['Pepper / Garlic Veg Manchurian', [129, 209]],
    ],
  },
  {
    // NOTE: the old client had this under the misspelled category "BBQ & Tandoor",
    // so Tandoori Chicken never appeared in the BBQ & Tandoori tab. Fixed here.
    category: 'BBQ & Tandoori', mainHeading: 'CHICKEN BBQ & TANDOORI', section: 'CHICKEN BBQ & TANDOORI', sizes: ['Half', 'Full'],
    rows: [['Tandoori Chicken', [299, 549]]],
  },
  {
    category: 'BBQ & Tandoori', mainHeading: '', section: 'CHICKEN BBQ & TANDOORI', sizes: ['6 pcs', '12 pcs'],
    rows: [
      ['Spicy Chicken Tikka', [149, 279]],
      ['Malai Chicken Tikka', [149, 279]],
    ],
  },
  {
    category: 'BBQ & Tandoori', mainHeading: 'CHICKEN BBQ & TANDOORI', section: 'CHICKEN BBQ & TANDOORI', sizes: ['1 pc', '3 pcs'],
    rows: [['Spicy BBQ Leg', [99, 279]]],
  },
  {
    category: 'BBQ & Tandoori', mainHeading: 'CHICKEN BBQ & TANDOORI', section: 'CHICKEN BBQ & TANDOORI', sizes: ['3 pcs', '6 pcs'],
    rows: [['Spicy BBQ Wings', [149, 289]]],
  },
  {
    category: 'BBQ & Tandoori', mainHeading: 'VEG BBQ', section: 'VEG BBQ', sizes: ['6 PCS', '12 PCS'],
    rows: [
      ['Paneer Tikka', [199, 379]],
      ['Malai Paneer Tikka', [219, 399]],
      ['Hariyali Paneer Tikka', [209, 389]],
      ['Mushroom Tikka', [159, 299]],
      ['Malai Mushroom Tikka', [169, 319]],
      ['Gobi Tikka', [129, 239]],
      ['Hariyali Gobi Tikka', [139, 259]],
    ],
  },
  {
    category: 'Chinese', mainHeading: '', section: 'FRIED RICE • BASMATI', sizes: ['Single', 'Full'],
    rows: [
      ['Veg Fried Rice', [109, 159]],
      ['Egg Fried Rice', [129, 179]],
      ['Chicken Fried Rice', [159, 219]],
      ['Schezwan Chicken Fried Rice', [179, 249]],
    ],
  },
  {
    category: 'Chinese', mainHeading: '', section: 'NOODLES', sizes: ['Single', 'Full'],
    rows: [
      ['Veg Noodles', [99, 159]],
      ['Egg Noodles', [119, 179]],
      ['Chicken Noodles', [129, 189]],
      ['Schezwan Chicken Noodles', [139, 199]],
    ],
  },
  {
    category: 'Indian Curries', mainHeading: '', section: 'VEGETARIAN CURRIES', sizes: ['Half', 'Full'],
    rows: [
      ['Paneer Butter Masala', [169, 289]],
      ['Kadai Paneer', [179, 299]],
      ['Mushroom Masala', [149, 249]],
      ['Kadai Mushroom', [159, 269]],
      ['Kaju Masala', [189, 329]],
    ],
  },
  {
    category: 'Indian Curries', mainHeading: '', section: 'NON-VEGETARIAN CURRIES', sizes: ['Half', 'Full'],
    rows: [
      ['Andhra Chicken Curry', [179, 299]],
      ['Butter Chicken / Kadai Chicken', [199, 349]],
      ['Gongura Chicken Curry', [199, 349]],
      ['Mutton Curry', [299, 499]],
      ['Gongura Mutton Curry', [329, 549]],
      ['Egg Masala', [119, 199]],
    ],
  },
  {
    category: 'Breads', mainHeading: '', section: '', sizes: ['Price'],
    rows: [
      ['Plain Naan', [39]],
      ['Butter Naan', [49]],
      ['Garlic Naan', [59]],
      ['Tandoori Roti', [29]],
      ['Butter Tandoori Roti', [39]],
      ['Pulka', [15]],
    ],
  },
];

// Only the first biryani was flagged as a bestseller in the old client.
const menuBestsellers = ['Chicken Dum Biryani'];

// ---------------------------------------------------------------------------
// Pre-order curries
// ---------------------------------------------------------------------------
const preorderCategories = [
  { name: 'Chicken Curries', icon: '🍗', curryType: 'Non-Veg Curries' },
  { name: 'Mutton Curries', icon: '🍖', curryType: 'Non-Veg Curries' },
  { name: 'Egg Curries', icon: '🥚', curryType: 'Non-Veg Curries' },
  { name: 'Veg Curries', icon: '🥗', curryType: 'Veg Curries' },
  { name: 'Special Curries', icon: '⭐', curryType: 'Special Curries' },
];

const preorderItems = [
  { name: 'Andhra Chicken Curry', description: 'Freshly prepared Andhra-style chicken curry.', prices: { Half: 179, Full: 299 }, category: 'Chicken Curries' },
  { name: 'Butter Chicken / Kadai Chicken', description: 'Rich and flavourful chicken curry.', prices: { Half: 199, Full: 349 }, category: 'Chicken Curries' },
  { name: 'Gongura Chicken Curry', description: 'Traditional chicken curry with gongura flavours.', prices: { Half: 199, Full: 349 }, category: 'Chicken Curries' },
  { name: 'Mutton Curry', description: 'Traditional mutton curry with rich spices.', prices: { Half: 299, Full: 499 }, category: 'Mutton Curries' },
  { name: 'Gongura Mutton Curry', description: 'Mutton curry prepared with gongura.', prices: { Half: 329, Full: 549 }, category: 'Mutton Curries' },
  { name: 'Egg Masala', description: 'Eggs cooked in flavourful masala gravy.', prices: { Half: 119, Full: 199 }, category: 'Egg Curries' },
  { name: 'Paneer Butter Masala', description: 'Paneer cooked in creamy tomato gravy.', prices: { Half: 169, Full: 289 }, category: 'Veg Curries' },
  { name: 'Kadai Paneer', description: 'Paneer cooked with aromatic kadai spices.', prices: { Half: 179, Full: 299 }, category: 'Veg Curries' },
  { name: 'Mushroom Masala', description: 'Mushrooms cooked in rich masala gravy.', prices: { Half: 149, Full: 249 }, category: 'Veg Curries' },
  { name: 'Kadai Mushroom', description: 'Mushrooms prepared with kadai spices.', prices: { Half: 159, Full: 269 }, category: 'Veg Curries' },
  { name: 'Kaju Masala', description: 'Cashews cooked in delicious masala gravy.', prices: { Half: 189, Full: 329 }, category: 'Special Curries' },
].map((item) => ({ ...item, image: menuImages[item.name] || '' }));

// ---------------------------------------------------------------------------
// Fresh meat & eggs
// ---------------------------------------------------------------------------
const meatCategories = [
  { name: 'Chicken', icon: '🐓' },
  { name: 'Boneless Chicken', icon: '🥩' },
  { name: 'Mutton', icon: '🐐' },
  { name: 'Mutton Keema', icon: '🍲' },
  { name: 'Eggs', icon: '🥚' },
];

const meatProducts = [
  {
    name: 'Fresh Chicken', subtitle: '(Whole)', price: 270, displayPrice: '₹270 / kg', category: 'Chicken',
    image: '/uploads/fresh-chicken.webp', unit: 'kg', cuttingAllowed: true,
    cuts: ['Curry Cut - Small', 'Curry Cut - Medium', 'Biryani Cut - 60g', 'Biryani Cut - 120g', 'Leg Piece - Whole', 'Leg Piece - Cut', 'Liver / Gizzards'],
  },
  {
    name: 'Boneless Chicken', subtitle: '(Breast)', price: 500, displayPrice: '₹500 / kg', category: 'Boneless Chicken',
    image: '/uploads/boneless-chicken.webp', unit: 'kg', cuttingAllowed: true,
    cuts: ['Breast - Pieces', 'Breast - Boneless'],
  },
  {
    name: 'Fresh Mutton', subtitle: '(Curry Cut)', price: 1100, displayPrice: '₹1,100 / kg', category: 'Mutton',
    image: '/uploads/fresh-mutton.webp', unit: 'kg', cuttingAllowed: true,
    cuts: ['Curry Cut - Small', 'Curry Cut - Medium', 'Biryani Cut - 60g', 'Biryani Cut - 120g', 'Leg Piece - Whole', 'Leg Piece - Cut'],
  },
  {
    name: 'Mutton Keema', subtitle: '(Minced)', price: 1500, displayPrice: '₹1,500 / kg', category: 'Mutton Keema',
    image: '/uploads/mutton-keema.webp', unit: 'kg', cuttingAllowed: false, cuts: [],
  },
  {
    name: 'Fresh Eggs', subtitle: '(Tray – 30 Eggs)', price: 180, displayPrice: '₹180 – ₹270 / tray', category: 'Eggs',
    image: '/uploads/fresh-eggs.webp', unit: 'tray', cuttingAllowed: false, cuts: [],
  },
];

const cuttingStyles = [
  { name: 'Curry Cut', subtitle: 'Small / Medium pieces', image: '/uploads/curry-cut.webp' },
  { name: 'Biryani Cut', subtitle: '60g / 120g pieces', image: '/uploads/biryani-cut.webp' },
  { name: 'Leg Piece', subtitle: 'Whole / Cut', image: '/uploads/leg-piece.webp' },
  { name: 'Breast', subtitle: 'Pieces / Boneless', image: '/uploads/chicken-breast.webp' },
  { name: 'Liver / Gizzards', subtitle: 'As per availability', image: '/uploads/liver-gizzards.webp' },
];

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------
const deliverySlots = [
  '12:00 – 1:00 PM', '1:00 – 2:00 PM', '2:00 – 3:00 PM', '3:00 – 4:00 PM', '4:00 – 5:00 PM',
  '5:00 – 6:00 PM', '6:00 – 7:00 PM', '7:00 – 8:00 PM', '8:00 – 9:00 PM', '9:00 – 10:00 PM',
];

// ---------------------------------------------------------------------------
// Special menu (Karthika Masam veg specials)
// ---------------------------------------------------------------------------
const specialMenuGroups = [
  { name: 'Veg Biryanis', image: '/uploads/karthika-veg-biryani.webp', items: ['Veg Biryani', 'Paneer Biryani', 'Mushroom Biryani', 'Kaju Biryani', 'Gongura Paneer Biryani'] },
  { name: 'Veg Starters', image: '/uploads/karthika-veg-starters.webp', items: ['Mushroom Pakoda', 'Paneer Pakoda', 'Gobi Pakoda', 'Paneer 65', 'Chilli Mushroom', 'Veg Manchurian'] },
  { name: 'Veg BBQ & Tandoori', image: '/uploads/karthika-veg-tandoori.webp', items: ['Paneer Tikka', 'Malai Paneer Tikka', 'Mushroom Tikka', 'Tandoori Gobi', 'Veg Seekh Kebab'] },
  { name: 'Veg Curries', image: '/uploads/karthika-veg-curries.webp', items: ['Paneer Butter Masala', 'Kadai Paneer', 'Mushroom Masala', 'Kaju Masala', 'Mixed Veg Curry', 'Gongura Paneer Curry'] },
];

// ---------------------------------------------------------------------------
// Generic page content -> content_items(page, section, ...)
// Multi-line titles use "\n" (the client renders it as a line break).
// ---------------------------------------------------------------------------
const content = {
  home: {
    // title, subtitle, image
    slides: [
      { image: '/uploads/malai-chicken-tikka.webp', title: 'Biryani, Curries,\nStarters & More...', subtitle: 'Fresh Ingredients • Authentic Taste • Hygienic Kitchen' },
      { image: '/uploads/butter-chicken.webp', title: 'Delicious Curries,\nMade With Love...', subtitle: 'Fresh Ingredients • Rich Flavours • Best Quality' },
      { image: '/uploads/fresh-chicken.webp', title: 'Fresh Meat & Eggs,\nQuality Guaranteed...', subtitle: 'Fresh Products • Quality Meat • Daily Fresh' },
      { image: '/uploads/chicken-65-biryani.webp', title: 'Party & Catering,\nCelebrate With Us...', subtitle: 'Birthdays • Family Functions • Bulk Orders' },
    ],
    // image, title, description, button_text, link
    services: [
      { image: '/uploads/malai-chicken-tikka.webp', title: 'Restaurant Menu', description: 'Biryani, Starters, BBQ, Chinese\nBreads & More', buttonText: 'View Menu', link: '/menu' },
      { image: '/uploads/butter-chicken.webp', title: 'Pre-Order Curries', description: 'Veg & Non-Veg Curries\n(Min. 1 kg)', buttonText: 'Pre-Order Now', link: '/PreOrderCurries' },
      { image: '/uploads/fresh-chicken.webp', title: 'Fresh Meat & Eggs', description: 'Chicken, Boneless, Mutton,\nMutton Keema & Eggs', buttonText: 'Book Now', link: '/FreshMeatEggs' },
      { image: '/uploads/chicken-65-biryani.webp', title: 'Catering & Party Orders', description: 'Birthdays, Family Functions,\nEvents & Bulk Orders', buttonText: 'Book Catering', link: '/catering' },
    ],
    // icon, title
    features: [
      { icon: '🛡️', title: 'Fresh &\nQuality Ingredients' },
      { icon: '👨‍🍳', title: 'Hygienic\nPreparation' },
      { icon: '✂️', title: 'Custom\nCutting Options' },
      { icon: '📋', title: '100%\nAdvance Booking' },
      { icon: '🚚', title: 'On-Time\nDelivery' },
      { icon: '👥', title: 'Bulk Orders\n& Catering' },
    ],
  },
  catering: {
    // title=name, description, subtitle=people, image, button_text, icon=badge
    packages: [
      { title: 'Standard Menu', description: 'Ideal for Small Gatherings', subtitle: '10 – 20 People', image: '/images/standard-menu.jpg', buttonText: 'View Menu' },
      { title: 'Premium Menu', description: 'Perfect for Family Functions', subtitle: '20 – 50 People', image: '/images/standard-menu.jpg', buttonText: 'View Menu', icon: '👑' },
      { title: 'Custom Menu', description: 'Choose your own items & quantities', subtitle: '50+ People', image: '/images/standard-menu.jpg', buttonText: 'Get Quote', icon: '♨' },
    ],
    // title
    services: [
      'Biryani & Rice Varieties', 'Starters & Appetizers', 'Veg & Non-Veg Curries', 'BBQ & Tandoori',
      'Breads & Sides', 'Custom Menus', 'Bulk & Event Orders',
    ].map((title) => ({ title })),
    // icon, title, subtitle
    benefits: [
      { icon: '🌿', title: 'Fresh', subtitle: 'Ingredients' },
      { icon: '♨', title: 'Authentic', subtitle: 'Taste' },
      { icon: '🏅', title: 'Customizable', subtitle: 'Menus' },
      { icon: '🛡️', title: 'Hygienic', subtitle: 'Preparation' },
      { icon: '🤝', title: 'On-Time', subtitle: 'Delivery' },
      { icon: '⭐', title: 'Quality &', subtitle: 'Reliable Service' },
    ],
    // title (form dropdown options)
    event_types: ['Wedding', 'Birthday Party', 'Engagement', 'Family Function', 'Corporate Event', 'House Party', 'Other'].map((title) => ({ title })),
    menu_preferences: ['Standard Menu', 'Premium Menu', 'Custom Menu', 'Veg Menu', 'Non-Veg Menu', 'Veg & Non-Veg Menu'].map((title) => ({ title })),
  },
  contact: {
    // title (form dropdown options)
    subjects: ['Food Order', 'Pre-Order Curries', 'Catering', 'Home Delivery', 'General Enquiry', 'Feedback'].map((title) => ({ title })),
  },
  about: {
    // title=key, image
    images: [
      { title: 'biryani', image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_400/RX_THUMBNAIL/IMAGES/VENDOR/2026/5/25/df19afc8-7d66-4912-aa14-4c2695e6a44c_1330325.jpg' },
      { title: 'restaurant', image: 'https://www.restroworks.com/blog/wp-content/uploads/2025/07/Cost-of-Opening-a-Restaurant-in-India.webp' },
    ],
    // icon, title, description
    features: [
      { icon: '♨', title: 'Authentic Recipes', description: 'Rich & traditional flavours' },
      { icon: '❀', title: 'Fresh Ingredients', description: 'Sourced with care' },
      { icon: '🛡', title: 'Quality & Hygiene', description: 'Clean, safe & reliable' },
      { icon: '♧', title: 'Customer First', description: 'Great taste & service' },
    ],
    services: [
      { icon: '🍴', title: 'Dine In', description: '(Limited Seating)' },
      { icon: '🛍', title: 'Takeaway / Counter Orders' },
      { icon: '🛵', title: 'Home Delivery', description: '(Matrusri Nagar & Nearby)' },
      { icon: '🍲', title: 'Pre-Order Curries', description: '(For Home & Events)' },
      { icon: '👥', title: 'Catering & Party Orders', description: '(Small & Large Gatherings)' },
    ],
    // icon, title
    benefits: [
      { icon: '▦', title: 'Freshly Prepared Daily' },
      { icon: '🏅', title: 'Quality You Can Trust' },
      { icon: '🌿', title: 'Hygienic & Safe Kitchen' },
      { icon: '👨‍👩‍👧', title: 'Local & Family Friendly' },
    ],
  },
  reviews: {
    // title=quote, description=text, subtitle=name, detail=role
    reviews: [
      { title: '“The Dum Biryani is an absolute masterclass.”', description: 'Saffron basmati and meltingly tender lamb remind me of vintage royal banquets. Their morning filter coffee delivery is now our family ritual.', subtitle: 'Vikramaditya Rao', detail: 'Resident, Miyapur' },
      { title: '“Our anniversary banquet was flawless.”', description: 'From the live tandoor starters to the warm Shahi Tukda, the culinary hospitality was truly exemplary.', subtitle: 'Dr. Sunita Malani', detail: 'Patron & Food Connoisseur' },
      { title: '“Sunday pre-order is a lifesaver.”', description: 'Waking up knowing clean, prime cuts of country chicken and organic brown eggs are waiting at our apartment entrance has transformed our weekends.', subtitle: 'Anand Kulkarni', detail: 'Tech Executive, Hitec City' },
    ],
  },
  hospitality: {
    // title, subtitle=capacity, description, image
    venues: [
      {
        title: 'The Saffron Grand Ballroom', subtitle: 'Capacity: 100 – 450 Guests',
        description: 'A grand celebration setting with bespoke amber chandeliers, integrated acoustics, and live tandoor stations.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeTbS3adXR_k3ZPBvExrUpPs6QdXFjbGqPNahRiNBfatv9P-XYM-bX0Q6oATK984yIoLChPO6RglUSbiwsxhUpos1ie9iRu898UDS-T0Gv4Hq-A36SkdPtrG8mB-vOIVZF83QPwsPFjkxAgdOlQJ2FM9aGiz1_XckqyvHjJFO0Q4Zuvh4r49yxsE7v4svyzIsMmTE8RDm7gO3McdiPt34JtJNzlCYEgqOTXTWZ2-fz',
      },
      {
        title: 'Private Dining Salons', subtitle: 'Intimate: 12 – 30 Guests',
        description: 'Acoustically secluded salons with a dedicated chef, custom tasting menus, and personal butler service.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFhPLS-aKPfcw5Zgw9n15JBwcd3HBX3V5_V5OsdZIk8GQjhDPwqpwq0cry6zTG-VdVlFMwr7rbA6qNYCfC1G69aGspZYuVsmu4U3c3twUBIGGbYszyWdp27sQt1qW86uxiZmPY2XliAdVYyE5jhmK8Qs1Vq-rhDq9RsPJhbAFQlCLgNmU6DhlmmI56_nO41cP-5Bv2Lzdp2E7MWNmiYPUcywf6xiA2_tb5Fs6rDgqo',
      },
      {
        title: 'Heritage Guest Suites', subtitle: '24-Hour Room Service',
        description: 'Refined luxury bedrooms for wedding guests and business patrons, with smart workspaces and 24-hour in-room tiffin service.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4K3HkmxYFd-KRZRDYd0ysrVPWxP0l9Zn_wX_MTm0L6Pcco2XjKN-qfIx6POHB1Y_fLKA8JfX18zxd5eMd5fu_QcIiWDxtmkt_oYnh6JeM6xd3DqPvqVQStdsGyOIZ5cMIrD-7sxkN1sX7EYtPcWjJuhu-00e6zcMt9F4SjDzoHaS-Xk0oN7NsKUYIoGzaunLxinCzLO7z-O55ENunffadnvG79covTY3c5BMU3TwC',
      },
    ],
  },
  'fine-dining': {
    // subtitle=category, title, description, detail, button_text=action, image
    experiences: [
      {
        subtitle: 'Lunch & Twilight Dinner', title: 'Artisanal Hyderabadi Dining',
        description: 'Signature Gosht Dum Biryani, clay oven seekh kebabs, warqi parathas, and rich Mirchi ka Salan gravies.',
        detail: 'Kitchen dispatch: 30–45 mins', buttonText: 'View Restaurant Menu',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2duHTX-y9IP1B5Cux2Ezm9qnkR29y17aZjWNssjY3iaM7TpMXI6VYLi34JYUPPRbyePDoDWRJ4UJd3-Ic8ZVqdMSuVSw2Vl-LEn9EQxL1z7OiJXg-ru4Ydvp6kMMPSnnKLl6_aFU9dFqnOgqbh7LDhq79uVkd8F8Co5M1rsAcOeHLJfWYn5zs5bRukYk-WxmJ-I7aQ21ylSYDYHn6SmgYP3QL3kzDiFs0bDtvO8Io',
      },
      {
        subtitle: 'Morning Sunrise Ritual', title: 'Signature Morning Tiffins',
        description: 'Fresh stone-ground batter, melt-in-mouth ghee idlis, crispy dosas, podi sambar, and traditional degree filter kaapi.',
        detail: 'Pre-book by 6:00 PM previous eve', buttonText: 'Select Tiffin Dates',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn0JJqrsznAe3Kms2DY8P5mduFBphq4JKnnvX_Q7vbmhVYNMVQCcYqEaz45kEGZ99cbKws9cmUNPJrp_ac_keRqtAqDkqXDBwQ_BReCbGp34uu9dwFY9mqo-GoVm_IfAX5BhYO_8zB1mmL7OkWqqs-RlcgHSVxEOjYh42zjK-I74QV7bVVyYEWigSW6r095Qk35QClDOvvVHDEHrMHWuGfyA0_uNey0To1phx_IzYA',
      },
      {
        subtitle: 'Weekend Family Feast', title: 'Weekend Handi Curries',
        description: 'Slow-simmered handi rogan josh, Gongura mamsam, Dum ka Murgh, and velvet Paneer pasanda in family pots.',
        detail: 'Min 1 kg • Book by 11 PM', buttonText: 'Plan Custom Feast',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGqBJ0xA85xtPlvVEcwM0pmwrVacpM4Ya2E0sUXFCsJSufulZv8NYqRnFSJdhufnV3cOzNmthcWmUISEMBUDG_ESc6aHso9nDTeRC3lG3ftmq52zOm2wLmFUchmL29LvqnBR1_2C5GiDAR9G8gwxc46bfL4VLQkjxBlLtKpbcI7U8JTlSMxMkrfjl_ysnrBPbF12wAMAVLQYGRYe-AE0PjYTHXO7pi3lfzUX6HickC',
      },
      {
        subtitle: 'Sunday Fresh Pantry', title: 'Sunday Artisanal Butchery',
        description: 'Pasture-raised tender mutton cuts, authentic country chicken (Natu Kodi), and nutrient-dense brown eggs.',
        detail: 'Sunrise delivery 7:00 AM Sunday', buttonText: 'Reserve Sunday Cut',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVPyd6Vf5C57NXpObdgWiXbXuD-VBDahwCAfE1NiguRjKSOvq2xVESXJ6BUDNxpxM_nuHk0l09A9xMVcbEPiU5hAx1dj0mnYZH9uvWx5wv3r0niujESSo5ZJ8R17e1xNqY-21G9_g9cpbrCQ-Y8_Dt_ZPl26P45BgkgnTRSrLH6LyiiE9er5BVPyAzUjJ-K4Le_2NJU6-knQMYCOsS-UwZOPP1M30ZRJAATASYm_zl',
      },
    ],
  },
};

module.exports = {
  settings,
  menuCategories,
  menuImages,
  menuGroups,
  menuBestsellers,
  preorderCategories,
  preorderItems,
  meatCategories,
  meatProducts,
  cuttingStyles,
  deliverySlots,
  specialMenuGroups,
  content,
};
