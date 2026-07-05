export enum IssueCategory {
  WATER = "Water Supply & Sewage",
  ROADS = "Roads & Infrastructure",
  ELECTRICITY = "Electricity & Power Grid",
  SAFETY = "Public Safety & Law",
  OTHER = "Other / Uncategorized"
}

export enum UrgencyLevel {
  ROUTINE = "Routine",
  MEDIUM = "Medium",
  URGENT = "Urgent",
  CRITICAL = "Critical"
}

export enum ReportStatus {
  SUBMITTED = "Submitted",
  ACKNOWLEDGED = "Acknowledged",
  UNDER_REVIEW = "Under Review",
  RESOLVED = "Resolved"
}

export interface Coordinates { latitude: number; longitude: number; display_name?: string; zone?: string; }

export interface GovernmentDepartment {
  id: string; name: string; abbreviation: string; icon: string; description: string; contactEmail: string;
  stats: { solved: number; pending: number; efficiency: string; };
  glowColor: "green" | "red" | "blue" | "purple" | "yellow";
}

export interface CivicReport {
  id: string; referenceId: string; title: string; description: string; category: IssueCategory; urgency: UrgencyLevel;
  status: ReportStatus; location: Coordinates; department: string; formalLetter: string; followUpLetter?: string; createdAt: string;
  daysActive: number; communityScore: number; needsHumanReview: boolean; reporterName: string; reporterId: string; mediaUrl?: string; voiceUrl?: string; isFollowUpDrafted: boolean;
}

export interface NotificationAlert { id: string; title: string; message: string; time: string; type: "info" | "success" | "warning" | "alert"; glowColor: "green" | "red" | "blue" | "purple" | "yellow"; read: boolean; }
