"use client";

import { useState, useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedBrain from '@/components/AnimatedBrain';
import BubbleBackground from '@/components/BubbleBackground';
import WelcomeOverlay from '@/components/WelcomeOverlay';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Magnetic Button component that moves slightly towards cursor
interface MagneticButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  [key: string]: any; // For any additional props
}

const MagneticButton = ({ children, onClick, variant = "default", className = "", ...props }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move button slightly towards cursor (magnetic effect)
    button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;

    // Change cursor appearance
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (cursor) {
      cursor.style.width = '60px';
      cursor.style.height = '60px';
      cursor.style.borderColor = variant === "default" ? '#3b82f6' : '#10b981';
    }
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (!button) return;

    // Reset position with a smooth transition
    button.style.transform = 'translate(0px, 0px)';

    // Reset cursor
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (cursor) {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.borderColor = '#3b82f6';
    }
  };

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      variant={variant}
      className={`transition-transform duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Button>
  );
};

// Custom cursor component
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor as any);
    return () => {
      window.removeEventListener('mousemove', moveCursor as any);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed w-10 h-10 rounded-full border-2 border-blue-500 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
    />
  );
};

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  useEffect(() => {
    // Initialize window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  const getParallaxStyle = (strength = 20) => {
    if (typeof window === 'undefined') return {};
    
    const x = (mousePosition.x - windowSize.width / 2) / strength;
    const y = (mousePosition.y - windowSize.height / 2) / strength;
    return {
      transform: `translateX(${x}px) translateY(${y}px)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <CustomCursor />
      <Toaster />
      <BubbleBackground />
      <AnimatedBrain />
      <WelcomeOverlay />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Brain background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url("/brain.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
        
        <div className="container mx-auto px-4 z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
              Brain Hack
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Optimize your productivity with AI-powered insights and personalized recommendations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Get Started
              </MagneticButton>
              
              <MagneticButton
                onClick={() => router.push('/about')}
                variant="outline"
                className="px-8 py-3 text-lg border-orange-500 text-orange-500 hover:bg-orange-500/10"
              >
                Learn More
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500"
            data-aos="fade-up"
          >
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Productivity Tracking",
                description: "Monitor your work patterns and identify productivity bottlenecks with AI-powered analytics.",
                icon: "📊",
                link: "/dashboard"
              },
              {
                title: "Distraction Prevention",
                description: "Get real-time alerts when you're about to get distracted and receive personalized strategies to stay focused.",
                icon: "🎯",
                link: "/focus-timer"
              },
              {
                title: "Smart Scheduling",
                description: "Optimize your daily schedule based on your energy levels and work preferences.",
                icon: "📅",
                link: "/goals"
              },
              {
                title: "Focus Mode",
                description: "Enter a distraction-free environment with ambient sounds and focus-enhancing features.",
                icon: "🧘",
                link: "/focus-timer"
              },
              {
                title: "Progress Analytics",
                description: "Track your productivity improvements over time with detailed reports and insights.",
                icon: "📈",
                link: "/dashboard"
              },
              {
                title: "AI Recommendations",
                description: "Receive personalized suggestions to improve your workflow and productivity.",
                icon: "🤖",
                link: "/ask-brainhack"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => router.push(feature.link)}
              >
                <Card
                  className="bg-gray-900/50 border-gray-800 hover:border-orange-500 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  style={getParallaxStyle(30)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardHeader>
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-2xl text-orange-400">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500"
            data-aos="fade-up"
          >
            How It Works
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="text-xl hover:text-orange-400">
                    Track Your Productivity
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Our AI monitors your work patterns, identifying when you're most productive and when you tend to get distracted. This data helps us understand your unique productivity profile.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="text-xl hover:text-orange-400">
                    Receive Personalized Insights
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Based on your productivity data, our AI generates personalized recommendations to help you work more efficiently and stay focused longer.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="text-xl hover:text-orange-400">
                    Implement Smart Strategies
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Follow our AI-guided strategies to optimize your workflow, minimize distractions, and maximize your productive hours.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="text-xl hover:text-orange-400">
                    Track Your Progress
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Monitor your productivity improvements over time with detailed analytics and progress reports.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-900/50 to-red-900/50">
        <div 
          className="container mx-auto px-4 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-4xl font-bold mb-8">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already improved their focus and productivity with Brain Hack.
          </p>
          
          <MagneticButton
            onClick={() => router.push('/signup')}
            className="px-8 py-3 text-lg"
          >
            Start Free Trial
          </MagneticButton>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Brain Hack</h3>
              <p className="text-gray-400">
                AI-powered productivity optimization for professionals.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    onMouseMove={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Change cursor on hover
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '50px';
                        cursor.style.height = '50px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      // Reset cursor
                      const cursor = document.querySelector('.custom-cursor') as HTMLElement;
                      if (cursor) {
                        cursor.style.width = '40px';
                        cursor.style.height = '40px';
                        cursor.style.borderColor = '#3b82f6';
                      }
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Brain Hack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
