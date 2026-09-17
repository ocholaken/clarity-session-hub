import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
interface StoredUser {
  name?: string;
  email?: string;
}
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const refreshAuthState = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const nextUser = {
        name: (currentUser.user_metadata?.full_name as string | undefined) ?? undefined,
        email: currentUser.email ?? undefined,
      };
      sessionStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .maybeSingle();
      setIsAdmin(profile?.role === "admin");
    };

    void refreshAuthState();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => void refreshAuthState(), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
    setIsMenuOpen(false);
    void supabase.auth.signOut();
    toast.success("You have been logged out");
    window.location.href = "/";
  };

  const displayName = user?.name || user?.email || "Account";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="w-full py-4 bg-background backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-y-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold">CS</span>
          </div>
          <span className="text-xl font-bold text-foreground">Clarity Sessions</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden min-w-0 max-w-full overflow-x-auto md:flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
          <Link to="/counselors" className="text-muted-foreground hover:text-primary transition-colors">Counselors</Link>
          <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link>
          <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          <Link to="/my-bookings" className="text-muted-foreground hover:text-primary transition-colors">My Bookings</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>
              <span className="text-sm text-muted-foreground max-w-[180px] truncate">{displayName}</span>
              <Button
                variant="outline"
                className="border-border px-4 py-2 rounded-full hover:bg-secondary"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/counselors"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Counselors
            </Link>
            <Link
              to="/resources"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/contact"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/my-bookings"
              className="py-2 px-4 hover:bg-secondary rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
            <div className="flex gap-2 mt-2">
              {user ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {avatarLetter}
                  </div>
                  <span className="flex-1 truncate text-sm">{displayName}</span>
                  <Button
                    variant="outline"
                    className="border-border px-4 py-2 rounded-full hover:bg-secondary"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-secondary">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-[#103838] text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
