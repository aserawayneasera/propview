<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useListingsStore } from '../stores/listings'

// Chart.js requires you to register the components you use.
// This is a tree-shaking optimisation — only the pieces you register
// are included in the bundle.
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useListingsStore()

// Transform the store's priceDistribution getter into Chart.js dataset format.
// computed() means this re-runs whenever the store data changes.
const chartData = computed(() => ({
  labels: store.priceDistribution.map(b => b.label),
  datasets: [
    {
      label: 'Listings',
      data: store.priceDistribution.map(b => b.count),
      backgroundColor: [
        'rgba(99,  102, 241, 0.7)',  // violet  — ¥0–15万
        'rgba(59,  130, 246, 0.7)',  // blue    — ¥15–25万
        'rgba(16,  185, 129, 0.7)',  // emerald — ¥25–40万
        'rgba(245, 158,  11, 0.7)',  // amber   — ¥40–60万
        'rgba(239,  68,  68, 0.7)',  // red     — ¥60万+
      ],
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },  // single dataset — legend adds no value
    title: { display: false },
    tooltip: {
      callbacks: {
        // Custom tooltip: "3 listings" instead of just "3"
        label: (ctx: any) => ` ${ctx.parsed.y} listing${ctx.parsed.y !== 1 ? 's' : ''}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Only show whole numbers — listing counts are integers
        stepSize: 1,
        precision: 0,
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
    x: {
      grid: { display: false },
    },
  },
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h2 class="text-sm font-semibold text-gray-700 mb-4">
      Price Distribution
      <span class="text-gray-400 font-normal ml-1">(monthly rent)</span>
    </h2>
    <!-- Fixed height container — Chart.js needs an explicit height -->
    <div class="h-48">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>