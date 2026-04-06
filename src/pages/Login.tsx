import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import adaniLogo from "@/assets/adani_logo.png";
import t4xLogo from "@/assets/t4x_logo.png";
import adaniBanner from "@/assets/adani_banner.jpeg";

const STATIC_USERS = [
  { username: "admin", password: "admin123" },
  { username: "captain", password: "captain123" },
  { username: "viewer", password: "viewer123" },
];

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const match = STATIC_USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (match) {
        localStorage.setItem("t4x_auth", JSON.stringify({ username: match.username }));
        onLogin();
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-[hsl(210,30%,92%)]">
      {/* Left Panel - Login Form */}
      <div className="w-full max-w-[340px] flex flex-col justify-between px-8 py-8 bg-[hsl(210,30%,95%)]">
        <div>
          {/* Adani Logo */}
          <div className="flex justify-center mb-6">
            <img src={adaniLogo} alt="Adani" className="h-14 w-auto" />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-info">Welcome Back</p>
            <p className="text-sm font-semibold text-warning mt-1">Un-Lock-Your-Time</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="bg-[hsl(0,0%,95%)] border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pr-10 bg-[hsl(0,0%,95%)] border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <a href="#" className="text-xs text-info hover:underline block">
              I agree to the Terms & Conditions
            </a>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[hsl(280,60%,50%)] to-[hsl(200,80%,50%)] hover:from-[hsl(280,60%,45%)] hover:to-[hsl(200,80%,45%)] text-[hsl(0,0%,100%)]"
              disabled={loading}
            >
              {loading ? "Signing in…" : "LOGIN"}
            </Button>
          </form>

          {/* T4X Logo */}
          <div className="flex justify-center mt-6">
            <img src={t4xLogo} alt="Twenty4X" className="h-16 w-auto" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-warning">
            Login access allowed under license to<br />Twenty4x Solutions FZCO
          </p>
          <p className="text-[9px] text-muted-foreground mt-2">
            Demo: admin / admin123
          </p>
        </div>
      </div>

      {/* Right Panel - Banner Image */}
      <div className="hidden md:flex flex-1 relative">
        <img
          src={adaniBanner}
          alt="Adani Growth with Goodness"
          className="w-full h-full object-cover"
        />
        {/* Overlay with Adani branding */}
        <div className="absolute top-8 right-8 flex items-center gap-3">
          <img src={adaniLogo} alt="Adani" className="h-10 w-auto" />
          <div className="h-10 w-px bg-[hsl(0,0%,60%)]" />
          <div className="text-[hsl(215,20%,40%)]">
            <span className="text-lg font-light leading-tight block">Growth</span>
            <span className="text-sm font-light leading-tight">with <span className="font-medium">Goodness</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
