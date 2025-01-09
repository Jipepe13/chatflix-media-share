import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, RoleOption } from "@/types/admin";
import { toast } from "sonner";

export const useUsersManagement = () => {
  const [selectedRole, setSelectedRole] = useState<RoleOption>('all');

  const { data: users, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      console.log("Fetching users and roles...");
      
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        throw rolesError;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, last_sign_in_at");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const combinedData = userRoles.map(userRole => {
        const profile = profiles.find(p => p.id === userRole.user_id);
        return {
          id: userRole.user_id,
          email: profile?.email,
          role: userRole.role,
          last_sign_in_at: profile?.last_sign_in_at
        };
      });

      console.log("Combined user data:", combinedData);
      return combinedData;
    },
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: newRole });

      if (error) throw error;
      
      toast.success("Rôle mis à jour avec succès");
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      const { error } = await supabase
        .from("user_bans")
        .insert({
          user_id: userId,
          end_date: endDate.toISOString(),
        });

      if (error) throw error;
      
      toast.success("Utilisateur banni avec succès");
      refetch();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Erreur lors du bannissement de l'utilisateur");
    }
  };

  return {
    users,
    selectedRole,
    setSelectedRole,
    handleRoleChange,
    handleBanUser,
  };
};