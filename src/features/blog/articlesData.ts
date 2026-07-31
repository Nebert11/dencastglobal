export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  views: string;
  coverImage: string;
  featured?: boolean;
  tags: string[];
  tableOfContents: { id: string; label: string }[];
  content: string;
  relatedSlugs: string[];
}



const IMAGE_BASE = '/dencast_images';

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: '1',
    slug: 'kenya-filmmakers-dreamland',
    title: 'Kenya Is a Filmmaker\'s Dreamland, Here\'s Why',
    excerpt:
      'From the Maasai Mara to the Kenyan coast and Lake Turkana, Kenya offers extraordinary visual variety for filmmakers in a single country.',
    category: 'Documentary',
    author: 'Dennis Machio',
    authorRole: 'Film Writer & Production Communications',
    authorBio:
      'Carolyne writes about production realities in Kenya, helping international crews understand locations, regulation, and practical execution.',
    authorAvatar:
      `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-01',
    readTime: '8 min read',
    views: '2,410',
    coverImage: `${IMAGE_BASE}/dennis_machio.jpg`,
    featured: true,
    tags: ['Kenya', 'Filmmaking', 'Locations', 'Documentary', 'Production'],
    tableOfContents: [
      { id: 'why-kenya', label: 'Why Kenya Stands Out' },
      { id: 'wildlife-power', label: 'Wildlife and Natural Scale' },
      { id: 'location-diversity', label: 'Location Diversity' },
      { id: 'culture-economy', label: 'Culture and Industry Value' },
      { id: 'final-word', label: 'Final Word' },
    ],
    content: `
<h2 id="why-kenya">Why Kenya Stands Out</h2>
<p>Kenya gives filmmakers an unusual advantage: dramatic visual range without crossing multiple borders. In one country, a production can access savannah, coastline, volcanic terrain, mountains, forests, and modern cityscapes.</p>
<p>That versatility reduces production friction and allows directors to preserve visual consistency while still changing tone and setting between sequences.</p>

<h2 id="wildlife-power">Wildlife and Natural Scale</h2>
<p>The Maasai Mara remains one of Kenya's strongest production assets. It forms part of the ecosystem that hosts the Great Wildebeest Migration and has supported major international wildlife productions.</p>
<br />
<p>For documentary crews, this means authentic animal behavior and high-impact natural action that is difficult to replicate in studio or controlled environments.</p>

<h2 id="location-diversity">Location Diversity</h2>
<p>Beyond the Mara, Kenya's filming potential expands quickly: white-sand coastal strips, Swahili architectural districts, alpine terrain around Mount Kenya, and the stark geological forms of northern Kenya.</p>
<p>This breadth supports many genres, including adventure, historical storytelling, science-focused documentary, and contemporary urban narratives.</p>

<h2 id="culture-economy">Culture and Industry Value</h2>
<p>Kenya's cultural diversity gives productions access to authentic language, costume, music, and traditions across different communities. This can significantly improve realism and story depth.</p>
<p>Production activity also contributes to local economies through employment, accommodation, transport, and service procurement, while also strengthening local technical capacity.</p>

<h2 id="final-word">Final Word</h2>
<p>Kenya does not need to imitate another destination. Its existing wildlife, landscapes, history, and people already provide what many productions spend heavily to recreate elsewhere.</p>
<p>For producers seeking cinematic scale with practical flexibility, Kenya remains one of Africa's most compelling filming environments.</p>
`,
    relatedSlugs: [
      'drone-photography-kenya-regulations',
      'obtain-film-licences-kenya',
      'ready-to-film-in-kenya-guide',
    ],
  },
  {
    id: '2',
    slug: 'drone-photography-kenya-regulations',
    title: 'Drone Photography in Kenya: Regulations, Licensing, and Permits',
    excerpt:
      'Kenya offers incredible aerial storytelling opportunities, but filmmakers must plan approvals carefully to avoid delays and compliance issues.',
    category: 'Technology',
    author: 'Carolyne Wangare',
    authorRole: 'Film Writer & Production Communications',
    authorBio:
      'Carolyne covers production operations in Kenya with a focus on compliance, permitting, and location readiness for international crews.',
    authorAvatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2026-07-03',
    readTime: '7 min read',
    views: '1,982',
    coverImage: `${IMAGE_BASE}/DRONE.jpg`,
    tags: ['Drone', 'Regulation', 'Aerial', 'Kenya', 'Permits'],
    tableOfContents: [
      { id: 'opportunity', label: 'Aerial Opportunity in Kenya' },
      { id: 'regulations', label: 'Why Regulation Matters' },
      { id: 'permits', label: 'Approvals and Import Rules' },
      { id: 'mistakes', label: 'Common Mistakes to Avoid' },
      { id: 'local-support', label: 'Role of Local Film Agents' },
    ],
    content: `
