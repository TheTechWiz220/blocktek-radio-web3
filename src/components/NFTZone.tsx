import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Wallet } from "lucide-react";
import nftZoneImage from "@/assets/nft-zone.jpg";

const NFTZone = () => {
  const featuredNFTs = [
    { id: 1, title: "Blockchain Beats Vol. 1", artist: "DJ Crypto", price: "0.5 ETH", minted: "45/100" },
    { id: 2, title: "Web3 Anthem", artist: "Sarah Chain", price: "0.3 ETH", minted: "78/100" },
    { id: 3, title: "Decentralized Dreams", artist: "BlockBeats", price: "0.8 ETH", minted: "23/50" },
  ];

  return (
    <section id="nft" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, hsl(271 81% 56% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent animate-pulse-glow" />
            <span className="text-accent font-semibold">EXCLUSIVE DROPS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">NFT Zone</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mint exclusive music NFTs from international artists and own a piece of Web3 music history
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero NFT Card */}
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/30 mb-12">
            <div className="grid md:grid-cols-2 gap-0">
              <div 
                className="h-64 md:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url(${nftZoneImage})` }}
              />
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
                    Featured Drop
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Genesis Collection</h3>
                  <p className="text-muted-foreground mb-4">
                    Limited edition music NFTs from BlockTek Radio's founding artists
                  </p>
                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-accent">1.5 ETH</div>
                      <div className="text-sm text-muted-foreground">Floor Price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">500</div>
                      <div className="text-sm text-muted-foreground">Total Supply</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 glow-purple">
                    <Wallet className="w-4 h-4 mr-2" />
                    Mint Now
                  </Button>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Featured NFTs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNFTs.map((nft, index) => (
              <Card 
                key={nft.id} 
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg bg-gradient-primary" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">{nft.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">by {nft.artist}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-accent">{nft.price}</div>
                        <div className="text-xs text-muted-foreground">Minted: {nft.minted}</div>
                      </div>
                      <Button size="sm" variant="outline" className="border-primary/50">
                        View
                      </Button>
                    </div>
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

export default NFTZone;
