import { Card } from "@/components/ui/card";
import { Target, Eye, Users, Zap, Twitter, Globe, Mail, MapPin, Linkedin } from "lucide-react";
import { FOUNDERS } from "@/data/founders";

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

  const founders = FOUNDERS;

  // ADD THIS: Default fallback image URL (use a public placeholder or your own)
  const fallbackImage = "'/images/founders/techwiz-avatar.jpg'"; // Or '/images/default-avatar.jpg'

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
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:animate-pulse">
                    <Icon className="w-6 h-6 text-background" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">Meet Our Founders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((f, index) => (
              <Card
                key={f.name}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <img 
                      src={f.image || fallbackImage} // ← ADD FALLBACK HERE
                      alt={f.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      onError={(e) => { e.currentTarget.src = fallbackImage; }} // ← ADD ONERROR HANDLER HERE
                    />
                    <div className="absolute inset-0 rounded-full glow-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{f.name}</h3>
                  <p className="text-primary mb-4">{f.role}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{f.bio}</p>

                  <div className="flex justify-center items-center gap-2 text-muted-foreground mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>{f.location}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <a
                      href={f.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm"
                      aria-label={`Visit ${f.name}'s X (Twitter)`}
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="hidden lg:inline truncate">{f.handle}</span>
                    </a>

                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm"
                      aria-label={`Visit ${f.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden lg:inline">LinkedIn</span>
                    </a>

                    <a
                      href={f.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm"
                      aria-label={`Visit ${f.name}'s website`}
                    >
                      <Globe className="w-4 h-4" />
                      <span className="hidden lg:inline">Website</span>
                    </a>

                    <a
                      href={`mailto:${f.email}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm"
                      aria-label={`Email ${f.name}`}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="hidden lg:inline">Email</span>
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
