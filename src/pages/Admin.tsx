import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { Statistics } from "@/components/admin/Statistics";
import { Reports } from "@/components/admin/Reports";
import { Settings } from "@/components/admin/Settings";

const Admin = () => {
  const navigate = useNavigate();

  // Check if user is admin
  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      return role?.role;
    },
  });

  useEffect(() => {
    if (!isLoading && userRole !== "admin") {
      navigate("/");
    }
  }, [userRole, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration</h1>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="reports">Signalements</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Reports />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <Statistics />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;