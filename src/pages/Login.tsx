import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Anchor, Eye, EyeOff } from "lucide-react";

// Static credentials for UI demo — replace with real auth later
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[400px] shadow-lg border-border/60">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Anchor className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Twenty4X Maritime
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to Command Center
            </p>
          </div>

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
                  className="pr-10"
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

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Demo: admin / admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
