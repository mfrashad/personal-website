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
        description: 'Stipend: $750\u2013$6,600 USD (varies by project size and country via PPP)\nSmall (90 hrs): $750\u2013$1,650 \u2022 Medium (175 hrs): $1,500\u2013$3,300 \u2022 Large (350 hrs): $3,000\u2013$6,600\nMalaysia: ~$1,500 (medium) / ~$3,000 (large)\n\nApplications: March 24 \u2013 April 8, 2026\nEligibility: 18+, new to open source, open to students AND non-students since 2022\nDuration: 8\u201322 weeks (flexible)',
        url: 'https://summerofcode.withgoogle.com/',
        tags: ['Google', '$750\u2013$6,600', 'Mar\u2013Apr 2026'],
    },
    {
        name: 'European Summer of Code (ESoC)',
        description: 'Stipend: \u20AC4,800 for open source projects (over 3 months); applied projects may offer higher\n\nApplications (2026):\nBatch 1: Feb 18 \u2013 Mar 18\nBatch 2: Mar 19 \u2013 Apr 16\n\nEligibility: Contributors new to open source, worldwide. Projects are based in Europe but applicants can be international.\nDuration: ~3 months',
        url: 'https://esoc.dev/',
        tags: ['Europe', '\u20AC4,800+', 'Feb\u2013Apr 2026'],
    },
    {
        name: 'LFX Mentorship (Linux Foundation)',
        description: 'Stipend: $3,000\u2013$6,600 USD (varies by country via PPP)\nMalaysia: $3,000\n\nApplication Periods (2026):\nSpring: Jan 26 \u2013 Feb 10 \u2192 Program Mar 3 \u2013 May 30\nSummer: May 14 \u2013 May 27 \u2192 Program Jun 9 \u2013 Aug 29\nFall: Jul 30 \u2013 Aug 12 \u2192 Program Sep 8 \u2013 Nov 28\n\nEligibility: 18+, no prior LFX participation, max 3 applications per term\nDuration: 12 weeks (full-time) or 24 weeks (part-time)',
        url: 'https://mentorship.lfx.linuxfoundation.org/',
        tags: ['Linux Foundation', '$3,000\u2013$6,600', 'Rolling'],
    },
    {
        name: 'Igalia Coding Experience',
        description: 'Stipend: ~\u20AC7,000 for 450 hours of mentored work\n\nApplications: Typically Feb\u2013Apr each year (2026 expected ~Feb 2026)\nEligibility: People studying CS, IT, or free software (formal or self-taught). Underrepresented groups especially encouraged. Remote-friendly worldwide.\nDuration: ~3\u20134 months\n\nFocus: WebKit, Chromium/Blink, Gecko, Mesa 3D, GStreamer, compilers, and low-level open source infrastructure',
        url: 'https://www.igalia.com/coding-experience/',
        tags: ['Browsers', '~\u20AC7,000', 'Feb\u2013Apr (annual)'],
    },
    {
        name: 'Outreachy',
        description: 'Stipend: $7,000 USD + $500 travel stipend\n\nMay 2026 Cohort:\nInitial applications: Feb 6 \u2013 Feb 13 (4pm UTC)\nInternship: May 18 \u2013 Aug 17\nDec 2026 cohort apps typically open ~Aug 2026\n\nEligibility: Open worldwide to anyone facing under-representation, systemic bias, or discrimination in tech. Must NOT be a past GSoC or Outreachy intern. Must be available 30 hrs/week.\nDuration: 3 months',
        url: 'https://www.outreachy.org/',
        tags: ['Diversity', '$7,000', 'Feb / Aug 2026'],
    },
    {
        name: 'Processing Foundation Fellowship',
        description: 'Stipend: $10,000 USD\n\nApplications: Typically Apr\u2013May each year\nEligibility: Open to individuals and collectives worldwide, all backgrounds and skill levels. Creative coding focus \u2014 artists, designers, educators, researchers, coders welcome.\nDuration: ~3 months (100 hours commitment)\n\nFocus: Creative coding, open-source projects related to Processing, p5.js, ml5.js',
        url: 'https://processingfoundation.org/fellowships',
        tags: ['Creative Coding', '$10,000', 'Apr\u2013May (annual)'],
    },
    {
        name: 'Processing Foundation Software Development Grant (pr05)',
        description: 'Stipend: $10,000 USD\n\nApplications: Expected around Apr\u2013May 2026\nEligibility: Early to mid-career software developers worldwide. Fully remote. Must work on curated open-source projects from the Processing ecosystem.\nDuration: 200 hours over 4 months\n\nFocus: Software development contributions to Processing, p5.js, and p5.js editor',
        url: 'https://processingfoundation.org/grants',
        tags: ['Creative Coding', '$10,000', 'Apr\u2013May (annual)'],
    },
];
