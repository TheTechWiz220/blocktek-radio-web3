import { Radio, Twitter, Send, Music, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { name: "Live Stream", href: "#live" },
      { name: "Crypto Tracker", href: "#crypto" },
      { name: "NFT Zone", href: "#nft" },
      { name: "Education Hub", href: "#education" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Advertise", href: "#advertise" },
      { name: "Community", href: "#community" },
      { name: "Contact", href: "#contact" },
    ],
    Resources: [
      { name: "Blog", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Partners", href: "#" },
      { name: "Careers", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Send, href: "#", label: "Telegram" },
    { icon: Music, href: "#", label: "Discord" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Radio className="w-8 h-8 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 glow-purple rounded-full" />
              </div>
              <span className="text-2xl font-bold text-gradient">BlockTek Radio</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Africa's leading Web3 radio station. Revolutionizing radio with blockchain technology.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-card border border-primary/20 hover:border-primary/50 flex items-center justify-center hover:glow-purple transition-all group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold mb-4 text-foreground">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 BlockTek Radio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(271 81% 56% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(271 81% 56% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </footer>
  );
};

export default Footer;
