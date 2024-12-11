import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReportTable } from "./ReportTable";

type Report = {
  id: string;
  reported_user_id: string;
  reporter_id: string | null;
  comment: string;
  status: string | null;
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

type SupabaseUser = {
  email: string;
}

export const Reports = () => {
  const { data: reports, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      console.log("Fetching reports...");
      const { data, error } = await supabase
        .from("user_reports")
        .select(`
          *,
          reported_user:reported_user_id(email),
          reporter:reporter_id(email)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }

      console.log("Reports data:", data);
      
      const transformedData = data?.map(report => ({
        ...report,
        reported_user: report.reported_user ? { email: (report.reported_user as unknown as SupabaseUser).email } : null,
        reporter: report.reporter ? { email: (report.reporter as unknown as SupabaseUser).email } : null
      })) || [];

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
      <ReportTable reports={reports || []} onResolve={handleResolveReport} />
    </div>
  );
};