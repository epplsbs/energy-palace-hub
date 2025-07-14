import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import Contacts from "./pages/Contacts";
import POS from "./pages/POS";
import AboutPage from "./pages/About"; // Corrected import for the About page
import Media from "./pages/Media"; // Import the new Media page
import NotFound from "./pages/NotFound";
import POSLayout from "./pages/pos/POSLayout"; // Import new POS Layout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/about" element={<AboutPage />} />{" "}
            {/* Corrected element for About page */}
            <Route path="/media" element={<Media />} />{" "}
            {/* Added route for Media page */}
            <Route path="/sales/*" element={<POSLayout />} />{" "}
            {/* Added POS route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
