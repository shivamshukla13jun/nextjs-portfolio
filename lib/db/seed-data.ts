import type {
  Profile,
  Skill,
  Experience,
  Project,
  Education,
  Certification,
  Service,
  Blog,
  SiteSettings,
} from '../../types/portfolio.ts';

export const SEED_PROFILE: Profile = {
  name: 'Shivam Shukla',
  professionalTitle: 'MERN Stack Developer',
  email: 'shivam13jun@gmail.com',
  phone: '8459784241',
  location: 'Mumbai, Maharashtra, India',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  shortBio: 'MERN Stack Developer specializing in secure, high-scale Node.js, TypeScript, React, MongoDB, Redis, and RabbitMQ systems.',
  longBio:
    'As a MERN Stack Developer at Wing Global IT Service Ltd, I specialize in creating secure and scalable web solutions. My core strengths lie in advanced JavaScript, TypeScript, and Node.js, complemented by hands-on experience with React.js, Express.js, and MongoDB. I have a proven track record in optimizing performance using Redis, RabbitMQ, and Docker. Projects like FreightBooks and Safalam showcase my ability to deliver complex logistics and accounting systems. Formerly at Hands In Technology, I honed my skills in building robust REST APIs and backend modules. I am passionate about innovation and excellence in software development.',
  github: 'https://github.com/shivamshukla13jun',
  linkedin: 'https://www.linkedin.com/in/shivam-shukla-344973235?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  twitter: 'https://x.com/shivamshuk32451',
  website: 'https://nextjs-portfolio-seven-silk-44.vercel.app',
  yearsOfExperience: 4,
  availability: 'Available for Hire',
};

export const SEED_SKILLS: Skill[] = [
  // Backend & Core
  { id: 'sk-1', name: 'Node.js', category: 'Backend', proficiency: 96, yearsOfExperience: 4, featured: true },
  { id: 'sk-2', name: 'Express.js', category: 'Backend', proficiency: 94, yearsOfExperience: 4, featured: true },
  { id: 'sk-3', name: 'TypeScript', category: 'Backend', proficiency: 70, yearsOfExperience: 2, featured: true },
  { id: 'sk-4', name: 'REST APIs', category: 'Backend', proficiency: 96, yearsOfExperience: 4, featured: true },
  { id: 'sk-5', name: 'JavaScript (ES6+)', category: 'Backend', proficiency: 98, yearsOfExperience: 4, featured: true },

  // Frontend
  { id: 'sk-6', name: 'React.js', category: 'Frontend', proficiency: 93, yearsOfExperience: 3, featured: true },
  { id: 'sk-7', name: 'Redux / Redux Toolkit', category: 'Frontend', proficiency: 94, yearsOfExperience: 4, featured: true },
  { id: 'sk-8', name: 'TanStack Query', category: 'Frontend', proficiency: 88, yearsOfExperience: 2, featured: true },
  // Database
  { id: 'sk-10', name: 'MongoDB', category: 'Database', proficiency: 95, yearsOfExperience: 4, featured: true },

  // Messaging & Caching
  { id: 'sk-12', name: 'Redis', category: 'Messaging & Caching', proficiency: 90, yearsOfExperience: 3, featured: true },
  { id: 'sk-13', name: 'RabbitMQ', category: 'Messaging & Caching', proficiency: 88, yearsOfExperience: 2, featured: true },
  { id: 'sk-14', name: 'Socket.io', category: 'Messaging & Caching', proficiency: 88, yearsOfExperience: 2, featured: true },
  { id: 'sk-15', name: 'MQTT', category: 'Messaging & Caching', proficiency: 20, yearsOfExperience: 0.2, featured: true },

  // DevOps & Tools
  { id: 'sk-16', name: 'Docker', category: 'DevOps & Cloud', proficiency: 86, yearsOfExperience: 3, featured: true },
  { id: 'sk-17', name: 'Git', category: 'Tools & Architecture', proficiency: 94, yearsOfExperience: 4, featured: true },
];

