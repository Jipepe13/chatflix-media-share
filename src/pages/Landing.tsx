import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ChatFlix Media Share
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Partagez et discutez gratuitement avec votre communauté
          </p>
          <Link to="/auth">
            <Button size="lg" className="animate-pulse hover:animate-none">
              Commencer Gratuitement
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <Card className="mb-16 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Avertissement</CardTitle>
            <CardDescription className="text-red-500">
              Cette plateforme peut contenir du contenu explicite ne convenant pas aux mineurs.
              En continuant, vous confirmez avoir l'âge légal requis dans votre pays.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Chat en Temps Réel</CardTitle>
              <CardDescription>
                Communiquez instantanément avec vos amis et votre communauté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2960&auto=format&fit=crop"
                alt="Chat Feature"
                className="rounded-lg w-full h-48 object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Partage de Médias</CardTitle>
              <CardDescription>
                Partagez facilement vos photos et vidéos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Media Sharing"
                className="rounded-lg w-full h-48 object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>100% Gratuit</CardTitle>
              <CardDescription>
                Toutes les fonctionnalités sont gratuites, sans frais cachés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"
                alt="Free Features"
                className="rounded-lg w-full h-48 object-cover"
              />
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Fonctionnalités Principales</h2>
          <ul className="text-left space-y-4">
            <li className="flex items-center">
              <span className="mr-2">✨</span>
              Messagerie instantanée avec support des emojis
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎥</span>
              Partage de photos et vidéos en haute qualité
            </li>
            <li className="flex items-center">
              <span className="mr-2">👥</span>
              Création de groupes et de canaux de discussion
            </li>
            <li className="flex items-center">
              <span className="mr-2">🔒</span>
              Sécurité et confidentialité garanties
            </li>
            <li className="flex items-center">
              <span className="mr-2">💯</span>
              Toutes les fonctionnalités sont et resteront gratuites
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="animate-bounce hover:animate-none">
              Rejoindre la Communauté
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
