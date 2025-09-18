import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Film, User, Menu, Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0); //watchlist count to be retrieved from db
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              CineReview
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="ghost">
              Movies
            </Button>
            <Button variant="ghost">
              Reviews
            </Button>
            <Button variant="ghost">
              Top Rated
            </Button>
          </div>

          {/* Search & User Actions */}
          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search movies..."
                  className="w-64"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Watchlist Icon */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => navigate("/watchlist")}
              title="My Watchlist"
            >
              <Bookmark className="h-5 w-5" />
              {watchlistCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}