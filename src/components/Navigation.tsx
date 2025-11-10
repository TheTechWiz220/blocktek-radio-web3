import { Button } from "@/components/ui/button";
import { Wallet, Menu, Radio } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Live Stream", href: "#live" },
    { name: "Crypto Tracker", href: "#crypto" },
    { name: "NFT Zone", href: "#nft" },
    { name: "Education", href: "#education" },
    { name: "Advertise", href: "#advertise" },
    { name: "Community", href: "#community" },
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

          {/* Connect Wallet Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex items-center gap-2 border-primary/50 hover:bg-primary/10">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </Button>

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
              <Button variant="outline" className="flex items-center gap-2 border-primary/50 mt-2">
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
