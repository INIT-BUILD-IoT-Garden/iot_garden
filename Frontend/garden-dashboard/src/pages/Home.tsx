import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { NavBar } from "@/components/NavBar";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    // Check if there's a stored scroll target
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget) {
      // Clear the stored target
      sessionStorage.removeItem('scrollTarget');
      // Wait for the page to fully render
      setTimeout(() => {
        const targetSection = document.getElementById(scrollTarget);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <main className="relative h-screen w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
      <NavBar />
      <div className="relative">
        <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-5">
          <div className="hidden md:block" />
          <div className="col-span-1 md:col-span-3" />
          <div className="hidden md:block" />
        </div>
        
        <section id="hero" className="h-screen scroll-section">
          <HeroSection />
        </section>
        <section id="dashboard" className="scroll-section">
          <Dashboard />
        </section>
        <section id="footer" className="scroll-section">
          <Footer />
        </section>
      </div>
    </main>
  );
}