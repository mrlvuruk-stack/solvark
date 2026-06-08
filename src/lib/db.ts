import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const clientsMap = new WeakMap<any, PrismaClient>();
let globalPrisma: PrismaClient | null = null;

// Mock Data Store mirroring schema structure and seed data
const mockUsers = [
  {
    id: "admin-id",
    name: "Solvark Admin",
    email: "admin@solvark.com",
    password_hash: "$2a$10$U/1hZ7cRmWz34DkY9x51veOqI52D3k1yIeqy4l2h42t6B6T7tT6qy", // bcrypt for solvarkadmin123
    role: "admin",
    created_at: new Date(),
    updated_at: new Date(),
  }
];

const mockSettings = {
  id: "settings-id",
  site_name: "Solvark",
  contact_email: "hello@solvark.com",
  contact_phone: "+91 98765 43210",
  address: "4th Floor, Tech Hub, HSR Layout, Bangalore, India",
  social_links: {
    twitter: "https://twitter.com/solvark",
    linkedin: "https://linkedin.com/company/solvark",
    instagram: "https://instagram.com/solvark",
    github: "https://github.com/solvark",
  },
  updated_at: new Date(),
};

const mockServices = [
  {
    id: "s1",
    title: "Website Development",
    slug: "website-development",
    short_description: "High-performance, custom business websites built with Next.js and React.",
    full_description: "We develop custom, ultra-fast business websites tailored to your exact brand and goals. We do not use bloated page builders; instead, we code clean, responsive, and SEO-optimized web architectures that convert visitors into active leads.",
    icon: "Monitor",
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "s2",
    title: "E-commerce Development",
    slug: "ecommerce-development",
    short_description: "Modern, high-converting online stores that scale with your sales volume.",
    full_description: "Scale your retail operations with robust online stores. We create headless Shopify solutions, custom Woo-commerce builds, or fully custom transactional systems integrated with premium payment gateways and inventory systems.",
    icon: "ShoppingBag",
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "s3",
    title: "Branding & Identity",
    slug: "branding",
    short_description: "Visual identity systems, logos, and market positioning that define your business.",
    full_description: "Go beyond a logo. We build holistic brand identity systems including typography guides, color systems, voice positioning, and brand collateral to command premium prices in your industry.",
    icon: "Compass",
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "s4",
    title: "Website Redesign",
    slug: "website-redesign",
    short_description: "Transform outdated layouts into modern, premium, and high-performance assets.",
    full_description: "Is your current website costing you credibility? We reconstruct outdated designs, improve core performance, optimize client conversion paths, and align your site with modern visual design trends.",
    icon: "RefreshCw",
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "s5",
    title: "Website Maintenance",
    slug: "website-maintenance",
    short_description: "Ongoing technical updates, performance monitoring, backups, and security checks.",
    full_description: "Ensure 100% downtime and visual consistency. We handle daily backups, security patching, page content revisions, analytics reports, and speed optimizations so you can focus entirely on growing your business.",
    icon: "Shield",
    featured: false,
    created_at: new Date(),
    updated_at: new Date(),
  }
];

const mockTestimonials = [
  {
    id: "t1",
    client_name: "Rajesh Sharma",
    company_name: "Shyam Honda",
    designation: "Managing Director",
    review: "Solvark transformed our digital showroom experience. Our dealership inquiries increased by 45% within three months of launching the redesigned website. Their engineering is top-tier.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    featured: true,
    created_at: new Date(),
  },
  {
    id: "t2",
    client_name: "Sarah Jenkins",
    company_name: "Aura Skincare",
    designation: "Founder & CEO",
    review: "Their e-commerce approach is highly professional. The checkout experience is seamless, and page speed is incredibly fast. Solvark is a true partner in our brand growth.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    featured: true,
    created_at: new Date(),
  },
  {
    id: "t3",
    client_name: "Amit Patel",
    company_name: "Nexus Real Estate",
    designation: "Head of Marketing",
    review: "We were blown away by the custom interactive features. The property filter system feels premium and operates instantly. Excellent communications throughout the design process.",
    rating: 4,
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    featured: true,
    created_at: new Date(),
  }
];

