import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types/admin";

interface UserTableRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: string) => void;
  onBanUser: (userId: string) => void;
}

export const UserTableRow = ({ user, onRoleChange, onBanUser }: UserTableRowProps) => (
  <TableRow>
    <TableCell>{user.email}</TableCell>
    <TableCell>
      <Select
        value={user.role}
        onValueChange={(newRole) => onRoleChange(user.id, newRole)}
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
        onClick={() => onBanUser(user.id)}
      >
        Bannir
      </Button>
    </TableCell>
  </TableRow>
);