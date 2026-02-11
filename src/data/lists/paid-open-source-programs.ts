export interface ResourceItem {
    name: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
}

export const paidOpenSourcePrograms: ResourceItem[] = [
    {
        name: 'Google Summer of Code (GSoC)',
        description: 'Stipend: $750\u2013$6,600 USD (varies by project size and country via PPP). Small (90 hrs): $750\u2013$1,650, Medium (175 hrs): $1,500\u2013$3,300, Large (350 hrs): $3,000\u2013$6,600. Malaysia: ~$1,500 (medium) / ~$3,000 (large). Applications open March 24 \u2013 April 8, 2026. Eligibility: 18+, new to open source, open to students AND non-students since 2022. Duration: 8\u201322 weeks (flexible).',
        url: 'https://summerofcode.withgoogle.com/',
        tags: ['Google', '$750\u2013$6,600', 'Mar\u2013Apr 2026'],
    },
    {
        name: 'European Summer of Code (ESoC)',
        description: 'Stipend: \u20AC4,800 for open source projects (over 3 months); applied projects may offer higher. Two batches in 2026: Batch 1 applications Feb 18 \u2013 Mar 18, Batch 2 applications Mar 19 \u2013 Apr 16. Contributors new to open source, worldwide. Projects are based in Europe but applicants can be international. Duration: ~3 months.',
        url: 'https://esoc.dev/',
        tags: ['Europe', '\u20AC4,800+', 'Feb\u2013Apr 2026'],
    },
    {
        name: 'LFX Mentorship (Linux Foundation)',
        description: 'Stipend: $3,000\u2013$6,600 USD (varies by country via PPP). Malaysia: $3,000. Three terms per year: Spring (Jan\u2013Feb apps, Mar\u2013May program), Summer (May apps, Jun\u2013Aug program), Fall (Jul\u2013Aug apps, Sep\u2013Nov program). Eligibility: 18+, no prior LFX participation, max 3 applications per term. Duration: 12 weeks (full-time) or 24 weeks (part-time).',
        url: 'https://mentorship.lfx.linuxfoundation.org/',
        tags: ['Linux Foundation', '$3,000\u2013$6,600', 'Rolling'],
    },
    {
        name: 'Igalia Coding Experience',
        description: 'Stipend: ~\u20AC7,000 for 450 hours of mentored work. Applications typically open around Feb\u2013Apr each year. Open to people studying CS, IT, or free software (formal or self-taught). Underrepresented groups especially encouraged. Remote-friendly worldwide. Focus: WebKit, Chromium/Blink, Gecko, Mesa 3D, GStreamer, compilers, and low-level open source infrastructure. Duration: ~3\u20134 months.',
        url: 'https://www.igalia.com/coding-experience/',
        tags: ['Browsers', '~\u20AC7,000', 'Feb\u2013Apr (annual)'],
    },
    {
        name: 'Outreachy',
        description: 'Stipend: $7,000 USD + $500 travel stipend. May 2026 cohort: initial applications Feb 6\u201313, internship May 18 \u2013 Aug 17. Dec 2026 cohort apps typically open ~Aug 2026. Open worldwide to anyone facing under-representation, systemic bias, or discrimination in tech. Must NOT be a past GSoC or Outreachy intern. Must be available 30 hrs/week. Duration: 3 months.',
        url: 'https://www.outreachy.org/',
        tags: ['Diversity', '$7,000', 'Feb / Aug 2026'],
    },
    {
        name: 'Processing Foundation Fellowship',
        description: 'Stipend: $10,000 USD. Applications typically open around Apr\u2013May each year. Open to individuals and collectives worldwide, all backgrounds and skill levels. Creative coding focus \u2014 artists, designers, educators, researchers, coders welcome. Focus: Processing, p5.js, ml5.js. Duration: ~3 months (100 hours commitment).',
        url: 'https://processingfoundation.org/fellowships',
        tags: ['Creative Coding', '$10,000', 'Apr\u2013May (annual)'],
    },
    {
        name: 'Processing Foundation Software Development Grant (pr05)',
        description: 'Stipend: $10,000 USD. Applications expected around Apr\u2013May 2026. Open to early to mid-career software developers worldwide. Fully remote. Must work on curated open-source projects from the Processing ecosystem. Focus: Processing, p5.js, and p5.js editor. Duration: 200 hours over 4 months.',
        url: 'https://processingfoundation.org/grants',
        tags: ['Creative Coding', '$10,000', 'Apr\u2013May (annual)'],
    },
];
