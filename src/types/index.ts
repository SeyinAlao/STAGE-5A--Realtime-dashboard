export type Severity = 'success' | 'warning' | 'error' | 'info';

export type ChartDataPoint = [number, number]; 

export type SystemStatus = 'online' | 'reconnecting' | 'offline';

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  severity: Severity;
  category: 'NETWORK' | 'AUTH' | 'SYSTEM' | 'SECURITY';
}

export interface DashboardState {
  isLive: boolean;
  status: SystemStatus;
  timeRange: '1m' | '5m' | '1h';
  metricsHistory: ChartDataPoint[]; 
  logs: ActivityLog[];
}