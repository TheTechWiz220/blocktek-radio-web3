import { Button } from "@/components/ui/button";
import { Play, Radio, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(271 81% 56% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(271 81% 56% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'fadeIn 2s ease-in-out'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30">
            <Radio className="w-4 h-4 text-accent animate-pulse-glow" />
            <span className="text-sm text-accent">Africa's Leading Web3 Radio</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-gradient">Revolutionizing Radio</span>
            <br />
            <span className="text-foreground">with Blockchain</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stream exclusive Web3 content, mint music NFTs, track crypto prices, and join the decentralized audio revolution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-purple group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Listen Live Now
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10">
              <TrendingUp className="w-5 h-5 mr-2" />
              Explore NFT Zone
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
            {[
              { label: "Active Listeners", value: "10K+" },
              { label: "Music NFTs", value: "500+" },
              { label: "Blockchain Partners", value: "25+" },
              { label: "Educational Hours", value: "100+" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
