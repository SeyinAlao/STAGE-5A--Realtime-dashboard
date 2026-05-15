<script setup lang="ts">
import { ref, onMounted, watch, markRaw, onUnmounted } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { BarSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';

type ECOption = echarts.ComposeOption<BarSeriesOption | GridComponentOption | TooltipComponentOption>;

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{ 
  data: { name: string; value: number }[]; 
  color: string 
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  if (!chartRef.value) return;
  chartInstance = markRaw(echarts.init(chartRef.value));

  const option: ECOption = {
    backgroundColor: 'transparent',
    grid: { top: 10, right: 10, bottom: 20, left: 40 },
    xAxis: { 
      type: 'category', 
      data: props.data.map(d => d.name), 
      axisLabel: { color: '#4a5568', fontSize: 9 } 
    },
    yAxis: { 
      type: 'value', 
      splitLine: { lineStyle: { color: '#1a1f2e' } }, 
      axisLabel: { color: '#4a5568', fontSize: 9 } 
    },
    series: [{
      type: 'bar',
      data: props.data.map(d => d.value),
      itemStyle: { 
        color: props.color, 
        opacity: 0.8,
        decal: { 
          symbol: 'rect', 
          dashArrayX: [1, 4], 
          rotation: 45 
        } 
      },
    }]
  };

  chartInstance.setOption(option);
  
  window.addEventListener('resize', handleResize);
});

watch(() => props.data, (newData) => {
  chartInstance?.setOption({
    xAxis: { data: newData.map(d => d.name) },
    series: [{ data: newData.map(d => d.value) }]
  });
}, { deep: true });

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>