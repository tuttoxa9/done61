import { writeFileSync } from 'fs';

const BASE_URL = 'https://unicservices.ru';
const PAGES = [
  '/',
  '/about',
  '/contacts',
];
const now = new Date().toISOString().substring(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>
`;
writeFileSync('./client/public/sitemap.xml', sitemap, 'utf-8');
console.log('sitemap.xml generated');
