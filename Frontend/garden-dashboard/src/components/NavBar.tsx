import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/Separator";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const menuItems = [
  { title: "Home", href: "#hero" },
  { title: "Dashboard", href: "#dashboard" },
  { title: "About", href: "/about" },
  { title: "Instagram", href: "https://www.instagram.com/gcifiu" },
];

interface NavBarProps {
  isAboutPage?: boolean;
}

export function NavBar({ isAboutPage = false }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isAboutPage ? "about" : "hero");
  
  const updateActiveSection = (section: string) => {
    setActiveSection(section);
    if (!isAboutPage) {
      window.history.replaceState(null, "", `#${section}`);
    }
  };

  // Update active section when hash changes - only for home page
  useEffect(() => {
    if (isAboutPage) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "hero";
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isAboutPage]);

  // Use the callback to update active section and URL hash - only for home page
  const isDashboardVisible = useIntersectionObserver("dashboard", (isVisible) => {
    if (isAboutPage) return;
    
    if (isVisible) {
      updateActiveSection("dashboard");
    } else {
      const heroSection = document.getElementById("hero");
      const heroRect = heroSection?.getBoundingClientRect();
      const dashboardSection = document.getElementById("dashboard");
      const dashboardRect = dashboardSection?.getBoundingClientRect();
      
      // Check if we're scrolling up and hero section is more visible
      if (heroRect && dashboardRect && 
          heroRect.top >= -window.innerHeight / 2 && 
          dashboardRect.top > window.innerHeight / 2) {
        updateActiveSection("hero");
      }
    }
  });

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      if (isAboutPage) {
        // Store the target section in sessionStorage before navigation
        const targetSection = href.slice(1);
        sessionStorage.setItem('scrollTarget', targetSection);
        window.location.href = '/';
      } else {
        const sectionId = href.slice(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          updateActiveSection(sectionId);
        }
      }
    } else if (href === '/about') {
      window.location.href = href;
    } else if (href.startsWith('https://')) {
      window.open(href, '_blank');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl bg-[#3e2213]/80 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[#3e2213]"
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-[#3e2213]/95 backdrop-blur-sm transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col items-end justify-center gap-8 px-8">
          {menuItems.map((item, i) => (
            <div
              key={item.title}
              className={`group relative transition-all duration-300 delay-[${
                i * 100
              }ms] ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            >
              <a
                href={item.href}
                className="text-xl font-medium text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                  setIsOpen(false);
                }}
              >
                {item.title}
              </a>
              <span className="absolute -bottom-1 right-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Menu */}
      <nav
        className={`fixed left-[8%] z-50 hidden transition-all duration-500 ease-in-out md:block ${
          isDashboardVisible || isAboutPage ? "top-32" : "top-1/3"
        }`}
      >
        <div className="relative flex flex-col items-end gap-5">
          {menuItems.map((item) => {
            const isActive = isAboutPage 
              ? item.href === "/about"
              : activeSection === item.href.replace("#", "");
            return (
              <div key={item.title} className="group relative">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                  className={`text-lg font-semibold  transition-colors hover:opacity-90 ${
                    isDashboardVisible || isAboutPage ? "text-black" : "text-white"
                  }`}
                >
                  {item.title.toLowerCase()}
                </a>
                <span
                  className={`absolute -bottom-1 right-0 h-[2px] transition-all duration-300 
                    ${isDashboardVisible || isAboutPage ? "bg-black" : "bg-white"} 
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </div>
            );
          })}
          <Separator
            orientation="vertical"
            className={`absolute -right-3 top-0 h-full w-[2px] ${
              isDashboardVisible || isAboutPage ? "bg-black" : "bg-white"
            }`}
          />
        </div>
      </nav>
    </>
  );
}
