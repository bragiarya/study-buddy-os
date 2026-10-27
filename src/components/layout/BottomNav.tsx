"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, BookOpen, Calculator, LogOut } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Habit Log", icon: CalendarCheck, href: "/habit-log" },
  { label: "Resource", icon: BookOpen, href: "/resource-library" },
  { label: "Kalkulator", icon: Calculator, href: "/calculator" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Error during bottom nav logout:", error);
    } finally {
      setIsLogoutOpen(false);
    }
  };


  return (
    <>
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t z-50 flex items-center justify-around px-2"
        style={{ 
          backgroundColor: "hsl(var(--bg-surface))", 
          borderColor: "hsl(var(--border))" 
        }}
      >
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link 
              key={route.href} 
              href={route.href}
              className="flex flex-col items-center justify-center flex-1 gap-1"
            >
              <route.icon 
                className="h-6 w-6 transition-colors" 
                style={{ color: isActive ? "hsl(var(--accent-primary))" : "hsl(var(--text-muted))" }}
              />
              <span 
                className="text-[10px] font-medium transition-colors"
                style={{ color: isActive ? "hsl(var(--accent-primary))" : "hsl(var(--text-muted))" }}
              >
                {route.label}
              </span>
            </Link>
          );
        })}
        
        <button 
          onClick={() => setIsLogoutOpen(true)}
          className="flex flex-col items-center justify-center flex-1 gap-1"
        >
          <LogOut 
            className="h-6 w-6 transition-colors" 
            style={{ color: "hsl(var(--text-muted))" }}
          />
          <span 
            className="text-[10px] font-medium transition-colors"
            style={{ color: "hsl(var(--text-muted))" }}
          >
            Logout
          </span>
        </button>
      </nav>

      <ConfirmDialog 
        isOpen={isLogoutOpen} 
        title="Keluar Aplikasi" 
        description="Kamu yakin mau logout dari Study Buddy OS?" 
        onConfirm={handleLogout} 
        onCancel={() => setIsLogoutOpen(false)} 
        confirmText="Ya, Logout" 
      />
    </>
  );
}

