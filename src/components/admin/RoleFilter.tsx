import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleOption } from "@/types/admin";

interface RoleFilterProps {
  value: RoleOption;
  onChange: (value: RoleOption) => void;
}

export const RoleFilter = ({ value, onChange }: RoleFilterProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filtrer par rôle" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="moderator">Modérateur</SelectItem>
      <SelectItem value="user">Utilisateur</SelectItem>
    </SelectContent>
  </Select>
);