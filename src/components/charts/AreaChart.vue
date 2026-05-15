<script setup lang="ts">
import { ref, onMounted, watch, markRaw, onUnmounted } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import type { ChartDataPoint } from '@/types';

type ECOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>;

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{ 
  data: ChartDataPoint[]; 
  color: string;
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
    xAxis: { type: 'time', show: false },
    yAxis: { 
      type: 'value', 
      splitLine: { lineStyle: { color: '#1a1f2e' } },
      axisLabel: { color: '#4a5568', fontSize: 9 }
    },
    series: [{
      type: 'line',
      step: 'middle',
      showSymbol: false,
      data: props.data,
      lineStyle: { width: 1, color: props.color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: props.color },
          { offset: 1, color: 'transparent' }
        ]),
        opacity: 0.2
      }
    }]
  };

  chartInstance.setOption(option);
  
  window.addEventListener('resize', handleResize);
});

watch(() => props.data, (newData) => {
  chartInstance?.setOption({ series: [{ data: newData }] });
}, { deep: true });

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>