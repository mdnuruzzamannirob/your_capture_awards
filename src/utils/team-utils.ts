import { Role, TeamMemberUser } from "@/types/team"

export function getInitials(
  fullName: string | null,
  firstName?: string,
  lastName?: string,
): string {
  const name = fullName || `${firstName ?? ""} ${lastName ?? ""}`.trim()
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
}

export function getMemberName(m: TeamMemberUser): string {
  return m.fullName || `${m.firstName} ${m.lastName}`.trim()
}

export function getRoleChipClass(role: Role): string {
  return {
    LEADER:    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    MODERATOR: "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-300",
    MEMBER:    "bg-muted text-muted-foreground",
  }[role]
}

export function getAvatarClass(role: Role): string {
  return {
    LEADER:    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    MODERATOR: "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-300",
    MEMBER:    "",
  }[role]
}
