# Design Analysis: createwithsyaar (Canva Portfolio)

**Source**: https://portfolio307.my.canva.site/createwithsyaar
**Scraped**: 2026-03-06
**Screenshots**: `/tmp/syaar-section-0.png` through `/tmp/syaar-section-8.png`

---

## Overall Structure (12 sections, ~7450px total height)

| # | Section | Height | Background | Content |
|---|---------|--------|------------|---------|
| 0 | **Hero** | 635px | White + warm beige `#d6c6ab` | "PORTFOLIO" / "SYAAR" in massive type, creator tagline, scrolling text marquee |
| 1 | **About/Tagline** | 548px | White | "Hooked with STORYTELLING, Fascinated by connection, creating content that feels real." + portrait images |
| 2 | **Portfolio Grid** | 1288px | White with dark card overlays | 4 project cards (KLIA Express, Collagen Glow Berries, Superfood Greens, MAE E-Banking) with phone mockup screenshots |
| 3 | **Section Divider** | 170px | White | "Helping Brands Thrive in the digital world" |
| 4 | **Case Study: Finance** | 632px | White -> Dark `#0e1318` | MAE E-Banking deep dive with metrics (3 sec plays 90%, engagement 8%, reach 72.8%) |
| 5 | **Case Study: Business** | 571px | Dark `#0e1318` | KLIA Express with metrics, phone mockup videos |
| 6 | **Case Study: Wellness** | 632px | Dark `#0e1318` | Collagen Glow Berries with metrics |
| 7 | **Case Study: Health** | 629px | Dark `#0e1318` | Superfood Greens with ROAS 5.21 metric |
| 8 | **Products Showcase** | 718px | Dark `#0e1318` | Product imagery grid |
| 9 | **Tagline** | 95px | Dark | "Real Reactions, Real Results!" |
| 10 | **Video Reel/Testimonials** | 744px | Dark | Video content showcase |
| 11 | **Contact/CTA** | 768px | Dark | "Email me an inquiry here!" + bio + portrait |

---

## Color Palette

- **Primary accent**: `#d6c6ab` (warm beige/gold) -- used in hero bg, highlights, decorative elements
- **White sections**: `#ffffff` -- hero, about, portfolio grid
- **Dark sections**: `#0e1318` / `rgb(14, 19, 24)` -- all case studies and bottom half
- **Card overlays**: `rgba(17, 23, 29, 0.6)` -- dark semi-transparent on project cards
- **Text on white**: Black `#000000` for headers
- **Text on dark**: White `#ffffff`
- **Body text**: `#676767` (medium gray)
- **Accent text/highlights**: `#d6c6ab` (gold)

---

## Typography

- **Display headers**: ALL-CAPS sans-serif, extremely large (up to 429px on hero), generous letter-spacing (~96px tracking)
- **Body text**: Uppercase serif for labels, mixed case for descriptions, 14-21px
- **Marquee text**: ALL-CAPS with middot separators
  - "APPLE AFFICIONADO . STORYTELLER . TECH ENTHUSIAST . RIGHT BRAINER . BRAND CONNOISEUR . FINANCE GIRLY"
- **Line heights**: 1200-2240 for display, 1830 for body text
- **Font families**: Sans-serif for headers (Canva custom "YAFcfnjI7Vk"), serif for body ("YAFdJjbTu24")

---

## Section Details

### Section 0: Hero (0-635px)
- Warm beige `#d6c6ab` background accent area
- "PORTFOLIO" as massive 429px uppercase heading
- "SYAAR" as 429px right-aligned subtitle
- Content creator descriptor text (21px uppercase):
  "A versatile CONTENT CREATOR with a dynamic presence, professional experience in editorial, commercial, and UGC work. Passionate, photogenic, and confident in front of the camera."
- Scrolling marquee text strip with repeating attributes
- Portrait image of creator on one side
- 3 images total

### Section 1: About/Tagline (634-1182px)
- White background
- Large poetic text:
  - "Hooked with STORYTELLING,"
  - "Fascinated by connection,"
  - "creating content that"
  - "feels real."
