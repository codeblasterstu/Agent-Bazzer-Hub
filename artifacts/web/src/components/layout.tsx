import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "./auth-provider";
import { Bot, LogOut, User, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Marketplace" },
    { href: "/feedback", label: "Live Feed" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background ambient lights */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-accent/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-x-0 rounded-none bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                <Bot className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/50" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wide text-foreground">
                Agent<span className="text-primary">Bazaar</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary text-glow" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <User className="w-4 h-4 text-accent" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="relative px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 group"
                  >
                    <span>Get Started</span>
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-panel border-t border-white/10"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium p-2 rounded-lg ${
                      location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                {user ? (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-foreground font-medium">{user.name}</span>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-destructive flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center p-3 rounded-xl border border-white/10 font-medium hover:bg-white/5"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center p-3 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/25"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-card/80 backdrop-blur-md py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl tracking-wide text-foreground">
                  Agent<span className="text-primary">Bazaar</span>
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                The premier marketplace for specialized AI agents. Automate your workflow, scale your business, and step into the future.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 flex flex-col">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors w-fit">Marketplace</Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors w-fit">Pricing</Link>
                <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors w-fit">Live Feed</Link>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 flex flex-col">
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors w-fit">About Us</Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors w-fit">Contact</Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors w-fit">Privacy Policy</Link>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AgentBazaar Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Status: <span className="text-emerald-400">All Systems Operational</span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
