
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { LogOut, IndianRupee, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  user: User;
  title?: string;
}

export function Header({ user, title = "Cricket Expense Ledger" }: HeaderProps) {
  const { logout } = useAuth();
  
  return (
    <header className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] px-4 py-3 shadow-lg relative overflow-hidden">
      {/* Header background image with slide-up animation */}
      <div className="absolute inset-0 opacity-10 z-0 header-slide-up">
        <img 
          src="/lovable-uploads/313780a5-9010-4171-b7c3-8089e87e9f08.png" 
          alt="Cricket Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white shadow-md transform hover:scale-110 transition-all duration-300">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white drop-shadow-sm">{title}</h1>
            <p className="text-xs text-white/80">Manage your team's finances</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src={user.photoUrl || ""} alt={user.username} />
            <AvatarFallback className="bg-blue-700 text-white">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "text-sm text-white hidden sm:inline-block",
            user.isAdmin ? "font-medium" : ""
          )}>
            {user.username}
          </span>
          <span className={cn(
            "cricket-badge shadow-md",
            user.isAdmin 
              ? "bg-white text-[#1A2980] font-semibold hover:bg-white/90 transition-colors" 
              : "bg-white/20 text-white hover:bg-white/30 transition-colors"
          )}>
            {user.isAdmin ? "Admin" : "Member"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={logout}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
