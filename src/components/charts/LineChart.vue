<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, markRaw, onUnmounted } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import type { ChartDataPoint } from '@/types';

interface TooltipFormatterCallback {
  value: ChartDataPoint;
  seriesName: string;
  marker: string;
}

type ECOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>;

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{ 
  data: ChartDataPoint[]; 
  color: string;
  title?: string;
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
    grid: { top: 20, right: 15, bottom: 25, left: 45, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#161922',
      borderColor: props.color,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 12 },
      formatter: (params) => {
        if (!Array.isArray(params) || params.length === 0) return '';

        const items = params as unknown as TooltipFormatterCallback[];
        const firstItem = items[0];

        if (!firstItem || !firstItem.value) return '';

        const [timestamp, val] = firstItem.value;
        const time = new Date(timestamp).toLocaleTimeString();
        
        return `<div class="font-mono">
                  <div class="text-gray-500 text-[10px] uppercase mb-1">${time}</div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2" style="background-color: ${props.color}"></span>
                    <span class="text-white font-bold">${val} REQS/S</span>
                  </div>
                </div>`;
      }
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#2d3748' } },
      axisLabel: { color: '#4a5568', fontFamily: 'JetBrains Mono', fontSize: 10 },
      splitLine: { show: true, lineStyle: { color: '#1a1f2e', type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#4a5568', fontFamily: 'JetBrains Mono', fontSize: 10 },
      splitLine: { lineStyle: { color: '#1a1f2e' } }
    },
    series: [{
      type: 'line',
      showSymbol: false,
      data: props.data,
      smooth: false,
      lineStyle: { width: 2, color: props.color, shadowBlur: 10, shadowColor: props.color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${props.color}22` },
          { offset: 1, color: 'transparent' }
        ])
      }
    }]
  };

  chartInstance.setOption(option);
  
  window.addEventListener('resize', handleResize);
});

watch(() => props.data, (newData) => {
  chartInstance?.setOption({
    series: [{ data: newData }]
  });
}, { deep: true });

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>