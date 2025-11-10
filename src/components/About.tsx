import { Card } from "@/components/ui/card";
import { Target, Eye, Users, Zap, Twitter, Globe, Mail, MapPin, Linkedin } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Building a vibrant Web3 community through top-quality blockchain content and education."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be Africa's leading Web3 radio platform, driving blockchain innovation and adoption."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Creating interactive spaces for blockchain enthusiasts, developers, and creators."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging blockchain technology to revolutionize internet radio and music distribution."
    }
  ];

  // Replace the placeholder values below with real names, bios, and links.
  const founders = [
    {
      name: "The Tech Wiz",
      title: "Co-Founder & CTO",
      handle: "@thetechwiz220",
      xUrl: "https://x.com/thetechwiz220",
      linkedin: "https://www.linkedin.com/in/thetechwiz220",
      website: "https://thetechwiz220.fun",
      email: "hello@thetechwiz.dev",
      location: "Banjul, The Gambia",
      bio: "Blockchain developer and educator focused on building infrastructure and tools that make Web3 accessible. Leads technical strategy, product architecture, and developer community initiatives."
    },
    {
      name: "Stan Munyasia",
      title: "Co-Founder & Head of Content",
      handle: "@stanmunyasia",
      xUrl: "https://x.com/stanmunyasia",
      linkedin: "https://www.linkedin.com/in/stanmunyasia",
      website: "https://stanmunyasia.com",
      email: "contact@stanmunyasia.com",
      location: "Nairobi, Kenya",
      bio: "Content strategist and host with a passion for translating complex blockchain topics into engaging stories. Manages editorial, partnerships, and community programming."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-gradient">BlockTek Radio</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            As a blockchain evangelist and founder, I'm committed to creating a platform that leverages
            blockchain technology to revolutionize internet radio. We collaborate with leading Web3 chains
            and projects, sharing news, insights, and updates exclusively around Web3 and blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-purple group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-12">
            Meet the <span className="text-gradient">Founders</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((f) => (
              <Card
                key={f.handle}
                className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-purple group"
              >
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Twitter className="w-10 h-10 text-primary-foreground" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold">{f.name}</h4>
                    <p className="text-sm text-muted-foreground">{f.title}</p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed text-sm">{f.bio}</p>

                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{f.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-2">
                    <a
                      href={f.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Visit ${f.name}'s X (Twitter)`}
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="hidden sm:inline">{f.handle}</span>
                    </a>

                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Visit ${f.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>

                    <a
                      href={f.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Visit ${f.name}'s website`}
                    >
                      <Globe className="w-5 h-5" />
                      <span className="hidden sm:inline">Website</span>
                    </a>

                    <a
                      href={`mailto:${f.email}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Email ${f.name}`}
                    >
                      <Mail className="w-5 h-5" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
