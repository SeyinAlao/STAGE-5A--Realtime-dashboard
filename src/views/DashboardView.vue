<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useDataStream } from '@/composables/useDataStream';

import MetricCard from '@/components/dashboard/MetricCard.vue';
import ControlBar from '@/components/dashboard/ControlBar.vue';
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue';

import LineChart from '@/components/charts/LineChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import AreaChart from '@/components/charts/AreaChart.vue';

const store = useDashboardStore();
const { startStream } = useDataStream();

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    event.preventDefault();
    store.toggleLive();
    store.addLog({
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      message: `USER_ACTION: Feed ${store.isLive ? 'RESUMED' : 'PAUSED'} via Spacebar`,
      severity: 'info',
      category: 'SYSTEM'
    });
  }
  if (event.key.toLowerCase() === 'c') {
    store.logs = [];
  }
};

onMounted(() => {
  store.generateSeedData();
  startStream();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

const endpointData = computed(() => {
  if (store.metricsHistory.length || true) {
    return [
      { name: '/API/V1', value: Math.floor(Math.random() * 50) + 10 },
      { name: '/AUTH', value: Math.floor(Math.random() * 30) + 5 },
      { name: '/SOCKET', value: Math.floor(Math.random() * 80) + 20 },
      { name: '/DATA', value: Math.floor(Math.random() * 40) + 15 }
    ];
  }
  return [];
});
</script>

<template>
  <main class="h-screen w-full bg-[#0a0b10] flex flex-col overflow-hidden font-mono text-gray-400">

    <header
      class="h-12 border-b border-tech-border flex items-center px-6 justify-between bg-tech-bg/80 backdrop-blur-md">
      <div class="flex items-center gap-4">
        <span class="text-neon-blue font-black tracking-tighter text-xl">TERMINAL.v5</span>
        <div class="h-4 w-px bg-tech-border"></div>
        <span class="text-[10px] text-gray-600 uppercase tracking-[0.2em]">Core Analytics Engine</span>
      </div>
      <div class="text-[10px] text-gray-500 uppercase">
        {{ new Date().toLocaleDateString() }} // SESSION_ACTIVE
      </div>
    </header>

    <div class="flex flex-col xl:flex-row flex-1 overflow-hidden p-4 gap-4">
      <section class="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Traffic.Load" :value="store.metricsHistory.length" color="#00f2ff" unit="REQ/S" />
          <MetricCard title="System.Latency" value="24.8" color="#bc00ff" unit="MS" />
          <MetricCard title="Node.Health" value="99.2" color="#39ff14" unit="%" />
          <MetricCard title="Security.Threats" value="0" color="#ff0055" unit="ACT" />
        </div>

        <ControlBar />

        <div class="h-[400px] bg-tech-panel border border-tech-border p-5 relative overflow-hidden group">
          <div class="absolute top-3 left-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest z-10">
            // Global_Network_Traffic_Realtime
          </div>

          <div v-if="store.status !== 'online'"
            class="absolute inset-0 z-20 bg-tech-bg/60 backdrop-blur-sm flex items-center justify-center border border-neon-red/20">
            <div class="text-center">
              <div class="text-neon-red text-xs font-black animate-pulse mb-1">!! CONNECTION_INTERRUPTED !!</div>
              <div class="text-[8px] text-gray-500 uppercase tracking-widest">Attempting reconnect...</div>
            </div>
          </div>

          <LineChart :data="store.metricsHistory" color="#00f2ff" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-80 mb-4">
          <div class="bg-tech-panel border border-tech-border p-4 flex flex-col">
            <h3 class="text-[10px] font-bold text-gray-600 uppercase mb-4 tracking-widest">// Endpoint_Volume</h3>
            <div class="flex-1">
              <BarChart :data="endpointData" color="#bc00ff" />
            </div>
          </div>
          <div class="bg-tech-panel border border-tech-border p-4 flex flex-col">
            <h3 class="text-[10px] font-bold text-gray-600 uppercase mb-4 tracking-widest">// Memory_Step_Index</h3>
            <div class="flex-1">
              <AreaChart :data="store.metricsHistory" color="#39ff14" />
            </div>
          </div>
        </div>
      </section>

      <aside class="w-full xl:w-80 h-64 xl:h-auto flex flex-col shrink-0">
        <ActivityFeed />
      </aside>
    </div>
    <div
      class="fixed bottom-4 left-4 flex gap-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest bg-black/40 backdrop-blur-md p-2 border border-tech-border pointer-events-none z-50">
      <div><span class="text-neon-blue">[SPACE]</span> Pause/Resume</div>
      <div><span class="text-neon-blue">[C]</span> Clear Logs</div>
    </div>
  </main>
</template>