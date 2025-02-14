import Loader from './components/Loader';
import { PlanetGrid } from './components/PlanetGrid';
import { LoaderProvider, useLoader } from './context/LoadingContext';

function AppContent() {
  const { showLoader } = useLoader();

  return (
    <div className="min-h-screen relative">
      {showLoader && (
        <div className="fixed inset-0 z-50">
          <Loader />
        </div>
      )}

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
            <p>
              All images are AI generated, and is a hypothetical representation of the planet.
              &copy; 2025 Exo Worlds Explorer. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
