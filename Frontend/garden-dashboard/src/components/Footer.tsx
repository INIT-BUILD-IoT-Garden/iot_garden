import { useEffect, useState } from 'react';
import { Facebook, Github, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/Separator';

interface FooterProps {
  onDirtHeightChange?: (height: number) => void;
}

export function Footer({ onDirtHeightChange }: FooterProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const maxDirtHeight = 130;

  useEffect(() => {
    if (onDirtHeightChange) {
      const handleScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const threshold = 0.95; 
        
        const shouldOpen = currentScroll > maxScroll * threshold;
        setIsOpen(shouldOpen);
        onDirtHeightChange(shouldOpen ? maxDirtHeight : 0);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [onDirtHeightChange, maxDirtHeight]);

  return (
    <footer>
      <div className="h-40 w-full bg-gradient-to-b from-[#2d5a27] via-[#3e2213] via-10% to-[#5e3c22] to-50%">
        <div className="container relative z-20 mx-auto flex h-full items-center justify-between px-4 text-white/90">
          <div className="flex items-center space-x-8">
            <div>
              <a 
                href="https://www.weareinit.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors">
                  Init website
              </a>
              <p className="text-sm text-white/70">
                Contact us at fiu@weareinit.org
              </p>
              <a 
                href="https://gcifiu.wixsite.com/website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors">
                  GCI Website
              </a>
            </div>

            <Separator orientation="vertical" className="h-24 bg-white/20" />

            <div className="text-center">
              <p className="text-sm text-white/70">
                <strong>Green Campus Initiative</strong><br />
                A student organization in the FIU Honors College dedicated to increasing sustainability at the campus, county, and state level.
              </p>
            </div>

            <Separator orientation="vertical" className="h-24 bg-white/20" />

            <div className="text-center">
              <p className="text-sm text-white/70">
                <strong>Init Mission</strong><br />
                We empower underserved communities to launch successful careers in technology.
              </p>
            </div>

            <Separator orientation="vertical" className="h-24 bg-white/20" />

            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/link/to/repo" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>  
              <a
                href="https://www.instagram.com/init.fiu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5"/>
              </a>
              <a 
                href="https://x.com/initfiu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white/50"
              >
                <Twitter className="h-5 w-5"/>
              </a>
              <a 
                href="https://www.facebook.com/init.fiu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white/50"
              >
                <Facebook className="h-5 w-5"/>
              </a>
              <p className="text-sm text-white/50">
                © {new Date().getFullYear()} 
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
