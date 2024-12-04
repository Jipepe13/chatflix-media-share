import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types/chat";
import { useNavigate } from "react-router-dom";

interface UserProfileCardProps {
  user: User;
  children: React.ReactNode;
}

export const UserProfileCard = ({ user, children }: UserProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{user.username}</h4>
            <p className="text-sm text-muted-foreground">
              {user.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            Voir le profil
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};