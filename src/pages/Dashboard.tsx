import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Headphones, Trophy, Wallet, Settings, LogOut, Lock, Mic, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CredentialsAuth from "@/components/CredentialsAuth";
import * as api from "@/lib/api";
import ProfileEditor from "@/components/ProfileEditor";
import { useToast } from "@/components/ui/use-toast";
import { verifyMessage } from "ethers";

const Dashboard = () => {
  const { account, disconnect, isConnected, connectWallet, isConnecting, isDJ } = useWeb3(); // ← ADD isDJ HERE
  const navigate = useNavigate();
  const [ethBalance, setEthBalance] = useState<string>("0.00");

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && (window as any).ethereum) {
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const balance = await provider.getBalance(account);
          const formatted = parseFloat(ethers.formatEther(balance)).toFixed(4);
          setEthBalance(formatted);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };
    
    fetchBalance();
  }, [account]);

  // NOT AUTHENTICATED → Show lock screen
  const [credentialsUser, setCredentialsUser] = useState<string | null>(null);
  const [serverProfile, setServerProfile] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getMe();
        if (!mounted) return;
        const p = data.profile;
        setServerProfile(p || null);
        setCredentialsUser(p?.email || null);
      } catch (e) {
        // not authenticated
        setServerProfile(null);
        setCredentialsUser(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // track linked wallet for the credential user
  const [linkedWallet, setLinkedWallet] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinkedWallet = async () => {
      if (serverProfile?.id) {
        try {
          const data = await api.getLinkedWallets(serverProfile.id);
          setLinkedWallet(data);
        } catch (error) {
          console.error("Failed to fetch linked wallet:", error);
        }
      }
    };
    fetchLinkedWallet();
  }, [serverProfile]);

  const linkWallet = async () => {
    if (!account) {
      toast({ title: "Connect your wallet first" });
      return;
    }
    if (!serverProfile?.id) {
      toast({ title: "Authenticate with credentials first" });
      return;
    }
    try {
      const message = `Sign this message to link your wallet to your profile. Nonce: ${Date.now()}`;
      const signer = await new ethers.BrowserProvider((window as any).ethereum).getSigner();
      const signature = await signer.signMessage(message);
      const data = await api.linkWallet(serverProfile.id, account, message, signature);
      setLinkedWallet(data);
      toast({ title: "Wallet linked successfully" });
    } catch (error) {
      console.error("Failed to link wallet:", error);
      toast({ title: "Failed to link wallet" });
    }
  };

  const unlinkWallet = async () => {
    if (!linkedWallet?.id) return;
    try {
      await api.unlinkWallet(linkedWallet.id);
      setLinkedWallet(null);
      toast({ title: "Wallet unlinked successfully" });
    } catch (error) {
      console.error("Failed to unlink wallet:", error);
      toast({ title: "Failed to unlink wallet" });
    }
  };

  if (!isConnected || !account) {
    return (
      <div className="pt-20 text-center">
        <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
        <p className="text-muted-foreground mb-6">Connect your wallet to access your dashboard.</p>
        <Button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    );
  }

  // ADD NFT GATE HERE: If not isDJ, show mint prompt
  if (!isDJ) {
    return (
      <div className="pt-20 container mx-auto px-4 text-center">
        <Lock className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold mb-4">DJ Pass Required</h2>
        <p className="text-muted-foreground mb-6">
          Mint a <strong>BlockTek DJ Pass NFT</strong> to unlock premium features, schedule shows, and earn tips.
        </p>
        <Button onClick={() => navigate("/#nft")} className="gap-2">
          <Trophy className="w-5 h-5" />
          Mint DJ Pass
        </Button>
      </div>
    );
  }

  // DJ MODE UNLOCKED (Your existing premium content below)
  // ... (Your existing code: stats, recent streams, NFT collection, etc.)
  const stats = [
    { label: "ETH Balance", value: `${ethBalance} ETH`, icon: Wallet },
    { label: "Listening Time", value: "48h 12m", icon: Headphones },
    { label: "NFTs Owned", value: "3", icon: Trophy },
  ];

  const recentStreams = [
    { title: "Web3 Evening Mix", date: "Nov 10, 2025", duration: "2h 15m" },
    { title: "NFT Market Analysis", date: "Nov 9, 2025", duration: "1h 30m" },
    { title: "Blockchain Morning Brief", date: "Nov 8, 2025", duration: "45m" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Mic className="w-10 h-10 text-green-500" />
              DJ Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {account.slice(0, 6)}...{account.slice(-4)}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* Go Live Card */}
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-8">
          <h3 className="text-xl font-bold mb-2">Start Your Show</h3>
          <p className="mb-4">Go live and earn real-time tips from fans on Abstract Chain!</p>
          <Button variant="secondary" className="gap-2">
            <Mic className="w-5 h-5" />
            Launch Stream
          </Button>
        </Card>

        {/* Your Existing Profile Editor/Auth Logic Here */}
        {/* ... (paste your truncated code for credentialsUser, serverProfile, linkedWallet, etc.) */}
        {/* For example: */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-4">Profile Editor</h2>
          <ProfileEditor />
          {/* Add your linkWallet/unlinkWallet buttons, etc. */}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
