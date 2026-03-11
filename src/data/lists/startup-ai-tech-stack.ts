export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const startupAiTechStack: ResourceItem[] = [
    {
        name: 'Convex',
        description: 'Open-source reactive backend-as-a-service with real-time sync. TypeScript-first with auto-generated APIs, built-in auth, and cron jobs. Went open-source in Feb 2025, now self-hostable with Postgres/MySQL/SQLite. Higher learning curve than Firebase or Supabase, but best DX once you learn it \u2014 AI-native and you\'re less likely to hit walls that force refactoring as your app grows. Queries run directly in the database with no cache invalidation needed.',
        url: 'https://convex.dev/',
        tags: ['Backend', 'Database'],
    },
    {
        name: 'Supabase',
        description: 'Open-source Firebase alternative built on Postgres. Best quick-to-setup backend when vibecoding or prototyping \u2014 get auth, real-time subscriptions, storage, and edge functions running in minutes. Self-hostable with predictable pricing. Great for MVPs and hackathons where speed matters most.',
        url: 'https://supabase.com/',
        tags: ['Backend', 'Database'],
    },
    {
        name: 'Trigger.dev',
        description: 'Open-source durable workflow and background jobs platform for TypeScript. Handles long-running AI workflows, retries, queues, and human-in-the-loop approvals with no timeouts. Better experience than Inngest in practice \u2014 excels at tasks like video processing and multi-step AI pipelines. Pay-as-you-go model. V3 brought major improvements though migration from V2 had some pain points.',
        url: 'https://trigger.dev/',
        tags: ['Backend', 'Jobs'],
    },
    {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework and the industry standard for modern web apps. Perfect for AI-assisted coding \u2014 LLMs generate Tailwind classes reliably since the patterns are consistent and well-represented in training data. Build custom designs without leaving your HTML.',
        url: 'https://tailwindcss.com/',
        tags: ['Frontend', 'CSS'],
    },
    {
        name: 'shadcn/ui',
        description: 'Copy-paste React components built with Radix UI and Tailwind CSS. Perfect for AI coding and shipping fast \u2014 full code ownership, WCAG compliant, and LLMs know the patterns well. 100k+ GitHub stars. The trade-off: your app might look like dozens of other startups unless you customize the theme.',
        url: 'https://ui.shadcn.com/',
        tags: ['Frontend', 'Components'],
    },
    {
        name: '21st.dev',
        description: 'Copy-paste library of fancy animated React components. Browse, publish, and remix components with live code previews. CLI integration via npx for easy installation. Great for when you need polished, eye-catching UI elements beyond what shadcn/ui offers out of the box.',
        url: 'https://21st.dev/',
        tags: ['Frontend', 'Components'],
    },
    {
        name: 'PostHog',
        description: 'Open-source all-in-one product analytics with session replay, feature flags, A/B testing, and surveys. Better DX than Mixpanel \u2014 everything in one platform instead of juggling multiple tools. Generous free tier: 1M events, 5K session recordings, and more per month. Over 90% of companies use PostHog for free.',
        url: 'https://posthog.com/',
        tags: ['Analytics', 'Product'],
    },
    {
        name: 'Knock',
        description: 'Notification infrastructure for cross-channel messaging \u2014 single API for email, SMS, push, Slack, and in-app notifications. Most teams ship notifications within hours. Version-controlled templates with CLI support. Good for announcements and transactional notifications. Free tier available, $250/mo for paid plans.',
        url: 'https://knock.app/',
        tags: ['Notifications', 'Infrastructure'],
    },
    {
        name: 'Sentry',
        description: 'Industry-standard application monitoring and error tracking. Real-time crash reporting with full stack traces, performance monitoring, and release tracking. Essential for any production app \u2014 catches bugs before your users report them.',
        url: 'https://sentry.io/',
        tags: ['Monitoring', 'Errors'],
    },
    {
        name: 'Autumn',
        description: 'YC-backed open-source billing platform built on Stripe, designed specifically for AI SaaS. Like a CMS for managing usage-based pricing, credits, subscriptions, and feature gating. Handles checkouts, upgrades, downgrades, and cancellations in 3 function calls with no webhooks needed. Saves a lot of time if you\'re building the typical AI SaaS pricing model.',
        url: 'https://useautumn.com/',
        tags: ['Billing', 'AI SaaS'],
    },
    {
        name: 'Stripe',
        description: 'The industry standard payment infrastructure for the internet. Handles payments, subscriptions, invoicing, and financial reporting. Practically every SaaS startup uses Stripe \u2014 the ecosystem of wrappers and integrations (like Autumn) makes it even more powerful.',
        url: 'https://stripe.com/',
        tags: ['Payments', 'Infrastructure'],
    },
    {
        name: 'Firebase',
        description: 'Google\'s backend-as-a-service platform. Real-time database, authentication, hosting, cloud functions, and analytics. Great for rapid prototyping and MVPs, though you may outgrow it and want to migrate to something like Supabase or Convex as your app gets more complex.',
        url: 'https://firebase.google.com/',
        tags: ['Backend', 'Google'],
    },
    {
        name: 'Clerk',
        description: 'Complete authentication and user management with drop-in UI components. Integration takes 1\u20133 days for most projects. Free for 10K monthly active users. Great DX with flexible APIs and admin dashboards. Can get pricey at scale \u2014 around $100\u2013$150/mo at 15K users \u2014 but the speed of integration is hard to beat.',
        url: 'https://clerk.com/',
        tags: ['Auth', 'Users'],
    },
    {
        name: 'Resend',
        description: 'Email API built for developers with the cleanest DX in the space. React Email integration lets you write email templates as React components. 3,000 emails/month free. Modern REST API with SDKs for Node.js, Python, Go, and more. Domain approval can take 1\u20132 business days (vs instant on SendGrid).',
        url: 'https://resend.com/',
        tags: ['Email', 'API'],
    },
    {
        name: 'Bun',
        description: 'All-in-one JavaScript runtime, bundler, test runner, and package manager. Switching from npm is mind-blowing \u2014 package installs go from 20+ seconds to 2\u20133 seconds. 4x HTTP throughput vs Node.js and 10\u201330% less memory. Production-ready for greenfield projects, though some teams still deploy to Node for maximum ecosystem stability.',
        url: 'https://bun.sh/',
        tags: ['Runtime', 'Tooling'],
    },
    {
        name: 'Vercel',
        description: 'Frontend cloud platform with zero-config deployments, edge functions, and built-in analytics. Easy and quick \u2014 push to deploy and it just works. Created Next.js and the AI SDK. Can get expensive as you scale, so evaluate costs early if you expect high traffic.',
        url: 'https://vercel.com/',
        tags: ['Deployment', 'Hosting'],
    },
    {
        name: 'next-forge',
        description: 'Production-grade Turborepo monorepo template for Next.js, maintained by Vercel. Includes auth (Clerk), database (Prisma), payments (Stripe), docs, blog, analytics, emails, and feature flags out of the box. Opinionated but saves weeks of boilerplate setup. Monorepo structure keeps apps, packages, and docs organized from day one.',
        url: 'https://next-forge.com/',
        tags: ['Starter', 'Monorepo'],
    },
    {
        name: 'mf\u00B2',
        description: 'Startup-in-a-command monorepo boilerplate built for the agent era. Bundles the recommended stack: Convex, Clerk, shadcn/ui, Tailwind CSS, PostHog, Knock, Resend, Sentry, Stripe, and Vercel AI SDK \u2014 all pre-configured. Ship with one command: npx create-mf2-app. Like next-forge but Convex-based instead of Prisma, with AI agent skills and Storybook included.',
        url: 'https://www.mf2.dev/',
        tags: ['Starter', 'Monorepo'],
    },
    {
        name: 'Vercel AI SDK',
        description: 'TypeScript toolkit for building AI apps with 20M+ monthly downloads. Unified API across OpenAI, Anthropic, Google, and more \u2014 swap providers without rewriting code. Handles the hard parts: stream parsing, tool streaming, multi-turn execution, and error recovery. Great abstractions without being over-abstracted.',
        url: 'https://ai-sdk.dev/',
        tags: ['AI', 'SDK'],
    },
    {
        name: 'Mobbin',
        description: 'World\'s largest UI/UX design reference library with 400K+ screenshots from real apps. Useful when you want to see how other apps handle specific UI patterns \u2014 search by screens, UI elements, flows, or text. Figma integration for direct copying.',
        url: 'https://mobbin.com/',
        tags: ['Design', 'Reference'],
    },
    {
        name: 'Intercom',
        description: 'AI-first customer service platform with live chat, help center, and AI agent (Fin) for support automation. Great product overall \u2014 free for startups for 1\u20132 years through their startup program. The catch: pricing gets ridiculously expensive after the program ends. Fin AI costs $0.99 per resolved inquiry, which adds up fast.',
        url: 'https://intercom.com/',
        tags: ['Support', 'Chat'],
    },
    {
        name: 'Expo',
        description: 'The easiest way to build cross-platform mobile apps with React Native. No Xcode or Android Studio needed for most tasks \u2014 file-based routing, over-the-air updates, and 70+ built-in APIs. Recommended by the community for 95% of React Native projects. App size starts at ~25MB which is the main trade-off.',
        url: 'https://expo.dev/',
        tags: ['Mobile', 'React Native'],
    },
    {
        name: 'RevenueCat',
        description: 'Stripe wrapper for mobile in-app purchases and subscriptions. Eliminates the pain of dealing with raw StoreKit and Google Play Billing \u2014 most devs get subscription handling working in a couple of hours. Handles iOS, Android, and web from one codebase. Free up to $2,500 MRR. Analytics for MRR, churn, and LTV.',
        url: 'https://revenuecat.com/',
        tags: ['Mobile', 'Subscriptions'],
    },
];
