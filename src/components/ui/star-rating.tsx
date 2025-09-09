import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showValue = true, 
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const isHalf = i === fullStars && hasHalfStar;
          const isFull = i < fullStars;
          
          return (
            <div key={i} className="relative">
              <Star 
                className={cn(
                  sizeClasses[size],
                  "text-muted-foreground"
                )} 
              />
              {(isFull || isHalf) && (
                <Star 
                  className={cn(
                    sizeClasses[size],
                    "absolute inset-0 text-rating-gold fill-rating-gold",
                    isHalf && "clip-path-[polygon(0_0,50%_0,50%_100%,0_100%)]"
                  )} 
                />
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium text-rating-gold", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}