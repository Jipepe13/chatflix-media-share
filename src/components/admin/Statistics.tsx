import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Statistics = () => {
  // Get active connections
  const { data: activeConnections } = useQuery({
    queryKey: ["activeConnections"],
    queryFn: async () => {
      const { count } = await supabase
        .from("connection_logs")
        .select("*", { count: "exact" })
        .is("disconnected_at", null);
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get new users per day (last 7 days)
  const { data: newUsers } = useQuery({
    queryKey: ["newUsers"],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const { data: { users } } = await supabase.auth.admin.listUsers();
      
      const usersByDay = users?.reduce((acc: any[], user) => {
        const date = new Date(user.created_at).toLocaleDateString();
        const existingDay = acc.find(d => d.date === date);
        
        if (existingDay) {
          existingDay.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        
        return acc;
      }, []) || [];

      return usersByDay;
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Connexions actives</CardTitle>
          <CardDescription>Nombre d'utilisateurs actuellement connectés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{activeConnections}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nouveaux utilisateurs</CardTitle>
          <CardDescription>Sur les 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={300} data={newUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};