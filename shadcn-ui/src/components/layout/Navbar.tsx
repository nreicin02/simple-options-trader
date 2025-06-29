import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // For demo purposes

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Demo login functionality - for prototype only
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-shrink-0 items-center">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">S</span>
              <span className="ml-2 text-xl font-bold text-foreground">SimpliOptions</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/trade" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Trade
            </Link>
            <Link to="/portfolio" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Portfolio
            </Link>
            <Link to="/education" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Learn
            </Link>
            <Link to="/watchlists" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Watchlists
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleLogin}>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={toggleLogin} variant="ghost" className="text-sm">
                  Log In
                </Button>
                <Button onClick={toggleLogin} variant="default" className="text-sm bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button variant="ghost" size="icon" aria-label="Toggle Menu" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to="/trade" className="text-sm font-medium" onClick={toggleMenu}>
                Trade
              </Link>
              <Link to="/portfolio" className="text-sm font-medium" onClick={toggleMenu}>
                Portfolio
              </Link>
              <Link to="/education" className="text-sm font-medium" onClick={toggleMenu}>
                Learn
              </Link>
              <Link to="/watchlists" className="text-sm font-medium" onClick={toggleMenu}>
                Watchlists
              </Link>
              <div className="pt-2 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block py-2" onClick={toggleMenu}>
                      Profile
                    </Link>
                    <Link to="/settings" className="block py-2" onClick={toggleMenu}>
                      Settings
                    </Link>
                    <Button onClick={() => {toggleLogin(); toggleMenu();}} variant="ghost" className="w-full justify-start px-0">
                      Log Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => {toggleLogin(); toggleMenu();}} variant="outline" className="w-full">
                      Log In
                    </Button>
                    <Button onClick={() => {toggleLogin(); toggleMenu();}} variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;