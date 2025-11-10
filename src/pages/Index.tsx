import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LiveStream from "@/components/LiveStream";
import CryptoTracker from "@/components/CryptoTracker";
import NFTZone from "@/components/NFTZone";
import Education from "@/components/Education";
import Advertise from "@/components/Advertise";
import Community from "@/components/Community";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <About />
        <LiveStream />
        <CryptoTracker />
        <NFTZone />
        <Education />
        <Advertise />
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
