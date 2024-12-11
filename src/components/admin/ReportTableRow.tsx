import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Report = {
  id: string;
  reported_user: { email: string } | null;
  reporter: { email: string } | null;
  comment: string;
  status: string | null;
  created_at: string;
};

type ReportTableRowProps = {
  report: Report;
  onResolve: (reportId: string) => void;
};

export const ReportTableRow = ({ report, onResolve }: ReportTableRowProps) => {
  return (
    <TableRow>
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
            onClick={() => onResolve(report.id)}
          >
            Résoudre
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};