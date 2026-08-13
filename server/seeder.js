const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected (Seeder Standard): ${conn.connection.host}`);
  } catch (error) {
    console.log(`Standard MongoDB connection failed. Initializing MongoMemoryServer v4.4...`);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({ binary: { version: '4.4.18' } });
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected (Seeder MemoryServer v4.4): ${mongoUri}`);
  }
};

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Immerse yourself in pure sound with hybrid active noise cancellation, 30-hour battery life, and crystal-clear microphone calls.',
    category: 'Electronics',
    brand: 'SoundPro',
    price: 199.99,
    discountPercent: 15,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    numReviews: 12
  },
  {
    name: 'Ultra-Slim Mechanical Gaming Keyboard',
    description: 'Low-profile mechanical switches, customizable RGB backlighting per key, and durable aluminum alloy top frame.',
    category: 'Electronics',
    brand: 'CyberTech',
    price: 129.99,
    discountPercent: 10,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    numReviews: 8
  },
  {
    name: '4K Ultra HD Smart Monitor 32"',
    description: 'Vibrant IPS panel with HDR400, USB-C 65W charging port, ultra-thin bezels, and built-in eye-care flicker-free technology.',
    category: 'Electronics',
    brand: 'VividView',
    price: 449.99,
    discountPercent: 20,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    numReviews: 15
  },
  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Designed for natural wrist posture, multi-device Bluetooth connection, customizable thumb buttons, and fast USB-C charging.',
    category: 'Electronics',
    brand: 'CyberTech',
    price: 59.99,
    discountPercent: 5,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'],
    rating: 4.4,
    numReviews: 6
  },
  {
    name: 'Smart Fitness Watch Series 5',
    description: 'Track heart rate, SpO2, sleep stages, GPS workouts, water resistant to 50m, with 7-day battery life.',
    category: 'Electronics',
    brand: 'FitTrack',
    price: 179.99,
    discountPercent: 12,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    rating: 4.7,
    numReviews: 22
  },
  {
    name: 'Classic Leather Minimalist Watch',
    description: 'Genuine Italian leather strap, stainless steel case, Japanese quartz movement, water-resistant 3ATM.',
    category: 'Fashion',
    brand: 'Aura',
    price: 89.99,
    discountPercent: 0,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'],
    rating: 4.5,
    numReviews: 9
  },
  {
    name: 'Premium Canvas Backpack',
    description: 'Water-resistant vintage canvas backpack with padded 15.6" laptop compartment, leather accents, and anti-theft back pocket.',
    category: 'Fashion',
    brand: 'UrbanGear',
    price: 69.99,
    discountPercent: 10,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    numReviews: 14
  },
  {
    name: 'Unisex Polarized Sunglasses',
    description: 'UV400 protection polarized lenses, lightweight TR90 flexible frame, classic aviator style for all face shapes.',
    category: 'Fashion',
    brand: 'RayLux',
    price: 39.99,
    discountPercent: 25,
    stock: 3,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'],
    rating: 4.3,
    numReviews: 7
  },
  {
    name: 'Lightweight Running Sneakers',
    description: 'Breathable mesh upper, shock-absorbing EVA midsole, anti-slip rubber outsole for daily running and training.',
    category: 'Fashion',
    brand: 'StrideFit',
    price: 79.99,
    discountPercent: 15,
    stock: 19,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    numReviews: 31
  },
  {
    name: 'Cold Brew Electric Espresso Machine',
    description: '15-bar Italian pump pressure, removable milk frother wand, rapid thermoblock heating for barista quality espresso at home.',
    category: 'Home & Kitchen',
    brand: 'BaristaPro',
    price: 249.99,
    discountPercent: 18,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebe02f2a6e8?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    numReviews: 19
  },
  {
    name: 'Stainless Steel Pour-Over Kettle',
    description: 'Gooseneck spout for accurate pour control, built-in thermometer lid, ergonomic wooden handle, induction compatible.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 49.99,
    discountPercent: 0,
    stock: 2,
    images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    numReviews: 5
  },
  {
    name: 'Smart Air Purifier HEPA H13',
    description: 'Filters 99.97% of dust, pollen, smoke, and odors in rooms up to 500 sq ft. Real-time air quality sensor display.',
    category: 'Home & Kitchen',
    brand: 'PureBreeze',
    price: 159.99,
    discountPercent: 10,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'],
    rating: 4.7,
    numReviews: 11
  },
  {
    name: 'Non-Stick Ceramic Cookware Set 10-Piece',
    description: 'Toxin-free non-stick coating, dishwasher safe, heavy-gauge aluminum for fast even heating, stainless steel handles.',
    category: 'Home & Kitchen',
    brand: 'ChefLine',
    price: 189.99,
    discountPercent: 20,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'],
    rating: 4.5,
    numReviews: 10
  },
  {
    name: 'High-Density Yoga Mat with Carrying Strap',
    description: '6mm extra thick eco-friendly TPE material, non-slip textured surfaces on both sides, lightweight with bonus alignment lines.',
    category: 'Sports & Fitness',
    brand: 'ZenFit',
    price: 34.99,
    discountPercent: 0,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    numReviews: 18
  },
  {
    name: 'Adjustable Dumbbell Set (5-52.5 lbs)',
    description: 'Replaces 15 sets of weights with an easy dial system. Durable molding around metal plates for smooth quiet lift off.',
    category: 'Sports & Fitness',
    brand: 'IronFlex',
    price: 299.99,
    discountPercent: 15,
    stock: 6,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    numReviews: 24
  },
  {
    name: 'Clean Code: Handbook of Agile Software Craftsmanship',
    description: 'Essential reading for every developer. Teaches principles of writing clean, maintainable, readable code with practical refactoring examples.',
    category: 'Books',
    brand: 'Prentice Hall',
    price: 44.99,
    discountPercent: 10,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80'],
    rating: 5.0,
    numReviews: 45
  },
  {
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive guide to the architecture of modern data systems, storage engines, distributed consensus, and streaming systems.',
    category: 'Books',
    brand: "O'Reilly Media",
    price: 49.99,
    discountPercent: 5,
    stock: 28,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    numReviews: 38
  },
  {
    name: 'Smart Home Security Camera 1080p',
    description: 'Indoor HD security camera with 360-degree pan/tilt, night vision, 2-way audio, and instant motion alert notifications.',
    category: 'Electronics',
    brand: 'SecureView',
    price: 45.99,
    discountPercent: 20,
    stock: 16,
    images: ['https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=80'],
    rating: 4.4,
    numReviews: 12
  }
];

