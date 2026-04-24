import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/Login";
import CommandCenter from "@/pages/CommandCenter";

const queryClient = new QueryClient();

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("t4x_auth");
    if (stored) setAuthenticated(true);
  }, []);

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem("t4x_auth");
    setAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {authenticated ? (
            <CommandCenter onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
