import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
  duration: number;
  genre: string;
  onClick?: () => void;
  className?: string;
}

export function MovieCard({
  id,
  title,
  poster,
  rating,
  year,
  duration,
  genre,
  onClick,
  className
}: MovieCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-0 bg-gradient-to-b from-card to-secondary cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-movie-card)]",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img 
          src={poster} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {genre}
          </Badge>
          
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{duration}min</span>
            </div>
          </div>
          
          <StarRating rating={rating} size="sm" />
        </div>
      </div>
    </Card>
  );
}