const seedDatabase = async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await Review.deleteMany();
  await Cart.deleteMany();
  await Order.deleteMany();

  console.log('Cleared existing collections...');

  const adminUser = await User.create({
    name: 'Admin Manager',
    email: 'admin@shopez.com',
    password: 'admin123',
    role: 'ADMIN'
  });

  const standardUser1 = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'USER'
  });

  const standardUser2 = await User.create({
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'USER'
  });

  console.log('Created Users:');
  console.log('  Admin -> Email: admin@shopez.com | Pass: admin123');
  console.log('  User1 -> Email: john@example.com  | Pass: user123');

  const createdProducts = await Product.create(sampleProducts);
  console.log(`Seeded ${createdProducts.length} products!`);

  const sampleReviews = [
    {
      product: createdProducts[0]._id,
      user: standardUser1._id,
      name: standardUser1.name,
      rating: 5,
      comment: 'Outstanding sound quality and active noise cancellation! Battery life easily lasts 3 days.'
    },
    {
      product: createdProducts[0]._id,
      user: standardUser2._id,
      name: standardUser2.name,
      rating: 4,
      comment: 'Very comfortable over-ear design. Bluetooth connects instantly.'
    }
  ];

  await Review.create(sampleReviews);

  await Order.create([
    {
      user: standardUser1._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          quantity: 1,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          discountPercent: createdProducts[0].discountPercent,
          finalPrice: createdProducts[0].finalPrice,
          product: createdProducts[0]._id
        }
      ],
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Tech Park Ave',
        city: 'San Francisco',
        postalCode: '94107',
        country: 'USA',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'Simulated Card / UPI',
      paymentResult: { id: 'SIM_PAY_1001', status: 'COMPLETED', update_time: new Date().toISOString() },
      itemsPrice: createdProducts[0].finalPrice,
      taxPrice: Math.round(createdProducts[0].finalPrice * 0.05 * 100) / 100,
      shippingPrice: 0,
      totalPrice: Math.round(createdProducts[0].finalPrice * 1.05 * 100) / 100,
      isPaid: true,
      orderStatus: 'DELIVERED',
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      user: standardUser2._id,
      orderItems: [
        {
          name: createdProducts[1].name,
          quantity: 2,
          image: createdProducts[1].images[0],
          price: createdProducts[1].price,
          discountPercent: createdProducts[1].discountPercent,
          finalPrice: createdProducts[1].finalPrice,
          product: createdProducts[1]._id
        }
      ],
      shippingAddress: {
        fullName: 'Jane Smith',
        address: '456 Innovation Blvd',
        city: 'Austin',
        postalCode: '78701',
        country: 'USA',
        phone: '+1 (555) 987-6543'
      },
      paymentMethod: 'Simulated Card / UPI',
      paymentResult: { id: 'SIM_PAY_1002', status: 'COMPLETED', update_time: new Date().toISOString() },
      itemsPrice: createdProducts[1].finalPrice * 2,
      taxPrice: Math.round(createdProducts[1].finalPrice * 2 * 0.05 * 100) / 100,
      shippingPrice: 0,
      totalPrice: Math.round(createdProducts[1].finalPrice * 2 * 1.05 * 100) / 100,
      isPaid: true,
      orderStatus: 'PLACED'
    }
  ]);

  console.log('Seeded sample orders for admin analytics!');
};

const run = async () => {
  await connectDB();
  await seedDatabase();
  if (require.main === module) {
    process.exit(0);
  }
};

if (require.main === module) {
  run();
}

module.exports = { seedDatabase };
