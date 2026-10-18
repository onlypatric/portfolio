import { Fade, Slide, Stagger, HoverEffect } from '@/_components/common/ohmygui/behavior';
import { ArrowsLeftRightIcon, ChargingStationIcon, MapPinIcon, SquaresFourIcon, WaveformIcon, ImageIcon, ChatTextIcon, CubeIcon, CirclesThreeIcon } from '@phosphor-icons/react';
import Playground from './Playground';
import { HStack, VStack } from '@/_components/common/ohmygui/layout';
import { Text, Link } from '@/_components/common/ohmygui/content';

const Arrow = () => <span aria-hidden="true">↗</span>;
const projectGroups = [
  {
    title: 'Infrastructure & operations',
    projects: [
      { id: 'ocpp-proxy', icon: ArrowsLeftRightIcon, tone: 'sage', title: 'OCPP WebSocket reverse proxy (NDA)', description: 'Targeting low latency and high throughput for OCPP connections.' },
      { id: 'charger-platform', icon: ChargingStationIcon, tone: 'sand', title: 'Charger management platform (NDA)', description: 'A CPMS for managing EV chargers.' },
      { id: 'tracker-server', icon: MapPinIcon, tone: 'clay', title: 'Teltonika tracker server (NDA)', description: 'Vehicle tracking with Teltonika devices.' },
      { id: 'fleet-operations', icon: SquaresFourIcon, tone: 'sage', title: 'Fleet, charging & facility operations (NDA)', description: 'Production Next.js frontend: 1,000+ vehicles, 1,000+ chargers, 20 storage facilities.' },
    ],
  },
  {
    title: 'AI & machine learning',
    projects: [
      { id: 'power-forecasting', icon: WaveformIcon, tone: 'sand', title: 'Facility power forecasting (NDA)', description: 'Custom AI predicting a storage facility’s power consumption.' },
      { id: 'text-to-image', icon: ImageIcon, tone: 'clay', title: 'Text-to-image model', description: 'Custom generative model with 2 billion parameters.' },
      { id: 'text-to-text', icon: ChatTextIcon, tone: 'sage', title: 'Text-to-text model', description: 'Custom language model with 2 billion parameters.' },
    ],
  },
  {
    title: 'Side projects & experiments',
    projects: [
      { id: 'minecraft-plugins', icon: CubeIcon, tone: 'sand', title: 'Minecraft plugins', description: 'Custom plugins built as a hobby.' },
      { id: 'instagram-experiment', icon: CirclesThreeIcon, tone: 'clay', title: 'Instagram automation experiment', description: 'Past experiment: 1,000 accounts automated for algorithm manipulation and testing.' },
    ],
  },
];
const experience = [
  {
    area: 'EDUCATION · YEAR 2, SEMESTER 1',
    title: 'Politecnico di Torino',
    description: 'Computer Engineering (Ingegneria Informatica), bachelor’s degree · L-8. In progress.',
    href: 'https://www.polito.it/didattica/corsi-di-laurea/ingegneria-informatica',
    linkLabel: 'About the degree',
  },
  {
    area: 'FREELANCE',
    title: 'Independent software developer',
    description: 'Italian Partita IVA (VAT registration). Available exclusively for per-project contracts.',
    href: 'mailto:patric@pintescul.com',
    linkLabel: 'Discuss a project',
  },
  { area: 'SYSTEMS', title: 'Working within constraints', description: 'Building critical systems under compute and memory constraints.' },
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
      </header></Fade>
      <main id="main" className="page-width">
        <section className="hero" aria-labelledby="intro-title">
          <Slide direction="up" distance={18} duration={850} delay={80}><Text as="h1" id="intro-title" className="hero-title">Connected systems.<br /><span>Thoughtful interfaces.</span></Text></Slide>
          <Fade duration={800} delay={180}><div className="hero-bottom">
            <Text as="p" className="intro-copy">I’m Patric, a freelance developer building connected systems, web apps, and AI.</Text>
            <VStack gap="md" align="end" className="hero-actions"><Link href="#current" className="text-link">Explore my work <span aria-hidden="true">↓</span></Link><Link href="mailto:patric@pintescul.com" className="text-link contact-email">Let’s talk <Arrow /></Link></VStack>
          </div>
          </Fade>
        </section>

        <section id="current" className="portfolio-section" aria-labelledby="projects-title">
          <div className="section-heading"><HStack align="baseline" gap="md"><span className="section-number">01</span><Text as="h2" id="projects-title">Projects</Text></HStack></div>
          <Slide direction="up" distance={20} duration={750}><article className="featured-project">
            <VStack className="project-copy" gap="lg" justify="between">
              <span className="project-status"><span className="status-dot" /> In development</span>
              <div><span className="project-symbol" aria-hidden="true">⌘</span><Text as="h3">ohmygui<span className="accent">.</span></Text><Text as="p" className="project-description">SwiftUI-inspired components for React.</Text></div>
              <div><Link href="/ohmygui" className="text-link">Explore components <Arrow /></Link></div>
            </VStack>
            <div className="project-preview"><Playground /></div>
          </article></Slide>
          <div className="project-groups">
            {projectGroups.map(group => <section className="project-group" key={group.title} aria-label={group.title}>
              <Fade duration={650}><div className="project-group-heading"><Text as="h3">{group.title}</Text></div></Fade>
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
                    <Text as="h4">{project.title}</Text>
                    <Text as="p" className="project-summary">{project.description}</Text>
                  </div>
                </article>)}
              </Stagger>
            </section>)}
          </div>
        </section>

        <section id="writing" className="portfolio-section writing-empty" aria-labelledby="writing-title">
          <HStack align="baseline" gap="md"><span className="section-number">02</span><Text as="h2" id="writing-title">Writing</Text></HStack>
          <Text as="p" className="muted">First posts coming soon.</Text>
        </section>

        <section id="experience" className="portfolio-section" aria-labelledby="experience-title">
          <div className="section-heading"><HStack align="baseline" gap="md"><span className="section-number">03</span><Text as="h2" id="experience-title">Experience</Text></HStack></div>
            <Stagger effect="fade" duration={750} stagger={100} className="experience-list experience-overview">{experience.map(item => <article className="experience-entry" key={item.area}>
              <span className="timeline-dot" aria-hidden="true" /><Text as="span" className="small-label accent">{item.area}</Text><Text as="h3">{item.title}</Text><Text as="p" className="muted">{item.description}</Text>
              {item.href && <Link href={item.href} className="text-link">{item.linkLabel} <Arrow /></Link>}
            </article>)}</Stagger>
        </section>
        <footer className="portfolio-footer"><div><Text as="p" className="footer-title">Let’s talk<span className="accent">.</span></Text><Link href="mailto:patric@pintescul.com" className="text-link contact-email">patric@pintescul.com <Arrow /></Link></div><Link href="#home" className="text-link">Back to top <span aria-hidden="true">↑</span></Link><div className="footer-bottom"><span>© {year} Patric</span></div></footer>
      </main>
    </div>
  );
}
