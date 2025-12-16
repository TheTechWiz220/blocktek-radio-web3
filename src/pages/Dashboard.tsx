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
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ProfileEditor from "@/components/ProfileEditor";
import MintDJPass from "@/components/MintDJPass";
import { useNavigate, Link } from "react-router-dom";

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

  const [ethBalance, setEthBalance] = useState<string>("0.00");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Load ETH balance from current network + refresh on network change
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !window.ethereum) {
        setEthBalance("0.00");
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const bal = await provider.getBalance(account);
        const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4);

        // Clean display — no double ETH
        setEthBalance(`${formatted} ETH`);
      } catch (e) {
        console.error("Balance fetch error:", e);
        setEthBalance("Error");
      }
    };

    fetchBalance();

    // Listen for network/account changes
    if (window.ethereum) {
      window.ethereum.on("chainChanged", fetchBalance);
      window.ethereum.on("accountsChanged", fetchBalance);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", fetchBalance);
        window.ethereum.removeListener("accountsChanged", fetchBalance);
      }
    };
  }, [account]);

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
            <div className="space-y-3">
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </Button>
            </div>
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
    { label: "ETH Balance", value: `${ethBalance} ETH`, icon: Wallet },
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
        {/* Header */}
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
          <div className="flex gap-4 mt-6">
            <ProfileEditor onUpdated={fetchProfile} />
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
          <Button
            onClick={async () => {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x2b58" }],
                });
              } catch (switchError: any) {
                if (switchError.code === 4902) {
                  await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      /* network config */
                    ],
                  });
                }
              }
            }}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Switch to Abstract Testnet</span>
            <span className="sm:hidden">Abstract Testnet</span>
          </Button>
        </div>

        {/* DJ Tabs (only show if DJ) */}
        {isDJ && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {djTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        )}

        {/* Content */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Streams */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Recent Streams
                </h3>
                <div className="space-y-4">
                  {recentStreams.map((stream, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{stream.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {stream.date}
                        </p>
                      </div>
                      <span className="text-sm text-primary">
                        {stream.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* DJ Pass Mint Card */}
              <MintDJPass onMintSuccess={refreshDJStatus} />
            </div>
          </>
        )}

        {/* DJ-only tabs content */}
        {isDJ && activeTab === "schedule" && (
          <Card className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Schedule Management</h3>
            <p className="text-muted-foreground">
              Manage your upcoming radio shows and events.
            </p>
          </Card>
        )}

        {isDJ && activeTab === "audience" && (
          <Card className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Audience Analytics</h3>
            <p className="text-muted-foreground">
              View your listener stats and engagement metrics.
            </p>
          </Card>
        )}

        {isDJ && activeTab === "broadcast" && (
          <Card className="p-8 text-center">
            <Send className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Go Live</h3>
            <p className="text-muted-foreground">
              Start your live broadcast and connect with your audience.
            </p>
            <Button className="mt-6" size="lg">
              <Mic className="w-5 h-5 mr-2" />
              Start Broadcasting
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
