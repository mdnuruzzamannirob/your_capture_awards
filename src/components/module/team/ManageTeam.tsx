import { Button } from "@/components/ui/button";
import { TeamData } from "@/types/team";
import { Crown, Lock, Settings, Trash2, Unlock } from "lucide-react";

interface ManageTeamProps {
  team: TeamData;
  onSettings: () => void;
  onTransfer: () => void;
  onTogglePrivacy: () => void;
  onDisband: () => void;
}

function ManageTeam({ team, onSettings, onTransfer, onTogglePrivacy, onDisband }: ManageTeamProps) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <p className="text-muted-foreground mb-4 text-[11px] font-semibold tracking-wider uppercase">
        Manage Team
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onSettings}>
          <Settings size={13} className="mr-1.5" /> Team settings
        </Button>

        <Button variant="outline" size="sm" onClick={onTransfer}>
          <Crown size={13} className="mr-1.5" /> Transfer leadership
        </Button>

        <Button variant="outline" size="sm" onClick={onTogglePrivacy}>
          {team.accessibility === 'PUBLIC' ? (
            <>
              <Lock size={13} className="mr-1.5" /> Make private
            </>
          ) : (
            <>
              <Unlock size={13} className="mr-1.5" /> Make public
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
          onClick={onDisband}
        >
          <Trash2 size={13} className="mr-1.5" /> Disband team
        </Button>
      </div>
    </div>
  );
}

export default ManageTeam;
