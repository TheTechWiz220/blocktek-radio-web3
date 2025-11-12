import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Headphones, Trophy, DollarSign, Settings, LogOut, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  const { account, disconnect, isConnected, connectWallet, isConnecting } = useWeb3();
  const navigate = useNavigate();

  // NOT CONNECTED → Show lock screen
  if (!isConnected || !account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
        <Card className="p-8 text-center max-w-md w-full">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet to access your dashboard.</p>
          <div className="space-y-3">
            <Button onClick={connectWallet} className="w-full" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            <Button onClick={() => navigate("/#live")} variant="outline" className="w-full">
              Go to Live Stream
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const stats = [
    { label: "Listening Time", value: "48h 12m", icon: Headphones },
    { label: "NFTs Owned", value: "3", icon: Trophy },
    { label: "Earnings", value: "$127.50", icon: DollarSign },
  ];

  const recentStreams = [
    { title: "Web3 Evening Mix", date: "Nov 10, 2025", duration: "2h 15m" },
    { title: "NFT Market Analysis", date: "Nov 9, 2025", duration: "1h 30m" },
    { title: "Blockchain Morning Brief", date: "Nov 8, 2025", duration: "45m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {formatAddress(account)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={disconnect} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary opacity-70" />
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Streams</h2>
          <div className="space-y-3">
            {recentStreams.map((stream, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium">{stream.title}</p>
                  <p className="text-sm text-muted-foreground">{stream.date} • {stream.duration}</p>
                </div>
                <Button size="sm" variant="ghost">Replay</Button>
              </div>
            ))}
          </div>
        </Card>

        {/* NFT Collection */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your NFT Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 h-32 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white opacity-80" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm">BlockTek Pass #{i}</p>
                  <p className="text-xs text-muted-foreground">Premium Access</p>
                </div>
              </Card>
            ))}
            <Card className="border-dashed border-2 border-primary/30 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/60 transition">
              <Trophy className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Mint More</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
