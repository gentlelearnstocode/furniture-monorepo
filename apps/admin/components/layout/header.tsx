"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import {
  SidebarTrigger,
} from "@repo/ui/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/ui/breadcrumb";
import { Separator } from "@repo/ui/ui/separator";
import { Button } from "@repo/ui/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/ui/avatar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-100 shadow-sm gap-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-gray-400">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary-500 rounded-full border-2 border-white" />
        </Button>
        
        <Separator orientation="vertical" className="mx-2 h-6" />

        <Avatar className="h-8 w-8 transition-transform hover:scale-110 cursor-pointer">
          <AvatarImage src="" alt="JD" />
          <AvatarFallback className="bg-brand-primary-600 text-white text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
