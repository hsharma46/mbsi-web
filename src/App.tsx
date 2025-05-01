
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PDFsProvider } from "@/contexts/PDFsContext";
import { RouteGuard } from "@/components/RouteGuard";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import PDFViewer from "@/pages/PDFViewer";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PDFsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RouteGuard><Dashboard /></RouteGuard>} />
              <Route path="/dashboard" element={<RouteGuard><Dashboard /></RouteGuard>} />
              <Route path="/pdf-viewer/:id" element={<RouteGuard><PDFViewer /></RouteGuard>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PDFsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
