"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, BookOpen, Calculator } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Habit Log", icon: CalendarCheck, href: "/habit-log" },
  { label: "Resource", icon: BookOpen, href: "/resource-library" },
  { label: "Kalkulator", icon: Calculator, href: "/calculator" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (resolvedTheme || theme) : "dark";
  const logoSrc = activeTheme === "light" ? "/logo2-warnaGelap.png" : "/logo2-warnaTerang.png";

  return (
    <div className="space-y-4 py-4 flex-col h-full bg-card border-r w-20 lg:w-64 hidden md:flex transition-all duration-300">
      <div className="px-6 py-2 flex items-center gap-3 mb-6 overflow-hidden">
        <div className="shrink-0">
          <Image src={logoSrc} alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <h1 className="font-heading font-bold text-xl whitespace-nowrap hidden lg:block">Study Buddy</h1>
      </div>
      <div className="px-3 flex-1 space-y-1">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${pathname === route.href
              ? "bg-primary text-primary-foreground font-medium shadow-md"
              : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
              }`}
          >
            <route.icon className="h-5 w-5 shrink-0" />
            <span className="hidden lg:block truncate">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}