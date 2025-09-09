import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { MovieGrid } from "@/components/movie-grid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <MovieGrid title="Trending Now" limit={4} />
        <MovieGrid title="Popular Movies" />
      </main>
    </div>
  );
};

export default Index;
