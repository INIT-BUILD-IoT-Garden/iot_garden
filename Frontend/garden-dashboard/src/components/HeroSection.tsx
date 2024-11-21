import { useEffect, useRef } from 'react';

interface HeroSectionProps {
  activeSection: 'hero' | 'dashboard';
  setActiveSection: (section: 'hero' | 'dashboard') => void;
}

export function HeroSection({ activeSection, setActiveSection }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !contentRef.current) return;
      
      const currentScroll = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollingUp = currentScroll < lastScrollPosition.current;
      
      // Snapping threshold
      const snapThreshold = viewportHeight * 0.3;
      
      if (scrollingUp && currentScroll <= snapThreshold) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('hero');
      }
      
      lastScrollPosition.current = currentScroll;

      // Adjust fade threshold
      const fadeStart = viewportHeight * 0.2;
      const fadeEnd = viewportHeight * 0.8;
      
      const progress = Math.max(0, Math.min(1, 
        (currentScroll - fadeStart) / (fadeEnd - fadeStart)
      ));
      
      // Update opacity and gradient in one place
      if (contentRef.current) {
        contentRef.current.style.opacity = (1 - progress).toString();
      }
      
      const startColor = `rgba(0, 0, 0, ${1 - progress})`;
      const midColor = `rgba(13, 25, 33, ${1 - progress})`;
      const endColor = `rgba(25, 50, 66, ${1 - progress})`;
      
      sectionRef.current.style.background = 
        `linear-gradient(to bottom, ${startColor}, ${midColor}, ${endColor})`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  // Helper function to generate random star properties
  const generateStarProperties = () => {
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.7 + 0.0;
    const animationDuration = Math.random() * 5 + 2;
    
    return {
      size,
      opacity,
      animationDuration,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    };
  };

  const handleExploreClick = () => {
    const viewportHeight = window.innerHeight;
    window.scrollTo({ 
      top: viewportHeight, 
      behavior: 'smooth' 
    });
    setActiveSection('dashboard');
  };

  return (
    <section 
      ref={sectionRef}
      className="h-screen w-full flex items-center justify-center relative"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => {
          const { size, opacity, animationDuration, left, top } = generateStarProperties();
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'white',
                left,
                top,
                opacity,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        })}
      </div>

      <div 
        ref={contentRef}
        className="container mx-auto px-4 text-center h-full flex flex-col items-center justify-center transition-opacity duration-200"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
          Green Campus
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
          Monitoring and maintaining our garden ecosystem through advanced sensor technology and real-time data analysis.
        </p>
        <button 
          onClick={handleExploreClick}
          className="group animate-bounce bg-white/10 px-4 py-2 rounded-md text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        >
          <p className="text-sm">Scroll to explore</p>
          <svg 
            className="w-6 h-6 mx-auto mt-2 group-hover:translate-y-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
