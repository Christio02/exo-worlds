import { PlanetGrid } from './components/PlanetGrid';

function App() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-linear-to-b from-slate-900 via-blue-900 to-slate-900 z-0" />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-200 mb-4">
              Welcome to Exo Worlds
            </h1>
            <p className="text-xl text-blue-300">Explore the fascinating universe of exoplanets</p>
          </header>
          <main>
            <PlanetGrid />
          </main>
          <footer className="mt-12 text-center text-blue-300">
            <p>&copy; 2025 Exo Worlds Explorer. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
