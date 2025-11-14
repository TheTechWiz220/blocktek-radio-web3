// src/data/founders.ts
export type Founder = {
  name: string;
  role?: string;
  handle?: string;
  twitter?: string;
  xUrl?: string;
  linkedin?: string;
  website?: string;
  email?: string;
  location?: string;
  bio?: string;
  image?: string;
};

export const FOUNDERS: Founder[] = [
  {
    name: "The TechWiz",
    role: "Founder & CTO",                     // ← Founder
    handle: "@thetechwiz220",
    twitter: "thetechwiz220",
    xUrl: "https://x.com/thetechwiz220",
    linkedin: "https://www.linkedin.com/in/thetechwiz220",
    website: "https://thetechwiz220.fun",
    email: "hello@thetechwiz.dev",
    location: "Banjul, The Gambia",
    bio: "Blockchain developer and educator focused on building infrastructure and tools that make Web3 accessible. Leads technical strategy, product architecture, and developer community initiatives.",
    // ← Direct path to the uploaded image
    image: "/images/founders/techwiz-avatar.jpg"
  },
  {
    name: "Stan Munyasia",
    role: "Advisor & Head of Content",         // ← Advisor
    handle: "@stanmunyasia",
    twitter: "stanmunyasia",
    xUrl: "https://x.com/stanmunyasia",
    linkedin: "https://www.linkedin.com/in/stanmunyasia",
    website: "https://stanmunyasia.com",
    email: "contact@stanmunyasia.com",
    location: "Nairobi, Kenya",
    bio: "Content strategist and host with a passion for translating complex blockchain topics into engaging stories. Manages editorial, partnerships, and community programming.",
    image: "https://unavatar.io/twitter/stanmunyasia"
  }
];
