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
      'Dennis writes about production realities in Kenya, helping international crews understand locations, regulation, and practical execution.',
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
    title: 'Drone Photography in Kenya: Navigating the Regulations and Licensing',
    excerpt:
      'Kenya offers incredible aerial storytelling opportunities, but filmmakers must understand KCAA rules, filming licences, and import requirements before a single drone takes flight.',
    category: 'Technology',
    author: 'Dennis Machio',
    authorRole: 'Film Writer & Production Communications',
    authorBio:
      'Dennis covers production operations in Kenya with a focus on compliance, permitting, and location readiness for international crews.',
    authorAvatar:
      `${IMAGE_BASE}/crew2.jpg`,
    date: '2026-07-03',
    readTime: '9 min read',
    views: '1,982',
    coverImage: `${IMAGE_BASE}/DRONE.jpg`,
    tags: ['Drone', 'Regulation', 'Aerial', 'Kenya', 'Permits', 'KCAA', 'KFCB'],
    tableOfContents: [
      { id: 'who-regulates', label: 'Who Regulates Drone Photography?' },
      { id: 'do-you-need-licence', label: 'Do You Need a Licence?' },
      { id: 'importing', label: 'Importing a Drone into Kenya' },
      { id: 'mistakes', label: 'Common Mistakes Foreign Filmmakers Make' },
      { id: 'local-agents', label: 'Why Local Film Agents Matter' },
      { id: 'conclusion', label: 'Conclusion' },
    ],
    content: `
<p>Kenya is one of Africa's most spectacular destinations for aerial photography and cinematography. From the coastal sandy beaches, the busy cities, the dramatic landscape of Lake Turkana and the Rift Valley, drones have transformed how filmmakers, photographers and content creators capture the country's beauty.</p>
<p>However, before flying a drone anywhere in Kenya, it is important to first understand the rules that apply. Drone operations are not as simple as just showing up and taking off, especially if the footage is for commercial use. Different government agencies handle different parts of the process, from aviation safety and filming permits to approvals for certain locations. Missing even one of these requirements can slow down your production, cost you money through fines, or in some cases lead to your drone being confiscated.</p>

<h2 id="who-regulates">Who Regulates Drone Photography in Kenya, and Why?</h2>
<p>Drone operations in Kenya are primarily regulated by the Kenya Civil Aviation Authority (KCAA), the government agency responsible for maintaining the safety, security and efficiency of the country's airspace. Under the Civil Aviation for Unmanned Aircraft Systems Regulations, KCAA oversees drone registration, importation, operator approvals and operational safety.</p>
<p>The purpose of these regulations extends beyond administrative compliance. Drones share airspace with commercial aircraft, helicopters and emergency services, making aviation safety a top priority. Regulations also help protect sensitive government installations, safeguard public privacy, preserve wildlife habitats and minimise security risks associated with unauthorised aerial operations.</p>
<p>A drone filming wildlife in the Maasai Mara isn't operating in the same environment as one flying over a construction site in Nairobi or surveying farmland in Uasin Gishu. Owning a drone alone does not guarantee you the right to film in Kenya. You also need a filming licence, which is different from a drone licence. For film productions, it is also important to understand the role of the Kenya Film Classification Board (KFCB), which handles filming licences for both local and international productions.</p>

<h2 id="do-you-need-licence">Do You Need a Licence to Fly a Drone in Kenya?</h2>
<p>In most professional cases, the answer is yes. If you're using a drone for commercial photography, filmmaking, surveying, inspections, or any other type of professional work, you are generally expected to meet the KCAA's requirements before flying.</p>
<p>If the drone is being used as part of a film production, you'll also need to comply with the filming requirements set by the KFCB before shooting begins. The exact approvals you'll need can vary depending on the type of project, where you plan to film, and how the drone will be used. It is always worth confirming the requirements before the production starts.</p>

<h2 id="importing">Importing a Drone into Kenya</h2>
<p>Bringing a drone into Kenya is not quite as straightforward as travelling with a camera or a phone. If you're planning to use it for a professional or commercial production, it's a good idea to check the import requirements before you travel.</p>
<p>Depending on the project, the authorities may ask for documents about the drone, what it will be used for, and any approvals that support the production. This is one of the reasons many international productions work with a local production partner — they can help organise the paperwork early and reduce the chances of delays at the airport or other entry points.</p>

<h2 id="mistakes">Common Mistakes Foreign Filmmakers Make</h2>
<p>Some of the most common mistakes include:</p>
<ul>
<li>Travelling with a drone before confirming import requirements.</li>
<li>Assuming a filming licence automatically covers drone operations.</li>
<li>Planning aerial shots near restricted areas like airports or wildlife conservancies without specific approval.</li>
<li>Waiting until arrival in Kenya before beginning the permit process.</li>
</ul>

<h2 id="local-agents">Why Accredited Local Film Agents Like Dencast Global Matter</h2>
<p>For many foreign productions, filming in Kenya involves much more than simply arriving with cameras and a shooting schedule. Depending on the project, you may need to organise filming licences, immigration paperwork, drone approvals, location permissions, and other local logistics — all while trying to keep the production on schedule.</p>
<p>That is why the Kenya Film Classification Board (KFCB) requires foreign filmmakers to apply for filming licences through an accredited local film agent. The agent acts as the link between the production team and the relevant government authorities, helping make sure the required applications and approvals are handled correctly.</p>
<p>As an accredited local film agent and full-service production company, Dencast Global works with productions from the planning stage right through to the final day of filming, helping the process run as smoothly as possible.</p>

<h2 id="conclusion">Conclusion</h2>
<p>Drone photography in Kenya has completely changed the way stories are told — from wildlife documentaries and tourism campaigns to commercial productions and corporate films, the country's landscapes offer remarkable creative opportunities.</p>
<p>Making the most of those opportunities starts with good preparation. Understanding the applicable regulations, securing the right approvals and planning ahead helps productions avoid unnecessary interruptions and keeps filming focused on what matters most. For international filmmakers, having an experienced local production partner also brings a level of confidence that is difficult to achieve when managing everything alone.</p>
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
      `${IMAGE_BASE}/TEAM.jpg`,
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
      `${IMAGE_BASE}/TEAM.jpg`,
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
      `${IMAGE_BASE}/TEAM.jpg`,
    date: '2026-07-09',
    readTime: '3 min read',
    views: '1,102',
    coverImage: `${IMAGE_BASE}/photography1.jpg`,
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
    authorAvatar: `${IMAGE_BASE}/19.jpg`,
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
    date: '2026-08-06',
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

  // ─── Kenya Life: practical guides ────────────────────────────────────────────

  {
    id: '9',
    slug: 'how-to-apply-for-passport-kenya',
    title: 'How to Apply for a Passport in Kenya',
    excerpt:
      'A step-by-step guide to applying for a Kenyan ePassport through eCitizen — from creating your account and paying fees to booking your biometrics appointment and collecting your passport.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-20',
    readTime: '7 min read',
    views: '1,240',
    coverImage: '/articles_and_insights /apply-for-passport.jpg',
    tags: ['Passport', 'eCitizen', 'Kenya', 'Immigration', 'Travel'],
    tableOfContents: [
      { id: 'documents', label: 'Documents Required' },
      { id: 'apply-online', label: 'Log in and Apply Online' },
      { id: 'payment', label: 'Pay and Book an Appointment' },
      { id: 'biometrics', label: 'Attend Biometrics Capture' },
      { id: 'collect', label: 'Track and Collect Your Passport' },
      { id: 'renewal', label: 'Renewal and Replacement' },
      { id: 'faq', label: 'Frequently Asked Questions' },
    ],
    content: `
