import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Video, BookOpen, Award } from "lucide-react";
import educationImage from "@/assets/education-hub.jpg";

const Education = () => {
  const courses = [
    {
      title: "Blockchain Fundamentals",
      duration: "4 weeks",
      level: "Beginner",
      type: "Free",
      icon: BookOpen
    },
    {
      title: "Web3 Development Bootcamp",
      duration: "8 weeks",
      level: "Intermediate",
      type: "Paid",
      icon: Video
    },
    {
      title: "NFT Creation Masterclass",
      duration: "2 weeks",
      level: "Advanced",
      type: "Paid",
      icon: Award
    }
  ];

  return (
    <section id="education" className="py-20 md:py-32 relative bg-gradient-glow">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-accent animate-pulse-glow" />
            <span className="text-accent font-semibold">LEARN WEB3</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Education Hub</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master blockchain technology with our comprehensive courses and workshops
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Education Card */}
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/30 mb-12 glow-purple">
            <div className="grid md:grid-cols-2 gap-0">
              <div 
                className="h-64 md:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url(${educationImage})` }}
              />
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
                    New Course
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Web3 Crash Course</h3>
                  <p className="text-muted-foreground mb-6">
                    A comprehensive introduction to blockchain, cryptocurrencies, and decentralized applications. 
                    Perfect for beginners looking to enter the Web3 space.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-accent" />
                      <span className="text-sm">12+ Video Lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-sm">Certificate</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground glow-cyan">
                    Enroll Now - Free
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <Card 
                  key={course.title} 
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:glow-purple group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.type === 'Free' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {course.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{course.level}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{course.duration}</p>
                      <Button size="sm" variant="outline" className="w-full border-primary/50">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10">
              View All Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
