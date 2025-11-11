"use client";

import { Button } from "@/components/ui/button";
import { Wallet, Menu, Radio, Check, AlertCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { account, connectWallet, disconnect, isConnecting, isWrongNetwork } = useWeb3();

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Team", href: "/team" },
    { name: "Live Stream", href: "/#live" },
    { name: "Crypto Tracker", href: "/#crypto" },
    { name: "NFT Zone", href: "/#nft" },
    { name: "Education", href: "/#education" },
    { name: "Dashboard", href: "/dashboard" }, // CHANGED FROM "Advertise"
    { name: "Community", href: "/#community" },
  ];

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

          {/* Wallet Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {account ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={disconnect}
                  className="flex items-center gap-2 border-green-500/50 bg-green-500/10"
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
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 border-primary/50 hover:bg-primary/10"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
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
                  <Button size="sm" variant="ghost" onClick={disconnect}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 border-primary/50 w-full mt-2"
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