<h2 id="opportunity">Aerial Opportunity in Kenya</h2>
<p>Kenya's terrain is ideal for drone storytelling, from wildlife reserves and coastlines to corporate and destination marketing productions.</p>
<p>With the right preparation, aerial units can add major production value while keeping schedules efficient.</p>

<h2 id="regulations">Why Regulation Matters</h2>
<p>Drone operations in Kenya are regulated and should be treated as a dedicated compliance track, not as an add-on to general filming logistics.</p>
<p>Teams should confirm requirements early to prevent blocked equipment, denied access, or interrupted shooting days.</p>

<h2 id="permits">Approvals and Import Rules</h2>
<p>Depending on project type and location, approvals may include filming permissions, drone-specific operational clearance, and import-related documentation for foreign equipment.</p>
<p>Productions should also validate whether location-based restrictions apply near protected zones or controlled airspace.</p>

<h2 id="mistakes">Common Mistakes to Avoid</h2>
<p>Recurring problems include traveling with drone equipment before confirming import requirements, assuming one permit covers all drone activity, and starting approval processes too late.</p>
<p>Early planning is the most reliable way to avoid expensive idle time on production days.</p>

<h2 id="local-support">Role of Local Film Agents</h2>
<p>For international crews, accredited local agents help connect production teams with relevant authorities and ensure application flows are submitted correctly.</p>
<p>This support reduces operational risk and allows creative teams to stay focused on delivery instead of navigating administrative uncertainty mid-shoot.</p>
`,
    relatedSlugs: ['obtain-film-licences-kenya', 'who-issues-filming-licences-kenya', 'ready-to-film-in-kenya-guide'],
  },
  {
    id: '3',
    slug: 'obtain-film-licences-kenya',
    title: 'How to Obtain Film Licences and International Filming Permits in Kenya',
    excerpt:
      'A practical guide for international producers on licensing, documentation, local agent requirements, and timeline planning before filming in Kenya.',
    category: 'Industry',
    author: 'Dencast Global Team',
    authorRole: 'Production Services Team',
    authorBio:
      'The Dencast Global team supports international productions across permitting, location operations, logistics, and end-to-end in-country execution.',
    authorAvatar:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2026-07-05',
    readTime: '9 min read',
    views: '2,126',
    coverImage: `${IMAGE_BASE}/obtain.jpg`,
    tags: ['Licensing', 'Permits', 'International Production', 'Kenya', 'KFCB'],
    tableOfContents: [
      { id: 'authority', label: 'Who Issues Licences' },
      { id: 'agent', label: 'Why Local Agents Matter' },
      { id: 'documents', label: 'Key Documents to Prepare' },
      { id: 'locations', label: 'Additional Location Approvals' },
      { id: 'timing', label: 'When to Start the Process' },
    ],
    content: `
<h2 id="authority">Who Issues Licences</h2>
<p>The Kenya Film Classification Board (KFCB) is the core licensing authority for filming projects under Kenya's film regulatory framework.</p>
<p>Producers should begin applications through the correct authority to avoid process delays and conflicting guidance.</p>

<h2 id="agent">Why Local Agents Matter</h2>
<p>International productions are generally expected to work with accredited local film agents to coordinate applications and authority communication.</p>
<p>Local partners help align permit sequences with your production timeline and reduce avoidable compliance gaps.</p>

<h2 id="documents">Key Documents to Prepare</h2>
<p>Typical submissions include project description, proposed schedule, equipment list, location plan, and crew/passport details where required.</p>
<p>Immigration-related documentation may also apply depending on nationality, role, and duration of stay.</p>

<h2 id="locations">Additional Location Approvals</h2>
<p>A filming licence does not automatically grant access to all spaces. National parks, county-managed spaces, private property, restricted facilities, and sensitive heritage areas can require separate permissions.</p>
<p>Location mapping against script and shooting order is essential for smooth execution.</p>

