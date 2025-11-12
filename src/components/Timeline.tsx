import { Card } from "@/components/ui/card";
import { Calendar, Trophy, Radio, Rocket, Users, Zap } from "lucide-react";

const Timeline = () => {
  const milestones = [
    {
      year: "2024",
      quarter: "Q1",
      title: "BlockTek Radio Launch",
      description: "Founded by blockchain enthusiasts to revolutionize Web3 media in Africa",
      icon: Rocket,
      color: "from-purple-500 to-blue-500"
    },
    {
      year: "2024",
      quarter: "Q2",
      title: "First 1,000 Listeners",
      description: "Reached our first milestone with growing community engagement across the continent",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2024",
      quarter: "Q3",
      title: "NFT Zone Launch",
      description: "Introduced NFT minting platform for artists and creators to showcase their work",
      icon: Trophy,
      color: "from-cyan-500 to-teal-500"
    },
    {
      year: "2024",
      quarter: "Q4",
      title: "24/7 Live Streaming",
      description: "Launched continuous blockchain content streaming with real-time crypto market updates",
      icon: Radio,
      color: "from-teal-500 to-green-500"
    },
    {
      year: "2025",
      quarter: "Q1",
      title: "Education Hub Expansion",
      description: "Partnered with leading Web3 educators to provide comprehensive blockchain courses",
      icon: Zap,
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2025",
      quarter: "Q2",
      title: "$BLOCK Token Coming Soon",
      description: "Preparing to launch our native token for enhanced community governance and rewards",
      icon: Calendar,
      color: "from-emerald-500 to-purple-500"
    }
  ];

  return (
    <section id="timeline" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From inception to innovation - tracking BlockTek Radio's milestones in building Africa's premier Web3 media platform
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 hidden sm:block" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-2 md:-translate-x-2 z-10 hidden sm:block" />

                  {/* Content card */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-purple group ml-16 sm:ml-0">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${milestone.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                            <span className="text-xs text-muted-foreground">{milestone.quarter}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground text-sm">{milestone.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="hidden md:block w-5/12" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Future goals CTA */}
        <div className="mt-20 text-center">
          <Card className="p-8 bg-gradient-primary/10 border-primary/30 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              The Journey <span className="text-gradient">Continues</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Join us as we shape the future of Web3 media and blockchain adoption across Africa and beyond
            </p>
            <a
              href="#community"
              className="inline-block px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Join Our Community
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
