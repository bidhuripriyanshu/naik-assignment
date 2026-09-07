const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Beetroot Chips',
    slug: 'beetroot-chips',
    category: 'Snacks and Namkeen',
    description: 'Beetroot, Crispy, Nutritious Treat. Made with pure natural beetroot slices and lightly seasoned.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780038991/medusa/1780038989592-IMG_3870.JPG.jpeg.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780038991/medusa/1780038989592-IMG_3870.JPG.jpeg.jpg'],
    variants: [
      { weight: '100g', price: 70, mrp: 85, stock: 50 },
      { weight: '250g', price: 160, mrp: 190, stock: 30 }
    ],
    ingredients: ['Beetroot', 'Edible Oil', 'Rock Salt', 'Spices'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.8,
    numReviews: 88,
  },
  {
    name: 'Cheeseling',
    slug: 'cheeseling',
    category: 'Snacks and Namkeen',
    description: 'Cheesy, Crispy, Snack Time favourite. Little golden squares filled with rich cheese flavor.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1779968324/medusa/1779968322289-IMG_3854.JPG.jpeg.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1779968324/medusa/1779968322289-IMG_3854.JPG.jpeg.jpg'],
    variants: [
      { weight: '150g', price: 110, mrp: 130, stock: 40 },
      { weight: '300g', price: 210, mrp: 250, stock: 25 }
    ],
    ingredients: ['Wheat Flour', 'Cheese Powder', 'Butter', 'Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 112,
  },
  {
    name: 'Corn Chakali',
    slug: 'corn-chakali',
    category: 'Snacks and Namkeen',
    description: 'Crispy, Golden, Corn Crunch. Crunchy spirals made with sweet corn flour & traditional Maharashtrian spices.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780036501/medusa/1780036499281-IMG_3868.JPG.jpeg.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780036501/medusa/1780036499281-IMG_3868.JPG.jpeg.jpg'],
    variants: [
      { weight: '100g', price: 50, mrp: 65, stock: 60 },
      { weight: '250g', price: 115, mrp: 140, stock: 35 }
    ],
    ingredients: ['Corn Flour', 'Rice Flour', 'Sesame', 'Red Chilli', 'Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.7,
    numReviews: 95,
  },
  {
    name: 'Thepla Puri',
    slug: 'thepla-puri',
    category: 'Snacks and Namkeen',
    description: 'Authentic, Rustic, Gujarati & Maharashtrian blend. Crispy whole wheat puris seasoned with fresh methi.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780047072/medusa/1780047070539-IMG_3886.JPG.jpeg.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780047072/medusa/1780047070539-IMG_3886.JPG.jpeg.jpg'],
    variants: [
      { weight: '150g', price: 90, mrp: 110, stock: 45 },
      { weight: '300g', price: 170, mrp: 200, stock: 20 }
    ],
    ingredients: ['Whole Wheat Flour', 'Fenugreek (Methi)', 'Sesame', 'Turmeric', 'Cumin'],
    isFeatured: false,
    isBestseller: true,
    rating: 4.8,
    numReviews: 76,
  },
  {
    name: 'Jwari Bhel',
    slug: 'jwari-bhel',
    category: 'Snacks and Namkeen',
    description: 'Authentic, Crispy Goodness. Roasted sorghum (Jowar) puffs mixed with tangy spices for a healthy low-cal snack.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1781146398/medusa/1781146396686-pomelli_photoshoot_image_1_1_0526%20%282%29%20%282%29.png.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1781146398/medusa/1781146396686-pomelli_photoshoot_image_1_1_0526%20%282%29%20%282%29.png.jpg'],
    variants: [
      { weight: '80g', price: 30, mrp: 40, stock: 80 },
      { weight: '200g', price: 70, mrp: 90, stock: 40 }
    ],
    ingredients: ['Puffed Jowar', 'Peanuts', 'Curry Leaves', 'Green Chilli', 'Rock Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 130,
  },
  {
    name: 'Ambadi Bhajiche Lonche',
    slug: 'ambadi-bhajiche-lonche',
    category: 'Pickles & Condiments',
    description: 'Traditional, Tangy Pickle Delight. Authentic Maharashtrian Roselle (Ambadi) greens pickle prepared in cold-pressed oil.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780057106/medusa/1780057104457-pomelli_photoshoot_image_1_1_0529%20%285%29.png.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780057106/medusa/1780057104457-pomelli_photoshoot_image_1_1_0529%20%285%29.png.jpg'],
    variants: [
      { weight: '250g', price: 190, mrp: 230, stock: 30 },
      { weight: '500g', price: 360, mrp: 420, stock: 15 }
    ],
    ingredients: ['Ambadi Greens', 'Mustard Oil', 'Fenugreek', 'Red Chilli Powder', 'Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 5.0,
    numReviews: 64,
  },
  {
    name: 'Banana Wefers',
    slug: 'banana-wefers',
    category: 'Snacks and Namkeen',
    description: 'Golden slices, tropical crispy charm. Thin wafer-crisp raw banana chips seasoned with rock salt.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780130812/medusa/1780130810786-pomelli_photoshoot-1%20%286%29.png.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780130812/medusa/1780130810786-pomelli_photoshoot-1%20%286%29.png.jpg'],
    variants: [
      { weight: '100g', price: 45, mrp: 60, stock: 75 },
      { weight: '250g', price: 105, mrp: 130, stock: 40 }
    ],
    ingredients: ['Raw Banana', 'Pure Coconut Oil', 'Rock Salt'],
    isFeatured: false,
    isBestseller: true,
    rating: 4.8,
    numReviews: 150,
  },
  {
    name: 'Prawns Pickle (Kolambi Lonche)',
    slug: 'kolambi-lonche',
    category: 'Pickles & Condiments',
    description: 'Authentic, Spicy, Coastal Flavor. Fresh prawns pickled with fiery Konkani spices & ginger-garlic paste.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780121990/medusa/1780121988900-pomelli_photoshoot_image_1_1_0529%20%287%29.png.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780121990/medusa/1780121988900-pomelli_photoshoot_image_1_1_0529%20%287%29.png.jpg'],
    variants: [
      { weight: '250g', price: 280, mrp: 340, stock: 25 },
      { weight: '500g', price: 540, mrp: 650, stock: 10 }
    ],
    ingredients: ['Fresh Prawns', 'Mustard Oil', 'Garlic', 'Ginger', 'Kokum', 'Malvani Spices'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 180,
  },
  {
    name: 'Tangy Tomato Rings',
    slug: 'tangy-tomato',
    category: 'Snacks and Namkeen',
    description: 'Crunchy, Tangy, Tomato Rings. Fun crispy rings coated in sweet & spicy tomato seasoning.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1779971724/medusa/1779971722505-IMG_3862.JPG.jpeg.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1779971724/medusa/1779971722505-IMG_3862.JPG.jpeg.jpg'],
    variants: [
      { weight: '150g', price: 100, mrp: 125, stock: 55 },
      { weight: '300g', price: 190, mrp: 230, stock: 30 }
    ],
    ingredients: ['Corn Meal', 'Rice Meal', 'Tomato Powder', 'Chilli Powder', 'Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.7,
    numReviews: 90,
  },
  {
    name: 'Methi Thalipith Bhajni',
    slug: 'methi-thalipith-bhajni',
    category: 'Spices & Masalas',
    description: 'Traditional, Healthy Flavor. Multi-grain roasted flour mix enriched with dried fenugreek leaves for instant Thalipeeth.',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780058273/medusa/1780058271381-pomelli_photoshoot_image_1_1_0529%20%281%29.png.jpg',
    images: ['https://res.cloudinary.com/dskzfipt3/image/upload/v1780058273/medusa/1780058271381-pomelli_photoshoot_image_1_1_0529%20%281%29.png.jpg'],
    variants: [
      { weight: '250g', price: 70, mrp: 90, stock: 50 },
      { weight: '500g', price: 130, mrp: 160, stock: 30 }
    ],
    ingredients: ['Jowar', 'Bajra', 'Wheat', 'Chana Dal', 'Kasuri Methi', 'Cumin'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 105,
  },
  {
    name: 'Bhajani Special Chakali',
    nameMr: 'भाजणी चकली',
    category: 'Chakali',
    slug: 'bhajani-special-chakali',
    description: 'Crispy, crunchy, and golden Maharashtrian Bhajani Chakali made from roasted 12-grain flour blend & pure sesame seeds.',
    image: '/chakali.png',
    images: ['/chakali.png'],
    variants: [
      { weight: '250g', price: 100, mrp: 120, stock: 50 },
      { weight: '500g', price: 180, mrp: 220, stock: 30 }
    ],
    ingredients: ['Rice', 'Chana Dal', 'Urad Dal', 'Sesame', 'Cumin', 'Red Chilli', 'Pure Ghee', 'Salt'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 142,
  },
  {
    name: 'Pure Cow Ghee Besan Laddoo',
    nameMr: 'बेसन लाडू',
    category: 'Laddoo',
    slug: 'pure-ghee-besan-laddoo',
    description: 'Melt-in-mouth traditional Besan Laddoos prepared with slow-roasted gram flour, pure cow ghee, and chopped almonds.',
    image: '/laado.png',
    images: ['/laado.png'],
    variants: [
      { weight: '250g', price: 130, mrp: 150, stock: 40 },
      { weight: '500g', price: 240, mrp: 280, stock: 25 }
    ],
    ingredients: ['Gram Flour (Besan)', 'Pure Cow Ghee', 'Sugar', 'Cardamom', 'Almonds'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.9,
    numReviews: 188,
  },
  {
    name: 'Goda Masala Special',
    nameMr: 'गोडा मसाला',
    category: 'Spices & Masalas',
    slug: 'goda-masala',
    description: 'Authentic Maharashtrian Goda Masala — hand-pounded with over 20 roasted aromatic spices.',
    image: '/masala.png',
    images: ['/masala.png'],
    variants: [
      { weight: '100g', price: 120, mrp: 150, stock: 50 },
      { weight: '250g', price: 280, mrp: 350, stock: 30 }
    ],
    ingredients: ['Coriander', 'Cumin', 'Black Pepper', 'Cloves', 'Cinnamon', 'Dagad Phool'],
    isFeatured: true,
    isBestseller: true,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: 'Kolhapuri Kanda Lasun Masala',
    nameMr: 'कांदा लसूण मसाला',
    category: 'Spices & Masalas',
    slug: 'kanda-lasun-masala',
    description: 'Fiery and bold Kolhapuri Onion Garlic Masala for the authentic spicy curry & Misal Pav experience.',
    image: '/masala.png',
    images: ['/masala.png'],
    variants: [
      { weight: '100g', price: 99, mrp: 130, stock: 80 },
      { weight: '250g', price: 230, mrp: 300, stock: 40 }
    ],
    ingredients: ['Red Chilli', 'Coriander', 'Garlic', 'Onion', 'Sesame', 'Coconut'],
    isFeatured: true,
    rating: 4.7,
    numReviews: 95,
  }
];

const seedDB = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑  Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Naik Admin',
      email: 'admin@naikfoods.co.in',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('👤 Admin user created: admin@naikfoods.co.in / admin123');

    await Product.insertMany(products);
    console.log(`🌿 ${products.length} products seeded`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
