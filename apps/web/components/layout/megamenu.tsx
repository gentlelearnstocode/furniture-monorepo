"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MegamenuProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
}

export function Megamenu({ isOpen, data, onClose }: MegamenuProps) {
  if (!isOpen || !data || !data.megaMenu) return null;

  return (
    <div 
      className={cn(
        "absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 z-50",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {data.megaMenu.sections.map((section: any, idx: number) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-brand-neutral-900 border-b border-gray-100 pb-2 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item: string, itemIdx: number) => (
                  <li key={itemIdx}>
                    <a 
                      href="#" 
                      className={cn(
                        "text-sm text-brand-neutral-600 hover:text-brand-primary-600 transition-colors uppercase tracking-wider",
                        item === "Sale" && "text-brand-primary-500 font-medium"
                      )}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {data.megaMenu.sections[0]?.image && (
            <div className="md:col-span-2 lg:col-span-2 relative h-80 rounded-sm overflow-hidden group">
              <Image
                src={data.megaMenu.sections[0].image}
                alt={data.megaMenu.sections[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
