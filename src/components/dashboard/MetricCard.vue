<template>
  <div class="bg-tech-panel border border-tech-border relative overflow-hidden flex flex-col p-4 h-32 group">
    <div 
      class="absolute top-0 left-0 right-0 h-0.5 transition-all duration-500" 
      :style="{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }"
    ></div>

    <div class="flex items-center gap-2 mb-2">
      <span class="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">
        // {{ title }}
      </span>
    </div>

    <div class="mt-auto flex items-baseline gap-1">
      <span 
        :key="value" 
        class="text-3xl font-black text-white tracking-tighter leading-none animate-value-pop"
      >
        {{ value }}
      </span>
      <span class="text-[10px] font-bold" :style="{ color: color }">
        {{ unit }}
      </span>
    </div>

    <div 
      class="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] font-black italic pointer-events-none select-none group-hover:opacity-[0.05] transition-opacity"
      :style="{ color: color }"
    >
      {{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  unit: string;
  color: string;
}>();
</script>

<style scoped>
@keyframes value-pop {
  0% { transform: translateY(-2px); opacity: 0.7; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-value-pop {
  display: inline-block;
  animation: value-pop 0.2s ease-out;
}
</style>