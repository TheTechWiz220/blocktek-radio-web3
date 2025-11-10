import { Card } from "@/components/ui/card";
import { Target, Eye, Users, Zap } from "lucide-react";

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
      </div>
    </section>
  );
};

export default About;
