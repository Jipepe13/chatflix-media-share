import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Camera } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";

const Auth = () => {
  const authForm = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <div className="flex justify-center space-x-2 mb-4">
            <MessageCircle className="w-8 h-8 text-primary animate-bounce" />
            <Camera className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">PhotoChat</h1>
          <p className="text-muted-foreground">
            Bienvenue sur PhotoChat ! Partagez vos moments préférés et chattez en direct.
          </p>
        </div>

        <Card className="w-full animate-scale-in shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {authForm.isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center">
              {authForm.isLogin
                ? "Heureux de vous revoir ! Connectez-vous à votre compte"
                : "Rejoignez notre communauté en créant votre compte"}
            </CardDescription>
          </CardHeader>
          <AuthForm {...authForm} />
        </Card>
      </div>
    </div>
  );
};

export default Auth;