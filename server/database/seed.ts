import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const client = createClient({ url: 'file:./data/store.db' })
const db = drizzle(client, { schema })

const CATEGORIES = [
  { name: 'WordPress Themes', slug: 'wordpress-themes' },
  { name: 'Elementor Template Kits', slug: 'elementor-kits' },
  { name: 'Joomla Templates', slug: 'joomla-templates' },
  { name: 'Magento Themes', slug: 'magento-themes' },
  { name: 'Shopify Themes', slug: 'shopify-themes' },
  { name: 'PrestaShop Themes', slug: 'prestashop-themes' },
  { name: 'WordPress Plugins', slug: 'wordpress-plugins' },
  { name: 'HTML Templates', slug: 'html-templates' },
]

const productEntries = [
  { title: 'Medicashop - Pharmacy & Medical Store Elementor Template Kit', category: 'elementor-kits' },
  { title: 'Barrameru - Outdoor Adventure Camping Store Elementor Pro', category: 'elementor-kits' },
  { title: 'Jantel - Lingerie & Nightwear Store Elementor Pro Template Kit', category: 'elementor-kits' },
  { title: 'Cabinet - Furniture Store Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'Sleepy - Mattress & Bedding Online Store Elementor Pro Template Kit', category: 'elementor-kits' },
  { title: 'Bagage - WooCommerce Bag Store Elementor Pro Template Kit', category: 'elementor-kits' },
  { title: 'Cutbert - Furniture Store Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'Bloxic - Furniture Store HTML Template Latest Version', category: 'html-templates' },
  { title: 'Gameplay - Video Game Store Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'Xanadu - Multi Store Responsive Shopify Theme Latest Version', category: 'shopify-themes' },
  { title: 'DailyFresh - Grocery Store Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'E-Store - Responsive HTML Template Latest Version', category: 'html-templates' },
  { title: 'Megha - Minimal Shopify Store Latest Version', category: 'shopify-themes' },
  { title: 'Bookly - Bookstore Shopify Theme Latest Version', category: 'shopify-themes' },
  { title: 'Herpride - Skincare Shopify Store Theme Latest Version', category: 'shopify-themes' },
  { title: 'Palos - Multi Store Responsive Shopify Theme Latest Version', category: 'shopify-themes' },
  { title: 'Elementor Pro WordPress Plugin Latest Version', category: 'wordpress-plugins' },
  { title: 'WPBakery Page Builder for WordPress', category: 'wordpress-plugins' },
  { title: 'Flavstarter - Multipurpose HTML Template Latest Version', category: 'html-templates' },
  { title: 'Tyres - Tyre Store WooCommerce Theme Latest Version', category: 'wordpress-themes' },
  { title: 'Bazart - Digital Marketplace React Next.js Latest Version', category: 'html-templates' },
  { title: 'Flashmart - WooCommerce Supermarket Theme Latest Version', category: 'wordpress-themes' },
  { title: 'Spacemax - Multipurpose HTML Template Latest Version', category: 'html-templates' },
  { title: 'Furea - Furniture Ecommerce HTML Template Latest Version', category: 'html-templates' },
  { title: 'Katerina - Photography Portfolio Site Template Latest', category: 'html-templates' },
  { title: 'Carbu - Car Repair Elementor Template Kit Latest Version', category: 'elementor-kits' },
  { title: 'Mebel - Pottery & Ceramic Studio Elementor Template Kit', category: 'elementor-kits' },
  { title: 'Curriporto - Creative Portfolio Elementor Pro', category: 'elementor-kits' },
  { title: 'Barber 1997 - Barbershop Elementor Template Kits Latest', category: 'elementor-kits' },
  { title: 'Markit - Digital Marketplace React Next.js Latest Version', category: 'html-templates' },
  { title: 'Lenka - Creative Digital Agency Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'Ballera - Ballet & Dance School Elementor Template Kit', category: 'elementor-kits' },
  { title: 'Career - Job Recruitment Elementor Template Kit Latest', category: 'elementor-kits' },
  { title: 'Cygnus - Minimalist Business HTML Template Latest Version', category: 'html-templates' },
  { title: 'Archtek - Architecture & Interior HTML Template Latest', category: 'html-templates' },
  { title: 'Power - Personal CV Elementor Pro Template Kit Latest Version', category: 'elementor-kits' },
  { title: 'Aenft - NFT Minting or Collection Landing Page Latest', category: 'html-templates' },
]

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  await db.insert(schema.users).values({
    name: 'Admin',
    email: 'aminsab@outlook.fr',
    password: '123456',
    role: 'admin',
  }).onConflictDoNothing()

  // Create sample customer
  await db.insert(schema.users).values({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  }).onConflictDoNothing()

  // Create products
  for (let i = 0; i < productEntries.length; i++) {
    const entry = productEntries[i]
    const categoryName = CATEGORIES.find(c => c.slug === entry.category)?.name ?? 'Uncategorized'

    await db.insert(schema.products).values({
      title: entry.title,
      slug: slugify(entry.title),
      description: 'Premium digital product with instant download.',
      price: 2.49,
      image: `https://picsum.photos/seed/product${i + 1}/400/300`,
      category: categoryName,
      categorySlug: entry.category,
      status: 'published',
    }).onConflictDoNothing()
  }

  console.log('✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
