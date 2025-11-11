import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Radio, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LiveStream = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const STREAM_URL = "/stream-audio.mp3";

  const upcomingShows = [
    { time: "10:00 AM", title: "Blockchain Morning Brief", host: "DJ CryptoKen" },
    { time: "2:00 PM", title: "NFT Market Analysis", host: "Sarah Chain" },
    { time: "6:00 PM", title: "Web3 Evening Mix", host: "BlockBeats DJ" },
  ];

  // Sync button with actual audio state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Playback failed:", err);
        alert("Stream failed to start. Check your stream URL or try again.");
        setIsLoading(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

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
            {/* Hidden Audio Player */}
            <audio
              ref={audioRef}
              src={STREAM_URL}
              preload="none"
              crossOrigin="anonymous"
            />

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
                    className={`w-1 bg-gradient-primary rounded-full transition-all duration-300 ${
                      isPlaying ? "animate-pulse-glow" : ""
                    }`}
                    style={{
                      height: `${isPlaying ? Math.random() * 100 + 20 : 20}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 glow-purple relative"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>

                {/* Volume Slider */}
                <div className="flex items-center gap-3 w-32">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #a855f7 ${volume * 100}%, #374151 ${volume * 100}%)`,
                    }}
                  />
                </div>
              </div>

              {/* Stream Info */}
              <p className="text-center text-sm text-muted-foreground">
                {isPlaying ? "Streaming live • 128 kbps" : "Click play to tune in"}
              </p>
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
                <Card
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all"
                >
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
