import { Fade, Slide, Stagger, HoverEffect } from '@/_components/common/ohmygui/behavior';
import { ArrowsLeftRightIcon, ChargingStationIcon, MapPinIcon, SquaresFourIcon, WaveformIcon, ImageIcon, ChatTextIcon, CubeIcon, CirclesThreeIcon, RobotIcon } from '@phosphor-icons/react';
import Playground from './Playground';
import { HStack, VStack, Grid } from '@/_components/common/ohmygui/layout';
import { Text, Link, Badge } from '@/_components/common/ohmygui/content';

const Arrow = () => <span aria-hidden="true">↗</span>;
const topics = ['Connected systems & OCPP', 'Applied AI & generative models', 'Interface design & React'];
const projectGroups = [
  {
    title: 'Infrastructure & operations',
    description: 'From device connections to the interfaces that run daily operations.',
    projects: [
      { id: 'ocpp-proxy', icon: ArrowsLeftRightIcon, tone: 'sage', title: 'OCPP WebSocket reverse proxy (NDA)', description: 'A WebSocket proxy built for OCPP, targeting low latency and high throughput.', tags: ['OCPP', 'WebSockets', 'Networking'] },
      { id: 'charger-platform', icon: ChargingStationIcon, tone: 'sand', title: 'Charger management platform (NDA)', description: 'A charge point management system for keeping charger operations in one place.', tags: ['CPMS', 'EV charging'] },
      { id: 'tracker-server', icon: MapPinIcon, tone: 'clay', title: 'Teltonika tracker server (NDA)', description: 'A dedicated tracking server connecting Teltonika devices to vehicle operations.', tags: ['Teltonika', 'Vehicle tracking'] },
      { id: 'fleet-operations', icon: SquaresFourIcon, tone: 'sage', title: 'Fleet, charging & facility operations (NDA)', description: 'A production Next.js frontend server managing upwards of 1,000 vehicles, 1,000 chargers, and 20 storage facilities.', tags: ['Next.js', 'Production systems'] },
    ],
  },
  {
    title: 'AI & machine learning',
    description: 'Custom prediction systems and generative models.',
    projects: [
      { id: 'power-forecasting', icon: WaveformIcon, tone: 'sand', title: 'Facility power forecasting (NDA)', description: 'A custom AI system for predicting the power consumption of a storage facility.', tags: ['Predictive AI', 'Energy'] },
      { id: 'text-to-image', icon: ImageIcon, tone: 'clay', title: 'Text-to-image model', description: 'A custom text-to-image model with 2 billion parameters.', tags: ['Generative AI', '2B parameters'] },
      { id: 'text-to-text', icon: ChatTextIcon, tone: 'sage', title: 'Text-to-text model', description: 'A custom text-to-text model with 2 billion parameters.', tags: ['Language models', '2B parameters'] },
    ],
  },
  {
    title: 'Side projects & experiments',
    description: 'Making things outside the main workbench, too.',
    projects: [
      { id: 'minecraft-plugins', icon: CubeIcon, tone: 'sand', title: 'Minecraft plugins', description: 'A variety of custom Minecraft plugins, developed as a side hobby.', tags: ['Minecraft', 'Plugins', 'Hobby'] },
      { id: 'instagram-experiment', icon: CirclesThreeIcon, tone: 'clay', title: 'Instagram automation experiment', description: 'A past side project automating a set of 1,000 Instagram accounts for algorithm manipulation and testing.', tags: ['Automation', 'Past experiment'] },
    ],
  },
];
const experience = [
  {
    area: 'EDUCATION · YEAR 2, SEMESTER 1',
    title: 'Politecnico di Torino',
    description: 'Currently studying Ingegneria Informatica (Computer Engineering), a three-year bachelor’s degree in the L-8 class: Ingegneria dell’informazione. I’m in my second year, first semester.',
    href: 'https://www.polito.it/didattica/corsi-di-laurea/ingegneria-informatica',
    linkLabel: 'About the degree',
  },
  {
    area: 'FREELANCE · PARTITA IVA',
    title: 'Independent software developer',
    description: 'I work as a freelancer with an Italian Partita IVA (VAT registration). I’m available exclusively for per-project contracts, with the scope and deliverables agreed for each job.',
    href: 'mailto:patric@pintescul.com',
    linkLabel: 'Discuss a project',
  },
  { area: 'LOW END SYSTEMS', title: 'From devices to operations', description: 'Thanks to my studies at Politecnico di Torino I\'ve been able to build critical systems under compute & memory constraints' },
  { area: 'CUSTOM AI', title: 'Prediction and generation', description: 'Developed facility power-consumption forecasting alongside text-to-image and text-to-text models with 2 billion parameters each.' },
  { area: 'INTERFACES & INDEPENDENT WORK', title: 'Tools, components, and experiments', description: 'Building ohmygui, a React take on SwiftUI, alongside Minecraft plugins and independent automation experiments.' },
];

