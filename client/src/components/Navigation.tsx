import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Map, BarChart3, Shield, Menu, X, LogOut, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { href: "/", label: "Report Issue", icon: FileText, show: true },
    { href: "/map", label: "Live Map", icon: Map, show: true },
    { href: "/admin", label: "Dashboard", icon: BarChart3, show: isAdmin },
    { href: "/admin/operations", label: "Operations", icon: Shield, show: isAdmin },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span>Stray<span className="text-accent">Stat</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.filter(l => l.show).map((link) => (
            <Link key={link.href} href={link.href}>
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                ${location === link.href
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"}
              `}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          ))}

          <div className="ml-4 pl-4 border-l border-border">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden p-2 text-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.filter(l => l.show).map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer
                  ${location === link.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}
                `}
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </div>
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t">
            {user ? (
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
