import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Settings = () => {
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Mot de passe mis à jour avec succès");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold">Paramètres</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">Nouveau mot de passe</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleChangePassword}>
          Changer le mot de passe
        </Button>
      </div>
    </div>
  );
};