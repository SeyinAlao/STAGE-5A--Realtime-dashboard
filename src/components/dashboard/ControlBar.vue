<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboardStore';
import type { DashboardState } from '@/types';

const store = useDashboardStore();
const ranges: DashboardState['timeRange'][] = ['1m', '5m', '1h'];
</script>

<template>
  <div class="flex items-center justify-between bg-tech-panel border border-tech-border p-2 font-mono">
    <div class="flex items-center gap-1">
      <span class="text-[9px] text-gray-600 font-bold mr-2 uppercase tracking-tighter">Range Selection:</span>
      <button 
        v-for="range in ranges" 
        :key="range"
        @click="store.setTimeRange(range)"
        class="text-[10px] px-3 py-1 border transition-all duration-200 uppercase"
        :class="[
          store.timeRange === range 
            ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
            : 'border-tech-border text-gray-500 hover:border-gray-500 hover:text-gray-300'
        ]"
      >
        {{ range }}
      </button>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden md:flex items-center gap-2 px-3 border-x border-tech-border/50 h-6">
        <span class="text-[9px] text-gray-600 uppercase">Buffer:</span>
        <span class="text-[10px] text-white">{{ store.metricsHistory.length }}/60</span>
      </div>

      <button 
        @click="store.toggleLive"
        class="flex items-center gap-2 px-4 py-1 border transition-all duration-300 group"
        :class="[
          store.isLive 
            ? 'border-neon-green/50 text-neon-green hover:bg-neon-green/10' 
            : 'border-neon-amber/50 text-neon-amber hover:bg-neon-amber/10 animate-pulse'
        ]"
      >
        <span 
          class="w-1.5 h-1.5 shadow-[0_0_5px_currentcolor]"
          :class="store.isLive ? 'bg-neon-green' : 'bg-neon-amber'"
        ></span>
        
        <span class="text-[10px] font-bold uppercase tracking-widest">
          {{ store.isLive ? 'Live Feed' : 'Paused' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  min-width: 45px;
  text-align: center;
}
</style>