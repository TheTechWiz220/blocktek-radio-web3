import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Calendar, Heart } from "lucide-react";

const Community = () => {
  const stats = [
    { icon: Users, label: "Active Members", value: "10,000+", color: "text-primary" },
    { icon: MessageCircle, label: "Daily Messages", value: "5,000+", color: "text-accent" },
    { icon: Calendar, label: "Events/Month", value: "20+", color: "text-web3-pink" },
    { icon: Heart, label: "Community Rating", value: "4.9/5", color: "text-web3-cyan" },
  ];

  const features = [
    {
      title: "Discussion Forums",
      description: "Engage in conversations about blockchain, crypto trends, and Web3 innovations",
      cta: "Join Discussions"
    },
    {
      title: "Live AMAs",
      description: "Connect with blockchain leaders, developers, and industry experts",
      cta: "View Schedule"
    },
    {
      title: "Discord Community",
      description: "Real-time chat with fellow Web3 enthusiasts and BlockTek listeners",
      cta: "Join Discord"
    }
  ];

  return (
    <section id="community" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-accent animate-pulse-glow" />
            <span className="text-accent font-semibold">JOIN THE MOVEMENT</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of Africa's fastest-growing Web3 community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple group text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10 group-hover:border-primary">
                {feature.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-12 bg-gradient-primary text-primary-foreground max-w-3xl mx-auto glow-purple">
            <h3 className="text-3xl font-bold mb-4">Ready to Join?</h3>
            <p className="text-lg mb-8 opacity-90">
              Connect with thousands of blockchain enthusiasts and be part of the Web3 revolution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join Discord
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Explore Forums
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Community;
