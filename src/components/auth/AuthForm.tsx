import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const AuthForm = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  showPassword,
  setShowPassword,
  handleSubmit,
  setIsLogin,
}: AuthFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nom d'utilisateur
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="JohnDoe"
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john@example.com"
            className="transition-all duration-200 focus:scale-[1.01]"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pr-10 transition-all duration-200 focus:scale-[1.01]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full hover:scale-[1.02] transition-transform">
          {isLogin ? "Se connecter" : "S'inscrire"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full hover:bg-muted/50 transition-colors"
        >
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </Button>
      </CardFooter>
    </form>
  );
};