import { blogPosts } from '../../_contracts/common/blog/posts';
import { Fade, Slide, Stagger, HoverEffect } from '@/_components/common/ohmygui/behavior';
import Playground from './Playground';
import { Group } from '@/_components/common/ohmygui/collection/Group';
import { HStack, VStack } from '@/_components/common/ohmygui/layout';
import { Text, Link, Image, Icon } from '@/_components/common/ohmygui/content';

const Arrow = () => <Group as="span" aria-hidden="true">↗</Group>;
const projectGroups = [
  {
    title: 'Infrastructure & operations',
    projects: [
      { id: 'ocpp-proxy', icon: 'ArrowsLeftRight', tone: 'sage', title: 'OCPP WebSocket reverse proxy (NDA)', description: 'Targeting low latency and high throughput for OCPP connections.' },
      { id: 'charger-platform', icon: 'ChargingStation', tone: 'sand', title: 'Charger management platform (NDA)', description: 'A CPMS for managing EV chargers.' },
      { id: 'tracker-server', icon: 'MapPin', tone: 'clay', title: 'Teltonika tracker server (NDA)', description: 'Vehicle tracking with Teltonika devices.' },
      { id: 'fleet-operations', icon: 'SquaresFour', tone: 'sage', title: 'Fleet, charging & facility operations (NDA)', description: 'Production Next.js frontend: 1,000+ vehicles, 1,000+ chargers, 20 storage facilities.' },
    ],
  },
  {
    title: 'AI & machine learning',
    projects: [
      { id: 'power-forecasting', icon: 'Waveform', tone: 'sand', title: 'Facility power forecasting (NDA)', description: 'Custom AI predicting a storage facility’s power consumption.' },
      { id: 'text-to-image', icon: 'Image', tone: 'clay', title: 'Text-to-image model', description: 'Custom generative model with 2 billion parameters.' },
      { id: 'text-to-text', icon: 'ChatText', tone: 'sage', title: 'Text-to-text model', description: 'Custom language model with 2 billion parameters.' },
    ],
  },
  {
    title: 'Side projects & experiments',
    projects: [
      { id: 'minecraft-plugins', icon: 'Cube', tone: 'sand', title: 'Minecraft plugins', description: 'Custom plugins built as a hobby.' },
      { id: 'instagram-experiment', icon: 'CirclesThree', tone: 'clay', title: 'Instagram automation experiment', description: 'Past experiment: 1,000 accounts automated for algorithm manipulation and testing.' },
    ],
  },
];
const experience = [
  {
    area: 'WORK · MARCH 2025-PRESENT',
    title: 'Y3K',
    description: 'Ongoing collaboration, AiO for chargers, vehicles, power management.',
  },
  {
    area: 'INDEPENDENT CONTRACTOR · ONGOING',
    title: 'UI development & UX advice',
    description: 'Building interfaces and advising small companies on UX. Italian Partita IVA; exclusively per-project contracts.',
    href: 'mailto:patric@pintescul.com',
    linkLabel: 'Discuss a project',
  },
  {
    area: 'EDUCATION · YEAR 2, SEMESTER 1',
    title: 'Politecnico di Torino',
    description: 'Computer Engineering (Ingegneria Informatica), bachelor’s degree · L-8. In progress.',
    href: 'https://www.polito.it/didattica/corsi-di-laurea/ingegneria-informatica',
    linkLabel: 'About the degree',
  },
  {
    area: 'EDUCATION · JUNE 2025',
    title: 'High school diploma ITIS A. Volta',
    description: 'Graduated with the maximum score: 100/100.',
  },
  {
    area: 'RECENT INTEREST',
    title: 'Embedded systems & protocols',
    description: 'Exploring C, C++, and Rust for embedded systems and protocol implementation under compute and memory constraints. (Update) Built a Rust server supporting HTTP/1.1, HTTP/2, and HTTP/3.',
  },
];