export default function Portfolio({ images, year }: { images: Record<string, string>; year: number }) {
  return (
    <div className="portfolio" id="home">
      <Link href="#main" className="skip-link">Skip to content</Link>
      <Fade duration={550}><header className="portfolio-nav page-width">
        <Link href="#home" className="wordmark" aria-label="Patric — home"><img src="/index/LOGO.svg" alt="" width="24" height="28" />patric<span className="accent">.</span></Link>
        <HStack as="nav" aria-label="Main navigation" gap="lg" align="center">
          <Link href="#current">Projects</Link><Link href="#writing">Writing</Link><Link href="#experience">Experience</Link>
        </HStack>
        <span className="nav-note">A personal corner of the internet</span>
      </header></Fade>
      <main id="main" className="page-width">
        <section className="hero" aria-labelledby="intro-title">
          <Fade duration={650}><HStack gap="sm" align="center" className="eyebrow"><span className="status-dot" />A SMALL CORNER FOR BIG IDEAS</HStack></Fade>
          <Slide direction="up" distance={18} duration={850} delay={80}><Text as="h1" id="intro-title" className="hero-title">Connected systems.<br /><span>Thoughtful interfaces.</span><br />A lot of making.</Text></Slide>
          <Fade duration={800} delay={180}><div className="hero-bottom">
            <Text as="p" className="intro-copy">I’m Patric. I build connected infrastructure, production web applications, and custom AI — from charging systems and vehicle tracking to the interfaces that bring them together.</Text>
            <VStack gap="md" align="end" className="hero-actions"><Link href="#current" className="text-link">Explore my work <span aria-hidden="true">↓</span></Link><Link href="mailto:patric@pintescul.com" className="text-link contact-email">Let’s talk <Arrow /></Link></VStack>
          </div>
          </Fade>
          <span className="hero-index" aria-hidden="true">HI / BING / BONG</span>
        </section>

        <section id="current" className="portfolio-section" aria-labelledby="projects-title">
          <div className="section-heading"><HStack align="baseline" gap="md"><span className="section-number">01</span><Text as="h2" id="projects-title">On my workbench</Text></HStack><span className="section-aside">Selected builds, current work & past experiments</span></div>
          <Slide direction="up" distance={20} duration={750}><article className="featured-project">
            <VStack className="project-copy" gap="lg" justify="between">
              <HStack gap="sm" align="center"><Badge tone="outline">FEATURED PROJECT</Badge><span className="project-status"><span className="status-dot" /> In development</span></HStack>
              <div><span className="project-symbol" aria-hidden="true">⌘</span><Text as="h3">ohmygui<span className="accent">.</span></Text><Text as="p" className="project-description">A little SwiftUI.<br />A whole lot of React.</Text><Text as="p" className="muted project-detail">A component library for composing interfaces that feel at home. Familiar ideas, thoughtful primitives, and room to make it your own.</Text></div>
              <div><HStack gap="sm" wrap className="project-tags"><Badge tone="soft">React</Badge><Badge tone="soft">TypeScript</Badge><Badge tone="soft">UI library</Badge></HStack><Link href="/ohmygui" className="text-link">Meet the components <Arrow /></Link></div>
            </VStack>
            <div className="project-preview"><div className="preview-caption"><span>A LITTLE PLAYGROUND</span><span>TRY IT OUT ↙</span></div><Playground /><div className="preview-footnote"><span className="status-dot" /> Made with the same pieces as this page.</div></div>
          </article></Slide>
          <div className="project-groups">
            {projectGroups.map(group => <section className="project-group" key={group.title} aria-label={group.title}>
              <Fade duration={650}><div className="project-group-heading"><Text as="h3">{group.title}</Text><Text as="p" className="muted">{group.description}</Text></div></Fade>
              <Stagger className="project-grid" effect="slide" duration={650} stagger={90} maxDelay={180}>
                {group.projects.map(project => <article className="project-card" key={project.id}>
                  <HoverEffect variant="scale" duration={450} className="project-art-motion">
                    <div className={`project-art project-art--${project.tone}`} aria-hidden="true">
                      {images[project.id] ? <img src={images[project.id]} alt="" width="1600" height="1000" loading="lazy" decoding="async" /> : <>
                        <div className="art-orbit art-orbit--outer" /><div className="art-orbit art-orbit--inner" />
                        <div className="art-tile art-tile--back" /><div className="art-tile"><project.icon size={60} weight="light" /></div>
                        <span className="art-spark art-spark--one" /><span className="art-spark art-spark--two" />
                      </>}
                    </div>
                  </HoverEffect>
                  <div className="project-card-copy">
                    <Text as="p" className="project-meta">{project.tags.join(' · ')}</Text>
                    <Text as="h4">{project.title}</Text>
                    <Text as="p" className="project-summary">{project.description}</Text>
                  </div>
                </article>)}
              </Stagger>
            </section>)}
          </div>
        </section>

        <section id="writing" className="portfolio-section" aria-labelledby="writing-title">
          <div className="section-heading"><HStack align="baseline" gap="md"><span className="section-number">02</span><Text as="h2" id="writing-title">Stuff I'm doing right now</Text></HStack><span className="section-aside">A space to think out loud</span></div>
          <Slide direction="up" distance={16} duration={750}><Grid className="writing-grid">
            <VStack gap="lg" className="writing-intro"><span className="writing-mark" aria-hidden="true">✳</span><Text as="p">Things I’m learning.<br />Details I’m noticing.<br />Ideas worth keeping.</Text><Badge tone="outline">I'M CURRENTLY WORKING ON THIS SECTION</Badge></VStack>
            <div className="writing-topics"><Text as="p" className="small-label">ON MY ROADMAP</Text><HStack align="center" justify="between" className="topic-row"><HStack align="center" gap="lg"><span className="section-number">01</span><Text><RobotIcon/> I'm working on it...</Text></HStack><span className="muted small-label">UPCOMING</span></HStack><Text as="p" className="muted writing-note">No posts published yet. Just a few good starting points.</Text></div>
          </Grid></Slide>
        </section>

        <section id="experience" className="portfolio-section" aria-labelledby="experience-title">
          <div className="section-heading"><HStack align="baseline" gap="md"><span className="section-number">03</span><Text as="h2" id="experience-title">The path so far</Text></HStack><span className="section-aside">Education, independent work & hands-on experience</span></div>
          <div className="experience-layout">
            <div><Text as="p" className="experience-lede">From the connection<br />to the <em>experience.</em></Text><Text as="p" className="muted">I combine Computer Engineering studies at Politecnico di Torino with freelance work across connected systems, custom AI, and interface design.</Text></div>
            <Stagger effect="fade" duration={750} stagger={100} className="experience-list">{experience.map(item => <article className="experience-entry" key={item.area}>
              <span className="timeline-dot" aria-hidden="true" /><Text as="span" className="small-label accent">{item.area}</Text><Text as="h3">{item.title}</Text><Text as="p" className="muted">{item.description}</Text>
              {item.href && <Link href={item.href} className="text-link">{item.linkLabel} <Arrow /></Link>}
            </article>)}</Stagger>
          </div>
        </section>
        <footer className="portfolio-footer"><div><Text as="p" className="footer-title">Have something in mind<span className="accent">?</span></Text><Link href="mailto:patric@pintescul.com" className="text-link contact-email">patric@pintescul.com <Arrow /></Link><Text as="p" className="contact-note">Let’s talk about your next project. Per-project contracts, with Italian Partita IVA.</Text></div><Link href="#home" className="text-link">Back to top <span aria-hidden="true">↑</span></Link><div className="footer-bottom"><span>© {year} Patric</span><Link href="/ohmygui">Explore the component library <Arrow /></Link><span>AN ONGOING EXPLORATION</span></div></footer>
      </main>
    </div>
  );
}
