<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';
import SeverityIcon from '@/components/ui/SeverityIcon.vue';

const store = useDashboardStore();

const activeFilter = ref<'all' | 'error' | 'success'>('all');

const filteredLogs = computed(() => {
  if (activeFilter.value === 'all') return store.logs;
  return store.logs.filter(log => log.severity === activeFilter.value);
});
</script>

<template>
  <div class="flex flex-col h-full bg-tech-panel border border-tech-border overflow-hidden">
    <div class="p-3 border-b border-tech-border flex justify-between items-center bg-tech-bg/50">
      <span class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
        // LIVE_SYSTEM_LOGS
      </span>
      <span class="text-[10px] font-mono text-neon-blue animate-pulse">
        ● STREAMING
      </span>
    </div>

    <div class="flex gap-2 px-3 py-2 border-b border-tech-border/50 bg-black/20">
      <button @click="activeFilter = 'all'" :class="activeFilter === 'all' ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent'" class="text-[9px] uppercase font-bold border-b-2 px-1 transition-colors">All</button>
      <button @click="activeFilter = 'error'" :class="activeFilter === 'error' ? 'text-neon-red border-neon-red' : 'text-gray-500 border-transparent'" class="text-[9px] uppercase font-bold border-b-2 px-1 transition-colors">Errors</button>
      <button @click="activeFilter = 'success'" :class="activeFilter === 'success' ? 'text-neon-green border-neon-green' : 'text-gray-500 border-transparent'" class="text-[9px] uppercase font-bold border-b-2 px-1 transition-colors">Success</button>
    </div>

    <div class="grid grid-cols-[80px_1fr_40px] px-3 py-2 border-b border-tech-border text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
      <div>Timestamp</div>
      <div>Event Message</div>
      <div class="text-right">Stat</div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px]">
      <TransitionGroup name="list" tag="div">
        <div 
          v-for="log in filteredLogs" 
          :key="log.id"
          class="grid grid-cols-[80px_1fr_40px] px-3 py-2 border-b border-tech-border/30 items-center hover:bg-white/2 transition-colors group"
        >
          <div class="text-gray-500 text-[10px]">[{{ log.timestamp }}]</div>
          <div class="text-gray-300 truncate pr-2 group-hover:text-white">{{ log.message }}</div>
          <div class="flex justify-end"><SeverityIcon :severity="log.severity" /></div>
        </div>
      </TransitionGroup>

      <div v-if="filteredLogs.length === 0" class="p-10 text-center text-[10px] text-gray-600 italic uppercase">
        No logs match filter...
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active { transition: all 0.3s ease-out; }
.list-enter-from { opacity: 0; transform: translateX(-10px); background-color: rgba(0, 242, 255, 0.1); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0f1117; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #2d3748; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00f2ff; }
</style>