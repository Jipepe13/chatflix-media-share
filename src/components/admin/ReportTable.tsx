import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportTableRow } from "./ReportTableRow";

type Report = {
  id: string;
  reported_user: { email: string } | null;
  reporter: { email: string } | null;
  comment: string;
  status: string | null;
  created_at: string;
};

type ReportTableProps = {
  reports: Report[];
  onResolve: (reportId: string) => void;
};

export const ReportTable = ({ reports, onResolve }: ReportTableProps) => {
  return (
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
          <ReportTableRow 
            key={report.id} 
            report={report} 
            onResolve={onResolve}
          />
        ))}
      </TableBody>
    </Table>
  );
};