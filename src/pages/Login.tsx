import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import t4xLogo from "@/assets/t4x_logo.png";
import marineBanner from "@/assets/login-marine-bg.jpg";

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
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="w-full md:w-[360px] flex flex-col justify-between px-8 py-10 bg-card border-r border-border">
        <div className="flex flex-col items-center">
          {/* Adani Logo */}
          <img
            src={adaniLogo}
            alt="Adani"
            className="h-16 w-auto object-contain mb-6"
            style={{ mixBlendMode: "multiply" }}
          />

          {/* Welcome Text */}
          <p className="text-sm font-medium text-info mb-0.5">Welcome Back</p>
          <p className="text-sm font-bold text-warning mb-8">Un-Lock-Your-Time</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
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
                className="h-11 bg-muted/50 border-border"
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
                  className="h-11 pr-10 bg-muted/50 border-border"
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

            <a href="#" className="text-xs text-info hover:underline inline-block">
              I agree to the Terms & Conditions
            </a>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold tracking-wide bg-gradient-to-r from-[hsl(280,60%,50%)] to-[hsl(200,80%,55%)] hover:from-[hsl(280,60%,45%)] hover:to-[hsl(200,80%,50%)] text-[hsl(0,0%,100%)] shadow-md"
              disabled={loading}
            >
              {loading ? "Signing in…" : "LOGIN"}
            </Button>
          </form>

          {/* T4X Logo */}
          <img
            src={t4xLogo}
            alt="Twenty4X Digital Fleet Management"
            className="h-20 w-auto object-contain mt-8"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[10px] text-warning leading-relaxed">
            Login access allowed under license to<br />Twenty4x Solutions FZCO
          </p>
        </div>
      </div>

      {/* Right Panel - Marine Fleet Banner */}
      <div className="hidden md:block flex-1">
        <img
          src={marineBanner}
          alt="Marine fleet at sea"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
