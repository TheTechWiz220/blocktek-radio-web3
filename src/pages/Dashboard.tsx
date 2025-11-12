import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Headphones, Trophy, Wallet, Settings, LogOut, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CredentialsAuth, { getCurrentUser, clearCurrentUser, linkWalletToUser, unlinkWalletFromUser, getUser } from "@/components/CredentialsAuth";
import { useToast } from "@/components/ui/use-toast";
import { verifyMessage } from "ethers";

const Dashboard = () => {
  const { account, disconnect, isConnected, connectWallet, isConnecting } = useWeb3();
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

  useEffect(() => {
    const cur = getCurrentUser();
    setCredentialsUser(cur?.email || null);
  }, []);

  // track linked wallet for the credential user
  const [linkedWallet, setLinkedWallet] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!credentialsUser) return;
    const u = getUser(credentialsUser);
    setLinkedWallet(u?.linkedWallet || null);
  }, [credentialsUser]);

  const handleLinkWallet = async () => {
    if (!credentialsUser) return;
    if (!(window as any).ethereum) {
      toast({ title: "MetaMask required", description: "Please install MetaMask or another wallet extension" });
      return;
    }
    try {
      // request accounts and get signer
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Create a challenge and ask the user to sign it to prove ownership
      const nonce = Math.floor(Math.random() * 1e9).toString();
      const message = `Link wallet to BlockTek Radio account (${credentialsUser})\n\nNonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // Recover the address from the signature and compare
      const recovered = verifyMessage(message, signature);
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        toast({ title: "Verification failed", description: "Signature did not match the signer address." });
        return;
      }

      const ok = linkWalletToUser(credentialsUser, address, true);
      if (ok) {
        setLinkedWallet({ address, verified: true });
        toast({ title: "Wallet linked", description: `Linked ${address}` });
      } else {
        toast({ title: "Failed", description: "Could not link wallet" });
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message || "Failed to link wallet" });
    }
  };

  const handleUnlink = () => {
    if (!credentialsUser) return;
    const ok = unlinkWalletFromUser(credentialsUser);
    if (ok) {
      setLinkedWallet(null);
      toast({ title: "Unlinked", description: "Wallet disconnected from account" });
    } else {
      toast({ title: "Failed", description: "Could not unlink wallet" });
    }
  };

  if (!isConnected && !credentialsUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
        <Card className="p-8 text-center max-w-md w-full">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Wallet Required</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet or sign in with credentials to access your dashboard.</p>
          <div className="space-y-3">
            <Button onClick={connectWallet} className="w-full" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            <div className="flex gap-2">
              <CredentialsAuth onLogin={(email) => setCredentialsUser(email)} />
              <Button onClick={() => navigate("/#live")} variant="outline" className="flex-1">
                Go to Live Stream
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const formatAddress = (addr?: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const stats = [
    { label: "Listening Time", value: "48h 12m", icon: Headphones },
    { label: "NFTs Owned", value: "3", icon: Trophy },
    { label: "ETH Balance", value: `${ethBalance} ETH`, icon: Wallet },
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
            <p className="text-muted-foreground">Welcome back, {account ? formatAddress(account) : credentialsUser ? credentialsUser : "Listener"}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            {credentialsUser ? (
              <div className="flex items-center gap-2">
                {linkedWallet ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Linked: {linkedWallet.address ? formatAddress(linkedWallet.address) : String(linkedWallet)}
                      {linkedWallet.verified ? (
                        <span className="ml-2 text-xs font-medium text-green-500">Verified</span>
                      ) : null}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleUnlink}>Unlink</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleLinkWallet} className="gap-2">Link Wallet</Button>
                )}
                <Button variant="outline" onClick={() => { clearCurrentUser(); setCredentialsUser(null); }} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={disconnect} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
            )}
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
