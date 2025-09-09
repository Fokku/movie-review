import { MovieCard } from "@/components/movie-card";
import { useNavigate } from "react-router-dom";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";

const MOVIES = [
  {
    id: "1",
    title: "Steel Thunder",
    poster: movie1,
    rating: 4.2,
    year: 2024,
    duration: 142,
    genre: "Action"
  },
  {
    id: "2", 
    title: "Eternal Hearts",
    poster: movie2,
    rating: 4.6,
    year: 2024,
    duration: 118,
    genre: "Romance"
  },
  {
    id: "3",
    title: "Shadow's Edge",
    poster: movie3,
    rating: 4.3,
    year: 2024,
    duration: 105,
    genre: "Horror"
  },
  {
    id: "nexus",
    title: "Nexus Protocol",
    poster: "/api/placeholder/400/600",
    rating: 4.7,
    year: 2024,
    duration: 138,
    genre: "Sci-Fi"
  }
];

interface MovieGridProps {
  title?: string;
  limit?: number;
}

export function MovieGrid({ title = "Popular Movies", limit }: MovieGridProps) {
  const navigate = useNavigate();
  const displayMovies = limit ? MOVIES.slice(0, limit) : MOVIES;

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              {...movie}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}