<p>A Kenyan passport allows citizens to travel outside the country and serves as an important international identification document. Kenya issues electronic passports, commonly called ePassports, which are valid for 10 years. The application begins online through eCitizen, but applicants must attend an immigration centre for document submission and biometric capture.</p>

<h2 id="documents">Documents Required</h2>
<p>For a first-time adult application, prepare the following:</p>
<ul>
<li>An eCitizen account</li>
<li>Passport-sized photographs</li>
<li>Original birth certificate and a copy</li>
<li>Original national ID and a copy</li>
<li>Copies of your parents' national IDs</li>
<li>Original and copies of your parents' birth certificates</li>
<li>Any additional document requested by Immigration</li>
</ul>
<p>Minors require a completed consent form, birth certificate and copies of their parents' identification documents. Citizens registered as Kenyan citizens must provide their Certificate of Registration.</p>

<h2 id="apply-online">Log in and Complete the Online Application</h2>
<p>Create or sign in to your eCitizen account and open the State Department for Immigration and Citizen Services. Select the passport service and choose the correct application type: first-time passport, renewal, replacement, lost passport, damaged passport, or change of personal details.</p>
<p>Enter your personal information exactly as it appears on your national ID and birth certificate. Select the passport size you need:</p>
<ul>
<li>34 pages: KSh 7,550</li>
<li>50 pages: KSh 9,550</li>
<li>66 pages: KSh 12,050</li>
</ul>
<p>Check your names, ID number, date of birth and parents' details carefully before submitting. Correcting errors later may delay the application.</p>

