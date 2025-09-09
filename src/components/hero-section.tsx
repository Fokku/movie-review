import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Star } from "lucide-react";
import heroMovie from "@/assets/hero-movie.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroMovie} 
          alt="Nexus Protocol"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              Featured
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating-gold text-rating-gold" />
              <span className="text-sm font-medium">Editor's Choice</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Nexus Protocol
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground">
            <span>2024</span>
            <span>•</span>
            <span>2h 18min</span>
            <span>•</span>
            <Badge variant="outline">Sci-Fi Thriller</Badge>
          </div>

          <StarRating rating={4.7} size="lg" />

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            In a dystopian future where technology controls every aspect of life, 
            a rogue hacker discovers a hidden protocol that could either save humanity 
            or destroy it forever.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Play className="mr-2 h-5 w-5" />
              Watch Trailer
            </Button>
            <Button variant="outline" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}