<h2 id="timing">When to Start the Process</h2>
<p>Do not wait until arrival in Kenya to begin applications. Starting several weeks before travel gives room for approvals, revisions, and operational planning.</p>
<p>With early preparation and a qualified local partner, teams can move from planning to principal photography with far greater confidence.</p>
`,
    relatedSlugs: ['who-issues-filming-licences-kenya', 'ready-to-film-in-kenya-guide', 'drone-photography-kenya-regulations'],
  },
  {
    id: '4',
    slug: 'who-issues-filming-licences-kenya',
    title: 'Who Issues Filming Licences in Kenya?',
    excerpt:
      'A concise clarification of KFCB versus the Kenya Film Commission, and what filmmakers should know before beginning applications.',
    category: 'Industry',
    author: 'Dencast Global Team',
    authorRole: 'Production Services Team',
    authorBio:
      'The Dencast Global team supports international productions across permitting, location operations, logistics, and end-to-end in-country execution.',
    authorAvatar:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2026-07-07',
    readTime: '4 min read',
    views: '1,344',
    coverImage: `${IMAGE_BASE}/WEBSITE-11.jpg`,
    tags: ['KFCB', 'Kenya Film Commission', 'Licensing', 'Regulation'],
    tableOfContents: [
      { id: 'responsibility', label: 'Primary Licensing Responsibility' },
      { id: 'difference', label: 'KFCB vs Film Commission' },
      { id: 'specialised', label: 'Specialised Additional Approvals' },
    ],
    content: `
<h2 id="responsibility">Primary Licensing Responsibility</h2>
<p>The Kenya Film Classification Board (KFCB) is responsible for issuing filming licences to both Kenyan and foreign filmmakers.</p>
<p>Productions should not begin principal filming before obtaining the appropriate licence for the specific project period and schedule.</p>

<h2 id="difference">KFCB vs Film Commission</h2>
<p>These institutions serve different functions. KFCB regulates and licenses production activity, while the Kenya Film Commission promotes Kenya as a filming destination and supports sector development.</p>
<p>Understanding this distinction saves time and ensures producers enter the process through the right channel.</p>

<h2 id="specialised">Specialised Additional Approvals</h2>
<p>Some productions still require additional approvals depending on activity and location, including drone operations and access to protected or restricted zones.</p>
<p>Clarifying this early in pre-production prevents downstream disruption.</p>
`,
    relatedSlugs: ['obtain-film-licences-kenya', 'drone-photography-kenya-regulations', 'ready-to-film-in-kenya-guide'],
  },
  {
    id: '5',
    slug: 'ready-to-film-in-kenya-guide',
    title: 'Ready to Film in Kenya? A Short Guide for International Crews',
    excerpt:
      'A fast, practical checklist for moving from concept to camera in Kenya with the right licensing, logistics, and local support structure.',
    category: 'Events',
    author: 'Dencast Global Team',
    authorRole: 'Production Services Team',
    authorBio:
      'The Dencast Global team supports international productions across permitting, location operations, logistics, and end-to-end in-country execution.',
    authorAvatar:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    date: '2026-07-09',
    readTime: '3 min read',
    views: '1,102',
    coverImage: `${IMAGE_BASE}/WEBSITE_PHOTOGRAPHY.jpg`,
    tags: ['Production Guide', 'Kenya', 'International Crews', 'Logistics'],
    tableOfContents: [
      { id: 'plan-early', label: 'Plan Early, Film Smoothly' },
      { id: 'support', label: 'End-to-End Local Support' },
      { id: 'next', label: 'What to Do Next' },
    ],
    content: `
<h2 id="plan-early">Plan Early, Film Smoothly</h2>
<p>International production in Kenya works best when licensing, immigration requirements, and schedule dependencies are handled early.</p>
<p>Pre-production clarity reduces stress on shooting days and protects creative momentum.</p>

<h2 id="support">End-to-End Local Support</h2>
<p>From permits and location scouting to local crew sourcing and on-the-ground logistics, coordinated local support helps production teams move efficiently.</p>
<p>This is especially important when timelines are tight and shooting windows are fixed.</p>

<h2 id="next">What to Do Next</h2>
<p>If you are planning to film in Kenya, start compliance and logistics conversations before travel. Align approvals, location plans, and crew needs to the script breakdown as early as possible.</p>
<p>A prepared production enters Kenya ready to create, not troubleshoot.</p>
`,
    relatedSlugs: ['obtain-film-licences-kenya', 'who-issues-filming-licences-kenya', 'kenya-filmmakers-dreamland'],
  },
];

export const BLOG_CATEGORIES = [
  'All',
  ...Array.from(new Set(BLOG_ARTICLES.map((article) => article.category))),
];

export const BLOG_ARTICLES_LOOKUP = Object.fromEntries(
  BLOG_ARTICLES.map((article) => [article.slug, article])
) as Record<string, BlogArticle>;
