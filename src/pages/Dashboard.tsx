// src/pages/Dashboard.tsx   (or src/components/Dashboard.tsx — same file)
import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Headphones, Trophy, Wallet, Settings, LogOut, Lock,
  Mic, Send, Calendar, Users, Crown, User
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as api from "@/lib/api";
import ProfileEditor from "@/components/ProfileEditor";
import { useToast } from "@/components/ui/use-toast";

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

// REPLACE WHEN YOU DEPLOY YOUR NFT
const DJ_PASS_CONTRACT = "0xYourRealDJPassAddressHere";
const DJ_PASS_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const Dashboard = () => {
  const {
    account,
    disconnect,
    isConnected,
    connectWallet,
    isConnecting,
  } = useWeb3();

  const { toast } = useToast();

  const [ethBalance, setEthBalance] = useState<string>("0.00");
  const [isDJ, setIsDJ] = useState<boolean>(false);
  const [djLoading, setDjLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Profile data for header (avatar, name, bio)
  const [dashboardProfile, setDashboardProfile] = useState<{
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
  }>({});

  // Load ETH balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(account);
        setEthBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      } catch (e) {
        console.error(e);
      }
    };
    fetchBalance();
  }, [account]);

  // Load profile (runs on mount + after profile edit)
  const loadProfile = async () => {
    try {
      const data = await api.getMe();
      setDashboardProfile({
        displayName: data.profile?.displayName || "",
        avatarUrl: data.profile?.avatarUrl || "",
        bio: data.profile?.bio || "",
      });
    } catch (e) {
      console.warn("Failed to load profile");
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      loadProfile();
    }
  }, [isConnected, account]);

  // DJ-Pass NFT check
  useEffect(() => {
    if (!account || !window.ethereum) {
      setDjLoading(false);
      return;
    }

    const checkDJ = async () => {
      setDjLoading(true);
      try {
        if (DJ_PASS_CONTRACT.toLowerCase().includes("your")) {
          setIsDJ(false);
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(DJ_PASS_CONTRACT, DJ_PASS_ABI, provider);
        const bal = await contract.balanceOf(account);
        setIsDJ(bal > 0);
      } catch (err) {
        console.warn("DJ-Pass check failed:", err);
        setIsDJ(false);
      } finally {
        setDjLoading(false);
      }
    };
    checkDJ();
  }, [account]);

  if (!isConnected || !account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
        <Card className="p-8 text-center max-w-md w-full">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to access your dashboard.
          </p>
          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </Button>
        </Card>
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
    { label: "NFTs Owned", value: "3", icon: Trophy },
    { label: "ETH Balance", value: `${ethBalance} ETH`, icon: Wallet },
  ];

  const recentStreams = [
    { title: "Crypto Market Updates", date: "Nov 14, 2025", duration: "1h 30m" },
    { title: "Blockchain Morning Brief", date: "Nov 13, 2025", duration: "45m" },
    { title: "NFT Market Analysis", date: "Nov 12, 2025", duration: "1h" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* TOP HEADER — Avatar, Name, Bio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            {dashboardProfile.avatarUrl ? (
              <img
                src={dashboardProfile.avatarUrl}
                alt="Profile avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div>
              <h1 className="text-5xl font-bold text-gradient flex items-center gap-3">
                {isDJ ? <Mic className="w-12 h-12" /> : <Headphones className="w-12 h-12" />}
                {isDJ ? "DJ Dashboard" : "Listener Dashboard"}
                {isDJ && <Crown className="w-10 h-10 text-yellow-500" />}
              </h1>

              <p className="text-xl font-semibold text-foreground mt-2">
                {dashboardProfile.displayName || formatAddress(account)}
              </p>

              {dashboardProfile.bio ? (
                <p className="text-base text-muted-foreground mt-2 max-w-xl">
                  {dashboardProfile.bio}
                </p>
              ) : (
                <p className="text-base text-muted-foreground/60 italic mt-2">
                  No bio yet — click Edit Profile to add one
                </p>
              )}
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex gap-3">
            <ProfileEditor onUpdated={loadProfile} />
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={disconnect} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </div>
        </div>

        {/* DJ Tabs */}
        {isDJ && (
          <div className="flex gap-4 mb-8 border-b border-border">
            {["overview", "schedule", "fans", "tips"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab)}
                className="capitalize pb-3"
              >
                {tab}
              </Button>
            ))}
          </div>
        )}

        {/* Overview Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((s, i) => (
                <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
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

            {/* Recent Streams */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
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

            {/* Go Live Card for DJs */}
            {isDJ && (
              <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-8">
                <h3 className="text-xl font-bold mb-2">Go Live Now</h3>
                <p className="mb-4">Start your show and earn real-time tips from fans!</p>
                <Button variant="secondary" className="gap-2">
                  <Mic className="w-5 h-5" />
                  Launch Stream
                </Button>
              </Card>
            )}
          </>
        )}

        {/* DJ-only tabs – keep your existing code here */}
        {activeTab === "schedule" && isDJ && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4">Show Schedule</h2>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              Add New Show
            </Button>
          </Card>
        )}

        {activeTab === "fans" && isDJ && (
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold mb-4">Fan Leaderboard</h2>
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Invite Fans
            </Button>
          </Card>
        )}

        {activeTab === "tips" && isDJ && (
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
