
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, IndianRupee } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const backgroundImages = [
    "/lovable-uploads/8614bb7d-d79e-4cf5-9b25-fab7591bfdd7.png",
    "/lovable-uploads/313780a5-9010-4171-b7c3-8089e87e9f08.png",
    "/lovable-uploads/53e167b5-ed6f-4499-9ed1-181e1f4b5f66.png"
  ];

  useEffect(() => {
    // Fade effect between background images
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);
    
    setIsLoaded(true);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    const success = login(username, password);
    if (!success) {
      toast.error("Invalid credentials. Try admin/cricket123 for admin access.");
    } else {
      toast.success("Login successful!");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center login-background relative overflow-hidden">
      {/* Background image with fade transition */}
      {backgroundImages.map((img, index) => (
        <div 
          key={index}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0"
          style={{ 
            opacity: index === imageIndex ? 1 : 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      ))}
      
      {/* Login card */}
      <div className={`z-10 w-full max-w-md p-6 md:p-8 mx-4 ${isLoaded ? 'fade-in' : 'opacity-0'}`} style={{ transitionDelay: "0.3s" }}>
        <div className="login-card w-full p-8 md:p-10 space-y-6 md:space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6 slide-up" style={{ transitionDelay: "0.5s" }}>
              <div className="h-20 md:h-24 w-20 md:w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-[#9b87f5] to-[#0FA0CE] text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                <h1 className="text-2xl font-bold text-white">AW</h1>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 slide-up" style={{ transitionDelay: "0.6s" }}>Amazing Warrior</h1>
            <p className="mt-1 md:mt-2 text-base md:text-lg text-white slide-up" style={{ transitionDelay: "0.7s" }}>Cricket Expense Ledger</p>
          </div>
          
          <form className="space-y-5 md:space-y-6 slide-up" onSubmit={handleSubmit} style={{ transitionDelay: "0.8s" }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white font-medium text-sm md:text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-white/20 border-purple-300/30 focus:border-[#9b87f5] focus:ring-[#9b87f5]/20 text-white mt-2"
                  required
                />
                <p className="text-xs text-white mt-1">
                  Try "admin" for admin access
                </p>
              </div>
              <div>
                <Label htmlFor="password" className="text-white font-medium text-sm md:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-white/20 border-purple-300/30 focus:border-[#9b87f5] focus:ring-[#9b87f5]/20 text-white mt-2"
                  required
                />
                <p className="text-xs text-white mt-1">
                  Try "cricket123" for admin access
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#9b87f5] to-[#0FA0CE] hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 py-2 mt-6"
            >
              Sign in
            </Button>
            
            <div className="text-center text-xs md:text-sm text-white mt-4">
              <p className="font-medium">Admin can record deposits and expenses</p>
              <p>Regular users can only view information</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
