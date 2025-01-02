import { PlanetGrid } from './components/PlanetGrid.tsx';

function App() {
    return (
        <section className="flex flex-col items-center min-h-screen">
            <h1 className="text-xl p-4">Welcome to exo worlds!</h1>
            <PlanetGrid />
        </section>
    );
}

export default App;