<h2 id="payment">Pay and Book an Appointment</h2>
<p>Pay the amount displayed on eCitizen using one of the available payment methods. After payment, download and print the completed application form and sign it. Print two payment invoices, upload or attach the required documents and book an appointment through eCitizen.</p>
<p>Applicants can select from available passport processing centres, including Nairobi, Mombasa, Kisumu, Eldoret, Nakuru, Embu, Kisii, Kericho and Bungoma.</p>

<h2 id="biometrics">Attend Biometrics Capture</h2>
<p>Visit the selected immigration centre on your appointment date. Carry the printed application, invoices and all original supporting documents. Immigration officers will verify your documents and capture your photograph, fingerprints and other biometric details. Applicants must appear in person — someone else cannot complete the biometric process on your behalf.</p>

<h2 id="collect">Track and Collect Your Passport</h2>
<p>Check your eCitizen account for updates. You should also receive a notification when the passport has been printed and is ready. To collect it, visit the application centre with your payment invoice, original national ID, and original birth certificate if collecting for a minor or previous passport for a renewal.</p>
<p>Collect your passport as soon as you receive the ready notification.</p>

<h2 id="renewal">Passport Renewal and Replacement</h2>
<p>To renew or replace an expired or full passport, apply through eCitizen and carry your previous passport, national ID, Form 19 and payment invoices. For a lost passport, you also need a police abstract, sworn affidavit, written explanation and a copy of the lost passport's biodata page where available. A damaged passport requires the old passport, a written explanation and a sworn affidavit.</p>
<p>The current fee for either a lost or damaged passport is KSh 20,050.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<p><strong>Can I apply entirely online?</strong> No. While the application starts online through eCitizen, applicants must attend an in-person biometrics appointment before the passport can be processed.</p>
<p><strong>Can I check my application status?</strong> Yes. Log in to your eCitizen account to track your application status and receive updates.</p>
<p><strong>Does a minor need a passport when travelling with an adult?</strong> Yes. For international travel, a minor generally needs their own passport, even when travelling with a parent or another adult.</p>
`,
    relatedSlugs: ['how-to-apply-certificate-good-conduct-kenya', 'how-to-register-business-kenya', 'how-to-renew-driving-licence-kenya'],
  },

  {
    id: '10',
    slug: 'how-to-file-kra-returns-kenya',
    title: 'How to File KRA Returns in Kenya Through iTax',
    excerpt:
      'A complete guide for employed people, business owners and freelancers on filing annual income tax returns — including nil returns — through the KRA iTax portal.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-22',
    readTime: '8 min read',
    views: '3,015',
    coverImage: '/articles_and_insights /file-tax.jpg',
    tags: ['KRA', 'Tax Returns', 'iTax', 'Kenya', 'Finance', 'Business'],
    tableOfContents: [
      { id: 'who-must-file', label: 'Who Must File KRA Returns?' },
      { id: 'what-you-need', label: 'What You Need Before Filing' },
      { id: 'login', label: 'How to Log in to iTax' },
      { id: 'employed', label: 'Filing Returns as an Employee' },
      { id: 'nil-returns', label: 'How to File Nil Returns' },
      { id: 'business', label: 'Filing Returns as a Business Owner' },
    ],
    content: `
<p>Anyone whose KRA PIN has an active Income Tax obligation must file an annual return. This applies to employed people, business owners, freelancers and people who earned no income during the year. KRA returns are filed online through the iTax Kenya portal. The return you choose depends on whether you earned employment income, business income, other taxable income or no income at all.</p>

<h2 id="who-must-file">Who Must File KRA Returns?</h2>
<p>The following individuals and entities are required to file annual returns:</p>
<ul>
<li>Employed people (even if PAYE was fully deducted)</li>
<li>Business owners and self-employed individuals</li>
<li>Freelancers and consultants</li>
<li>People who earned no income during the year (nil return)</li>
<li>Registered companies and partnerships (using their own KRA PIN)</li>
</ul>

<h2 id="what-you-need">What You Need Before Filing</h2>
<p>Prepare the following before you begin:</p>
<ul>
<li>Your KRA PIN</li>
<li>Your iTax password</li>
<li>Access to your registered email address</li>
<li>A P9 form if you are employed (provided by your employer)</li>
<li>Business income and expense records</li>
<li>Withholding tax certificates where applicable</li>
<li>Instalment tax payment details</li>
<li>Supporting documents for insurance, mortgage or other reliefs</li>
</ul>

<h2 id="login">How to Log in to iTax Kenya</h2>
<p>Open the official iTax portal. Enter your KRA PIN, click continue, enter your password, complete the security check and click login. After logging in, confirm that your name, email address and tax obligations are correct.</p>

