export interface SiteStats {
  online: number;
  playingNow: number;
}

export interface SiteStatsResponse {
  success: boolean;
  message: string;
  data: SiteStats;
}
