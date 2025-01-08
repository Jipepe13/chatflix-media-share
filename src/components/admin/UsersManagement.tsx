import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserWithRole = {
  id: string;
  email: string | null;
  role: string;
  last_sign_in_at: string | null;
}

type UserRoleJoinResult = {
  user_id: string;
  role: string;
  profiles: {
    email: string | null;
    last_sign_in_at: string | null;
  } | null;
}

export const UsersManagement = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: users, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      console.log("Fetching users and roles...");
      
      const { data: usersWithRoles, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          profiles!user_roles_user_id_fkey (
            email,
            last_sign_in_at
          )
        `);

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return (usersWithRoles as UserRoleJoinResult[]).map(user => ({
        id: user.user_id,
        email: user.profiles?.email,
        role: user.role,
        last_sign_in_at: user.profiles?.last_sign_in_at
      }));
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
      endDate.setDate(endDate.getDate() + 1); // 24h ban by default

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <Select 
          value={selectedRole || "all"} 
          onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Modérateur</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.filter(user => !selectedRole || user.role === selectedRole)
            .map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Jamais'}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBanUser(user.id)}
                >
                  Bannir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};