import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Bitcoin, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type CoinId = "bitcoin" | "ethereum" | "lisk" | "cardano" | "solana" | "polygon";

const COINS: { id: CoinId; name: string; symbol: string; icon: any }[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: Bitcoin },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: Coins },
  { id: "lisk", name: "Lisk", symbol: "LSK", icon: Coins },
  { id: "cardano", name: "Cardano", symbol: "ADA", icon: Coins },
  { id: "solana", name: "Solana", symbol: "SOL", icon: Coins },
  { id: "polygon", name: "Polygon", symbol: "MATIC", icon: Coins },
];

const fetchPrices = async () => {
  const ids = COINS.map((c) => c.id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
};

const CryptoTracker = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cryptoPrices"],
    queryFn: fetchPrices,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

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
          {isLoading ? (
            <>
              {COINS.map((coin, index) => (
                <Card
                  key={`skeleton-${coin.symbol}`}
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 transition-all group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-40 h-5 rounded" />
                        <Skeleton className="w-24 h-4 rounded" />
                      </div>
                    </div>
                    <Skeleton className="w-5 h-5 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="w-32 h-8 rounded" />
                    <Skeleton className="w-20 h-4 rounded" />
                  </div>
                </Card>
              ))}
            </>
          ) : (
            <>
              {COINS.map((coin, index) => {
                const Icon = coin.icon;
                const coinData = data?.[coin.id];
                const price = coinData?.usd;
                const change = coinData?.usd_24h_change;
                const isUp = typeof change === "number" ? change >= 0 : true;

                return (
                  <Card
                    key={coin.symbol}
                    className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{coin.name}</h3>
                          <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : isUp ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{isLoading ? "--" : price ? formatPrice(price) : "N/A"}</div>
                      <div className={`text-sm font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isLoading ? "" : typeof change === 'number' ? `${change.toFixed(2)}%` : ""}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
  </div>

        <div className="text-center mt-12">
          {isError ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">Prices unavailable right now • Showing cached or placeholder data</p>
              <Button onClick={() => refetch()} aria-label="Retry fetching prices">Retry</Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Prices updated every 30 seconds • Powered by CoinGecko API</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CryptoTracker;
