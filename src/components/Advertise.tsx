import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Radio, Globe, Users } from "lucide-react";

const Advertise = () => {
  const adPackages = [
    { icon: Radio, title: "On-Air Spots", description: "30-60 second audio ads during live broadcasts", price: "From $500/week" },
    { icon: Globe, title: "Website Banners", description: "Premium placement on our high-traffic Web3 platform", price: "From $300/week" },
    { icon: Users, title: "Sponsored Shows", description: "Full episode sponsorship with brand integration", price: "From $2,000/episode" },
  ];

  return (
    <section id="advertise" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-accent animate-pulse-glow" />
            <span className="text-accent font-semibold">REACH YOUR AUDIENCE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Advertise With Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with 10,000+ blockchain enthusiasts, developers, and Web3 innovators
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Ad Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {adPackages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <Card 
                  key={pkg.title} 
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="text-lg font-bold text-accent">{pkg.price}</div>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-primary/30 glow-purple">
            <h3 className="text-2xl font-bold mb-6 text-center">Get Started Today</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input placeholder="Your Web3 Project" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="your@email.com" className="bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Package Interest</label>
                <Input placeholder="On-Air, Website, or Sponsored Show" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Tell us about your advertising goals and target audience..."
                  className="min-h-32 bg-background/50"
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 glow-purple">
                Submit Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Advertise;
