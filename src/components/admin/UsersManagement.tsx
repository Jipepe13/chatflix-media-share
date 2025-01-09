import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleFilter } from "./RoleFilter";
import { UserTableRow } from "./UserTableRow";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import { RoleOption } from "@/types/admin";

export const UsersManagement = () => {
  const {
    users,
    selectedRole,
    setSelectedRole,
    handleRoleChange,
    handleBanUser,
  } = useUsersManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <RoleFilter
          value={selectedRole}
          onChange={(value) => setSelectedRole(value as RoleOption)}
        />
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
          {users
            ?.filter(user => selectedRole === 'all' || user.role === selectedRole)
            .map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onRoleChange={handleRoleChange}
                onBanUser={handleBanUser}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};