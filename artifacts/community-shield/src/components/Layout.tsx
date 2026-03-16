import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Home, Map as MapIcon, Award, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map View", icon: MapIcon },
    { href: "/report", label: "Report Incident", icon: Shield, isPrimary: true },
    { href: "/recognize", label: "Recognize", icon: Award },
    { href: "/rights", label: "Rights Info", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border/50 z-50 flex items-center justify-between px-4 md:px-8 shadow-sm dark:shadow-none">
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
            alt="Common Ground Logo" 
            className="w-8 h-8 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Common<span className="text-primary"> Ground</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            if (item.isPrimary) {
              return (
                <Link key={item.href} href={item.href} className="ml-4">
                  <div className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <button 
          className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-background border-b border-border/50 shadow-lg z-40 animate-in slide-in-from-top-4">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <div className={cn(
                    "p-4 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                    item.isPrimary && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <main className="flex-1 w-full max-w-screen-2xl mx-auto pt-16 pb-24 md:pb-8 flex flex-col">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border/50 z-50 flex justify-around items-center px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          if (item.isPrimary) {
            return (
              <div key={item.href} className="relative -top-6">
                <Link href={item.href}>
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-background cursor-pointer">
                    <Icon className="w-7 h-7" />
                  </div>
                </Link>
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors cursor-pointer",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
