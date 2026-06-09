<script setup lang="ts">
import { computed } from 'vue'
import { useListingsStore } from '../stores/listings'
import type { PropertyType } from '../types/property'

const store = useListingsStore()

// Property type options — 'All' is the default/reset value
const typeOptions: Array<'All' | PropertyType> = [
  'All', 'Studio', 'Apartment', 'House', 'Condo'
]

// Bedroom options — 'Any' means no filter applied
const bedroomOptions: Array<number | 'Any'> = ['Any', 0, 1, 2, 3, 4]

// Label helper — 0 bedrooms displays as "Studio" in the filter too
function bedroomLabel(val: number | 'Any'): string {
  if (val === 'Any') return 'Any'
  if (val === 0) return 'Studio'
  return `${val} BR`
}

// Two-way computed helpers let us bind directly to <input> / <select>
// without calling setFilters() manually on every keystroke.
// The getter reads from the store; the setter writes back via the action.

const search = computed({
  get: () => store.filters.search,
  set: (val: string) => store.setFilters({ search: val }),
})

const selectedType = computed({
  get: () => store.filters.type,
  set: (val: 'All' | PropertyType) => store.setFilters({ type: val }),
})

const minPrice = computed({
  get: () => store.filters.minPrice,
  set: (val: number) => store.setFilters({ minPrice: Number(val) }),
})

const maxPrice = computed({
  get: () => store.filters.maxPrice,
  set: (val: number) => store.setFilters({ maxPrice: Number(val) }),
})

const selectedBedrooms = computed({
  get: () => store.filters.bedrooms,
  set: (val: number | 'Any') => store.setFilters({ bedrooms: val }),
})

// Result count label shown next to the reset button
const resultCount = computed(() => store.filteredListings.length)
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col gap-4">

    <!-- Search input -->
    <div class="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, district, or address…"
        class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
               text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
               focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>

    <!-- Filter controls row -->
    <div class="flex flex-wrap gap-3 items-end">

      <!-- Property type buttons -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Type
        </label>
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="type in typeOptions"
            :key="type"
            @click="selectedType = type"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150"
            :class="selectedType === type
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Price range -->
      <div class="flex flex-col gap-1 min-w-[180px]">
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Price: ¥{{ minPrice }}万 – ¥{{ maxPrice === 100 ? '100万+' : `${maxPrice}万` }}
        </label>
        <div class="flex gap-2 items-center">
          <input
            v-model="minPrice"
            type="range" min="0" max="100" step="5"
            class="flex-1 accent-blue-600"
          />
          <span class="text-xs text-gray-400">to</span>
          <input
            v-model="maxPrice"
            type="range" min="0" max="100" step="5"
            class="flex-1 accent-blue-600"
          />
        </div>
      </div>

      <!-- Bedrooms -->
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Bedrooms
        </label>
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="opt in bedroomOptions"
            :key="opt"
            @click="selectedBedrooms = opt"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150"
            :class="selectedBedrooms === opt
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'"
          >
            {{ bedroomLabel(opt) }}
          </button>
        </div>
      </div>

      <!-- Reset + result count — pushed to the right -->
      <div class="ml-auto flex items-center gap-3">
        <span class="text-sm text-gray-400">
          {{ resultCount }} {{ resultCount === 1 ? 'result' : 'results' }}
        </span>
        <button
          @click="store.resetFilters()"
          class="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200
                 text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors duration-150"
        >
          Reset
        </button>
      </div>

    </div>
  </div>
</template>