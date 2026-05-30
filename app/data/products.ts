export interface Product {
  id: number
  title: string
  slug: string
  price: number
  image: string
  category: string
  categorySlug: string
}

export const categories = [
  { name: 'WordPress Themes', slug: 'wordpress-themes', icon: 'mdi-wordpress' },
  { name: 'Elementor Template Kits', slug: 'elementor-kits', icon: 'mdi-palette' },
  { name: 'Joomla Templates', slug: 'joomla-templates', icon: 'mdi-joomla' },
  { name: 'Magento Themes', slug: 'magento-themes', icon: 'mdi-shopping' },
  { name: 'Shopify Themes', slug: 'shopify-themes', icon: 'mdi-shopify' },
  { name: 'PrestaShop Themes', slug: 'prestashop-themes', icon: 'mdi-store' },
  { name: 'WordPress Plugins', slug: 'wordpress-plugins', icon: 'mdi-puzzle' },
  { name: 'HTML Templates', slug: 'html-templates', icon: 'mdi-language-html5' },
]

const productNames = [
  'Medicashop - Pharmacy & Medical Store Elementor Template Kit',
  'Barrameru - Outdoor Adventure Camping Store Elementor Pro',
  'Jantel - Lingerie & Nightwear Store Elementor Pro Template Kit',
  'Cabinet - Furniture Store Elementor Template Kit Latest',
  'Sleepy - Mattress & Bedding Online Store Elementor Pro Template Kit',
  'Bagage - WooCommerce Bag Store Elementor Pro Template Kit',
  'Cutbert - Furniture Store Elementor Template Kit Latest',
  'Bloxic - Furniture Store HTML Template Latest Version',
  'Gameplay - Video Game Store Elementor Template Kit Latest',
  'Xanadu - Multi Store Responsive Shopify Theme Latest Version',
  'DailyFresh - Grocery Store Elementor Template Kit Latest',
  'E-Store - Responsive HTML Template Latest Version',
  'Megha - Minimal Shopify Store Latest Version',
  'Bookly - Bookstore Shopify Theme Latest Version',
  'Herpride - Skincare Shopify Store Theme Latest Version',
  'Palos - Multi Store Responsive Shopify Theme Latest Version',
  'Elementor Pro WordPress Plugin Latest Version',
  'WPBakery Page Builder for WordPress',
  'Flavstarter - Multipurpose HTML Template Latest Version',
  'Tyres - Tyre Store WooCommerce Theme Latest Version',
  'Bazart - Digital Marketplace React Next.js Latest Version',
  'Flashmart - WooCommerce Supermarket Theme Latest Version',
  'Spacemax - Multipurpose HTML Template Latest Version',
  'Furea - Furniture Ecommerce HTML Template Latest Version',
  'Katerina - Photography Portfolio Site Template Latest',
  'Carbu - Car Repair Elementor Template Kit Latest Version',
  'Mebel - Pottery & Ceramic Studio Elementor Template Kit',
  'Curriporto - Creative Portfolio Elementor Pro',
  'Barber 1997 - Barbershop Elementor Template Kits Latest',
  'Markit - Digital Marketplace React Next.js Latest Version',
  'Lenka - Creative Digital Agency Elementor Template Kit Latest',
  'Ballera - Ballet & Dance School Elementor Template Kit',
  'Career - Job Recruitment Elementor Template Kit Latest',
  'Cygnus - Minimalist Business HTML Template Latest Version',
  'Archtek - Architecture & Interior HTML Template Latest',
  'Power - Personal CV Elementor Pro Template Kit Latest Version',
  'Aenft - NFT Minting or Collection Landing Page Latest',
]

const categoryAssignments = [
  'elementor-kits', 'elementor-kits', 'elementor-kits', 'elementor-kits',
  'elementor-kits', 'elementor-kits', 'elementor-kits', 'html-templates',
  'elementor-kits', 'shopify-themes', 'elementor-kits', 'html-templates',
  'shopify-themes', 'shopify-themes', 'shopify-themes', 'shopify-themes',
  'wordpress-plugins', 'wordpress-plugins', 'html-templates', 'wordpress-themes',
  'html-templates', 'wordpress-themes', 'html-templates', 'html-templates',
  'html-templates', 'elementor-kits', 'elementor-kits', 'elementor-kits',
  'elementor-kits', 'html-templates', 'elementor-kits', 'elementor-kits',
  'elementor-kits', 'html-templates', 'html-templates', 'elementor-kits',
  'html-templates',
]

export const products: Product[] = productNames.map((title, i) => ({
  id: i + 1,
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  price: 2.49,
  image: `https://picsum.photos/seed/product${i + 1}/400/300`,
  category: categories.find(c => c.slug === categoryAssignments[i])?.name || 'Elementor Template Kits',
  categorySlug: categoryAssignments[i],
}))
