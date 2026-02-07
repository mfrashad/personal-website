export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    tags?: string[];
}

export const startupAiTechStack: ResourceItem[] = [
    {
        name: 'Convex',
        description: 'Open-source reactive backend with real-time sync. TypeScript-first with auto-generated APIs, built-in auth, and cron jobs. Queries run directly in the database with no cache invalidation needed.',
        url: 'https://convex.dev/',
        tags: ['Backend', 'Database'],
    },
    {
        name: 'Supabase',
        description: 'Open-source Firebase alternative built on Postgres. Includes auth, real-time subscriptions, storage, and edge functions. Self-hostable with predictable pricing.',
        url: 'https://supabase.com/',
        tags: ['Backend', 'Database'],
    },
    {
        name: 'Trigger.dev',
        description: 'Open-source background jobs platform for TypeScript. Handles long-running AI workflows, retries, queues, and human-in-the-loop approvals. No timeouts.',
        url: 'https://trigger.dev/',
        tags: ['Backend', 'Jobs'],
    },
    {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework for rapid UI development. Build custom designs without leaving your HTML. Industry standard for modern web apps.',
        url: 'https://tailwindcss.com/',
        tags: ['Frontend', 'CSS'],
    },
    {
        name: 'shadcn/ui',
        description: 'Copy-paste React components built with Radix UI and Tailwind. Full code ownership, WCAG compliant, and works perfectly with AI coding tools. 100k+ GitHub stars.',
        url: 'https://ui.shadcn.com/',
        tags: ['Frontend', 'Components'],
    },
    {
        name: '21st.dev',
        description: 'AI-powered UI component library with 400k+ components. Browse, publish, and remix components with code previews. CLI integration via npx for easy installation.',
        url: 'https://21st.dev/',
        tags: ['Frontend', 'AI'],
    },
    {
        name: 'PostHog',
        description: 'Open-source product analytics with session replay, feature flags, A/B testing, and surveys. Generous free tier. All-in-one platform for product teams.',
        url: 'https://posthog.com/',
        tags: ['Analytics', 'Product'],
    },
    {
        name: 'Knock',
        description: 'Notification infrastructure for cross-channel messaging. Single API for email, SMS, push, Slack, and in-app. Version-controlled templates with CLI support.',
        url: 'https://knock.app/',
        tags: ['Notifications', 'Infrastructure'],
    },
    {
        name: 'Sentry',
        description: 'Application monitoring and error tracking. Real-time crash reporting with stack traces, performance monitoring, and release tracking. Essential for production apps.',
        url: 'https://sentry.io/',
        tags: ['Monitoring', 'Errors'],
    },
    {
        name: 'Autumn',
        description: 'Open-source pricing and billing platform built on Stripe. Handles checkouts, subscriptions, usage tracking, and paywalls. Three-step payment with no webhooks needed.',
        url: 'https://useautumn.com/',
        tags: ['Billing', 'Payments'],
    },
    {
        name: 'Stripe',
        description: 'Payment infrastructure for the internet. Handles payments, subscriptions, invoicing, and financial reporting. Industry standard for SaaS billing.',
        url: 'https://stripe.com/',
        tags: ['Payments', 'Infrastructure'],
    },
    {
        name: 'Firebase',
        description: 'Google\'s app development platform. Real-time database, authentication, hosting, cloud functions, and analytics. Great for rapid prototyping and MVPs.',
        url: 'https://firebase.google.com/',
        tags: ['Backend', 'Google'],
    },
    {
        name: 'Clerk',
        description: 'Complete authentication and user management. Drop-in UI components, flexible APIs, and admin dashboards. Free for first 50k monthly users. HIPAA compliant.',
        url: 'https://clerk.com/',
        tags: ['Auth', 'Users'],
    },
    {
        name: 'Resend',
        description: 'Email API built for developers. Modern REST API with React Email integration for beautiful templates. SDKs for Node.js, Python, Go, and more.',
        url: 'https://resend.com/',
        tags: ['Email', 'API'],
    },
    {
        name: 'Bun',
        description: 'All-in-one JavaScript runtime, bundler, test runner, and package manager. 10-30% less memory than Node.js. Built-in database clients and zero-config frontend dev.',
        url: 'https://bun.sh/',
        tags: ['Runtime', 'Tooling'],
    },
    {
        name: 'Vercel',
        description: 'Frontend cloud platform for deploying web applications. Zero-config deployments, edge functions, and analytics. Created Next.js and the AI SDK.',
        url: 'https://vercel.com/',
        tags: ['Deployment', 'Hosting'],
    },
    {
        name: 'next-forge',
        description: 'Production-grade Turborepo template for Next.js by Vercel. Includes auth, database, payments, docs, blog, analytics, emails, and feature flags out of the box.',
        url: 'https://next-forge.com/',
        tags: ['Starter', 'Next.js'],
    },
    {
        name: 'Vercel AI SDK',
        description: 'TypeScript toolkit for building AI apps with 20M+ monthly downloads. Unified API for OpenAI, Anthropic, Google. Agent abstraction, streaming UI, and structured outputs.',
        url: 'https://ai-sdk.dev/',
        tags: ['AI', 'SDK'],
    },
    {
        name: 'Mobbin',
        description: 'World\'s largest UI/UX design reference library with 400k+ screenshots. Search by screens, UI elements, flows, or text. Figma integration for direct copying.',
        url: 'https://mobbin.com/',
        tags: ['Design', 'Reference'],
    },
    {
        name: 'Intercom',
        description: 'AI-first customer service platform. Live chat, help center, and AI agent for support automation. Used by 25k+ businesses for customer engagement.',
        url: 'https://intercom.com/',
        tags: ['Support', 'Chat'],
    },
    {
        name: 'Expo',
        description: 'Production-grade React Native framework. File-based routing, OTA updates, and one-click deployments. 94% of cross-platform apps use React Native.',
        url: 'https://expo.dev/',
        tags: ['Mobile', 'React Native'],
    },
    {
        name: 'RevenueCat',
        description: 'Cross-platform subscription infrastructure for mobile apps. Handles iOS, Android, and web subscriptions from one codebase. Analytics for MRR, churn, and LTV.',
        url: 'https://revenuecat.com/',
        tags: ['Mobile', 'Subscriptions'],
    },
];
