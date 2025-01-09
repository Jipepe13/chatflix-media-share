import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Report = {
  id: string;
  reported_user_id: string;
  reporter_id: string | null;
  comment: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  reported_user: {
    email: string;
  } | null;
  reporter: {
    email: string;
  } | null;
};

export const Reports = () => {
  const { data: reports, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      console.log("Fetching reports...");
      
      // First, get all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("user_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) {
        console.error("Error fetching reports:", reportsError);
        throw reportsError;
      }

      // Then, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Combine the data
      const transformedData = reportsData.map(report => {
        const reportedUser = profiles.find(p => p.id === report.reported_user_id);
        const reporter = profiles.find(p => p.id === report.reporter_id);

        return {
          ...report,
          reported_user: reportedUser ? { email: reportedUser.email } : null,
          reporter: reporter ? { email: reporter.email } : null
        };
      });

      console.log("Combined reports data:", transformedData);
      return transformedData as Report[];
    },
  });

  const handleResolveReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("user_reports")
        .update({ 
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", reportId);

      if (error) throw error;
      
      toast.success("Signalement résolu avec succès");
      refetch();
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("Erreur lors de la résolution du signalement");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Signalements</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur signalé</TableHead>
            <TableHead>Signalé par</TableHead>
            <TableHead>Commentaire</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports?.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.reported_user?.email || "Utilisateur inconnu"}</TableCell>
              <TableCell>{report.reporter?.email || "Anonyme"}</TableCell>
              <TableCell>{report.comment}</TableCell>
              <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>
                {report.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveReport(report.id)}
                  >
                    Résoudre
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};