import { Button } from "@/components/ui/button";
import { Wallet, Menu, Radio, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const TARGET_CHAIN_ID = "0x1"; // Ethereum Mainnet

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Team", href: "/team" },
    { name: "Live Stream", href: "/#live" },
    { name: "Crypto Tracker", href: "/#crypto" },
    { name: "NFT Zone", href: "/#nft" },
    { name: "Education", href: "/#education" },
    { name: "Advertise", href: "/#advertise" },
    { name: "Community", href: "/#community" },
  ];

  // Check wallet on load
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      checkWalletConnection();
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        const network = await provider.getNetwork();
        setChainId(network.chainId.toString(16));
        setIsWrongNetwork(network.chainId.toString(16) !== TARGET_CHAIN_ID);
      }
    } catch (err) {
      console.error("Wallet check failed:", err);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    setIsWrongNetwork(chainId !== TARGET_CHAIN_ID);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected! Install from https://metamask.io");
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const network = await provider.getNetwork();
      const currentChainId = network.chainId.toString(16);
      setChainId(currentChainId);

      if (currentChainId !== TARGET_CHAIN_ID) {
        setIsWrongNetwork(true);
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: TARGET_CHAIN_ID }],
          });
          setIsWrongNetwork(false);
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            alert("Please add Ethereum Mainnet to MetaMask.");
          }
        }
      }
    } catch (err: any) {
      console.error("Connection failed:", err);
      if (err.code === 4001) {
        alert("Connection rejected by user.");
      } else {
        alert("Failed to connect wallet.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setIsWrongNetwork(false);
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-8 h-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 glow-purple rounded-full" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gradient">BlockTek Radio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-4">
            {account ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-green-500/50 bg-green-500/10"
                  onClick={disconnectWallet}
                >
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-sm">{formatAddress(account)}</span>
                </Button>
                {isWrongNetwork && (
                  <div className="flex items-center gap-1 text-orange-500 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Wrong Network</span>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 border-primary/50 hover:bg-primary/10"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-slide-up">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  {link.name}
                </a>
              ))}

              {/* Mobile Wallet */}
              {account ? (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-sm">{formatAddress(account)}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-primary/50 w-full mt-2"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
