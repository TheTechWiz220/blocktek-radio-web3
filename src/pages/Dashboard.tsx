// src/pages/Dashboard.tsx
import { useWeb3 } from "@/context/Web3Context";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Headphones,
  Trophy,
  Wallet,
  Settings,
  LogOut,
  Lock,
  Mic,
  Send,
  Calendar,
  Users,
  Crown,
  User,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import ProfileEditor from "@/components/ProfileEditor";
import MintDJPass from "@/components/MintDJPass";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const formatAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const navigate = useNavigate();
  const {
    account,
    disconnect,
    isConnected,
    connectWallet,
    isConnecting,
    isDJ,
    djLoading,
    refreshDJStatus,
  } = useWeb3();

  const { toast } = useToast();

  const [ethBalance, setEthBalance] = useState<string>("0.00");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch balance from current network
  const fetchBalance = useCallback(async () => {
    if (!account || !window.ethereum) {
      setEthBalance("0.00");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(account);
      const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4);
      setEthBalance(`${formatted} ETH`);
    } catch (e) {
      console.error("Balance fetch error:", e);
      setEthBalance("Error");
    }
  }, [account]);

  // Refresh on mount, account change, and network change
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = () => {
      // Suppress Vite HMR reload
      if (import.meta.hot) {
        import.meta.hot.accept();
      }
      // Refresh data
      fetchBalance();
      refreshDJStatus();
    };

    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [fetchBalance, refreshDJStatus]);

  // Switch to Abstract Testnet
  const switchToAbstract = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not detected",
        description: "Please install MetaMask",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2b58" }], // Abstract Testnet = 11124 in hex
      });
      toast({
        title: "Network switched",
        description: "Connected to Abstract Testnet",
      });
      // Force balance refresh after switch
      fetchBalance();
      refreshDJStatus();
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2b58",
                chainName: "Abstract Testnet",
                rpcUrls: ["https://api.testnet.abs.xyz"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.testnet.abs.xyz"],
              },
            ],
          });
          toast({
            title: "Network added",
            description: "Now switch to Abstract Testnet",
          });
          fetchBalance();
          refreshDJStatus();
        } catch (addError) {
          toast({
            title: "Failed to add network",
            description: "Add Abstract Testnet manually in MetaMask",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Switch failed",
          description: "Check MetaMask and try again",
          variant: "destructive",
        });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    disconnect();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
        <Card className="p-8 text-center max-w-md w-full">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your dashboard.
          </p>
          <Link to="/auth">
            <Button className="w-full">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!isConnected || !account) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen p-4 pt-20">
          <Card className="p-8 text-center max-w-md w-full">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet for Web3 features like NFTs and crypto
              tracking.
            </p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (djLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Listening Time", value: "48h 12m", icon: Headphones },
    { label: "NFTs Owned", value: isDJ ? "1+" : "0", icon: Trophy },
    { label: "ETH Balance", value: ethBalance, icon: Wallet },
  ];

  const recentStreams = [
    {
      title: "Crypto Market Updates",
      date: "Dec 10, 2025",
      duration: "1h 30m",
    },
    { title: "Blockchain Morning Brief", date: "Dec 9, 2025", duration: "45m" },
    { title: "NFT Market Analysis", date: "Dec 8, 2025", duration: "1h" },
  ];

  const djTabs = [
    { id: "overview", label: "Overview", icon: Headphones },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "audience", label: "Audience", icon: Users },
    { id: "broadcast", label: "Go Live", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* TOP HEADER */}
        <div className="flex flex-col items-center justify-center text-center mb-12 gap-6">
          {/* Avatar */}
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile avatar"
              className="w-28 h-28 rounded-full object-cover ring-8 ring-primary/20 shadow-2xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center ring-8 ring-primary/20">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {/* Title + Name + Bio */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-4">
              {isDJ ? (
                <Mic className="w-12 md:w-16 h-12 md:h-16" />
              ) : (
                <Headphones className="w-12 md:w-16 h-12 md:h-16" />
              )}
              {isDJ ? "DJ Dashboard" : "Listener Dashboard"}
              {isDJ && (
                <Crown className="w-10 md:w-14 h-10 md:h-14 text-yellow-500" />
              )}
            </h1>

            <p className="text-xl md:text-2xl font-bold text-foreground mt-4">
              {profile?.display_name || user.email || formatAddress(account)}
            </p>

            {profile?.bio ? (
              <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                {profile.bio}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground/60 italic mt-3">
                No bio yet — click Edit Profile to add one
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <ProfileEditor onUpdated={fetchProfile} />
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>

            {/* Network Switch Button */}
            <Button
              variant="outline"
              onClick={switchToAbstract}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">
                Switch to Abstract Testnet
              </span>
              <span className="sm:hidden">Abstract Testnet</span>
            </Button>
          </div>
        </div>

        {/* DJ Tabs */}
        {isDJ && (
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {djTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="capitalize"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        {/* Overview Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((s, i) => (
                <Card
                  key={i}
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold mt-1">{s.value}</p>
                    </div>
                    <s.icon className="w-8 h-8 text-primary opacity-70" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Streams + Mint Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h2 className="text-xl font-bold mb-4">Recent Streams</h2>
                <div className="space-y-3">
                  {recentStreams.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.date} • {s.duration}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Replay
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <MintDJPass onMintSuccess={refreshDJStatus} />
            </div>
          </>
        )}

        {/* DJ-only tabs */}
        {isDJ && activeTab === "schedule" && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4">Show Schedule</h2>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              Add New Show
            </Button>
          </Card>
        )}

        {isDJ && activeTab === "audience" && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4">Fan Leaderboard</h2>
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Invite Fans
            </Button>
          </Card>
        )}

        {isDJ && activeTab === "broadcast" && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4">Tips & Earnings</h2>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              Withdraw Earnings
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