<h2 id="employed">How Employed People File Returns</h2>
<p>Employees should use the P9 form provided by their employer. It shows total salary earned, PAYE deducted, personal relief and other statutory deductions.</p>
<p>To file, open the returns menu, select File Return, choose Income Tax – Resident Individual and select the correct return period. Use the employment-income or simplified return option. Compare the displayed information with your P9 form, add any allowable reliefs or deductions, confirm the declaration and submit.</p>
<p>If you worked for more than one employer, include income from all employers in one return. PAYE deducted by an employer does not remove the requirement to file an annual return.</p>

<h2 id="nil-returns">How to File KRA Nil Returns</h2>
<p>A nil return is only for a person who earned no taxable income during the whole year. To file, log in to iTax, open Returns, select File Nil Return, choose Income Tax – Resident Individual, select the correct period, confirm that you earned no income, submit the return and download the acknowledgement receipt.</p>
<p>Do not file a nil return if you earned income from employment, business, freelance work, consultancy, farming, rent, online work or any other taxable source. Being unemployed for only part of the year does not qualify you for a nil return.</p>

<h2 id="business">How Business Owners File Returns</h2>
<p>A sole proprietor normally declares business income through the owner's individual return. A registered company or partnership files separately using its own KRA PIN.</p>
<p>Business owners should prepare total sales or income, allowable business expenses, profit-and-loss records, instalment tax payments, withholding tax certificates, invoices and supporting documents.</p>
<p>Where an Excel return is required, download the latest template from iTax, complete the income and expense sections, validate the file, correct any errors, upload the validated return, submit and download the receipt.</p>
`,
    relatedSlugs: ['how-to-register-business-kenya', 'how-to-apply-for-passport-kenya', 'how-to-register-sha-afya-yangu'],
  },

  {
    id: '11',
    slug: 'how-to-apply-certificate-good-conduct-kenya',
    title: 'How to Apply for a Certificate of Good Conduct in Kenya',
    excerpt:
      'A practical step-by-step guide to obtaining a Police Clearance Certificate in Kenya through the DCI eCitizen portal — from fingerprinting to downloading your certificate.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-25',
    readTime: '6 min read',
    views: '2,190',
    coverImage: `${IMAGE_BASE}/goodconduct.jpg`,
    tags: ['Certificate of Good Conduct', 'Police Clearance', 'DCI', 'eCitizen', 'Kenya'],
    tableOfContents: [
      { id: 'what-you-need', label: 'What You Need Before Applying' },
      { id: 'apply', label: 'Apply on eCitizen' },
      { id: 'payment', label: 'Pay and Print Documents' },
      { id: 'fingerprints', label: 'Have Your Fingerprints Taken' },
      { id: 'track', label: 'Track and Download the Certificate' },
      { id: 'minors', label: 'Applications for Minors' },
    ],
    content: `
<p>A Certificate of Good Conduct is officially known as a Police Clearance Certificate. It shows whether a person has a criminal record in Kenya as of the date the certificate is issued. The certificate is commonly requested when applying for employment, travelling, joining certain institutions or completing official applications. Kenyans can apply online through the Directorate of Criminal Investigations (DCI) service on eCitizen.</p>

<h2 id="what-you-need">What You Need Before Applying</h2>
<ul>
<li>An active eCitizen account</li>
<li>Your original Kenyan national ID</li>
<li>A working phone number</li>
<li>Access to a printer</li>
<li>Money to pay the application fee</li>
<li>Access to a fingerprinting centre</li>
</ul>

<h2 id="apply">Apply on eCitizen</h2>
<p>Sign in to your eCitizen account and from the dashboard, open the Directorate of Criminal Investigations services. Select Police Clearance Certificate and choose the application option for a Kenyan adult. Read the instructions before continuing.</p>
<p>Enter the requested personal information carefully — your details should match those shown on your national ID. You will also be asked to select where you want your fingerprints recorded. Choose a centre that you can visit easily because the selected location will appear on your C24 form.</p>

<h2 id="payment">Pay and Print Documents</h2>
<p>Select one of the payment methods provided on eCitizen and pay the amount shown on the invoice. After payment, download and print the payment invoice (two copies) and the C24 fingerprint form. The C24 form must be printed on both sides of one A4 sheet.</p>
<p>Use the official payment instructions generated by eCitizen. Do not send money to individuals claiming that they can speed up the application.</p>

<h2 id="fingerprints">Have Your Fingerprints Taken</h2>
<p>Visit the fingerprinting centre selected during your eCitizen application. Carry your original national ID, two printed invoice copies and the printed C24 form. An authorised officer will record your fingerprints on the C24 form and forward them for processing.</p>
<p>Fingerprints must be taken again each time you make a new application. Old fingerprint records cannot be reused.</p>