export default function Portfolio({ images, year }: { images: Record<string, string>; year: number }) {
  return (
    <Group as="div" className="portfolio" id="home">
      <Link href="#main" className="skip-link">Skip to content</Link>
      <Fade duration={550}><Group as="header" className="portfolio-nav page-width">
        <Link href="#home" className="wordmark" aria-label="Patric — home"><Image src="/index/LOGO.svg" alt="" width="24" height="28" loading="eager" />patric<Group as="span" className="accent">.</Group></Link>
        <HStack as="nav" aria-label="Main navigation" gap="lg" align="center">
          <Link href="#current">Projects</Link><Link href="#writing">Writing</Link><Link href="#experience">Experience</Link>
        </HStack>
      </Group></Fade>
      <Group as="main" id="main" className="page-width">
        <Group as="section" className="hero" aria-labelledby="intro-title">
          <Slide direction="up" distance={18} duration={850} delay={80}><Text as="h1" id="intro-title" className="hero-title">Connected systems.<Group as="span" style={{ display: 'block' }}>Thoughtful interfaces.</Group></Text></Slide>
          <Fade duration={800} delay={180}><Group as="div" className="hero-bottom">
            <VStack>
              <Text as="p" className="intro-copy">I’m Patric, a freelance developer building connected systems, web apps, and AI.</Text>
              <Text as="p" className='italic' color='muted'>Portfolio 100% made with <Link href="/ohmygui" className="text-link">"OhMyGUI"</Link></Text>
            </VStack>
            <VStack gap="md" align="end" className="hero-actions"><Link href="#current" className="text-link">Explore my work <Group as="span" aria-hidden="true">↓</Group></Link><Link href="mailto:patric@pintescul.com" className="text-link contact-email">Let’s talk <Arrow /></Link></VStack>
          </Group>
          </Fade>
        </Group>

        <Group as="section" id="current" className="portfolio-section" aria-labelledby="projects-title">
          <Group as="div" className="section-heading"><HStack align="baseline" gap="md"><Group as="span" className="section-number">01</Group><Text as="h2" id="projects-title">Projects</Text></HStack></Group>
          <Slide direction="up" distance={20} duration={750}><Group as="article" className="featured-project">
            <VStack className="project-copy" gap="lg" justify="between">
              <Group as="span" className="project-status"><Group as="span" className="status-dot" /> In development</Group>
              <Group as="div"><Group as="span" className="project-symbol" aria-hidden="true">⌘</Group><Text as="h3">ohmygui<Group as="span" className="accent">.</Group></Text><Text as="p" className="project-description">SwiftUI-inspired components for React.</Text></Group>
              <Group as="div"><Link href="/ohmygui" className="text-link">Explore components <Arrow /></Link></Group>
            </VStack>
            <Group as="div" className="project-preview"><Playground /></Group>
          </Group></Slide>
          <Group as="div" className="project-groups">
            {projectGroups.map(group => <Group as="section" className="project-group" key={group.title} aria-label={group.title}>
              <Fade duration={650}><Group as="div" className="project-group-heading"><Text as="h3">{group.title}</Text></Group></Fade>
              <Stagger className="project-grid" effect="slide" duration={650} stagger={90} maxDelay={180}>
                {group.projects.map(project => <Group as="article" className="project-card" key={project.id}>
                  <HoverEffect variant="scale" duration={450} className="project-art-motion">
                    <Group as="div" className={`project-art project-art--${project.tone}`} aria-hidden="true">
                      {images[project.id] ? <Image fit="cover" src={images[project.id]} alt="" width="1000" height="1000" loading="lazy" decoding="async" /> : <Group>
                        <Group as="div" className="art-orbit art-orbit--outer" /><Group as="div" className="art-orbit art-orbit--inner" />
                        <Group as="div" className="art-tile art-tile--back" /><Group as="div" className="art-tile"><Icon name={project.icon} size={60} stroke="light" /></Group>
                        <Group as="span" className="art-spark art-spark--one" /><Group as="span" className="art-spark art-spark--two" />
                      </Group>}
                    </Group>
                  </HoverEffect>
                  <Group as="div" className="project-card-copy">
                    <Text as="h4">{project.title}</Text>
                    <Text as="p" className="project-summary">{project.description}</Text>
                  </Group>
                </Group>)}
              </Stagger>
            </Group>)}
          </Group>
        </Group>

        <Group as="section" id="writing" className="portfolio-section" aria-labelledby="writing-title">
          <Group as="div" className="section-heading"><HStack align="baseline" gap="md"><Group as="span" className="section-number">02</Group><Text as="h2" id="writing-title">Writing</Text></HStack></Group>
          <Stagger effect="slide" duration={650} stagger={90} className="writing-posts">
            {blogPosts.map(post => <Group as="article" key={post.key}>
              <Link href={`/blog/${post.key}/`} className="writing-card">
                <Group as="div" className="writing-card-art" aria-hidden="true"><Icon name="PenNib" size={46} stroke="light" /></Group>
                <VStack gap="sm" className="writing-card-copy">
                  <Text as="p" className="small-label accent">{post.topic}</Text>
                  <Text as="h3">{post.title}</Text>
                </VStack>
                <Text as="span" className="writing-card-status">{post.status === 'draft' ? 'Preview draft' : 'Read article'} <Arrow /></Text>
              </Link>
            </Group>)}
          </Stagger>
        </Group>

        <Group as="section" id="experience" className="portfolio-section" aria-labelledby="experience-title">
          <Group as="div" className="section-heading"><HStack align="baseline" gap="md"><Group as="span" className="section-number">03</Group><Text as="h2" id="experience-title">Experience</Text></HStack></Group>
            <Stagger effect="fade" duration={750} stagger={100} className="experience-list experience-overview">{experience.map(item => <Group as="article" className="experience-entry" key={item.area}>
              <Group as="span" className="timeline-dot" aria-hidden="true" /><Text as="span" className="small-label accent">{item.area}</Text><Text as="h3">{item.title}</Text><Text as="p" className="muted">{item.description}</Text>
              {item.href && <Link href={item.href} className="text-link">{item.linkLabel} <Arrow /></Link>}
            </Group>)}</Stagger>
        </Group>
        <Group as="footer" className="portfolio-footer"><Group as="div"><Text as="p" className="footer-title">Let’s talk<Group as="span" className="accent">.</Group></Text><Link href="mailto:patric@pintescul.com" className="text-link contact-email">patric@pintescul.com <Arrow /></Link></Group><Link href="#home" className="text-link">Back to top <Group as="span" aria-hidden="true">↑</Group></Link><Group as="div" className="footer-bottom"><Group as="span">© {year} Patric</Group></Group></Group>
      </Group>
    </Group>
  );
}
