import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JoinRequest } from "@/types/team";
import { getInitials } from "@/utils/team-utils";
import { Check, X } from "lucide-react";

interface JoinRequestsProps {
  requests: JoinRequest[];
  onAccept: (req: JoinRequest) => void;
  onDecline: (req: JoinRequest) => void;
}

function JoinRequests({ requests, onAccept, onDecline }: JoinRequestsProps) {
  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Join Requests
        </p>
        <Badge variant="destructive" className="text-[11px]">
          {requests.length} pending
        </Badge>
      </div>

      <div className="divide-y">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center gap-3 px-5 py-3">
            <Avatar className="size-9 shrink-0">
              {req.member.avatar && <AvatarImage src={req.member.avatar} />}
              <AvatarFallback className="bg-amber-100 text-[11px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {getInitials(req.member.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{req.member.fullName}</p>
              <p className="text-muted-foreground text-xs">Requested {req.requestedAt}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 h-7 text-xs"
                onClick={() => onDecline(req)}
              >
                <X size={11} className="mr-1" /> Decline
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={() => onAccept(req)}>
                <Check size={11} className="mr-1" /> Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JoinRequests;
