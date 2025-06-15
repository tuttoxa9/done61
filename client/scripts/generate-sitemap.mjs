import { writeFileSync } from 'fs';

const BASE_URL = 'https://unictaste.ru';
const PAGES = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    url: '/calculator',
    changefreq: 'monthly',
    priority: '0.9'
  },
  {
    url: '/thank-you',
    changefreq: 'yearly',
    priority: '0.3'
  }
];
const now = new Date().toISOString().substring(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync('./public/sitemap.xml', sitemap, 'utf-8');
console.log('sitemap.xml generated with updated pages');
