import { useState, useCallback } from 'react';
import { Dashboard } from './components/Dashboard'
import { Footer } from './components/Footer'
import { GardenBackground } from './components/GardenBackground'
import { HeroSection } from './components/HeroSection'

function App() {
  const [grassOffset, setGrassOffset] = useState(0);
  const [activeSection, setActiveSection] = useState<'hero' | 'dashboard'>('hero');

  const handleDirtHeightChange = useCallback((height: number) => {
    setGrassOffset(height);
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden">
      <GardenBackground grassOffset={grassOffset} />
      <div className="relative">
        <HeroSection activeSection={activeSection} setActiveSection={setActiveSection} />
        <Dashboard activeSection={activeSection} setActiveSection={setActiveSection} />
        <Footer onDirtHeightChange={handleDirtHeightChange} />
      </div>
    </main>
  )
}

export default App