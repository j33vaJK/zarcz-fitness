import 'dotenv/config';
import { PrismaClient, ProductStatus } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─────────────────────────────────────────────
  // 0. Cleanup existing data
  // ─────────────────────────────────────────────
  console.log('🧹 Cleaning up existing data...');
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.testimonial.deleteMany();
  console.log('✅ Cleanup complete');

  // ─────────────────────────────────────────────
  // 1. Categories
  // ─────────────────────────────────────────────
  const [gymWear, sportsFootwear, trainingGear, equipment, supplements, accessories] = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Gym Wear' },
      update: { image: '/products/official-club-jersey.jpeg' },
      create: {
        name: 'Gym Wear',
        image: '/products/official-club-jersey.jpeg',
        itemCount: 45,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Sports Footwear' },
      update: { image: '/products/football-boots.jpeg' },
      create: {
        name: 'Sports Footwear',
        image: '/products/football-boots.jpeg',
        itemCount: 32,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Training Gear' },
      update: { image: '/products/adjustable-hand-grippers.jpeg' },
      create: {
        name: 'Training Gear',
        image: '/products/adjustable-hand-grippers.jpeg',
        itemCount: 28,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Sports Equipment' },
      update: { image: '/products/premium-cricket-bat.jpeg' },
      create: {
        name: 'Sports Equipment',
        image: '/products/premium-cricket-bat.jpeg',
        itemCount: 19,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Supplements' },
      update: { image: '/products/isolate-whey-protein.webp' },
      create: {
        name: 'Supplements',
        image: '/products/isolate-whey-protein.webp',
        itemCount: 15,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Accessories' },
      update: { image: '/products/wrist-bands.jpeg' },
      create: {
        name: 'Accessories',
        image: '/products/wrist-bands.jpeg',
        itemCount: 12,
      },
    }),
  ]);

  console.log(`✅ Seeded ${6} categories`);

  // ─────────────────────────────────────────────
  // 2. Products
  // ─────────────────────────────────────────────
  const productsData = [
    // --- Supplements ---
    {
      name: 'Whey Isolate Protein',
      categoryId: supplements.id,
      price: 2499.0,
      stock: 15,
      status: ProductStatus.IN_STOCK,
      image: '/products/isolate-whey-protein.webp',
      description: 'Ultra-pure whey isolate for fast muscle recovery.',
      featured: true,
    },
    {
      name: 'C9 BCAA + EAA Complex',
      categoryId: supplements.id,
      price: 1899.0,
      stock: 25,
      status: ProductStatus.IN_STOCK,
      image: '/products/c9-bcaa-eaa.jpg',
      description: 'Essential amino acids for endurance and recovery.',
      featured: true,
    },
    {
      name: 'Pre-Workout Elite Formula',
      categoryId: supplements.id,
      price: 1999.0,
      stock: 8,
      status: ProductStatus.LOW_STOCK,
      image: '/products/pre-workout-elite.jpeg',
      description: 'Energy-boosting pre-workout formula for peak performance.',
      featured: true,
    },
    {
      name: 'Protein Peanut Butter',
      categoryId: supplements.id,
      price: 499.0,
      stock: 40,
      status: ProductStatus.IN_STOCK,
      image: '/products/protein-peanut-butter.jpeg',
      description: 'Creamy high-protein peanut butter.',
      featured: false,
    },
    {
      name: 'Energy Muesli 1kg',
      categoryId: supplements.id,
      price: 599.0,
      stock: 42,
      status: ProductStatus.IN_STOCK,
      image: '/products/energy-muesli-1kg.webp',
      description: 'Nutritious high-energy breakfast for athletes.',
      featured: false,
    },
    {
      name: 'Omega-3 Fish Oil Capsules',
      categoryId: supplements.id,
      price: 899.0,
      stock: 30,
      status: ProductStatus.IN_STOCK,
      image: '/products/omega-3-fish-oil.jpeg',
      description: 'Premium fish oil for heart and joint health.',
      featured: false,
    },

    // --- Sports Equipment ---
    {
      name: 'BDM Professional Cricket Bat',
      categoryId: equipment.id,
      price: 4500.0,
      stock: 10,
      status: ProductStatus.IN_STOCK,
      image: '/products/bdm-cricket-bat.jpeg',
      description: 'Hand-crafted premium English willow bat.',
      featured: true,
    },
    {
      name: 'Premium Willow Cricket Bat',
      categoryId: equipment.id,
      price: 3500.0,
      stock: 15,
      status: ProductStatus.IN_STOCK,
      image: '/products/premium-cricket-bat.jpeg',
      description: 'High-quality willow bat for club players.',
      featured: false,
    },
    {
      name: 'Cosco FIFA Quality Football',
      categoryId: equipment.id,
      price: 1200.0,
      stock: 20,
      status: ProductStatus.IN_STOCK,
      image: '/products/cosco-football.jpeg',
      description: 'Official match quality football.',
      featured: true,
    },
    {
      name: 'Nivia Stitched Football',
      categoryId: equipment.id,
      price: 999.0,
      stock: 15,
      status: ProductStatus.IN_STOCK,
      image: '/products/nivia-stitched-football.jpeg',
      description: 'Durable hand-stitched football for all surfaces.',
      featured: false,
    },
    {
      name: 'Professional Soccer Ball',
      categoryId: equipment.id,
      price: 1100.0,
      stock: 18,
      status: ProductStatus.IN_STOCK,
      image: '/products/professional-football.jpeg',
      description: 'Tournament grade soccer ball.',
      featured: false,
    },
    {
      name: 'Badminton Net Pro',
      categoryId: equipment.id,
      price: 799.0,
      stock: 10,
      status: ProductStatus.IN_STOCK,
      image: '/products/badminton-nets.jpeg',
      description: 'Nylon badminton net with reinforced borders.',
      featured: false,
    },
    {
      name: 'Mavis 350 Shuttlecocks',
      categoryId: equipment.id,
      price: 1499.0,
      stock: 50,
      status: ProductStatus.IN_STOCK,
      image: '/products/mavis-350-shuttlecocks.jpeg',
      description: 'Nylon shuttlecocks for club practice.',
      featured: false,
    },

    // --- Apparel ---
    {
      name: 'Official Club Jersey',
      categoryId: gymWear.id,
      price: 1200.0,
      stock: 100,
      status: ProductStatus.IN_STOCK,
      image: '/products/official-club-jersey.jpeg',
      description: 'Breathable training jersey.',
      featured: true,
    },
    {
      name: 'CSK Official Training Jersey',
      categoryId: gymWear.id,
      price: 1499.0,
      stock: 80,
      status: ProductStatus.IN_STOCK,
      image: '/products/csk-official-jersey.jpeg',
      description: 'Limited edition team jersey.',
      featured: true,
    },
    {
      name: 'Professional Football Boots',
      categoryId: sportsFootwear.id,
      price: 1800.0,
      stock: 20,
      status: ProductStatus.IN_STOCK,
      image: '/products/football-boots.jpeg',
      description: 'High-grip boots for firm ground.',
      featured: true,
    },

    // --- Accessories ---
    {
      name: 'Adjustable Hand Grippers',
      categoryId: trainingGear.id,
      price: 499.0,
      stock: 45,
      status: ProductStatus.IN_STOCK,
      image: '/products/adjustable-hand-grippers.jpeg',
      description: 'Build forearm and grip strength.',
      featured: true,
    },
    {
      name: 'Basic Hand Grippers',
      categoryId: trainingGear.id,
      price: 299.0,
      stock: 60,
      status: ProductStatus.IN_STOCK,
      image: '/products/basic-hand-grippers.jpeg',
      description: 'Standard resistance hand grippers.',
      featured: false,
    },
    {
      name: 'Premium Referee Whistle',
      categoryId: accessories.id,
      price: 199.0,
      stock: 100,
      status: ProductStatus.IN_STOCK,
      image: '/products/premium-referee-whistle.jpeg',
      description: 'High-decibel professional whistle.',
      featured: false,
    },
    {
      name: 'Professional Pealess Whistle',
      categoryId: accessories.id,
      price: 249.0,
      stock: 80,
      status: ProductStatus.IN_STOCK,
      image: '/products/professional-pealess-whistle.jpeg',
      description: 'Finger-grip pealess whistle for referees.',
      featured: false,
    },
    {
      name: 'Cotton Wrist Bands',
      categoryId: accessories.id,
      price: 149.0,
      stock: 200,
      status: ProductStatus.IN_STOCK,
      image: '/products/wrist-bands.jpeg',
      description: 'Sweat-absorbent cotton wrist bands.',
      featured: false,
    },

    // --- Fitness Gear (from WhatsApp images) ---
    ...Array.from({ length: 20 }).map((_, i) => ({
      name: `ZarcZ Fitness Gear ${i + 1}`,
      categoryId: trainingGear.id,
      price: 599 + (i * 100),
      stock: 10 + i,
      status: ProductStatus.IN_STOCK,
      image: `/products/fitness-gear-${i + 1}.jpeg`,
      description: 'High-quality equipment for your fitness journey.',
      featured: i < 5, // Feature first 5
    })),
  ];

  let productCount = 0;
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { id: `seed-${product.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `seed-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...product,
      },
    });
    productCount++;
  }

  console.log(`✅ Seeded ${productCount} products`);

  // ─────────────────────────────────────────────
  // 3. Services
  // ─────────────────────────────────────────────
  const servicesData = [
    {
      id: 'seed-service-personal-training',
      title: 'Personal Training',
      description: '1-on-1 personalized coaching tailored to your specific fitness goals and lifestyle.',
      icon: 'Dumbbell',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    },
    {
      id: 'seed-service-online-coaching',
      title: 'Online Coaching',
      description: 'Remote workout programming and nutritional guidance accessible anywhere.',
      icon: 'Laptop',
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&q=80',
    },
    {
      id: 'seed-service-diet-consultation',
      title: 'Diet Consultation',
      description: 'Comprehensive nutritional planning from certified sports dietitians.',
      icon: 'Apple',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
    },
    {
      id: 'seed-service-group-programs',
      title: 'Group Programs',
      description: 'High-energy community classes focused on HIIT, strength, and endurance.',
      icon: 'Users',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
    },
  ];

  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }

  console.log(`✅ Seeded ${servicesData.length} services`);

  // ─────────────────────────────────────────────
  // 4. Testimonials
  // ─────────────────────────────────────────────
  const testimonialsData = [
    {
      id: 'seed-testimonial-sebi-tom',
      name: 'Sebi Tom',
      content: 'Class shop. Helped me nail the fit and the boots are spot on. Properly nice people too. Very satisfied experience.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80',
      rating: 5,
    },
    {
      id: 'seed-testimonial-mayoory-ashok',
      name: 'Mayoory Ashok',
      content: 'A reliable place for fitness products. Good quality fitness products and friendly staff.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      rating: 5,
    },
    {
      id: 'seed-testimonial-ajith-kumar',
      name: 'Ajith kumar',
      content: 'The store delivers a great customer experience, offering top-quality sports accessories and an outstanding car-driving game.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      rating: 5,
    },
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: {},
      create: testimonial,
    });
  }

  console.log(`✅ Seeded ${testimonialsData.length} testimonials`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
