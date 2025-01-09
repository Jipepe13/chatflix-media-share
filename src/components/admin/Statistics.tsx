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

type Profile = {
  created_at: string;
};

type UsersByDay = {
  date: string;
  count: number;
}[];

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
  const { data: newUsers } = useQuery<UsersByDay>({
    queryKey: ["newUsers"],
    queryFn: async () => {
      console.log("Fetching profiles for statistics...");
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("created_at");

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Profiles data:", profiles);
      
      const usersByDay = (profiles || []).reduce<UsersByDay>((acc, profile: Profile) => {
        const date = new Date(profile.created_at).toLocaleDateString();
        const existingDay = acc.find(d => d.date === date);
        
        if (existingDay) {
          existingDay.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        
        return acc;
      }, []);

      // Sort by date and limit to last 7 days
      return usersByDay
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7);
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