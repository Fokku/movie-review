import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Film, User, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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