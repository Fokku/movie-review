import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, ChevronDown, Grid, List, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MovieCard } from "@/components/movie-card";
import { Navbar } from "@/components/navbar";
import { useNavigate } from "react-router-dom";

const MoviesListPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data that would typically come from your MariaDB
  const sampleMovies = [
    {
      id: "1",
      series_title: "The Shawshank Redemption",
      released_year: "1994",
      certificate: "R",
      runtime: "142",
      genre: "Drama",
      imdb_rating: 9.3,
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      meta_score: 80,
      director: "Frank Darabont",
      star1: "Tim Robbins",
      star2: "Morgan Freeman",
      star3: "Bob Gunton",
      star4: "William Sadler",
      no_of_votes: 2743010,
      gross: "$16,000,000",
      poster_link: "/api/placeholder/300/450"
    },
    {
      id: "2",
      series_title: "The Godfather",
      released_year: "1972",
      certificate: "R",
      runtime: "175",
      genre: "Crime, Drama",
      imdb_rating: 9.2,
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      meta_score: 100,
      director: "Francis Ford Coppola",
      star1: "Marlon Brando",
      star2: "Al Pacino",
      star3: "James Caan",
      star4: "Diane Keaton",
      no_of_votes: 1865015,
      gross: "$134,966,411",
      poster_link: "/api/placeholder/300/450"
    },
    {
      id: "3",
      series_title: "The Dark Knight",
      released_year: "2008",
      certificate: "PG-13",
      runtime: "152",
      genre: "Action, Crime, Drama",
      imdb_rating: 9.0,
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      meta_score: 84,
      director: "Christopher Nolan",
      star1: "Christian Bale",
      star2: "Heath Ledger",
      star3: "Aaron Eckhart",
      star4: "Michael Caine",
      no_of_votes: 2654854,
      gross: "$534,858,444",
      poster_link: "/api/placeholder/300/450"
    },
    {
      id: "4",
      series_title: "Pulp Fiction",
      released_year: "1994",
      certificate: "R",
      runtime: "154",
      genre: "Crime, Drama",
      imdb_rating: 8.9,
      overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      meta_score: 94,
      director: "Quentin Tarantino",
      star1: "John Travolta",
      star2: "Uma Thurman",
      star3: "Samuel L. Jackson",
      star4: "Bruce Willis",
      no_of_votes: 2097041,
      gross: "$107,928,762",
      poster_link: "/api/placeholder/300/450"
    },
    {
      id: "5",
      series_title: "Forrest Gump",
      released_year: "1994",
      certificate: "PG-13",
      runtime: "142",
      genre: "Drama, Romance",
      imdb_rating: 8.8,
      overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man.",
      meta_score: 82,
      director: "Robert Zemeckis",
      star1: "Tom Hanks",
      star2: "Robin Wright",
      star3: "Gary Sinise",
      star4: "Sally Field",
      no_of_votes: 2065948,
      gross: "$330,252,182",
      poster_link: "/api/placeholder/300/450"
    },
    {
      id: "6",
      series_title: "Inception",
      released_year: "2010",
      certificate: "PG-13",
      runtime: "148",
      genre: "Action, Adventure, Sci-Fi",
      imdb_rating: 8.8,
      overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      meta_score: 74,
      director: "Christopher Nolan",
      star1: "Leonardo DiCaprio",
      star2: "Marion Cotillard",
      star3: "Tom Hardy",
      star4: "Elliot Page",
      no_of_votes: 2345021,
      gross: "$292,576,195",
      poster_link: "/api/placeholder/300/450"
    }
  ];

  // Simulate API call to MariaDB
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMovies(sampleMovies);
      setFilteredMovies(sampleMovies);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = movies;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.series_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(movie => movie.released_year === selectedYear);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.imdb_rating - a.imdb_rating;
        case 'year':
          return parseInt(b.released_year) - parseInt(a.released_year);
        case 'title':
          return a.series_title.localeCompare(b.series_title);
        case 'votes':
          return b.no_of_votes - a.no_of_votes;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, selectedYear, sortBy]);

  // Get unique genres and years for filters
  const genres = [...new Set(movies.flatMap(movie => 
    movie.genre.split(', ').map(g => g.trim())
  ))].sort();
  
  const years = [...new Set(movies.map(movie => movie.released_year))].sort((a, b) => b - a);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // List view movie card component matching your theme
  const MovieListCard = ({ movie }) => (
    <Card 
      className="group relative overflow-hidden border-0 bg-gradient-to-b from-card to-secondary cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-movie-card)]"
      onClick={() => handleMovieClick(movie.id)}
    >
      <div className="flex p-4">
        <div className="w-24 aspect-[2/3] overflow-hidden rounded flex-shrink-0">
          <img 
            src={movie.poster_link} 
            alt={movie.series_title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="ml-4 flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {movie.series_title}
            </h3>
            <div className="flex items-center ml-4">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1 text-foreground">{movie.imdb_rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{movie.released_year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{movie.runtime}min</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {movie.genre.split(', ')[0]}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.overview}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Dir: {movie.director}</span>
            <span>{(movie.no_of_votes / 1000).toFixed(0)}k votes</span>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Discover Movies
              </h1>
              <p className="text-muted-foreground">Explore films of all genres</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search movies, directors, genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <span className="text-muted-foreground text-sm">
                {filteredMovies.length} of {movies.length} movies
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="votes">Sort by Popularity</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-secondary rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <Card className="mt-4 p-4 bg-secondary/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedGenre('');
                      setSelectedYear('');
                      setSearchTerm('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Movies Grid/List */}
      <div className="container mx-auto px-4 py-8">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No movies found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.series_title}
                poster={movie.poster_link}
                rating={movie.imdb_rating}
                year={parseInt(movie.released_year)}
                duration={parseInt(movie.runtime)}
                genre={movie.genre.split(', ')[0]}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map(movie => (
              <MovieListCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button (for pagination) */}
      {filteredMovies.length > 0 && (
        <div className="text-center py-8">
          <Button size="lg" className="px-8">
            Load More Movies
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoviesListPage;