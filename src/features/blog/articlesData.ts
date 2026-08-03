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
  inlineImages?: BlogInlineImage[];
  bottomVideo?: BlogVideo;
  relatedSlugs: string[];
}

export interface BlogInlineImage {
  src: string;
  alt: string;
  caption?: string;
  /** Insert image after this paragraph number. Use 0 to place before first paragraph. */
  afterParagraph: number;
}

export interface BlogVideo {
  title?: string;
  youtubeUrl?: string;
  /** Optional raw iframe embed code copied from YouTube share dialog. */
  embedCode?: string;
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
  {
    id: '6',
    slug: 'docu-style-marketing-builds-brand-trust',
    title: 'Why Docu-Style Marketing Builds Stronger Brand Trust in 2026',
    excerpt:
      'Audiences are rejecting over-scripted ads. Docu-style brand storytelling is emerging as a stronger route to trust, retention, and measurable engagement.',
    category: 'Brand Strategy',
    author: 'Dencast Global Team',
    authorRole: 'Creative Strategy Desk',
    authorBio:
      'The Dencast strategy desk publishes practical guidance on storytelling formats, content performance, and modern media production decisions for growth-focused brands.',
    authorAvatar: `${IMAGE_BASE}/caroline_wangamati.jpg`,
    date: '2026-08-01',
    readTime: '6 min read',
    views: '914',
    coverImage: `${IMAGE_BASE}/stories.png`,
    tags: ['Docu-style', 'Brand Trust', 'Storytelling', 'Marketing', 'Audience'],
    tableOfContents: [
      { id: 'attention-shift', label: 'The Audience Attention Shift' },
      { id: 'trust-mechanics', label: 'How Trust is Built On Camera' },
      { id: 'format-guide', label: 'When to Use Docu-Style Content' },
      { id: 'execution', label: 'Execution Principles for Teams' },
    ],
    content: `
<h2 id="attention-shift">The Audience Attention Shift</h2>
<p>Viewers can identify generic advertising formulas quickly. As a result, scripted sales-first messaging often underperforms compared to human-led narratives grounded in real voices and environments.</p>
<p>Docu-style marketing aligns with this shift by prioritizing authenticity, context, and emotional credibility.</p>

<h2 id="trust-mechanics">How Trust is Built On Camera</h2>
<p>Trust grows when brands allow customers, teams, and communities to speak in their own words. Imperfect but honest moments frequently outperform polished yet detached messaging.</p>
<p>The goal is not lower production quality. The goal is higher narrative credibility.</p>

<h2 id="format-guide">When to Use Docu-Style Content</h2>
<p>Docu-style is especially effective for impact reporting, institutional storytelling, social campaigns, and purpose-led brand communication where proof matters as much as promise.</p>
<p>It can also complement commercials by deepening audience understanding before a product-focused conversion campaign.</p>

<h2 id="execution">Execution Principles for Teams</h2>
<p>Strong docu-style campaigns still require disciplined production: clear story arcs, intentional interview design, ethical representation, and consistent visual identity.</p>
<p>When executed well, this format helps brands become believable, memorable, and referable.</p>
`,
    inlineImages: [
      {
        src: `${IMAGE_BASE}/Dencast-Crew-27.jpg`,
        alt: 'Dencast production team filming a docu-style campaign scene',
        caption: 'Authenticity is built when real people and real environments are central to the frame.',
        afterParagraph: 2,
      },
      {
        src: `${IMAGE_BASE}/camera.jpg`,
        alt: 'Cinema camera setup during brand storytelling production',
        afterParagraph: 6,
      },
    ],
    bottomVideo: {
      title: 'Docu-style storytelling in action',
      embedCode:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/pYOevHo8v7Q?si=zcqMmyIhqPPlk9J1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    },
    relatedSlugs: ['ready-to-film-in-kenya-guide', 'kenya-filmmakers-dreamland', 'obtain-film-licences-kenya'],
  },
  {
    id: '7',
    slug: 'why-java-house-tastes-the-same-everywhere',
    title: 'WHY JAVA HOUSE TASTES THE SAME EVERYWHERE.',
    excerpt:
      'Have you ever noticed that your favourite meal at Java House tastes almost the same no matter which branch you visit? That consistency is not by chance, it is the result of a carefully planned system working behind the scenes every single day.',
    category: 'Industry',
    author: 'Dencast Team',
    authorRole: 'Editorial Team',
    authorBio:
      'The Dencast Team publishes practical feature stories and behind-the-scenes analysis across food systems, culture, business operations, and media.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-08-02',
    readTime: '6 min read',
    views: '1,031',
    coverImage: `${IMAGE_BASE}/java.png`,
    tags: ['Food Systems', 'Operations', 'Quality Control', 'Supply Chain', 'Kenya'],
    tableOfContents: [
      { id: 'why-consistency-matters', label: 'Why Consistency Matters' },
      { id: 'central-kitchen-model', label: 'The Central Kitchen Model' },
      { id: 'overnight-distribution', label: 'Overnight Distribution and Freshness' },
      { id: 'staff-training-and-standards', label: 'Training and In-Branch Standards' },
      { id: 'quality-after-service', label: 'Quality Beyond Service Hours' },
      { id: 'system-behind-the-taste', label: 'The System Behind Familiar Taste' },
    ],
    content: `
<h2 id="why-consistency-matters">Why Consistency Matters</h2>
<p>Have you ever noticed that your favourite meal at Java House tastes almost the same no matter which branch you visit? Whether you are in Nairobi or another town, having breakfast before work, grabbing lunch with friends, or stopping for coffee during a road trip, there is a good chance the food feels familiar.</p>
<p>That is not something that happens by chance. It is the result of a carefully planned system working behind the scenes every single day.</p>

<h2 id="central-kitchen-model">The Central Kitchen Model</h2>
<p>For many restaurants with multiple branches, consistency is one of the biggest challenges. Different chefs, different suppliers, and different kitchens can easily change how food tastes.</p>
<p>Java House avoids much of that problem by preparing many important ingredients at one central facility before they are delivered to restaurants. Instead of every branch preparing everything from scratch, many key ingredients and menu items are handled first at the company's central kitchen located in Nairobi's Industrial Area.</p>
<p>Bread is baked under controlled conditions, chicken is processed and prepared according to company standards, and signature items such as pork ribs are also prepared centrally.</p>
<p>By preparing these products in one place, the company has more control over quality, portion sizes, and flavour. Think of it like following one recipe instead of hundreds of slightly different ones.</p>
<p>When preparation happens in one place using the same ingredients, equipment, and procedures, it is much easier to make sure every customer gets a meal that tastes familiar. It also reduces the chances of small differences that naturally happen when each kitchen works independently.</p>

<h2 id="overnight-distribution">Overnight Distribution and Freshness</h2>
<p>After the food is prepared, each Java House branch places its daily order based on how busy it expects to be. A restaurant in a busy shopping mall may need more supplies than one in a quieter area, but both follow the same ordering process.</p>
<p>The orders are packed, checked, and loaded at the central kitchen and transported overnight so they arrive before the restaurants open for business.</p>
<p>Moving products overnight is not only about convenience. It also helps keep ingredients fresh while making sure every outlet begins the day fully stocked.</p>
<p>Instead of spending hours preparing every ingredient from scratch, staff at each branch can focus on cooking, assembling meals, and serving customers. That saves time during busy hours, when every minute counts.</p>

<h2 id="staff-training-and-standards">Training and In-Branch Standards</h2>
<p>Of course, consistency is not only about recipes. Staff training also plays an important role.</p>
<p>Even with centrally prepared ingredients, meals still need to be assembled, cooked, and presented correctly at every branch. Employees follow standard preparation methods so that your favourite burger, pasta, breakfast platter, or cup of coffee looks and tastes as close as possible to the one served at another location.</p>
<p>That does not mean every meal will be absolutely identical. Small differences can still happen because of cooking times, individual staff members, or even how busy a restaurant is at a particular moment.</p>
<p>Even so, the overall flavour, presentation, and quality remain remarkably consistent, which is why many regular customers know almost exactly what they are going to get before the food even reaches the table.</p>

<h2 id="quality-after-service">Quality Beyond Service Hours</h2>
<p>Another interesting part of the process is how food quality is maintained after service hours. According to people familiar with the company's operations, leftover food is not served again the following day.</p>
<p>Instead, any food remaining at the end of a shift is reportedly either shared with staff or handled according to the company's internal procedures. While most customers never see this side of the operation, practices like these are part of maintaining quality standards across the brand.</p>

<h2 id="system-behind-the-taste">The System Behind Familiar Taste</h2>
<p>Running a central kitchen also brings other benefits that many people do not think about. Buying ingredients in larger quantities makes it easier to maintain quality, monitor food safety, and keep recipes consistent.</p>
<p>It also allows the company to solve many kitchen challenges from one location instead of trying to manage them separately in every restaurant. The result is a system that supports both efficiency and consistency without changing the experience customers have come to expect.</p>
<p>It is one of those details most people never notice, but it is a big reason why so many customers keep coming back, knowing they will get an experience they can count on.</p>
<p>The next time you visit Java House and your favourite meal tastes just the way you remembered it, you will know there is more happening than good cooking in the kitchen. Behind every sandwich, pastry, coffee, or plate of ribs is a carefully organised process that starts long before you place your order.</p>
`,
    relatedSlugs: ['docu-style-marketing-builds-brand-trust', 'campaign-production-timeline-from-brief-to-delivery', 'ready-to-film-in-kenya-guide'],
  },
  {
    id: '8',
    slug: '26-years-of-impact-lewa-safari-marathon',
    title: '26 Years of Impact: The Lewa Safari Marathon',
    excerpt:
      'The Lewa Safari Marathon is one of Kenya\'s most distinctive sporting events, uniting athletics, wildlife conservation, and community development in one powerful initiative that has delivered measurable impact for over two decades.',
    category: 'Events',
    author: 'Dencast Team',
    authorRole: 'Editorial Team',
    authorBio:
      'The Dencast Team documents stories of social impact, development, conservation, and enterprise across Kenya and the wider region.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-08-03',
    readTime: '10 min read',
    views: '786',
    coverImage: `${IMAGE_BASE}/lewa1.jpg`,
    tags: ['Lewa Safari Marathon', 'Conservation', 'Community Development', 'Education', 'Healthcare'],
    tableOfContents: [
      { id: 'more-than-a-race', label: 'More Than a Race' },
      { id: 'wildlife-conservation', label: 'Protecting Wildlife and Reducing Conflict' },
      { id: 'community-conservancies', label: 'Supporting Community Conservancies' },
      { id: 'education-impact', label: 'Transforming Education' },
      { id: 'women-enterprise', label: 'Empowering Women and Enterprise' },
      { id: 'agriculture-water', label: 'Agriculture and Water Access' },
      { id: 'healthcare-access', label: 'Expanding Access to Healthcare' },
      { id: 'legacy', label: 'A Legacy Beyond the Finish Line' },
    ],
    content: `
<h2 id="more-than-a-race">More Than a Race</h2>
<p>The Lewa Safari Marathon is one of Kenya's most distinctive sporting events, bringing together athletics, wildlife conservation and community development in one powerful initiative.</p>
<p>Held annually at the Lewa Wildlife Conservancy, the marathon attracts runners from Kenya and around the world to support projects that protect wildlife while improving the lives of communities living around conservation areas.</p>
<p>Since its inception in 2000, the Lewa Safari Marathon has grown into one of Africa's most successful conservation fundraising events. Organised by the Lewa Wildlife Conservancy in partnership with Tusk and Safaricom, the marathon has become a strong example of how sport can inspire meaningful and lasting change.</p>

<h2 id="wildlife-conservation">Protecting Wildlife and Reducing Conflict</h2>
<p>Wildlife conservation remains at the heart of the marathon.</p>
<p>Funds raised through the event have supported the construction of more than 192 kilometres of fencing around the Lewa Conservancy. The fencing helps reduce human-wildlife conflict, protects nearby communities from dangerous encounters and provides safer habitats for wildlife.</p>
<p>Over the years, more than US$4 million has been invested directly in endangered-species protection, habitat restoration and conservation programmes.</p>
<p>The results have been significant. Lewa has recorded zero rhino poaching since 2019, demonstrating the impact of sustained investment in security, monitoring and conservation.</p>
<p>These efforts have helped protect some of Kenya's most iconic species, including black and white rhinos, elephants, Grevy's zebras and the rare mountain bongo. Wider environmental programmes have also supported the protection of endangered species such as hawksbill and green turtles.</p>

<h2 id="community-conservancies">Supporting Community Conservancies</h2>
<p>The impact of the marathon extends far beyond Lewa.</p>
<p>Support has reached 45 community conservancies across Northern Kenya, the Coast and the Rift Valley. These conservancies enable communities to participate in wildlife management while creating employment and income through tourism and conservation-related activities.</p>
<p>By involving local communities directly, the programmes strengthen conservation while ensuring that people living alongside wildlife also benefit from its protection.</p>

<h2 id="education-impact">Transforming Education</h2>
<p>Education is another area in which the marathon has delivered long-term impact.</p>
<p>Since the event began, 28 schools within the Lewa landscape have received support, benefiting more than 58,000 students.</p>
<p>More than 1,500 students have received scholarships, enabling many young people to continue their education despite financial challenges.</p>
<p>The investment has also supported the completion of 680 school infrastructure projects. These include classrooms, libraries, laboratories, dormitories, teachers' houses, kitchens, toilets and digital learning facilities equipped with computers, tablets and smartboards.</p>
<p>These improvements have created safer, more effective and more inspiring learning environments for students.</p>

<h2 id="women-enterprise">Empowering Women and Supporting Enterprise</h2>
<p>Women have also benefited significantly from programmes supported by the marathon.</p>
<p>More than 2,000 women have been economically empowered, while over 1,800 women-led businesses have received support to grow.</p>
<p>More than US$881,000 has been disbursed through women's micro-enterprise programmes, providing entrepreneurs with capital to expand their businesses, create jobs and improve household incomes.</p>
<p>In the Maasai Mara, 724 women artisans receive annual support through programmes that promote traditional craftsmanship and connect locally made products to wider markets.</p>
<p>These initiatives preserve cultural heritage while creating sustainable sources of income for women and their families.</p>

<h2 id="agriculture-water">Strengthening Agriculture and Water Access</h2>
<p>Many communities living around conservation areas depend heavily on agriculture. Supporting resilient farming systems is therefore essential for improving livelihoods and reducing pressure on natural resources.</p>
<p>Through the Lewa Sustainable Agriculture Programme, 8,881 farmers have received support to improve productivity and adopt environmentally sustainable farming practices.</p>
<p>The programme has also supported the formation of 36 farmer groups, encouraging knowledge sharing, collective marketing and stronger community cooperation.</p>
<p>Access to water has also improved through the establishment of 18 water projects, benefiting more than 5,000 community members. These projects support household needs, farming activities and food security across the region.</p>

<h2 id="healthcare-access">Expanding Access to Healthcare</h2>
<p>Healthy communities are essential to successful conservation.</p>
<p>Each year, six hospitals and clinics receive support through marathon-funded programmes. These include Lewa Clinic, Leparua Clinic, Ngare Ndare Clinic and Ntirimiti Clinic.</p>
<p>Together, the facilities treat more than 35,000 patients annually, bringing essential healthcare services closer to rural communities.</p>
<p>Mobile outreach clinics also reach remote areas with limited access to medical facilities, providing services to more than 17,000 people every year.</p>
<p>Maternal and reproductive healthcare remains a major priority, with more than 3,000 expectant mothers receiving support annually. These services help improve health outcomes for both mothers and newborns.</p>

<h2 id="legacy">A Legacy That Continues Beyond the Finish Line</h2>
<p>What makes the Lewa Safari Marathon special is not only where it is held, but what it continues to achieve year after year.</p>
<p>The event has shown that sport can be more than competition. It can protect endangered wildlife, improve education, strengthen healthcare, empower women, support farmers and create opportunities for entire communities.</p>
<p>This year's edition attracted more than 1,400 runners from around the world, further strengthening the marathon's international reputation.</p>
<p>In the elite races, Samson Lemayan successfully defended his men's marathon title, while Lydia Simiyu claimed victory in the women's race.</p>
<p>When the race is over and the event infrastructure has been packed away, the impact of the Lewa Safari Marathon continues.</p>
<p>Its legacy can be seen in protected wildlife, improved schools, stronger health facilities, thriving women-led businesses, supported farmers and communities with better access to water and opportunity.</p>
<p>After 26 years, the Lewa Safari Marathon has become much more than an annual sporting event. It stands as one of Kenya's strongest examples of how partnerships, purpose and community participation can create change that lasts.</p>
`,
    relatedSlugs: ['ready-to-film-in-kenya-guide', 'obtain-film-licences-kenya', 'docu-style-marketing-builds-brand-trust'],
  },
];

export const BLOG_CATEGORIES = [
  'All',
  ...Array.from(new Set(BLOG_ARTICLES.map((article) => article.category))),
];

export const BLOG_ARTICLES_LOOKUP = Object.fromEntries(
  BLOG_ARTICLES.map((article) => [article.slug, article])
) as Record<string, BlogArticle>;
