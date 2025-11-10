import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Radio, Clock } from "lucide-react";
import { useState } from "react";

const LiveStream = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const upcomingShows = [
    { time: "10:00 AM", title: "Blockchain Morning Brief", host: "DJ CryptoKen" },
    { time: "2:00 PM", title: "NFT Market Analysis", host: "Sarah Chain" },
    { time: "6:00 PM", title: "Web3 Evening Mix", host: "BlockBeats DJ" },
  ];

  return (
    <section id="live" className="py-20 md:py-32 relative bg-gradient-glow">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse-glow" />
            <span className="text-accent font-semibold">LIVE NOW</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Live Stream</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tune in to 24/7 blockchain content, news, and Web3 music
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-card/80 backdrop-blur-sm border-primary/30 glow-purple">
            {/* Player */}
            <div className="space-y-6">
              {/* Now Playing */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-accent mb-4">
                  <Radio className="w-5 h-5 animate-pulse-glow" />
                  <span className="font-semibold">NOW PLAYING</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Crypto Market Updates</h3>
                <p className="text-muted-foreground">with DJ BlockChain</p>
              </div>

              {/* Waveform Visualization */}
              <div className="h-24 flex items-center justify-center gap-1">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-primary rounded-full animate-pulse-glow"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 glow-purple"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
                <Button size="icon" variant="outline" className="w-12 h-12 rounded-full">
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Upcoming Shows */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-accent" />
              Upcoming Shows
            </h3>
            <div className="space-y-4">
              {upcomingShows.map((show, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-accent font-semibold">{show.time}</span>
                        <span className="text-muted-foreground">|</span>
                        <h4 className="font-semibold">{show.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Hosted by {show.host}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStream;