export const SEED_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    company: 'Wing Global IT Service Ltd',
    position: 'MERN Stack Developer',
    startDate: 'Feb 2025',
    endDate: 'Present',
    current: true,
    location: 'Panchkula, Haryana, India',
    employmentType: 'Full-time',
    description:
      'Lead backend and full-stack development for mission-critical logistics, transport dispatch, and accounting platforms servicing enterprise clientele across international supply chains.',
    responsibilities: [
      'Develop secure and scalable REST APIs using Node.js, Express, and TypeScript.',
      'Implement Redis caching for performance optimization and latency reduction.',
      'Use RabbitMQ for background jobs and async workflows.',
      'Use MQTT for Location Tracking and real-time updates.',
      'Build logistics, dispatch,real estate,costructions and accounting systems.',
    ],
    technologies: ['Node.js', 'TypeScript', 'React.js', 'Express.js', 'MongoDB', 'Redis', 'RabbitMQ', 'Docker', 'MQTT'],
    achievements: [
      'Cut API response times by 42% across search and ledger queries by deploying intelligent Redis caching layer.',
      'Engineered zero-loss asynchronous queue processing handling 20,000+ daily dispatch transactions via RabbitMQ.',
      'Delivered FreightBooks accounting and invoice reconciliation module 2 weeks ahead of scheduled timeline.',
    ],
  },
  {
    id: 'exp-2',
    company: 'Hands In Technology',
    position: 'Node.js Developer',
    startDate: 'Aug 2022',
    endDate: 'Jan 2025',
    current: false,
    location: 'Mumbai, Maharashtra, India',
    employmentType: 'Full-time',
    description:
      'Engineered backend microservices, database schemas, and client-facing React web modules for high-throughput logistics tracking and freight dispatch SaaS.',
    responsibilities: [
      'Developed REST APIs and React modules for logistics web apps.',
      'Worked on logistics platform C3Express.',
      'Designed backend modules and MongoDB schemas.',
      'Integrated third-party courier partner APIs and automated webhook reconciliation engines.',
      'Optimized aggregation pipelines and indexes for real-time package tracking.',
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'REST APIs', 'Git'],
    achievements: [
      'Successfully architected and launched core API services for C3Express logistics management.',
      'Optimized MongoDB aggregation pipelines, decreasing shipment history report generation time from 8s to 650ms.',
      'Built reusable React components reducing frontend delivery time across partner sub-portals.',
    ],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'FreightBooks — Enterprise Transport Accounting & Logistics SaaS',
    slug: 'freightbooks-accounting-saas',
    shortDescription:
      'Enterprise transport accounting & logistics SaaS spanning 35+ microservice modules — load dispatch, carrier management, invoicing, chart of accounts, and AI-assisted reporting.',
    detailedDescription:
      'FreightBooks is a full-scale accounting and operations platform for trucking companies, built at Wing Global IT Services Pvt. Ltd. The backend is organized as feature-based microservice modules (loads, carriers, customers, invoices, bills, estimates, chart of accounts, journal entries, payments, taxes, reports, AI services) inside a single Express + MongoDB deployment. Every API payload is encrypted end-to-end with CryptoJS, background jobs run on BullMQ + Redis with RabbitMQ events, and PDF invoices/reports are rendered via Puppeteer + EJS. The CRM frontend is a React 19 + MUI 6 application with Redux Toolkit persisted to IndexedDB (encrypted), TanStack Query for server state, and granular role-based menu permissions for 5 roles: superadmin, admin, manager, dispatcher, and accountant.',
    problem:
      'Freight brokers and trucking companies juggled loads, carrier paperwork, invoicing, and double-entry accounting across disconnected spreadsheets — causing billing errors, missed payment reminders, and zero real-time P&L visibility.',
    solution:
      'Designed a modular microservices backend where each domain (loads, invoicing, payments, accounting) owns its routes/controllers/models, wired together through RabbitMQ events and BullMQ job queues, with an encrypted React CRM giving each role a scoped, permission-driven workspace.',
    features: [
      '35+ domain microservice modules auto-loaded under a single Express gateway',
      'Double-entry accounting: chart of accounts, journal entries, credit/debit notes, P&L & AR/AP reports',
      'Encrypted request/response pipeline (CryptoJS middleware on both API and CRM)',
      'BullMQ + Redis workers for invoice reminders, PDF generation, and report exports',
      'AI-assisted reporting & data services powered by OpenAI',
      'Granular RBAC — 5 roles with per-menu permissions, session + JWT auth',
      'Dispatcher board, carrier/vendor management, driver reports & SAFER ratings',
      'Excel/CSV import-export (ExcelJS, json2csv) and Puppeteer PDF invoicing',
    ],
    responsibilities: [
      'Architected the microservice module system and core accounting domain (invoices, journal entries, chart of accounts)',
      'Implemented BullMQ + Redis background workers and RabbitMQ event publishing',
      'Built the encrypted Axios layer and role-permission gating on the React CRM',
      'Designed Mongoose schemas, aggregation pipelines, and data migration scripts',
    ],
    technologies: [
      'Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'Mongoose', 'Redis', 'BullMQ', 'RabbitMQ',
      'Socket.IO', 'React 19', 'MUI 6', 'Redux Toolkit', 'TanStack Query', 'Puppeteer', 'EJS',
      'OpenAI', 'CryptoJS', 'JWT', 'Jenkins', 'PM2', 'Docker',
    ],
    liveUrl: 'https://freightbooks.net',
    images: [ ],
    architectureTree: `freightbooks-api/                 # Express + TypeScript backend
├── src/
│   ├── microservices/           # 35+ feature modules (own routes+controllers)
│   │   ├── accounts-services/   #   loads, invoices, payments, expenses
│   │   ├── ai-services/         #   OpenAI-powered insights
│   │   ├── auth-service/        #   session + JWT, login flows
│   │   ├── carrier-services/    #   carriers, drivers, vendor bills
│   │   ├── chart-accounts-services/
│   │   ├── journal-entry-services/
│   │   ├── load-services/  customer-services/  report-services/  ...
│   ├── config/{bullmq,rabbitmq,redis}/  # queue, broker & cache wiring
│   ├── models/                  # Mongoose schemas (+hooks, plugins)
│   ├── middlewares/             # auth, encryption, RBAC, errors
│   ├── routes/                  # root router auto-loads microservices
│   ├── services/fileStorage/    # uploads & document storage
│   ├── templates/emails/        # EJS email templates
│   └── migrations/ seeders/ scripts/ utils/
│
freightbooks-crm/                # React 19 + Vite + MUI 6 CRM
└── src/
    ├── pages/*-service/         # mirrors API modules (load-service,
    │                            #   invoice-service, report-service, ...)
    ├── components/              # shared tables, forms, file viewer
    ├── redux/ store/            # Redux Toolkit + encrypted IndexedDB persist
    ├── service/ hooks/ config/  # axios layer, permission hooks, API config
    └── routes/ types/ utils/`,
    flow: [
      'Superadmin configures subscription plans & account types; company admin onboards the organization',
      'Dispatchers create loads and assign carriers/drivers with pickup & delivery stops',
      'Load lifecycle events propagate via Socket.IO + RabbitMQ to dashboards and notifications',
      'Delivered loads generate invoices, bills, estimates, and credit/debit notes',
      'Payments are recorded and journal entries post automatically to the chart of accounts',
      'BullMQ workers send reminder emails, render PDFs, and roll up P&L / AR / AP reports',
    ],
    challenges: [
      'Maintaining double-entry accounting consistency across async queue-driven writes in MongoDB',
      'Encrypting every request/response payload without breaking file uploads and PDF streaming',
      'Keeping 35+ feature modules isolated yet shareable under one deployment unit',
    ],
    results: [
      'Unified dispatch + accounting in one platform, eliminating spreadsheet reconciliation',
      'Automated invoice reminders and PDF generation cut manual billing effort dramatically',
      'Role-scoped workspaces let companies safely delegate to dispatchers and accountants',
    ],
    startDate: 'Feb 2025',
    endDate: 'Aug 2026',
    featured: true,
    category: 'Enterprise SaaS · Logistics & Accounting',
  },
  {
    id: 'proj-2',
    name: 'MyTailor — Online Tailoring Platform',
    slug: 'mytailor-tailoring-platform',
    shortDescription:
      'End-to-end tailoring commerce platform — customer ordering app API with FCM push notifications plus an admin/executive CRM for catalog, orders, and staff operations.',
    detailedDescription:
      'TailorsMat is an on-demand tailoring & garment services platform built at Wing Global IT Services Pvt. Ltd. The Node.js + TypeScript API serves the customer-facing app with JWT auth, MongoDB data layer, Redis caching, RabbitMQ-driven notification pipelines, Socket.IO realtime order updates, Firebase FCM push, Twilio SMS, and scheduled cron jobs. The companion CRM (React 19 + Vite + Tailwind + Radix UI) gives admins and executives full control over products, orders, users, and CSV bulk imports.',
    problem:
      'Local tailoring businesses had no digital pipeline — orders, measurements, fabric choices, and delivery commitments lived on paper, with no customer notifications or staff accountability.',
    solution:
      'Built a realtime order-management backend with event-driven notifications (RabbitMQ → FCM/Twilio/Socket.IO) and a role-split CRM (admin vs executive) so staff can manage catalogs, track orders, and communicate status changes instantly.',
    features: [
      'Realtime order status updates via Socket.IO + FCM push (Firebase Admin)',
      'CSV import with image attachments',
      'RabbitMQ notification pipeline + Twilio SMS fallback',
      'Redis caching & node-cron scheduled jobs for reminders and housekeeping',
      'Swagger-documented REST API with Joi/express-validator validation',
      'CRM with admin & executive workspaces, CSV imports (Papa Parse), ZIP exports',
      'QR-code app download distribution and EJS-rendered transactional emails',
    ],
    responsibilities: [
      'Designed the Express + Mongoose layered architecture (routes → controllers → services → models)',
      'Implemented RabbitMQ publishers/consumers and the notification-services module',
      'Built Firebase Admin FCM token management, seeders, and token cleanup scripts',
      'Developed CRM pages for admin/executive roles with axios service layer',
    ],
    technologies: [
      'Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'Mongoose', 'Redis', 'RabbitMQ',
      'Socket.IO', 'Firebase FCM', 'Twilio', 'JWT', 'Swagger', 'node-cron', 'Multer',
      'React 19', 'Vite', 'Tailwind CSS', 'Radix UI', 'Axios', 'PM2',
    ],
    images: [
      'https://play-lh.googleusercontent.com/BjMOZ7c-sjY1VBjMu-mP_9xyKi9ScIh7cjpjJFr6VdAb23XRetTzvpQF2FltqyAM80r7TqS0YFLCBaqLZ-Lnjg=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/jX7QfhtcNjrVma8OilT53_BGl8TEpXOSJfBbTRq1_TNtOwX06IBrV6h0FHHWnyvm-6dpTJ98r0VXgA1jWyDa=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/pFiSfEpQKsAc4vxvzzUj8lo4D5juLjSrs4BxHQtHzqlo3tg4xHzNyKMY7xsV6owaEav8PaDWHEZ1jDS53IK1Gg=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/TuqS4JUxXvxVXCRY9A57FCMFnSFPBYbimEciXpK7_Wf6vIQ2z4oVNZ71WnCPChDsqXm9itVh1jvBNnPDqXHkpMA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/p4eATndrdESleUIA7CJ8uzmioWRJ8hGXIEKZSyH8nV_XP-pvYYmCxXMbAV3ngHYB6CK2PE9ziKxOn01lGZ6h1Q=w2560-h1440-rw'
    ],
    architectureTree: `mytailor-api/                    # Express + TypeScript API
├── src/
│   ├── config/{rabbitmq,redis}/   # broker & cache connections
│   ├── controllers/  routes/      # HTTP layer
│   ├── services/
│   │   └── notification-services/ # FCM push, SMS, socket emitters
│   ├── models/                    # Mongoose schemas (+plugins, shared)
│   ├── middlewares/               # auth, validation, uploads
│   ├── cronjobs/                  # scheduled jobs (node-cron)
│   ├── swagger/ docs/             # OpenAPI documentation
│   ├── seeders/                   # admin/user/product seeding
│   └── helpers/ utils/ types/ shared/
│
mytailor-crm/                    # React 19 + Vite + Tailwind CRM
└── src/
    ├── pages/{admin,executive}/   # role-split workspaces
    ├── components/{ui,layout}/    # Radix/shadcn-style UI kit
    ├── service/  context/  lib/   # axios layer & session context
    └── assets/ util/`,
    flow: [
      'Customer browses catalog & places a tailoring order with measurements via the app',
      'API validates, persists the order, and publishes an event to RabbitMQ',
      'Notification services fan out FCM push + Twilio SMS + Socket.IO status updates',
      'Admin/executive staff process the order in the CRM (assign, stitch, QC, dispatch)',
      'Cron jobs handle reminders, token cleanup, and scheduled housekeeping',
    ],
    challenges: [
      'Coordinating multi-channel notifications (FCM, SMS, sockets) without duplicate sends',
      'Managing FCM token lifecycles across reinstalls and multi-device users',
      'CSV import with image attachments With large Content Handle From changing nginx configurations',
    ],
    results: [
      'Digitized the full order-to-delivery pipeline for tailoring operations',
      'Realtime status updates removed manual "order status" phone calls',
      'Scalable architecture handles high traffic during peak seasons',
    ],
    startDate: 'Jun 2026',
    endDate: 'Aug 2026',
    featured: true,
    liveUrl: 'https://play.google.com/store/apps/details?id=com.tailor.detail.tailor&pcampaignid=web_share',
    category: 'Commerce · On-Demand Services',
  },
  {
    id: 'proj-3',
    name: 'Docks2Doc — Freight Visibility & Documentation Platform',
    slug: 'docks2doc-freight-platform',
    shortDescription:
      'Multi-tenant freight platform with an 8-step load lifecycle, MQTT real-time GPS tracking, document center, and Stripe-billed subscriptions — Next.js 15 frontend + Express/MongoDB backend.',
    detailedDescription:
      'Docks2Doc is a freight visibility and document-management platform built at Wing Global IT Services Pvt. Ltd. The Next.js 15 (App Router) + Tailwind v4 frontend implements a role-aware shell for 6 personas — Super Admin, Carrier Corporate/Branch, Broker Corporate/Branch, and Shipper/Receiver — with a signature LoadRail component driving the 8-step load lifecycle. The Express + MongoDB backend enforces branch-scoped RBAC, streams driver GPS over MQTT, runs BullMQ workers on Redis, stores documents in MinIO, geofences with Turf.js, and bills subscriptions via Stripe.',
    problem:
      'Brokers, carriers, and shippers each worked in silos — load status lived in phone calls, POD documents in email threads, and there was no shared real-time view of freight in transit.',
    solution:
      'Built a multi-tenant platform where a single 8-step lifecycle (draft → tendered → assigned → pickup → in-transit → delivered → invoiced → reviewed) is shared across roles, with MQTT location streaming, geofenced auto-status, and a per-branch scoped document center.',
    features: [
      '8-step load lifecycle with branch-scope isolation across corporate hierarchies',
      'MQTT real-time GPS tracking + Turf.js geofencing/geospatial math',
      'Document center backed by MinIO object storage',
      'Stripe subscription plans & billing per company',
      'BullMQ + Redis background jobs; Firebase + Twilio notifications',
      'Reviews, notifications, and role-aware dashboards (Recharts)',
      'Leaflet maps, TanStack Table grids, RHF + Zod validated forms',
    ],
    responsibilities: [
      'Built the lifecycle engine (advance/trigger-arrival transitions) and RBAC + applyScope middleware',
      'Implemented MQTT ingestion service piping driver locations into Mongo + frontend map',
      'Designed Mongoose models for companies, branches, users, drivers, loads, invoices, reviews',
      'Developed Next.js app-router screens, mock/seed layer, and Redux session store',
    ],
    technologies: [
      'Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Redux Toolkit', 'TanStack Table',
      'Leaflet', 'MQTT', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'BullMQ', 'Redis',
      'MinIO', 'Stripe', 'Turf.js', 'Firebase Admin', 'Twilio', 'Zod', 'Docker',
    ],
    images: [ ],
    architectureTree: `docs2docs/
├── backend/                     # Express + MongoDB API
│   ├── src/
│   │   ├── models/              # Company, Branch, User, Driver,
│   │   │                        #   Equipment, Load, Invoice, Review
│   │   ├── controllers/ routes/ # per-resource REST + lifecycle endpoints
│   │   ├── middleware/          # JWT auth, asyncHandler, errorHandler
│   │   ├── tracking/            # MQTT ingest → GPS pipeline
│   │   ├── utils/  utils/geo/   # lifecycle, RBAC, applyScope, Turf geo
│   │   ├── schemas/  seed/      # zod validators, demo data seeder
│   │   └── views/               # EJS partials
│   └── mosquitto/  docker-compose.yml   # MQTT broker + stack
│
└── frontend/                    # Next.js 15 App Router
    ├── app/(auth)/login         # sign-in + workspace panel
    ├── app/(platform)/          # dashboard, loads, drivers,
    │                            #   invoices, admin/*
    ├── components/{shell,loads,documents,data,ui}
    ├── lib/{rbac,lifecycle,api,geo,store}
    └── types/                   # shared domain types`,
    flow: [
      'Company registers → picks carrier/broker/shipper type → Stripe subscription activated',
      'Shipper/broker creates an order (Draft) and tenders it to a carrier',
      'Carrier assigns a branch driver; driver app streams GPS over MQTT',
      'Load advances through pickup → in-transit → delivery with check-in/out events',
      'POD documents upload to MinIO; invoice generates; parties leave reviews',
      'Every query is branch-scope filtered so each tenant sees only its own data',
    ],
    challenges: [
      'Enforcing branch-level data isolation uniformly across every controller',
      'Reconciling bursty MQTT GPS packets into clean lifecycle state transitions',
    ],
    results: [
      'Single shared source of truth for all 6 freight personas',
      'Real-time tracking + document center replaced phone/email status chasing',
    ],
    startDate: 'Aug 2025',
    endDate: 'Present',
    featured: true,
    category: 'Logistics · Real-Time Platform',
  },
  {
    id: 'proj-4',
    name: 'Safalam CRM — Field Sales & Service Management',
    slug: 'safalam-field-crm',
    shortDescription:
      'Role & department-scoped CRM for field operations — task assignment, follow-ups, walking-customer capture with camera/EXIF geo, payments, subscriptions, and encrypted offline persistence.',
    detailedDescription:
      'Safalam CRM is a field-operations management system built at Wing Global IT Services Pvt. Ltd. The React 18 + MUI frontend uses Redux Toolkit with encrypted IndexedDB persistence (redux-persist + CryptoJS) so field staff keep working offline, TanStack Query for server sync, React Hook Form + Yup for validated entry, Recharts dashboards, xlsx exports, and react-camera-pro for on-site photo capture with EXIF geodata. The backend is an Express + Sequelize + MySQL API with JWT auth and dual RBAC — roles (Super Admin, Admin, Executive, Manager) plus departments (Sales, Field) controlling record visibility.',
    problem:
      'Field sales teams had no accountable system — customer visits, follow-ups, and collections were tracked in notebooks, and management had zero visibility into who visited whom and when.',
    solution:
      'Built a CRM where admins assign tasks per department, field executives capture visits with camera + geo proof, follow-ups and payments are logged against customers, and dashboards report activity per person, per department.',
    features: [
      'Dual access control — role-based (Super Admin/Admin/Executive/Manager) + department-based (Sales/Field)',
      'Task assignment & tracking scoped to the assigned salesperson/field agent',
      'Walking-customer capture with device camera + EXIF location verification',
      'Follow-ups, payments, and subscription management modules',
      'Encrypted offline-first state (redux-persist + IndexedDB + CryptoJS)',
      'Recharts analytics, xlsx exports, PDF generation (@react-pdf/renderer)',
    ],
    responsibilities: [
      'Built the Redux Toolkit + encrypted-persist store architecture for offline-capable sessions',
      'Implemented task, follow-up, payment, and walking-customer modules end-to-end',
      'Integrated react-camera-pro photo capture with EXIF geo extraction',
      'Designed Sequelize/MySQL models and JWT-protected REST endpoints',
    ],
    technologies: [
      'React 18', 'MUI 5', 'Redux Toolkit', 'Redux Persist', 'TanStack Query', 'React Hook Form',
      'Yup', 'Recharts', 'CryptoJS', 'react-camera-pro', 'xlsx', 'Node.js', 'Express.js',
      'Sequelize', 'MySQL', 'JWT',
    ],
    images: [],
    architectureTree: `safalam-crm/                     # React 18 (CRA) + MUI 5
└── src/
    ├── components/
    │   ├── auth/                  # login, guards
    │   ├── dashboard/             # role-aware analytics (Recharts)
    │   ├── tasks/  FollowUps/     # assignment & visit pipelines
    │   ├── WalkingCustomers/      # camera + EXIF geo capture
    │   ├── payments/  Subscription/
    │   ├── reports/  users/  common/
    ├── redux/slices/              # Redux Toolkit feature slices
    │                            #   (encrypted → IndexedDB persist)
    ├── services/                  # axios API layer
    ├── hooks/  data/  utils/ styles/`,
    flow: [
      'Admin creates users with role + department; managers assign tasks to agents',
      'Field executives see only their assigned tasks; sales see theirs',
      'On-site visits captured with camera photo + EXIF geolocation proof',
      'Follow-ups logged per customer; payments & subscriptions recorded',
      'Dashboards & reports aggregate per-person and per-department performance',
    ],
    challenges: [
      'Keeping encrypted persisted state in sync with the server without leaking stale data',
      'Extracting reliable geo proof from device EXIF data across browsers',
    ],
    results: [
      'Full audit trail of field visits with photo + location evidence',
      'Department-scoped visibility enforced across every module',
    ],
    startDate: 'Aug 2025',
    endDate: 'Feb 2026',
    featured: false,
    category: 'CRM · Field Operations',
    liveUrl: 'https://crm.safalam.com',
  },
  {
    id: 'proj-5',
    name: 'iTruck Dispatch (ITD) — Real-Time Truck Tracking API',
    slug: 'itruck-dispatch-tracking',
    shortDescription:
      'Real-time truck tracking & load-management backend — Socket.IO GPS streaming, SAFER/FMCSA carrier lookup by DOT, multi-carrier drivers, and check-in/out load execution.',
    detailedDescription:
      'iTruck Dispatch is the backend for a real-time trucking platform built at Wing Global IT Services Pvt. Ltd. It manages the full load lifecycle — creation with per-stop remarks and reference contacts, carrier verification via DOT number through the FMCSA SAFER service, drivers assignable to multiple carriers, and execution tracking with check-in/check-out timestamps at every pickup and delivery. Socket.IO streams live truck positions, Firebase Admin sends FCM pushes, RabbitMQ and Redis back the event and cache layers, and node-cron workers run schedulers — with a built-in movement simulator and auto-generated Swagger docs.',
    problem:
      'Dispatch operations could not see where trucks were in real time, could not verify carriers reliably, and had no timestamped proof of pickup/delivery events for disputes.',
    solution:
      'Built an event-driven API where driver devices stream GPS over Socket.IO into Redis-cached live state, SAFER lookups validate carriers by DOT, and every stop records check-in/check-out telemetry visible to admins, dispatchers, and carriers alike.',
    features: [
      'Live GPS streaming over Socket.IO with Redis-cached fleet state',
      'FMCSA SAFER integration — carrier onboarding & verification by DOT number',
      'Drivers assignable to multiple carriers; carriers can activate/deactivate drivers',
      'Per-stop check-in/check-out with remarks, visible to all relevant parties',
      'Load cancellation workflow (dispatcher / carrier / admin)',
      'Truck movement simulator + schedulers for testing and no-show detection',
      'Auto-generated Swagger docs, EJS email templates, FCM push notifications',
    ],
    responsibilities: [
      'Designed the load lifecycle schema (pickup/delivery stops, check-in/out, cancellation rules)',
      'Implemented Socket.IO location ingestion and the workers/schedulers layer',
      'Integrated the SAFER carrier service and Firebase Admin push pipeline',
      'Wrote simulation tooling and scripts for data seeding & index maintenance',
    ],
    technologies: [
      'Node.js', 'TypeScript', 'Express.js', 'MongoDB', 'Mongoose', 'Socket.IO', 'Redis',
      'RabbitMQ', 'Firebase Admin (FCM)', 'node-cron', 'Joi', 'Multer', 'Swagger', 'EJS', 'PM2',
    ],
    images: [
      'https://play-lh.googleusercontent.com/H32QubITRw1tTx5CBBGASsZehNecG3IC0S_EhkWstSfkdhbVt4wV5TyF7ps8tbFClVXu-JQQnnUD_MkZ50WExA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/8Nq4onh5Cg0ZitoVisyuYDKRoAYzTTY5uR9O64LSJY1qRtQ3-tu7bvylJB_6-SpGuxzAGvYLt5UO801eXeOeKA=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/5gqMFZnlWIHhXlv3jmGo3LEdT2trf3qQikkTEqR2kfTeuMShGcbq3nnQ1WzVyORuPPm_b2MRksM16dkD0Ohz5w=w2560-h1440-rw',
      'https://play-lh.googleusercontent.com/HNoitPoa0MjuySMLYuhLP9CEEqrs59KlnUHwKB3L4CQFRicmIIfqATR94msEHdlrIF9WuiYSYFJ4mFNMHSAVirE=w2560-h1440-rw'
    ],
    architectureTree: `itd-api/                         # Express + TypeScript API
├── src/
│   ├── controllers/ routes/       # load, carrier, driver, auth REST
│   ├── socket/                    # Socket.IO GPS ingest + broadcast
│   ├── services/
│   │   ├── notification-services/ # FCM push pipeline
│   │   └── safer-service/         # FMCSA SAFER carrier lookups (DOT)
│   ├── workers/schedulers/        # cron-driven jobs (node-cron)
│   ├── simulation/                # truck movement simulator
│   ├── models/  Schema/           # Mongoose schemas + Joi validators
│   ├── config/{rabbitmq,redis}/   # broker & cache wiring
│   ├── middleware/ helpers/ utils/
│   ├── docs/  seeders/  scripts/  # Swagger gen + data tooling
│   └── test/                      # location update & cache tests
├── templates/  views/             # EJS email/HTML templates
└── uploads/  public/  logs/`,
    flow: [
      'Admin creates a load with numbered pickup/delivery stops + remarks',
      'Carrier is fetched & verified by DOT number via the SAFER service',
      'Carrier assigns a driver (drivers may serve multiple carriers)',
      'Driver app streams GPS over Socket.IO; check-in/out recorded per stop',
      'Load completes or is cancelled by dispatcher, carrier, or admin — fully audited',
    ],
    challenges: [
      'Scaling Socket.IO location ingest while keeping the live fleet map consistent',
      'Handling drivers shared across carriers without breaking load ownership rules',
    ],
    results: [
      'End-to-end timestamped pickup/delivery audit trail for every load',
      'Carrier verification by DOT removed manual paperwork checks',
    ],
    startDate: 'Feb 2026',
    endDate: 'Aug 2026',
    featured: true,
    category: 'Logistics · Real-Time Tracking',
    liveUrl:"https://play.google.com/store/apps/details?id=com.itruck.itd&pcampaignid=web_share"
  },
  {
    id: 'proj-6',
    name: 'Shrees SSO — Job Portal & Community Platform',
    slug: 'shrees-sso-job-portal',
    shortDescription:
      'Multi-platform community portal spanning matrimony, networking, and jobs — owned the complete Job module end-to-end under a single sign-on umbrella.',
    detailedDescription:
      'Shrees SSO is a community platform hosting multiple sub-platforms — matrimony, networking, and a job portal — behind one shared single sign-on account. I built the Job module end-to-end: employers post openings and manage applicants, job seekers build profiles, search and filter listings, and apply — all tied to the shared SSO identity so one account works across every sub-platform.',
    problem:
      'Community members needed jobs, matrimony, and networking in one place, but maintaining separate accounts and siloed flows per platform created friction and drop-off.',
    solution:
      'Built the Job portal module on top of the shared SSO identity — employers get posting & applicant pipelines, seekers get profiles, search, and one-click apply — all without a second login.',
    features: [
      'Single sign-on identity shared across matrimony, networking, and jobs sub-platforms',
      'Employer job posting, listing management, and applicant tracking',
      'Job seeker profiles with search & filtered discovery',
      'Application pipeline with status tracking for both sides',
      'Role-aware dashboards for employers vs job seekers',
    ],
    responsibilities: [
      'Owned the entire Job module — schema design, REST APIs, and UI flows',
      'Integrated job flows with the platform-wide SSO session',
      'Built employer posting/management screens and applicant pipeline',
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'JWT', 'REST APIs'],
    liveUrl: 'https://shreesso.org/JobSection',
    images: [ ],
    flow: [
      'User signs in once via SSO — same session works across all sub-platforms',
      'Employer posts a job; seekers discover it via search & filters',
      'Seeker applies with their shared profile; employer reviews applicants',
      'Application status updates flow back to the seeker dashboard',
    ],
    challenges: [
      'Designing the job module to share auth/session with unrelated sub-platforms without coupling their data',
    ],
    results: [
      'Shipped a fully working jobs vertical inside an existing multi-platform portal',
    ],
    startDate: '2023',
    endDate: '2024',
    featured: false,
    category: 'Community Platform · Job Portal',
  },
  {
    id: 'proj-7',
    name: 'C3Xpress — Courier Dispatch & Carrier Platform',
    slug: 'c3xpress-carrier-platform',
    shortDescription:
      'Courier dispatch & load-management platform — same architecture family as iTruck Dispatch, extended with dedicated carrier and customer modules backed by third-party carrier data.',
    detailedDescription:
      'C3Xpress is a courier dispatch and load-management platform sharing the same architectural foundation as iTruck — Express + MongoDB REST APIs, realtime updates, role-based operations — extended with full carrier and customer verticals. I built the carrier and customer modules and wired carrier onboarding/verification to a third-party data service so carrier records (authority, safety, contact data) are pulled and synced automatically instead of being entered by hand.',
    problem:
      'Dispatch teams were onboarding carriers by hand — typing authority, insurance, and contact details — which was slow, error-prone, and impossible to verify.',
    solution:
      'Built carrier and customer modules that integrate with a third-party carrier data provider: enter a carrier identifier, pull verified company/authority data, and sync it into the dispatch workflow automatically.',
    features: [
      'Dedicated carrier module — onboarding, verification, and profile management',
      'Third-party carrier data integration for authority/company details',
      'Customer module with load history and account management',
      'Dispatch workflows consistent with the iTruck load lifecycle',
      'REST API architecture with role-based access',
    ],
    responsibilities: [
      'Built the carrier module end-to-end including third-party data integration',
      'Built the customer module — accounts, load history, management screens',
      'Reused and extended the shared dispatch/load architecture',
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'REST APIs', 'Third-Party Integrations'],
    liveUrl: 'https://www.c3xpress.com/',
    images: [ ],
    flow: [
      'Dispatcher registers a carrier using its identifier',
      'Verified carrier data is pulled from the third-party service and stored locally',
      'Customer accounts manage their loads, history, and contacts',
      'Dispatch assigns loads to verified carriers through the shared lifecycle',
    ],
    challenges: [
      'Normalizing third-party carrier payloads into the internal schema and handling missing/stale fields',
    ],
    results: [
      'Carrier onboarding reduced from manual data entry to an automated lookup',
    ],
    startDate: '2023',
    endDate: '2024',
    featured: false,
    category: 'Logistics · Dispatch Platform',
  },
  {
    id: 'proj-8',
    name: 'Last Minute Policy — Insurance Purchase & Support Platform',
    slug: 'last-minute-policy-platform',
    shortDescription:
      'Insurance purchase platform — built the real-time chat support module (Socket.IO), the policy purchase flow, and admin panel sections as part of a 5-person team.',
    detailedDescription:
      'Last Minute Policy is an insurance platform where customers browse and buy policies at short notice. Working in a 5-person team, I owned the real-time chat support module — customer ↔ agent conversations over Socket.IO — the end-to-end policy purchase flow, and several admin panel sections covering policy and support management.',
    problem:
      'Customers buying time-sensitive policies needed instant human support, and the purchase funnel had to be fast and unambiguous — a dropped chat or confusing checkout meant a lost sale.',
    solution:
      'Implemented Socket.IO-based realtime chat connecting customers to support agents inside the purchase flow, plus a streamlined multi-step policy purchase journey and admin tooling for managing policies and conversations.',
    features: [
      'Real-time customer–agent chat built on Socket.IO',
      'End-to-end policy purchase flow — selection, details, payment, confirmation',
      'Admin panel sections for policy and support management',
      'Chat history and conversation state persistence',
    ],
    responsibilities: [
      'Owned the chat support module — Socket.IO rooms, events, and UI',
      'Built the policy purchase section of the customer journey',
      'Delivered admin panel screens for policy & support operations',
    ],
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'Socket.IO', 'JWT'],
    images: [ ],
    flow: [
      'Customer browses policies and selects a plan',
      'Guided purchase flow collects details and completes payment',
      'Any friction point opens a realtime Socket.IO chat with a support agent',
      'Admins manage policies, conversations, and operations from the panel',
    ],
    challenges: [
      'Keeping chat state reliable across reconnects mid-purchase',
      'Coordinating module boundaries within a 5-person team codebase',
    ],
    results: [
      'Realtime in-funnel support reduced purchase abandonment',
    ],
    startDate: '2023',
    endDate: '2024',
    featured: false,
    category: 'Insurance · Customer Support',
  },
];

export const SEED_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    institution: 'SN College, Mumbai University',
    degree: 'Bachelor of Science (B.Sc)',
    fieldOfStudy: 'Information Technology',
    startDate: '2019',
    endDate: '2021',
    grade: 'First Class',
    activities: 'Software Engineering Project Lead',
  },
];

export const SEED_CERTIFICATIONS: Certification[] = [];

export const SEED_SERVICES: Service[] = [];

export const SEED_BLOGS: Blog[] = [];

export const SEED_SETTINGS: SiteSettings = {
  siteTitle: 'Shivam Shukla | MERN Stack Developer Portfolio & Resume',
  metaDescription:
    'MERN Stack Developer specializing in Node.js, TypeScript, React, MongoDB, Redis, RabbitMQ, and Docker in Mumbai, India.',
  primaryColor: '#2563eb',
  enableBlog: true,
  enableServices: true,
  enableCertifications: true,
  heroHeadline: 'Building Secure, Scalable Web Systems & High-Throughput APIs',
  heroSubheadline:
    'MERN Stack Developer at Wing Global IT Service Ltd specializing in Node.js, TypeScript, React, MongoDB, Redis, and RabbitMQ.',
};
