import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      login(username);
      setLocation("/admin");
    } else {
      setError("Invalid credentials (try admin/admin)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-display font-bold text-2xl text-primary">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <span>Straystat</span>
          </div>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-11 text-base">
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Unauthorized access is prohibited.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