const mockCaseStudies = [
  {
    id: "cs1",
    title: "Shyam Honda: Dealership Digital Transformation",
    slug: "shyam-honda",
    client_name: "Shyam Honda",
    industry: "Automotive",
    challenge: "Shyam Honda needed a premium visual showroom website to display active two-wheeler models, capture customer test ride bookings, and channel dealership leads. The existing solution was slow, non-responsive, and failed to capture leads effectively.",
    solution: "We built a high-performance Next.js custom catalog containing sleek model showcases, 360-degree color selectors, local booking scheduler integrations, and automated lead routing alerts for the sales desk.",
    results: "Over 45% increase in online test-ride bookings, page loading times dropped under 1.2s, and leads are distributed to sales reps within 3 minutes.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Prisma", "PostgreSQL"],
    featured_image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop"
    ],
    project_url: "https://shyamhonda.com",
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "cs2",
    title: "Aura: Scalable Headless E-commerce",
    slug: "aura-skincare",
    client_name: "Aura Skincare",
    industry: "E-commerce",
    challenge: "Aura was struggling with high cart abandonment and poor mobile rendering on standard Shopify templates. They needed an extremely premium visual showcase that felt luxury and operated instantly.",
    solution: "We engineered a headless Shopify architecture using Next.js on the frontend and Shopify GraphQL API on the backend. We implemented page transition animations and a secure single-step checkout.",
    results: "Cart conversion rates improved by 22% and average mobile sessions increased by 1.5 minutes.",
    technologies: ["Next.js", "Shopify Storefront API", "Tailwind CSS", "Framer Motion", "Jose"],
    featured_image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    gallery_images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop"
    ],
    project_url: "https://auraskin.co",
    featured: true,
    created_at: new Date(),
    updated_at: new Date(),
  }
];

const mockCategories = [
  { id: "c1", name: "Design & UX", slug: "design-ux" },
  { id: "c2", name: "Technology", slug: "technology" },
  { id: "c3", name: "Digital Growth", slug: "digital-growth" }
];

const mockBlogPosts = [
  {
    id: "b1",
    author_id: "admin-id",
    category_id: "c1",
    title: "The Power of Glassmorphism in Modern SaaS Design",
    slug: "power-of-glassmorphism-saas-design",
    excerpt: "How subtle translucent layering and backdrop blurring can elevate user interfaces into premium, tactile experiences.",
    content: "Glassmorphism has taken the modern UI design world by storm. Originating from Windows Vista and popularized by iOS 7 and macOS Big Sur, it relies on a combination of translucent backgrounds, blurred backdrops, and fine borders to simulate physical glass panes. When implemented correctly, it provides visual depth, establishes clear visual hierarchies, and makes apps feel premium. In this article, we outline best practices for CSS backdrop-filter, border color transparency, and dynamic ambient background glows.",
    featured_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    seo_title: "Glassmorphism in Modern SaaS Design | Solvark",
    seo_description: "Learn how to implement glassmorphism inside premium web designs to drive user engagement and interface credibility.",
    status: "published",
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    author: mockUsers[0],
    category: mockCategories[0],
  },
  {
    id: "b2",
    author_id: "admin-id",
    category_id: "c2",
    title: "Why Next.js Server Actions Are Replacing REST API Endpoints",
    slug: "why-nextjs-server-actions-replacing-rest",
    excerpt: "Exploring how RPC-like Server Actions simplify form submissions, database access, and security workflows in React 19.",
    content: "Next.js Server Actions allow developers to define server-side functions that can be invoked directly from client components. This eliminates the need to manually write fetch calls, setup API endpoints, and handle routing parameters. Under the hood, Next.js handles the POST request and response serialization securely. In this deep dive, we compare Server Actions and typical API routes in terms of type-safety, bundle size reductions, and security validation (Zod, CORS protection).",
    featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    seo_title: "Next.js Server Actions vs REST APIs | Solvark Blog",
    seo_description: "Analyze the performance and architectural differences between Next.js Server Actions and standard REST endpoints.",
    status: "published",
    published_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    author: mockUsers[0],
    category: mockCategories[1],
  }
];

