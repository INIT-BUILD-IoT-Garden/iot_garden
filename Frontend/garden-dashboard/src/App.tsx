import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <main className="relative h-screen w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
      <NavBar />
      <div className="relative">
        <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-5">
          {/* Left column - empty on mobile, nav space on desktop */}
          <div className="hidden md:block" />
          {/* Main content column */}
          <div className="col-span-1 md:col-span-3" />
          {/* Right column - empty */}
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

export default App;
