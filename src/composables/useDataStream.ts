import { useDashboardStore } from '@/stores/dashboardStore';
import type { ChartDataPoint, ActivityLog, Severity } from '@/types';

export function useDataStream() {
  const store = useDashboardStore();
  let intervalId: number | null = null;
  let reconnectTimeoutId: number | null = null;

  const validatePayload = (point: ChartDataPoint): boolean => {
    return Array.isArray(point) && typeof point[0] === 'number' && typeof point[1] === 'number';
  };

  const generateMockData = () => {
    if (Math.random() < 0.03 && store.status === 'online') {
      handleConnectionFailure();
      return;
    }

    if (store.status !== 'online') return;

    const timestamp = Date.now();
    const value = Math.floor(Math.random() * 100);
    const newPoint: ChartDataPoint = [timestamp, value];

    if (validatePayload(newPoint)) {
      store.addMetricPoint(newPoint);
    }

    if (Math.random() > 0.95) {
      const severities: Severity[] = ['info', 'success', 'warning'];
      store.addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        message: `Inbound packet processed from node_${Math.floor(Math.random() * 10)}`,
        severity: severities[Math.floor(Math.random() * severities.length)] ?? 'info',
        category: 'NETWORK'
      });
    }
  };

  const handleConnectionFailure = () => {
    store.setStatus('offline');
    stopStream();
    
    console.warn("Connection lost. Retrying in 3s...");
    reconnectTimeoutId = window.setTimeout(() => {
      store.setStatus('reconnecting');
      
      reconnectTimeoutId = window.setTimeout(() => {
        store.setStatus('online');
        startStream();
        store.addLog({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          message: "SYSTEM: Connection re-established. Buffers cleared.",
          severity: 'success',
          category: 'SYSTEM'
        });
      }, 2000);
    }, 3000);
  };

  const startStream = () => {
    if (intervalId) return;
    intervalId = window.setInterval(generateMockData, 1000);
  };

  const stopStream = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
    }
  };

  return { startStream, stopStream };
}