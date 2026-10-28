export type Language = 'en' | 'hi';

export type AlertKind =
  | 'tree-cover loss'
  | 'mining/excavation'
  | 'fire/smoke'
  | 'encroachment'
  | 'suspected tree-cutting acoustic';

export type AlertCategory = 'Acoustic' | 'Satellite' | 'Camera' | 'Community';

export type CaseStatus =
  | 'Pending review'
  | 'Verified'
  | 'Dismissed'
  | 'Referred for departmental / legal review';

export interface AuditEntry {
  timestamp: string;
  action: string;
  level: 1 | 2 | 3;
  detail: string;
  actor: string;
}

export interface IncidentReport {
  english: string;
  hindi: string;
  generatedAt: string;
}

export interface EscalationCase {
  id: string;
  title: string;
  kind: AlertKind;
  category: AlertCategory;
  latitude: number;
  longitude: number;
  confidence: number;
  deviceId: string;
  level: 1 | 2 | 3;
  status: CaseStatus;
  replyWindowSeconds: number;
  createdAt: string;
  lastEscalatedAt: string;
  deadlineAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  auditTrail: AuditEntry[];
  incidentReport?: IncidentReport;
}

export interface NotificationPayload {
  recipientLevel: 'Level 1 Local Monitoring Team' | 'Level 2 Supervisory Authority' | 'Level 3 Higher Authority';
  recipientContact: string;
  channel: 'SMS' | 'Email' | 'Radio/LoRa' | 'Legal Channel';
  subject: string;
  message: string;
  timestamp: string;
  alertId: string;
  status: 'QUEUED_IN_DEMO_OUTBOX';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
  source: string;
  disclaimer: string;
}

export interface CommunityObservation {
  id: string;
  observationType: string;
  observedAt: string;
  latitude: number;
  longitude: number;
  placeName: string;
  description: string;
  reporterContact?: string;
  savedLocallyAt: string;
}

export interface AcousticAnalysisResult {
  category: 'chainsaw' | 'axe-impact' | 'vehicle' | 'normal forest' | 'machinery' | 'human activity' | 'other';
  confidence: number;
  reasoning: string;
  modelUsed?: string;
  disclaimer: string;
}

export interface VisionAnalysisResult {
  observations: string[];
  possible_tree_cutting: boolean;
  confidence: number;
  uncertainty_notes: string;
  modelUsed?: string;
  disclaimer: string;
}