<h2 id="track">Track and Download the Certificate</h2>
<p>After fingerprinting, log in to your eCitizen account regularly and open the DCI application section to check the status. The DCI states that where there are no delays or other issues, processing takes at least two weeks from the date your fingerprints are recorded. Your application may take longer if your fingerprints are unclear, your personal details do not match, further verification is required or there is a system or processing delay.</p>
<p>Once the certificate is ready, the DCI sends an SMS notification. After approval, log in to eCitizen, open the DCI services section, find your application and select the option to download the certificate. The certificate is issued electronically — you do not need to return to the fingerprinting centre to collect it.</p>

<h2 id="minors">Applications for Minors</h2>
<p>Only Kenyan minors aged 16 or 17 can apply. The application must be made through a parent's or guardian's eCitizen account. The minor must present the C24 form, invoices and original birth certificate at the selected fingerprinting centre.</p>
`,
    relatedSlugs: ['how-to-apply-for-passport-kenya', 'how-to-register-business-kenya', 'how-to-renew-driving-licence-kenya'],
  },

  {
    id: '12',
    slug: 'how-to-apply-helb-university-funding-kenya',
    title: 'How to Apply for HELB and University Funding in Kenya',
    excerpt:
      'Everything you need to know about applying for HELB loans, scholarships and bursaries under Kenya\'s Student-Centred Funding Model — from registration to disbursement.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-28',
    readTime: '7 min read',
    views: '4,320',
    coverImage: '/articles_and_insights /good-conduct.jpg',
    tags: ['HELB', 'University Funding', 'Kenya', 'Students', 'Education', 'HEF'],
    tableOfContents: [
      { id: 'what-is-helb', label: 'What is HELB?' },
      { id: 'who-can-apply', label: 'Who Can Apply?' },
      { id: 'documents', label: 'Documents Required' },
      { id: 'create-account', label: 'Create an Account' },
      { id: 'how-to-apply', label: 'How to Apply' },
      { id: 'disbursement', label: 'How Funds are Disbursed' },
      { id: 'repayment', label: 'HELB Loan Repayment' },
    ],
    content: `
<p>Paying for university or college can be difficult. The Kenyan government supports eligible students through the Higher Education Loans Board (HELB) and the Higher Education Funding (HEF) programme. The funding may cover tuition, accommodation, books and upkeep. Apply as soon as the application window opens.</p>

<h2 id="what-is-helb">What is HELB?</h2>
<p>HELB supports students pursuing higher education. Under the Student-Centred Funding Model, eligible learners may receive scholarships, student loans and bursaries where available. The amount awarded depends on the student's assessed financial need and household circumstances.</p>

<h2 id="who-can-apply">Who Can Apply?</h2>
<p>You may qualify if you:</p>
<ul>
<li>Are a Kenyan citizen</li>
<li>Have been placed in an eligible public university or approved TVET institution</li>
<li>Are joining as a first-time undergraduate or TVET student</li>
<li>Have an official admission letter</li>
<li>Meet the HEF assessment requirements</li>
</ul>
<p>Some students in approved private institutions may also qualify under government guidelines.</p>

<h2 id="documents">Documents Required</h2>
<ul>
<li>National ID or KCSE Index Number if you are a minor</li>
<li>Email address and mobile phone number</li>
<li>Passport photo and birth certificate</li>
<li>Admission letter</li>
<li>KCPE and KCSE index numbers</li>
<li>Parents' or guardians' IDs and contacts</li>
<li>Death certificate if a parent is deceased</li>
<li>Bank or mobile payment details</li>
</ul>
<p>Ensure all scanned documents are clear before uploading.</p>

<h2 id="create-account">Create an Account</h2>
<p>First-time applicants must register through the HEF student portal. Open the portal and select Register. Enter your National ID or KCSE Index Number, add your email address and create a password. Verify your email and phone number, complete your profile and accept the consent terms. Use active contacts because updates may be sent by email or SMS.</p>

<h2 id="how-to-apply">How to Apply for HELB</h2>
<p>After registration, log in and complete the following steps:</p>
<ol>
<li><strong>Complete your profile</strong> — Enter your names, date of birth, ID details, contacts and home address. Ensure they match your documents.</li>
<li><strong>Add education details</strong> — Provide your institution, course, admission number, academic year and admission letter details.</li>
<li><strong>Enter parent or guardian information</strong> — Add their names, ID numbers, contacts, employment details and income information. Incorrect details may affect the decision.</li>
<li><strong>Add guarantor details</strong> — Loan applicants may be asked to provide guarantors. A parent or guardian may sometimes act as one.</li>
<li><strong>Upload documents</strong> — Upload every requested document in the correct format. Avoid blurred or incomplete copies.</li>
<li><strong>Review and submit</strong> — Check names, ID numbers, contacts and uploads. Read and accept the loan terms, then submit. You should receive a confirmation message and application serial number.</li>
</ol>