- Two-column layout with portrait imagery on left/right
- 12 images (portraits, decorative elements)
- Bio text: "I'm Syaar, a UGC creator and digital marketer with experience crafting content for fintech, lifestyle, and consumer brands..."

### Section 2: Portfolio Grid (1181-2469px)
- White background, 1288px tall
- 4 project cards in a grid layout
- Each card has:
  - Phone mockup screenshot
  - Dark overlay `rgba(17, 23, 29, 0.6)`
  - White text overlay with project name and description
  - Video play indicator ("0.0s")
- Projects:
  1. **KLIA Ekspres Business Pass** -- "The campaign framed the KLIA Express Business Pass through a streamlined travel journey, spotlighting VIP privileges and speed as key value drivers for business users."
  2. **Collagen Glow Berries** -- "Built a long-term creative partnership spanning over two years, consistently communicating product benefits while aligning the messaging with a health-conscious, ingredient-aware audience."
  3. **Superfood Greens** -- "Following strong personal results, the experience was translated into a results-driven UGC review and ad creative that delivered high conversion performance for the brand."
  4. **MAE E-Banking App** -- "The Maybank team set out to make security features feel relevant to a younger audience..."
- 21 images total in this section

### Section 3: Divider (2468-2638px)
- White background, 170px tall
- "Helping Brands Thrive in the digital world"
- Transitional section between portfolio grid and case studies

### Sections 4-7: Case Studies (2637-5098px)
Each case study follows the same template:

**Layout**: Full-width dark section with:
- Left side: Category label (FINANCE, BUSINESS, WELLNESS, HEALTH) in uppercase
- Description text explaining the campaign
- Project title in large uppercase
- Right side: Phone mockup(s) showing the content
- Bottom: 4 KPI metric cards

**Metrics format**:
| Metric | Description |
|--------|-------------|
| 3 sec plays | Video view rate (75-95%) |
| Like to save ratio | Engagement quality (3:1 - 6:1) |
| Engagement rate | Interaction rate (4.2-12%) |
| New Reach | Audience expansion (60-88%) |
| ROAS | Return on ad spend (5.21 for Superfood) |

**Case Study: Finance (MAE E-Banking)**
- 3 sec plays: 90%, Like-save: 3:1, Engagement: 8%, New Reach: 72.8%

**Case Study: Business (KLIA Express)**
- 3 sec plays: 75%, Like-save: 6:1, Engagement: 4.2%, New Reach: 60.2%

**Case Study: Wellness (Collagen Glow Berries)**
- 3 sec plays: 95%, Like-save: 3:1, Engagement: 12%, New Reach: 88%

**Case Study: Health (Superfood Greens)**
- 3 sec plays: 90%, ROAS: 5.21, Engagement: 12%, New Reach: 72.6%

### Section 8: Products Showcase (5097-5815px)
- Dark background
- "Products" label
- Grid of product images/mockups
- 718px tall

### Section 9: Tagline (5814-5909px)
- Dark background, 95px tall
- "Real Reactions, Real Results!"
- Bold statement divider

### Section 10: Video Reel (5908-6652px)
- Dark background
- Video content showcase / testimonials
- 744px tall

### Section 11: Contact/CTA (6651-7419px)
- Dark background
- "Email me an inquiry here!" link/button
- Bio text: "Hi! My name is Syaar and I have been creating content for brands since 2022. I'm passionate in working with finance, tech, beauty, skincare, wellness and travel! I love helping businesses (big and small) to achieve their content and marketing goals with my creativity."
- Portrait image
- 768px tall

---

## Image Types Used

