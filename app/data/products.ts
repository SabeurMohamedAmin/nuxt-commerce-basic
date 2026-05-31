import type { Product } from '~/types'
import { CATEGORIES, DEFAULT_PRODUCT_PRICE } from '~/constants'
import { slugify } from '~/utils/format'

// ─── Raw Product Data ───────────────────────────────────────────
const productEntries: Array<{ title: string; category: string }> = [
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

// ─── Build Product List ─────────────────────────────────────────
function getCategoryName(slug: string): string {
  return CATEGORIES.find(c => c.slug === slug)?.name ?? 'Uncategorized'
}

export const products: Product[] = productEntries.map((entry, index) => ({
  id: index + 1,
  title: entry.title,
  slug: slugify(entry.title),
  price: DEFAULT_PRODUCT_PRICE,
  image: `https://picsum.photos/seed/product${index + 1}/400/300`,
  category: getCategoryName(entry.category),
  categorySlug: entry.category,
}))