const mockFaqs = [
  {
    id: "f1",
    question: "What is your typical project timeline?",
    answer: "A standard custom website development project takes 4 to 8 weeks depending on the page volume and interactive features required. We operate in weekly sprints to ensure transparent progress.",
    display_order: 1,
    active: true,
  },
  {
    id: "f2",
    question: "Do you work with templates or write custom code?",
    answer: "We design and write custom code for every single project. We do not use heavy templates or page builders like Elementor. This guarantees the highest speed scores (90+) and full layout control.",
    display_order: 2,
    active: true,
  },
  {
    id: "f3",
    question: "Will I be able to update my own website content?",
    answer: "Yes. We provide a custom, user-friendly admin dashboard where you can edit blog posts, add new case studies, read submitted leads, and manage website text without needing developer help.",
    display_order: 3,
    active: true,
  }
];

const mockLeads: any[] = [];
const mockContactMessages: any[] = [];

// Helper to construct a Mock Prisma Client
function createMockPrismaClient(): PrismaClient {
  const mockDb: Record<string, any[]> = {
    user: mockUsers,
    websiteSettings: [mockSettings],
    service: mockServices,
    testimonial: mockTestimonials,
    caseStudy: mockCaseStudies,
    blogCategory: mockCategories,
    blogPost: mockBlogPosts,
    fAQ: mockFaqs,
    lead: mockLeads,
    contactMessage: mockContactMessages,
  };

  const getModelData = (model: string) => {
    // Handle model casing inconsistencies
    if (model === "fAQ") return mockDb.fAQ;
    return mockDb[model] || [];
  };

  const makeQueryMethods = (modelName: string) => {
    return {
      findMany: async (args?: any) => {
        let data = [...getModelData(modelName)];
        if (args?.where) {
          data = data.filter(item => {
            for (const key in args.where) {
              const val = args.where[key];
              if (val && typeof val === 'object') {
                if ('mode' in val) {
                  // Ignore case-insensitive matching mode object for mocks
                  continue;
                }
              }
              if (item[key] !== val) return false;
            }
            return true;
          });
        }
        if (args?.orderBy) {
          const orderKey = Object.keys(args.orderBy)[0];
          const orderDir = args.orderBy[orderKey];
          data.sort((a, b) => {
            if (a[orderKey] < b[orderKey]) return orderDir === 'asc' ? -1 : 1;
            if (a[orderKey] > b[orderKey]) return orderDir === 'asc' ? 1 : -1;
            return 0;
          });
        }
        if (args?.take) {
          data = data.slice(0, args.take);
        }
        return data;
      },
      findUnique: async (args: any) => {
        const data = getModelData(modelName);
        const where = args?.where || {};
        const found = data.find(item => {
          for (const key in where) {
            if (item[key] !== where[key]) return false;
          }
          return true;
        });
        return found || null;
      },
      findFirst: async (args?: any) => {
        const data = getModelData(modelName);
        const where = args?.where || {};
        const found = data.find(item => {
          for (const key in where) {
            if (item[key] !== where[key]) return false;
          }
          return true;
        });
        return found || data[0] || null;
      },
      create: async (args: any) => {
        const data = getModelData(modelName);
        const newObj = {
          id: Math.random().toString(36).substring(2, 11),
          created_at: new Date(),
          updated_at: new Date(),
          ...args.data
        };
        data.push(newObj);
        return newObj;
      },
      update: async (args: any) => {
        const data = getModelData(modelName);
        const where = args?.where || {};
        const idx = data.findIndex(item => {
          for (const key in where) {
            if (item[key] !== where[key]) return false;
          }
          return true;
        });
        if (idx !== -1) {
          data[idx] = {
            ...data[idx],
            ...args.data,
            updated_at: new Date()
          };
          return data[idx];
        }
        throw new Error(`Record not found to update in ${modelName}`);
      },
      delete: async (args: any) => {
        const data = getModelData(modelName);
        const where = args?.where || {};
        const idx = data.findIndex(item => {
          for (const key in where) {
            if (item[key] !== where[key]) return false;
          }
          return true;
        });
        if (idx !== -1) {
          const removed = data.splice(idx, 1)[0];
          return removed;
        }
        throw new Error(`Record not found to delete in ${modelName}`);
      },
      deleteMany: async (args?: any) => {
        const data = getModelData(modelName);
        const where = args?.where || {};
        let count = 0;
        for (let i = data.length - 1; i >= 0; i--) {
          const item = data[i];
          let matches = true;
          for (const key in where) {
            if (item[key] !== where[key]) {
              matches = false;
              break;
            }
          }
          if (matches) {
            data.splice(i, 1);
            count++;
          }
        }
        return { count };
      },
      count: async (args?: any) => {
        const data = await makeQueryMethods(modelName).findMany(args);
        return data.length;
      }
    };
  };

  return new Proxy({} as any, {
    get(target, prop) {
      if (typeof prop === 'string') {
        if (prop === '$disconnect' || prop === '$connect') {
          return async () => {};
        }
        return makeQueryMethods(prop);
      }
      return undefined;
    }
  }) as any;
}

