import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("User123");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Avatar mis à jour !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Simulation de sauvegarde (à remplacer par Supabase)
    toast.success("Profil mis à jour avec succès !");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-panel animate-in">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar || undefined} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-input"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("avatar-input")?.click()}
                >
                  Changer l'avatar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-2"
                >
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSaveProfile} className="flex-1">
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/chat")}
                  className="flex-1"
                >
                  Aller au Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;