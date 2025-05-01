
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { TemplateUploadModal } from "./TemplateUploadModal";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center cursor-pointer hover-scale transition-transform" 
              onClick={() => navigate("/dashboard")}
              role="button"
            >
              <img src="/placeholder.svg" alt="MBSI Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">MBSI</span>
            </div>
          </div>

          <div className="flex items-center gap-2">            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              className="hover-scale text-muted-foreground hover:text-destructive"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto">{children}</main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MBSI. All rights reserved.
        </div>
      </footer>
      
      <TemplateUploadModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}