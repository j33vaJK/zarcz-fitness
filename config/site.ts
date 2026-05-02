export const siteConfig = {
    name: 'ZarcZ Fitness Solutions',
    description: 'Premium sportswear and transformative fitness programs',
    url: 'https://localhost:3000',
    ogImage: 'https://starter.example.com/og.jpg',
    links: {
        twitter: 'https://twitter.com/yourusername',
        github: 'https://github.com/yourusername/nextjs-starter',
        docs: 'https://docs.example.com',
    },
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+911234567890',
};

export type SiteConfig = typeof siteConfig;