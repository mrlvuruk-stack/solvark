const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

const client = createClient({
  url: 'file:./dev.db',
});
const adapter = new PrismaLibSQL(client);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Clean database
  await prisma.user.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.caseStudy.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.blogCategory.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.websiteSettings.deleteMany({});
  await prisma.mediaLibrary.deleteMany({});

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('solvarkadmin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Solvark Admin',
      email: 'admin@solvark.com',
      password_hash: passwordHash,
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 3. Create Default Website Settings
  const settings = await prisma.websiteSettings.create({
    data: {
      site_name: 'Solvark',
      contact_email: 'mrlv.uruk@gmail.com',
      contact_phone: '+91 91094 75522',
      address: 'Phoenix Township, Dewas Naka, Indore, India',
      social_links: {
        twitter: 'https://twitter.com/solvark',
        linkedin: 'https://linkedin.com/company/solvark',
        instagram: 'https://instagram.com/solvark',
        github: 'https://github.com/solvark',
      },
    },
  });
  console.log('Created global website settings');

  // 4. Create Services
  const servicesData = [
    {
      title: 'Website Development',
      slug: 'website-development',
      short_description: 'High-performance, custom business websites built with Next.js and React.',
      full_description: 'We develop custom, ultra-fast business websites tailored to your exact brand and goals. We do not use bloated page builders; instead, we code clean, responsive, and SEO-optimized web architectures that convert visitors into active leads.',
      icon: 'Monitor',
      featured: true,
    },
    {
      title: 'E-commerce Development',
      slug: 'ecommerce-development',
      short_description: 'Modern, high-converting online stores that scale with your sales volume.',
      full_description: 'Scale your retail operations with robust online stores. We create headless Shopify solutions, custom Woo-commerce builds, or fully custom transactional systems integrated with premium payment gateways and inventory systems.',
      icon: 'ShoppingBag',
      featured: true,
    },
    {
      title: 'Branding & Identity',
      slug: 'branding',
      short_description: 'Visual identity systems, logos, and market positioning that define your business.',
      full_description: 'Go beyond a logo. We build holistic brand identity systems including typography guides, color systems, voice positioning, and brand collateral to command premium prices in your industry.',
      icon: 'Compass',
      featured: true,
    },
    {
      title: 'Website Redesign',
      slug: 'website-redesign',
      short_description: 'Transform outdated layouts into modern, premium, and high-performance assets.',
      full_description: 'Is your current website costing you credibility? We reconstruct outdated designs, improve core performance, optimize client conversion paths, and align your site with modern visual design trends.',
      icon: 'RefreshCw',
      featured: false,
    },
    {
      title: 'Website Maintenance',
      slug: 'website-maintenance',
      short_description: 'Ongoing technical updates, performance monitoring, backups, and security checks.',
      full_description: 'Ensure 100% uptime and visual consistency. We handle daily backups, security patching, page content revisions, analytics reports, and speed optimizations so you can focus entirely on growing your business.',
      icon: 'Shield',
      featured: false,
    },
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }
  console.log('Seeded services');

  // 5. Create Testimonials
  const testimonialsData = [
    {
      client_name: 'Rajesh Sharma',
      company_name: 'Shyam Honda',
      designation: 'Managing Director',
      review: 'Solvark transformed our digital showroom experience. Our dealership inquiries increased by 45% within three months of launching the redesigned website. Their engineering is top-tier.',
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      featured: true,
    },
    {
      client_name: 'Sarah Jenkins',
      company_name: 'Aura Skincare',
      designation: 'Founder & CEO',
      review: 'Their e-commerce approach is highly professional. The checkout experience is seamless, and page speed is incredibly fast. Solvark is a true partner in our brand growth.',
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      featured: true,
    },
    {
      client_name: 'Amit Patel',
      company_name: 'Nexus Real Estate',
      designation: 'Head of Marketing',
      review: 'We were blown away by the custom interactive features. The property filter system feels premium and operates instantly. Excellent communications throughout the design process.',
      rating: 4,
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      featured: true,
    },
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log('Seeded testimonials');

  // 6. Create Case Studies
  const caseStudiesData = [
    {
      title: 'Shyam Honda: Dealership Digital Transformation',
      slug: 'shyam-honda',
      client_name: 'Shyam Honda',
      industry: 'Automotive',
      challenge: 'Shyam Honda needed a premium visual showroom website to display active two-wheeler models, capture customer test ride bookings, and channel dealership leads. The existing solution was slow, non-responsive, and failed to capture leads effectively.',
      solution: 'We built a high-performance Next.js custom catalog containing sleek model showcases, 360-degree color selectors, local booking scheduler integrations, and automated lead routing alerts for the sales desk.',
      results: 'Over 45% increase in online test-ride bookings, page loading times dropped under 1.2s, and leads are distributed to sales reps within 3 minutes.',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Prisma', 'PostgreSQL'],
      featured_image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop',
      gallery_images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop'
      ],
      project_url: 'https://shyamhonda.com',
      featured: true,
    },
    {
      title: 'Aura: Scalable Headless E-commerce',
      slug: 'aura-skincare',
      client_name: 'Aura Skincare',
      industry: 'E-commerce',
      challenge: 'Aura was struggling with high cart abandonment and poor mobile rendering on standard Shopify templates. They needed an extremely premium visual showcase that felt luxury and operated instantly.',
      solution: 'We engineered a headless Shopify architecture using Next.js on the frontend and Shopify GraphQL API on the backend. We implemented page transition animations and a secure single-step checkout.',
      results: 'Cart conversion rates improved by 22% and average mobile sessions increased by 1.5 minutes.',
      technologies: ['Next.js', 'Shopify Storefront API', 'Tailwind CSS', 'Framer Motion', 'Jose'],
      featured_image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      gallery_images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop'
      ],
      project_url: 'https://auraskin.co',
      featured: true,
    },
  ];

  for (const caseStudy of caseStudiesData) {
    await prisma.caseStudy.create({ data: caseStudy });
  }
  console.log('Seeded case studies');

  // 7. Create Blog Categories & Posts
  const catDesign = await prisma.blogCategory.create({
    data: { name: 'Design & UX', slug: 'design-ux' },
  });
  const catTech = await prisma.blogCategory.create({
    data: { name: 'Technology', slug: 'technology' },
  });
  const catGrowth = await prisma.blogCategory.create({
    data: { name: 'Digital Growth', slug: 'digital-growth' },
  });

  const blogsData = [
    {
      author_id: admin.id,
      category_id: catDesign.id,
      title: 'The Power of Glassmorphism in Modern SaaS Design',
      slug: 'power-of-glassmorphism-saas-design',
      excerpt: 'How subtle translucent layering and backdrop blurring can elevate user interfaces into premium, tactile experiences.',
      content: 'Glassmorphism has taken the modern UI design world by storm. Originating from Windows Vista and popularized by iOS 7 and macOS Big Sur, it relies on a combination of translucent backgrounds, blurred backdrops, and fine borders to simulate physical glass panes. When implemented correctly, it provides visual depth, establishes clear visual hierarchies, and makes apps feel premium. In this article, we outline best practices for CSS backdrop-filter, border color transparency, and dynamic ambient background glows.',
      featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      seo_title: 'Glassmorphism in Modern SaaS Design | Solvark',
      seo_description: 'Learn how to implement glassmorphism inside premium web designs to drive user engagement and interface credibility.',
      status: 'published',
      published_at: new Date(),
    },
    {
      author_id: admin.id,
      category_id: catTech.id,
      title: 'Why Next.js Server Actions Are Replacing REST API Endpoints',
      slug: 'why-nextjs-server-actions-replacing-rest',
      excerpt: 'Exploring how RPC-like Server Actions simplify form submissions, database access, and security workflows in React 19.',
      content: 'Next.js Server Actions allow developers to define server-side functions that can be invoked directly from client components. This eliminates the need to manually write fetch calls, setup API endpoints, and handle routing parameters. Under the hood, Next.js handles the POST request and response serialization securely. In this deep dive, we compare Server Actions and typical API routes in terms of type-safety, bundle size reductions, and security validation (Zod, CORS protection).',
      featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
      seo_title: 'Next.js Server Actions vs REST APIs | Solvark Blog',
      seo_description: 'Analyze the performance and architectural differences between Next.js Server Actions and standard REST endpoints.',
      status: 'published',
      published_at: new Date(),
    },
  ];

  for (const blog of blogsData) {
    await prisma.blogPost.create({ data: blog });
  }
  console.log('Seeded blog categories and posts');

  // 8. Seed FAQs
  const faqsData = [
    {
      question: 'What is your typical project timeline?',
      answer: 'A standard custom website development project takes 4 to 8 weeks depending on the page volume and interactive features required. We operate in weekly sprints to ensure transparent progress.',
      display_order: 1,
    },
    {
      question: 'Do you work with templates or write custom code?',
      answer: 'We design and write custom code for every single project. We do not use heavy templates or page builders like Elementor. This guarantees the highest speed scores (90+) and full layout control.',
      display_order: 2,
    },
    {
      question: 'Will I be able to update my own website content?',
      answer: 'Yes. We provide a custom, user-friendly admin dashboard where you can edit blog posts, add new case studies, read submitted leads, and manage website text without needing developer help.',
      display_order: 3,
    },
  ];

  for (const faq of faqsData) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('Seeded FAQs');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
