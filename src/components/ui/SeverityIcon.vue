
<script setup lang="ts">
import type { Severity } from '@/types';
defineProps<{ severity: Severity }>();
</script>

<template>
  <div class="flex items-center justify-center">
    <div 
      class="w-2 h-2 shadow-[0_0_8px_currentcolor]"
      :class="{
        'bg-neon-green text-neon-green': severity === 'success',
        'bg-neon-amber text-neon-amber': severity === 'warning',
        'bg-neon-red text-neon-red': severity === 'error',
        'bg-neon-blue text-neon-blue': severity === 'info',
      }"
    ></div>
  </div>
</template>