<h2 id="disbursement">How Funds are Disbursed</h2>
<p>Once approved, tuition funds are usually sent directly to the institution. Upkeep money is sent through the selected payment option. Apply early to reduce delays, as processing depends on document verification, institutional confirmation, application numbers and government funding schedules.</p>

<h2 id="repayment">HELB Loan Repayment</h2>
<p>A HELB loan must be repaid after completing your studies and becoming eligible. Employed graduates may repay through salary deductions. Self-employed borrowers can use approved payment channels. Timely repayment helps avoid penalties, protects your credit record and supports future students. Eligible borrowers may also apply for a HELB compliance certificate.</p>
`,
    relatedSlugs: ['how-to-register-sha-afya-yangu', 'how-to-apply-for-passport-kenya', 'how-to-file-kra-returns-kenya'],
  },

  {
    id: '13',
    slug: 'how-to-register-sha-afya-yangu',
    title: 'How to Register for SHA and Use Afya Yangu',
    excerpt:
      'A complete guide to registering for the Social Health Authority (SHA) through the Afya Yangu portal — including adding dependants, checking contributions, and accessing healthcare services.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-30',
    readTime: '6 min read',
    views: '5,840',
    coverImage: `${IMAGE_BASE}/Bungoma-County-ICU.jpg`,
    tags: ['SHA', 'NHIF', 'Afya Yangu', 'Health Insurance', 'Kenya', 'Healthcare'],
    tableOfContents: [
      { id: 'what-you-need', label: 'What You Need Before Registering' },
      { id: 'how-to-register', label: 'How to Register for SHA' },
      { id: 'dependants', label: 'How to Add Dependants' },
      { id: 'contributions', label: 'How to Check Contributions' },
      { id: 'afya-yangu', label: 'Using Afya Yangu for Healthcare' },
      { id: 'faq', label: 'Frequently Asked Questions' },
    ],
    content: `
<p>The Social Health Authority (SHA) replaced the National Health Insurance Fund (NHIF) as Kenya's national public health insurance provider. To access healthcare under SHA, every eligible resident must register through the Afya Yangu platform or other approved registration channels.</p>
<p>Afya Yangu serves as the official self-service portal where members can register, manage their accounts, add dependants, check contributions, access healthcare information and update personal details.</p>

<h2 id="what-you-need">What You Need Before Registering</h2>
<ul>
<li>Kenyan National ID or other accepted identification</li>
<li>Registered mobile phone number</li>
<li>Email address</li>
<li>Passport-size photograph</li>
<li>Your residential information</li>
<li>Employment details</li>
<li>Information for any dependants you intend to add</li>
</ul>
<p>Foreign residents and refugees can also register using the identification documents accepted by SHA.</p>

<h2 id="how-to-register">How to Register for SHA</h2>
<p>There are three main ways to register:</p>
<p><strong>1. Register Online</strong> — Visit the official SHA registration portal. Enter your National ID, provide the mobile number registered in your name and verify your account using the OTP sent by SMS. Create your account PIN, complete your personal profile including your residence and preferred healthcare facility, then submit your details.</p>
<p><strong>2. Register using USSD</strong> — If you do not have internet access, dial *147# and follow the prompts to complete your registration. You may still need to log in later through the portal to finish your profile or manage dependants.</p>
<p><strong>3. Assisted registration</strong> — You can receive help at selected SHA registration centres, Huduma Centres and participating healthcare facilities if you need assistance with registration or updating your information.</p>

<h2 id="dependants">How to Add Dependants</h2>
<p>Once registered, log into Afya Yangu, open your profile and select Dependants. Choose Add Dependant, enter the dependant's required details and submit the request. Depending on the relationship and age of the dependant, you may be required to provide supporting documentation during verification.</p>

<h2 id="contributions">How to Check SHA Contributions</h2>
<p>You can monitor your contributions through Afya Yangu by logging in and opening the contributions or insurance section to view payment history, current contribution status, active cover and outstanding payments.</p>
<p>You can also dial *147# and follow the prompts to check your account information through USSD.</p>

