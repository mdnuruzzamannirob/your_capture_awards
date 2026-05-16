import { Eye, Languages, MapPin, Shield, Star, Swords, Trophy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
type Role = "leader" | "moderator" | "member";

interface TeamData {
  name: string;
  description: string;
  avatar: string | null;
  rank: string;
  totalMembers: number;
  maxSlots: number;
  totalWins: number;
  totalMatches: number;
  points: number;
  createdAt: string;
  isPrivate: boolean;
}

// ─── Mock data ────────────────────────────────────────────
const mockTeam: TeamData = {
  name: "Aperture Alliance",
  description:
    "A collective of passionate photographers pushing creative boundaries in every contest. We shoot, we compete, we win.",
  avatar: null,
  rank: "Gold III",
  totalMembers: 8,
  maxSlots: 12,
  totalWins: 7,
  totalMatches: 10,
  points: 1695,
  createdAt: "January 2025",
  isPrivate: false,
};
const winRate = Math.round((mockTeam.totalWins / mockTeam.totalMatches) * 100);
const TeamInfo = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="size-40 shrink-0 rounded-full bg-gray-800"></div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Aperture Alliance</h1>
          <p>
            A collective of passionate photographers pushing creative boundaries in every contest.
            We shoot, we compete, we win.
          </p>
          <div className="flex items-center gap-3">
            <p className="bg-primary/10 text-primary flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
              <Languages size={18} /> English
            </p>
            <p className="bg-primary/10 text-primary flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
              <MapPin size={18} /> Bangladesh
            </p>
            <p className="bg-primary/10 text-primary flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
              <Eye size={18} /> Public
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-muted-foreground mb-2 text-sm">Team Stats</p>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy size={18} />}
            label="Points"
            value={mockTeam.points.toLocaleString()}
          />
          <StatCard icon={<Swords size={18} />} label="Matches" value={mockTeam.totalMatches} />
          <StatCard icon={<Star size={18} />} label="Wins" value={mockTeam.totalWins} />
          <StatCard icon={<Shield size={18} />} label="Win Rate" value={`${winRate}%`} />
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Member Slots</span>
          <span className="text-foreground font-medium">
            {mockTeam.totalMembers} / {mockTeam.maxSlots}
          </span>
        </div>
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div className="bg-primary h-full rounded-full" style={{ width: `${winRate}%` }} />
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-center flex-col gap-2 rounded-lg border p-4 text-center">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default TeamInfo;
