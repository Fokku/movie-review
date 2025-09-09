import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/navbar";
import { Play, Plus, Calendar, Clock, Star, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import heroMovie from "@/assets/hero-movie.jpg";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";

const MOVIE_DATA: Record<string, any> = {
  "nexus": {
    title: "Nexus Protocol",
    poster: heroMovie,
    rating: 4.7,
    year: 2024,
    duration: 138,
    genre: "Sci-Fi Thriller",
    director: "Alex Morgan",
    cast: ["Ryan Chen", "Maya Rodriguez", "David Park"],
    plot: "In a dystopian future where technology controls every aspect of life, a rogue hacker discovers a hidden protocol that could either save humanity or destroy it forever. As corporate overlords tighten their grip on society, our protagonist must navigate a dangerous web of betrayal and conspiracy.",
    reviews: [
      { id: 1, user: "MovieBuff92", rating: 5, comment: "Absolutely mind-blowing! The cinematography and plot twists kept me on the edge of my seat.", date: "2024-01-15" },
      { id: 2, user: "CinemaLover", rating: 4, comment: "Great sci-fi thriller with excellent world-building. Some pacing issues in the middle act.", date: "2024-01-12" }
    ]
  },
  "1": {
    title: "Steel Thunder",
    poster: movie1,
    rating: 4.2,
    year: 2024,
    duration: 142,
    genre: "Action",
    director: "Marcus Steel",
    cast: ["Jake Harrison", "Anna Cross", "Marcus Wolf"],
    plot: "When a retired special forces operative's family is kidnapped by a ruthless arms dealer, he must use all his skills to infiltrate a heavily fortified compound and rescue them before time runs out.",
    reviews: [
      { id: 1, user: "ActionFan", rating: 4, comment: "Non-stop action with incredible stunts. A bit predictable but thoroughly entertaining.", date: "2024-01-10" }
    ]
  },
  "2": {
    title: "Eternal Hearts",
    poster: movie2,
    rating: 4.6,
    year: 2024,
    duration: 118,
    genre: "Romance",
    director: "Sofia Martinez",
    cast: ["Emma Stone", "Michael Rivers", "Grace Chen"],
    plot: "A touching story about two souls who find each other across different timelines, proving that true love transcends all boundaries of time and space.",
    reviews: [
      { id: 1, user: "RomanceReader", rating: 5, comment: "Beautiful and emotional. Made me cry multiple times. Perfect chemistry between the leads.", date: "2024-01-08" }
    ]
  },
  "3": {
    title: "Shadow's Edge",
    poster: movie3,
    rating: 4.3,
    year: 2024,
    duration: 105,
    genre: "Horror",
    director: "James Blackwood",
    cast: ["Sarah Dark", "Thomas Night", "Luna Shadow"],
    plot: "A family moves into an old Victorian house, only to discover that the shadows within hold dark secrets and malevolent spirits that refuse to rest.",
    reviews: [
      { id: 1, user: "HorrorHound", rating: 4, comment: "Genuinely scary with great atmosphere. Some clichéd moments but overall very effective.", date: "2024-01-05" }
    ]
  }
};

export default function MovieDetail() {
  const { id } = useParams();
  const [newReview, setNewReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

  const movie = id ? MOVIE_DATA[id] : null;

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Movie not found</h1>
            <p className="text-muted-foreground">The movie you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      toast({
        title: "Review required",
        description: "Please write a review before submitting.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review submitted!",
      description: "Thank you for your review. It will be published shortly."
    });

    setNewReview("");
    setUserRating(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </section>

      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-0 shadow-[var(--shadow-movie-card)]">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">{movie.genre}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}min</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {movie.title}
              </h1>

              <StarRating rating={movie.rating} size="lg" className="mb-6" />

              <div className="flex gap-4 mb-6">
                <Button size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
                <Button variant="outline" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add to Watchlist
                </Button>
              </div>
            </div>

            {/* Plot */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.plot}
              </p>
            </div>

            {/* Cast & Crew */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Cast & Crew</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Director</h3>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cast</h3>
                  <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Reviews Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Existing Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-4">
              {movie.reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{review.user}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <StarRating rating={review.rating} size="sm" showValue={false} />
                        <span>{review.date}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Write Review */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="transition-colors"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            star <= userRating 
                              ? 'text-rating-gold fill-rating-gold' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleSubmitReview} className="w-full">
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
