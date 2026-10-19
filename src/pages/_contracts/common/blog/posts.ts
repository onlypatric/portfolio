/** Browser-safe metadata shared by the homepage and prerendered article routes. */
const entries = [
  {
    key: 'why-ai-isnt-designing-my-systems',
    title: "Why I don't let AI design a ground-up system",
    topic: 'AI & architecture',
    description: 'On AI and designing systems from the ground up.',
    status: 'published',
  },
  {
    key: 'modern-ux',
    title: "Modern day user-experience for tiktok-brains",
    topic: 'Visual interaction',
    description: 'On visual interaction in the modern era of software',
    status: 'draft',
  },
] as const satisfies readonly {
  key: string;
  title: string;
  topic: string;
  description: string;
  status: 'draft' | 'published';
}[];

export type BlogPostKey = (typeof entries)[number]['key'];
export type BlogPost = Omit<(typeof entries)[number], 'status'> & { status: 'draft' | 'published' };
export const blogPosts: readonly BlogPost[] = entries;
