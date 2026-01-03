"use client";

import * as React from "react";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuData } from "./menu-data";
import { Megamenu } from "./megamenu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeMenuData = menuData.find((m) => m.title === activeMenu);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-6",
        activeMenu && "bg-white"
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Icons */}
        <div className="flex items-center space-x-6 text-brand-neutral-900 group">
          <button 
            className="p-1 hover:text-brand-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button className="p-1 hover:text-brand-primary-600 transition-colors">
            <Search size={22} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
          <a href="/" className="flex flex-col items-center">
             <div className="flex items-center space-x-1">
                <span className="text-3xl font-black tracking-tighter text-brand-neutral-900">TA</span>
                <div className="h-8 w-[2px] bg-brand-primary-600" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-brand-neutral-600 uppercase">Decor</span>
                  <span className="text-xs font-black tracking-widest text-brand-neutral-900 uppercase">Thien An</span>
                </div>
             </div>
             <span className="text-[8px] font-medium tracking-[0.3em] text-brand-neutral-400 mt-1 uppercase">Furniture • Since 1997</span>
          </a>
        </div>

        {/* Right: Spacer for symmetry */}
        <div className="w-24 md:hidden" />
      </div>

      {/* Navigation Links Row */}
      <nav className="hidden md:flex justify-center mt-6">
        <ul className="flex items-center space-x-10">
          {menuData.map((item) => (
            <li 
              key={item.title}
              onMouseEnter={() => setActiveMenu(item.title)}
              className="relative py-2"
            >
              <a 
                href="#" 
                className={cn(
                  "text-xs font-bold tracking-[0.2em] transition-colors uppercase border-b-2 border-transparent hover:border-brand-primary-600",
                  isScrolled || activeMenu ? "text-brand-neutral-900" : "text-white"
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Megamenu */}
      <Megamenu 
        isOpen={!!activeMenu} 
        data={activeMenuData} 
        onClose={() => setActiveMenu(null)} 
      />
    </header>
  );
}