<h2 id="afya-yangu">Using Afya Yangu for Healthcare Services</h2>
<p>After your registration is complete, the Afya Yangu portal allows you to view insurance details, check approved healthcare facilities, view appointment information, access healthcare visit records, track claims and pre-authorisation status, manage dependants and control consent for sharing health information.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<p><strong>Is SHA registration free?</strong> Registration itself is generally free. However, eligible members are required to make contributions based on the applicable rules after registration.</p>
<p><strong>Can I register without a smartphone?</strong> Yes. Registration is available online, through the USSD code (*147#), and via assisted registration points.</p>
<p><strong>How do I know if my cover is active?</strong> Log into Afya Yangu or use *147# to check your account and contribution status.</p>
<p><strong>What if I fill in incorrect personal information?</strong> Visit an authorised SHA support centre if your identity details cannot be corrected online.</p>
`,
    relatedSlugs: ['how-to-apply-helb-university-funding-kenya', 'how-to-file-kra-returns-kenya', 'how-to-apply-for-passport-kenya'],
  },

  {
    id: '14',
    slug: 'how-to-renew-driving-licence-kenya',
    title: 'How to Renew a Driving Licence in Kenya',
    excerpt:
      'Renewing your Kenyan driving licence is done fully online through the NTSA portal on eCitizen. Here\'s everything you need to know — from logging in to downloading your confirmation.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-08-01',
    readTime: '5 min read',
    views: '2,780',
    coverImage: '/articles_and_insights /driving-license.jpg',
    tags: ['Driving Licence', 'NTSA', 'eCitizen', 'Kenya', 'Transport'],
    tableOfContents: [
      { id: 'what-you-need', label: 'What You Need' },
      { id: 'login', label: 'Step 1: Log in to eCitizen' },
      { id: 'choose-renewal', label: 'Step 2: Choose Driving Licence Renewal' },
      { id: 'payment', label: 'Step 3: Make Payment' },
      { id: 'confirmation', label: 'Step 4: Download Confirmation' },
      { id: 'common-problems', label: 'Common Problems' },
    ],
    content: `
<p>Renewing a driving licence in Kenya is done online through the NTSA Service Portal on eCitizen. You can apply, pay and download confirmation without visiting an office for most standard renewals.</p>

<h2 id="what-you-need">What You Need</h2>
<ul>
<li>Your national ID number</li>
<li>An active eCitizen account</li>
<li>Your phone number and email</li>
<li>M-Pesa or another accepted payment method</li>
<li>Your current driving licence details</li>
</ul>
<p>Your names and ID details should match eCitizen and NTSA records before you start.</p>

<h2 id="login">Step 1: Log in to eCitizen</h2>
<p>Visit the official eCitizen website and sign in using your ID number, phone number or email. Enter your password and complete verification. After logging in, open Agencies or Services, select National Transport and Safety Authority – NTSA and open the NTSA Service Portal. Enter any code sent to your phone or email.</p>

<h2 id="choose-renewal">Step 2: Choose Driving Licence Renewal</h2>
<p>On the NTSA dashboard, open driver services and select Driving Licence Renewal. The system should show your name, licence number, driving classes, expiry date and renewal option. Check the details before continuing.</p>
<p>Choose the renewal option shown on the portal. A smart driving licence is normally renewed for three years. Fees may change, so follow the amount shown on the portal. Click Renew and confirm the details.</p>

<h2 id="payment">Step 3: Make Payment</h2>
<p>The system will create an invoice. Choose M-Pesa or another payment option shown on eCitizen. For M-Pesa, select M-Pesa, enter the phone number, confirm the payment request and enter your M-Pesa PIN. Return to the portal and check the payment status.</p>
<p>Do not pay twice if the portal delays. First check your M-Pesa message and application history.</p>

<h2 id="confirmation">Step 4: Download Confirmation</h2>
<p>After payment, open My Applications or Application History. Download the payment receipt, renewal confirmation and application slip. Save them on your phone. Keep the receipt and reference number until the renewal is complete.</p>
<p>After renewal, NTSA may send an SMS. You may be asked to visit an NTSA office for biometric capture or licence collection. To check driving licence status, use the official NTSA service status portal and enter your ID number to see whether the licence is ready or still being processed.</p>

<h2 id="common-problems">Common Problems</h2>
<p>Common problems include wrong contact details, failed verification, missing licence records, pending payments, name differences and choosing replacement instead of renewal. Use only the official eCitizen and NTSA portals. Keep your payment message, receipt and application reference. After applying, log in again and confirm that the status shows paid, submitted, processing or completed.</p>
<p>For wrong names, ID details or licence classes, visit an NTSA office or Huduma Centre with your ID, licence and supporting documents.</p>
`,
    relatedSlugs: ['how-to-apply-for-passport-kenya', 'how-to-apply-certificate-good-conduct-kenya', 'how-to-register-business-kenya'],
  },

  {
    id: '15',
    slug: 'how-to-register-business-kenya',
    title: 'How to Register a Business in Kenya',
    excerpt:
      'A complete guide to registering a business name, private limited company or LLP in Kenya through the eCitizen Business Registration Service — including KRA registration and business permits.',
    category: 'Kenya Life',
    author: 'Dencast Global Editorial',
    authorRole: 'Editorial Team',
    authorBio: 'The Dencast Global Editorial team covers practical guides, industry stories and everyday topics relevant to life and business in Kenya and across Africa.',
    authorAvatar: `${IMAGE_BASE}/dennis_machio.jpg`,
    date: '2026-07-10',
    readTime: '8 min read',
    views: '3,650',
    coverImage: '/articles_and_insights /apply-for-business.jpg',
    tags: ['Business Registration', 'eCitizen', 'BRS', 'Kenya', 'Entrepreneurship', 'Company'],
    tableOfContents: [
      { id: 'structure', label: 'Choose a Business Structure' },
      { id: 'prepare', label: 'Prepare Required Information' },
      { id: 'apply', label: 'Apply Through eCitizen' },
      { id: 'payment', label: 'Pay the Registration Fee' },
      { id: 'certificate', label: 'Download the Certificate' },
      { id: 'kra', label: 'Complete KRA Registration' },
      { id: 'permits', label: 'Get the Required Business Permits' },
    ],
    content: `
<p>Registering a business in Kenya is done online through the eCitizen platform under the Business Registration Service (BRS). The process depends on the type of business you want to start.</p>

<h2 id="structure">1. Choose a Business Structure</h2>
<p><strong>Business name</strong> — Suitable for a sole proprietor or a simple partnership. It is cheaper to register, but the owner remains personally responsible for business debts.</p>
<p><strong>Private limited company</strong> — Legally separate from its owners. Suitable for a business that wants to grow, attract investors or protect the owners' personal property. The company name must end with Limited or Ltd.</p>
<p><strong>Limited Liability Partnership (LLP)</strong> — Suitable for professional firms or businesses with several partners. It is also treated as a separate legal entity.</p>

<h2 id="prepare">2. Prepare the Required Information</h2>
<ul>
<li>Three preferred business names</li>
<li>National ID or passport</li>
<li>KRA PIN</li>
<li>Recent passport photograph</li>
<li>Phone number and email address</li>
<li>Postal and physical business address</li>
<li>Description of the business activity</li>
<li>Details of owners, partners, directors or shareholders</li>
<li>Shareholding and beneficial ownership details for a company</li>
</ul>
<p>Make sure the names, ID numbers and KRA PIN details match your official records.</p>

<h2 id="apply">3. Apply Through eCitizen</h2>
<p>Log in to your eCitizen account. From the dashboard, open the Business Registration Service, select Make Application, choose the type of business, enter the required information, review the details and submit.</p>
<p>Business name approval is completed together with the registration application. Enter three preferred names in order of priority — names should be unique and not too similar to an existing business or registered trademark. Offensive, misleading or restricted names may be rejected.</p>

<h2 id="payment">4. Pay the Registration Fee</h2>
<p>The listed BRS registration fees are displayed during the application. Always pay the amount displayed on eCitizen because government fees may change.</p>
<p>A business name may take about one day to process. A private limited company may take three to five days. Applications with mistakes or missing information may take longer.</p>

<h2 id="certificate">5. Download the Certificate</h2>
<p>After approval, log in to eCitizen and download your registration documents. A business name receives a Certificate of Registration, while a limited company receives a Certificate of Incorporation. Keep both digital and printed copies — you may need the certificate when opening a bank account, applying for permits or registering for taxes.</p>

<h2 id="kra">6. Complete KRA Registration</h2>
<p>A sole proprietor normally uses their personal KRA PIN because a business name is not a separate legal person. A registered company normally receives its own KRA PIN during or after registration. Where a separate application is required, register through iTax as a non-individual and select the correct tax obligations.</p>

<h2 id="permits">7. Get the Required Business Permits</h2>
<p>Business registration alone does not allow every business to start operating. Most businesses need a county Single Business Permit — the cost depends on the county, location, business activity and size.</p>
<p>Depending on your business, you may also need health certificates, fire approval, advertising approval, an alcohol licence, construction permits, environmental approval or professional licences. Businesses with employees should also complete the required NSSF and Social Health Authority employer registrations.</p>
<p>Before opening, confirm that you have your registration certificate, KRA PIN, county permit and any licence required for your specific business activity.</p>
`,
    relatedSlugs: ['how-to-file-kra-returns-kenya', 'how-to-register-sha-afya-yangu', 'how-to-apply-certificate-good-conduct-kenya'],
  },
];

export const BLOG_CATEGORIES = [
  'All',
  ...Array.from(new Set(BLOG_ARTICLES.map((article) => article.category))),
];

export const BLOG_ARTICLES_LOOKUP = Object.fromEntries(
  BLOG_ARTICLES.map((article) => [article.slug, article])
) as Record<string, BlogArticle>;
