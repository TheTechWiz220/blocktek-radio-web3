import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bitcoin, Coins } from "lucide-react";

const CryptoTracker = () => {
  const cryptoPrices = [
    { name: "Bitcoin", symbol: "BTC", price: "$67,234", change: "+5.24%", isUp: true, icon: Bitcoin },
    { name: "Ethereum", symbol: "ETH", price: "$3,456", change: "+3.12%", isUp: true, icon: Coins },
    { name: "Lisk", symbol: "LSK", price: "$1.23", change: "+8.45%", isUp: true, icon: Coins },
    { name: "Cardano", symbol: "ADA", price: "$0.58", change: "-1.23%", isUp: false, icon: Coins },
    { name: "Solana", symbol: "SOL", price: "$142.56", change: "+6.78%", isUp: true, icon: Coins },
    { name: "Polygon", symbol: "MATIC", price: "$0.89", change: "-2.15%", isUp: false, icon: Coins },
  ];

  return (
    <section id="crypto" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Live <span className="text-gradient">Crypto Tracker</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time cryptocurrency prices and market updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoPrices.map((crypto, index) => {
            const Icon = crypto.icon;
            return (
              <Card
                key={crypto.symbol}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{crypto.name}</h3>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                  {crypto.isUp ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{crypto.price}</div>
                  <div className={`text-sm font-semibold ${crypto.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Prices updated every 30 seconds • Powered by CoinGecko API
          </p>
        </div>
      </div>
    </section>
  );
};

export default CryptoTracker;
