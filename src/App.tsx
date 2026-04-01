import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import CrewManagement from "@/pages/CrewManagement";
import EmissionsTracker from "@/pages/EmissionsTracker";
import IotDashboard from "@/pages/IotDashboard";
import SuperAdmin from "@/pages/SuperAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payroll/*" element={<CrewManagement />} />
          <Route path="/emissions" element={<EmissionsTracker />} />
          <Route path="/iot" element={<IotDashboard />} />
          <Route path="/super-admin/*" element={<SuperAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
