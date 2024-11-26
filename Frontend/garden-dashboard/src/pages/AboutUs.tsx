import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { GardenBackground } from "../components/GardenBackground";
import { useEffect } from "react";

export function AboutUs() {
  // Set active section to "about" when component mounts
  useEffect(() => {
    const hash = window.location.hash.slice(1) || "about";
    window.history.replaceState(null, "", "/about");
  }, []);

  return (
    <main className="relative h-screen w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
      <NavBar isAboutPage />
      <div className="relative">
        <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-5">
          <div className="hidden md:block" />
          <div className="col-span-1 md:col-span-3" />
          <div className="hidden md:block" />
        </div>

        {/* Background */}
        <div className="absolute inset-0">
          <GardenBackground />
        </div>

        {/* Content */}
        <section className="relative z-10 min-h-screen scroll-section">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left column - empty for nav */}
            <div className="hidden md:block" />
            {/* Main content column */}
            <div className="col-span-1 md:col-span-3 px-6 py-32">
              <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>
              <div className="rounded-xl border border-black/30 bg-white/30 p-8 backdrop-blur-sm">
                <p className="text-lg">
                  Content coming soon...
                </p>
              </div>
            </div>
            {/* Right column - empty */}
            <div className="hidden md:block" />
          </div>
        </section>

        {/* Footer Section */}
        <section className="scroll-section">
          <Footer />
        </section>
      </div>
    </main>
  );
}