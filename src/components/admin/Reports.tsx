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
import { toast } from "sonner";

type Report = {
  id: string;
  reported_user_id: string;
  reporter_id: string | null;
  comment: string;
  status: string | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  reported_user: { email: string } | null;
  reporter: { email: string } | null;
};

export const Reports = () => {
  const { data: reports, refetch } = useQuery<Report[]>({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_reports")
        .select(`
          *,
          reported_user:reported_user_id(
            email
          ),
          reporter:reporter_id(
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });

  const handleResolveReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("user_reports")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      if (error) throw error;
      
      toast.success("Signalement résolu");
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
              <TableCell>{report.reported_user?.email}</TableCell>
              <TableCell>{report.reporter?.email}</TableCell>
              <TableCell>{report.comment}</TableCell>
              <TableCell>
                {new Date(report.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell>
                {report.status === "pending" && (
                  <Button
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