| Type | Dimensions | Usage |
|------|-----------|-------|
| **Portrait photography** | 599x799, 753x800 | Creator headshots with warm filters, used in hero, about, and contact sections |
| **Phone mockups** | 406x720 (poster), 720x1280 (video) | Vertical 9:16 device frames showing UGC content -- primary visual element in case studies |
| **Product shots** | 800x800, 500x500 | Square format brand/product images |
| **Brand logos** | 315x160, 300x300 | Client brand logos in products section |
| **Decorative elements** | Various | Abstract shapes, geometric gold accents |
| **Video thumbnails** | 406x720, 360x640 | Poster frames from UGC video content |
| **Scrolling text images** | 1682x512, 800x169 | Pre-rendered marquee text strips |

### Videos (12 total)
- All vertical format (720x1280 or 480x848)
- MP4 format, embedded with autoplay/muted
- Used in case study phone mockups and video reel section

---

## Key Design Patterns

1. **Two-tone split**: Top half white/light, bottom half dark/editorial (transition at ~section 4-5)
2. **Oversized typography**: Hero uses impossibly large type (429px) that fills the entire viewport width
3. **Scrolling marquee**: Repeating text strip with interests/attributes separated by middots
4. **Metrics cards**: Each case study shows 4 KPIs with large percentage numbers and small labels
5. **Phone mockup presentations**: Content displayed inside device frames, vertical 9:16 ratio
6. **Dark mode case studies**: Each brand gets a full-width dark section with uppercase category label
7. **Subtle lift animation**: Elements have a gentle parallax "lift" effect on scroll (intensity: 0.07)
8. **Card overlays**: Project cards use dark semi-transparent overlays with white text

---

## Layout Patterns

- **Full-width sections**, no max-width container -- content spans edge to edge
- **Generous vertical spacing** between sections
- **Two-column layouts** in about section and case studies (text + image, alternating sides)
- **2x2 grid** for portfolio showcase
- **Content centered** within sections
- **Viewport-height sections**: Most sections are roughly 550-750px (close to viewport height at 1440x900)
- **Desktop-optimized**: Designed for 1440x900 minimum viewport

---

## Spacing and Sizing

- Generous padding: 50-100px from section edges
- Inter-element spacing: 20-30px
- Case study image-to-text ratio: roughly 2:1 or 1:2
- Metric card grid: 4 columns, evenly spaced

---

## Interactive Elements

- No traditional navigation header
- Scrolling marquee with hover pause (animation-play-state: paused)
- Video elements with mute toggle buttons
- "Email me an inquiry here!" CTA link
- Canva footer with Terms/Privacy modals
- Right-click protection on media
- No contact form -- email link only

---

## Overall Aesthetic

**"Modern editorial luxury meets UGC creator energy"**

- Clean white space transitions into a dark, cinematic bottom half
- Typography-forward with warm gold (#d6c6ab) accents throughout
- Professional enough for brand partnerships, personal enough to feel authentic
- Uppercase sans-serif headers paired with serif body copy signal contemporary magazine design
- Selective use of warm accent colors against white space
- High-end portfolio feel with digital-native UGC sensibility

---

## Replication Prompt

To replicate this design, build a single-page scrolling portfolio with:

1. **Hero**: Full-width warm beige accent + massive (clamp 80-400px) uppercase sans-serif type for name/title, with a scrolling marquee of attributes below
2. **About**: White section with large poetic/editorial text ("Hooked with..., Fascinated by..., creating content that feels real") alongside portrait photography
3. **Portfolio Grid**: 2x2 card grid on white bg, each card has a phone mockup image with dark overlay + white text title/description
4. **Transition**: Small divider section "Helping Brands Thrive in the digital world"
5. **Case Studies**: Switch to dark bg (#0e1318). Each case study is full-width with category label, description, project title, phone mockup, and 4 KPI metric cards (large number + small label)
6. **Products**: Grid showcase of product images on dark bg
7. **Video Reel**: Horizontal scroll or grid of vertical video thumbnails
8. **Contact**: Dark section with portrait, bio text, and email CTA

**Key CSS**: Use `clamp()` for responsive type, CSS scroll-based animations for lift effects, `marquee` via CSS animation (translateX), dark overlays with `rgba()`, and generous whitespace throughout.
