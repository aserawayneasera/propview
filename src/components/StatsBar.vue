<script setup lang="ts">
import { computed } from 'vue'
import { useListingsStore } from '../stores/listings'

const store = useListingsStore()

// All stats derived from filteredListings so they update with filters
const stats = computed(() => {
  const listings = store.filteredListings
  if (listings.length === 0) return null

  const prices = listings.map(p => p.price)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  return {
    count: listings.length,
    avg: `¥${(avg * 10000).toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`,
    min: `¥${(min * 10000).toLocaleString('ja-JP')}`,
    max: `¥${(max * 10000).toLocaleString('ja-JP')}`,
  }
})
</script>

<template>
  <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-4 gap-3">

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Listings</p>
      <p class="text-xl font-bold text-gray-900 mt-1">{{ stats.count }}</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Avg Rent / mo</p>
      <p class="text-xl font-bold text-gray-900 mt-1">{{ stats.avg }}</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Lowest</p>
      <p class="text-xl font-bold text-emerald-600 mt-1">{{ stats.min }}</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      <p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Highest</p>
      <p class="text-xl font-bold text-rose-500 mt-1">{{ stats.max }}</p>
    </div>

  </div>
</template>