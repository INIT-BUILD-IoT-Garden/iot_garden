import { useState, useCallback } from 'react';
import { Dashboard } from './components/Dashboard'
import { Footer } from './components/Footer'
import { GardenBackground } from './components/GardenBackground'

function App() {
  const [grassOffset, setGrassOffset] = useState(0);

  const handleDirtHeightChange = useCallback((height: number) => {
    setGrassOffset(height);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GardenBackground grassOffset={grassOffset} />
      <Dashboard />
      <Footer onDirtHeightChange={handleDirtHeightChange} />
    </div>
  )
}

export default App