function getDb(): PrismaClient {
  let cfEnv: any = null;
  let cfCtx: any = null;

  try {
    const context = getCloudflareContext();
    cfEnv = context.env;
    cfCtx = context.ctx;
  } catch (e) {
    // Ignore error - we might be in a non-Cloudflare environment (e.g. CLI, local dev)
  }

  // Use the context object as a key for caching to avoid "Cannot perform I/O" error on Cloudflare
  if (cfCtx) {
    if (clientsMap.has(cfCtx)) {
      return clientsMap.get(cfCtx)!;
    }
  } else if (globalPrisma) {
    return globalPrisma;
  }

  let url = cfEnv?.DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
  let authToken = cfEnv?.DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  console.log("[getDb DEBUG] cfEnv:", cfEnv);
  console.log("[getDb DEBUG] process.env.DATABASE_URL:", process.env.DATABASE_URL);
  console.log("[getDb DEBUG] Resolved url:", url);

  // Fallback to mock data if DATABASE_URL contains placeholder dummy domain or is not provided
  if (url.includes("dummy-db.turso.io") || !url) {
    console.warn("[getDb] Using mock database client fallback (dummy-db or empty URL)");
    const mockClient = createMockPrismaClient();
    if (cfCtx) {
      clientsMap.set(cfCtx, mockClient);
    } else {
      globalPrisma = mockClient;
    }
    return mockClient;
  }

  let client;
  if (url.startsWith("file:")) {
    // In Node.js (build/next dev), require the native client to support local SQLite files
    const { createClient: createNodeClient } = require("@libsql/client");
    client = createNodeClient({ url });
  } else {
    // In Cloudflare Worker or remote, use the web-compatible client
    const { createClient: createWebClient } = require("@libsql/client/web");
    client = createWebClient({ url, authToken });
  }

  const { PrismaLibSQL } = require("@prisma/adapter-libsql");
  const adapter = new PrismaLibSQL(client);
  const prismaClient = new PrismaClient({ adapter });

  // Wrap the real client in a proxy to catch connection timeouts or query errors gracefully
  const resilientClient = new Proxy(prismaClient, {
    get(target, prop) {
      if (typeof prop === "string" && !prop.startsWith("$")) {
        const modelMethods = (target as any)[prop];
        if (modelMethods) {
          return new Proxy(modelMethods, {
            get(methodsTarget, methodProp) {
              const originalMethod = (methodsTarget as any)[methodProp];
              if (typeof originalMethod === "function") {
                return async function (...args: any[]) {
                  try {
                    return await originalMethod.apply(methodsTarget, args);
                  } catch (err) {
                    console.error(`[Resilient DB] Database query failed for ${prop}.${String(methodProp)}:`, err);
                    console.warn(`[Resilient DB] Falling back to mock database client...`);
                    const mockClient = createMockPrismaClient();
                    const mockModelMethods = (mockClient as any)[prop];
                    if (mockModelMethods && typeof mockModelMethods[methodProp] === "function") {
                      return await mockModelMethods[methodProp].apply(mockModelMethods, args);
                    }
                    throw err;
                  }
                };
              }
              return originalMethod;
            }
          });
        }
      }
      const val = (target as any)[prop];
      if (typeof val === "function") {
        return val.bind(target);
      }
      return val;
    }
  });

  if (cfCtx) {
    clientsMap.set(cfCtx, resilientClient);
  } else {
    globalPrisma = resilientClient;
  }

  return resilientClient;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    const client = getDb();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
}) as PrismaClient;
