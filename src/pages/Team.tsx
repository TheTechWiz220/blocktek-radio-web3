import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Twitter, Linkedin, Github, Globe } from "lucide-react";

const Team = () => {
  const founders = [
    {
      name: "The Tech Wiz",
      role: "Co-Founder & CEO",
      bio: "Blockchain evangelist driving Web3 adoption across Africa",
      twitter: "thetechwiz220",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=techwiz"
    },
    {
      name: "Stan Munyasia",
      role: "Co-Founder & CTO",
      bio: "Technical architect building the future of decentralized radio",
      twitter: "stanmunyasia",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=stan"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Ochieng",
      role: "Head of Content",
      bio: "Curating the best Web3 content and educational resources",
      twitter: "sarahweb3",
      linkedin: "sarahochieng",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      name: "David Kamau",
      role: "Lead Developer",
      bio: "Building scalable blockchain integrations and smart contracts",
      twitter: "davidblockdev",
      github: "davidkamau",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david"
    },
    {
      name: "Amina Hassan",
      role: "Community Manager",
      bio: "Growing and engaging our global Web3 community",
      twitter: "aminacrypto",
      linkedin: "aminahassan",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amina"
    },
    {
      name: "James Mwangi",
      role: "Blockchain Analyst",
      bio: "Providing insights on crypto markets and blockchain trends",
      twitter: "jamescryptoanalyst",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=james"
    }
  ];

  const contributors = [
    {
      name: "Lisa Wanjiru",
      role: "Content Contributor",
      bio: "NFT artist and Web3 content creator",
      twitter: "lisanft",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa"
    },
    {
      name: "Peter Odhiambo",
      role: "Technical Writer",
      bio: "Simplifying complex blockchain concepts for everyone",
      twitter: "peterblockchain",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter"
    },
    {
      name: "Grace Akinyi",
      role: "Social Media Manager",
      bio: "Amplifying BlockTek Radio across all platforms",
      twitter: "graceweb3",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace"
    }
  ];

  const advisors = [
    {
      name: "Dr. Michael Njoroge",
      role: "Blockchain Advisor",
      bio: "PhD in Distributed Systems, advising on technical architecture",
      linkedin: "drmichaelnjoroge",
      website: "michaelnjoroge.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
    },
    {
      name: "Caroline Mburu",
      role: "Business Advisor",
      bio: "Former VP at major crypto exchange, guiding business strategy",
      linkedin: "carolinemburu",
      twitter: "carolinecrypto",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=caroline"
    },
    {
      name: "Alex Kipchirchir",
      role: "Legal Advisor",
      bio: "Crypto regulations expert ensuring compliance across Africa",
      linkedin: "alexkipchirchir",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    }
  ];

  const SocialLink = ({ platform, handle, url }: { platform: string; handle?: string; url?: string }) => {
    const icons = {
      twitter: Twitter,
      linkedin: Linkedin,
      github: Github,
      website: Globe
    };
    
    const Icon = icons[platform as keyof typeof icons];
    const finalUrl = url || (
      platform === 'twitter' ? `https://x.com/${handle}` :
      platform === 'linkedin' ? `https://linkedin.com/in/${handle}` :
      platform === 'github' ? `https://github.com/${handle}` :
      `https://${handle}`
    );

    return (
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
      >
        <Icon className="w-4 h-4 text-primary" />
      </a>
    );
  };

  const TeamCard = ({ person, socialLinks }: { person: any; socialLinks: React.ReactNode }) => (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-purple group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img
            src={person.image}
            alt={person.name}
            className="w-24 h-24 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-all"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">{person.name}</h3>
          <p className="text-primary text-sm font-medium mb-2">{person.role}</p>
          <p className="text-muted-foreground text-sm">{person.bio}</p>
        </div>
        <div className="flex gap-2 pt-2">
          {socialLinks}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Meet the <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The passionate individuals building the future of Web3 radio and driving blockchain adoption across Africa
            </p>
          </div>
        </section>

        {/* Founders */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Founders</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {founders.map((founder, index) => (
                <div key={founder.name} style={{ animationDelay: `${index * 100}ms` }}>
                  <TeamCard
                    person={founder}
                    socialLinks={
                      <SocialLink platform="twitter" handle={founder.twitter} />
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Team */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Core <span className="text-gradient">Team</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div key={member.name} style={{ animationDelay: `${index * 100}ms` }}>
                  <TeamCard
                    person={member}
                    socialLinks={
                      <>
                        {member.twitter && <SocialLink platform="twitter" handle={member.twitter} />}
                        {member.linkedin && <SocialLink platform="linkedin" handle={member.linkedin} />}
                        {member.github && <SocialLink platform="github" handle={member.github} />}
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contributors */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Contributors</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contributors.map((contributor, index) => (
                <div key={contributor.name} style={{ animationDelay: `${index * 100}ms` }}>
                  <TeamCard
                    person={contributor}
                    socialLinks={
                      <SocialLink platform="twitter" handle={contributor.twitter} />
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advisors */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-gradient">Advisors</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {advisors.map((advisor, index) => (
                <div key={advisor.name} style={{ animationDelay: `${index * 100}ms` }}>
                  <TeamCard
                    person={advisor}
                    socialLinks={
                      <>
                        {advisor.twitter && <SocialLink platform="twitter" handle={advisor.twitter} />}
                        {advisor.linkedin && <SocialLink platform="linkedin" handle={advisor.linkedin} />}
                        {advisor.website && <SocialLink platform="website" handle={advisor.website} />}
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Card className="p-12 bg-gradient-primary/10 border-primary/30 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Want to <span className="text-gradient">Join Us?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're always looking for talented individuals passionate about Web3 and blockchain technology.
              </p>
              <a
                href="#community"
                className="inline-block px-8 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Involved
              </a>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
