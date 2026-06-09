<script setup lang="ts">
import { useListingsStore } from '../stores/listings'

const store = useListingsStore()

// Total rent of all saved properties — a useful summary stat
function totalRent(): string {
  const total = store.savedListings.reduce((sum, p) => sum + p.price, 0)
  return `¥${(total * 10000).toLocaleString('ja-JP')}`
}
</script>

<template>
  <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100
              rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center
              justify-between gap-4">

    <div class="flex items-center gap-3">
      <!-- Heart icon -->
      <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-500"
             viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 8.5c0-2.485-2.015-4.5-4.5-4.5-1.688 0-3.157.93-3.938
                   2.306A4.493 4.493 0 0 0 9 4C6.515 4 4.5 6.015 4.5 8.5c0
                   5.25 7.5 10.5 7.5 10.5s7.5-5.25 7.5-10.5z"/>
        </svg>
      </div>

      <div>
        <p class="font-semibold text-gray-900 text-sm">
          {{ store.savedListings.length }}
          {{ store.savedListings.length === 1 ? 'property' : 'properties' }} saved
        </p>
        <p class="text-xs text-gray-500 mt-0.5">
          Combined monthly rent: <span class="font-medium text-gray-700">{{ totalRent() }}</span>
        </p>
      </div>
    </div>

    <!-- Clear all button -->
    <button
      @click="store.savedListings.forEach(p => store.toggleSaved(p.id))"
      class="text-xs font-medium text-rose-500 border border-rose-200 rounded-lg
             px-3 py-2 hover:bg-rose-50 transition-colors duration-150 self-start sm:self-auto"
    >
      Clear all saved
    </button>

  </div>
</template>