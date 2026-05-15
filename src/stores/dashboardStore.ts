import { defineStore } from 'pinia';
import type { ChartDataPoint, ActivityLog, DashboardState, SystemStatus } from '@/types';

// Map time ranges to max array lengths (1 tick = 1 second)
const RANGE_LIMITS = {
  '1m': 60,
  '5m': 300,
  '1h': 3600
};

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    isLive: true,
    status: 'online',
    timeRange: '1m',
    metricsHistory: [],
    logs: [],
  }),

  actions: {
    generateSeedData() {
    const now = Date.now();
    const points: ChartDataPoint[] = [];
    for (let i = 20; i > 0; i--) {
      points.push([now - (i * 1000), Math.floor(Math.random() * 100)]);
    }
    this.metricsHistory = points;
  },
    toggleLive() {
      this.isLive = !this.isLive;
    },

    setTimeRange(range: '1m' | '5m' | '1h') {
      this.timeRange = range;
      // Truncate array immediately if switching to a smaller range
      const limit = RANGE_LIMITS[range];
      if (this.metricsHistory.length > limit) {
        this.metricsHistory = this.metricsHistory.slice(-limit);
      }
    },

    setStatus(newStatus: SystemStatus) {
      this.status = newStatus;
      
      if (newStatus === 'offline') {
        this.addLog({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          message: "CRITICAL: Data stream connection lost. Attempting failover...",
          severity: 'error',
          category: 'SYSTEM'
        });
      }
    },

    addMetricPoint(point: ChartDataPoint) {
      if (!this.isLive || this.status === 'offline') return;

      this.metricsHistory.push(point);
      
      const limit = RANGE_LIMITS[this.timeRange];
      if (this.metricsHistory.length > limit) {
        this.metricsHistory.shift();
      }
    },

    addLog(log: ActivityLog) {
      this.logs.unshift(log);
      
      if (this.logs.length > 25) {
        this.logs.pop();
      }
    }
  }
});