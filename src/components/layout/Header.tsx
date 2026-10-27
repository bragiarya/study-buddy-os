"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { logoutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function Header() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutOpen(false);
    }
  };

  return (
    // Kita gunakan React Fragment (<>) agar bisa mengembalikan 2 elemen terpisah
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-md border-b sticky top-0 z-30">
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-heading font-bold text-lg text-primary">Study Buddy</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium leading-none mb-1">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground leading-none">{user?.totalPoints} Pts | Lvl {user?.currentLevel}</p>
            </div>
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={() => setIsLogoutOpen(true)} className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ConfirmDialog ditaruh DI LUAR tag <header> agar tidak terkena efek kurungan backdrop-blur */}
      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="Keluar Aplikasi"
        description="Kamu yakin mau logout dari Study Buddy OS?"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutOpen(false)}
        confirmText="Ya, Logout"
        isLoading={isLoggingOut}
      />
    </>
  );
}