<script setup lang="ts">
import { computed, ref } from 'vue'
import { useListingsStore } from './stores/listings'
import PropertyCard from './components/PropertyCard.vue'
import FilterBar from './components/FilterBar.vue'
import PriceChart from './components/PriceChart.vue'
import SavedBanner from './components/SavedBanner.vue'
import StatsBar from './components/StatsBar.vue'

const store = useListingsStore()

const activeTab = ref<'all' | 'saved'>('all')

const displayedListings = computed(() =>
  activeTab.value === 'saved' ? store.savedListings : store.filteredListings
)

const savedCount = computed(() => store.savedListings.length)
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ── Header ────────────────────────────────────────────────────────── -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        <!-- Brand -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
            </svg>
          </div>
          <span class="font-bold text-gray-900 text-lg tracking-tight">PropView</span>
          <span class="hidden sm:inline text-xs text-gray-400 ml-1 font-normal">
            Tokyo Property Explorer
          </span>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            @click="activeTab = 'all'"
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
            :class="activeTab === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'"
          >
            All Listings
          </button>
          <button
            @click="activeTab = 'saved'"
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                   duration-150 flex items-center gap-1.5"
            :class="activeTab === 'saved'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'"
          >
            Saved
            <span
              v-if="savedCount > 0"
              class="bg-rose-500 text-white text-xs rounded-full w-4 h-4
                     flex items-center justify-center leading-none"
            >
              {{ savedCount }}
            </span>
          </button>
        </div>

      </div>
    </header>

    <!-- ── Main ──────────────────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

      <!-- Filter bar + chart — only shown on All tab -->
      <template v-if="activeTab === 'all'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="lg:col-span-2">
            <FilterBar />
          </div>
          <div>
            <PriceChart />
          </div>
        </div>

        <!-- Stats strip — updates as filters change -->
        <StatsBar />
      </template>

      <!-- Saved banner — only shown on Saved tab when there are saves -->
      <SavedBanner v-if="activeTab === 'saved' && savedCount > 0" />

      <!-- Empty state -->
      <div
        v-if="displayedListings.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300 mb-4"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <p class="text-gray-500 font-medium">
          {{ activeTab === 'saved'
              ? 'No saved properties yet — click the heart on any listing'
              : 'No listings match your filters' }}
        </p>
        <button
          v-if="activeTab === 'all'"
          @click="store.resetFilters()"
          class="mt-3 text-sm text-blue-600 hover:underline"
        >
          Reset filters
        </button>
        <button
          v-if="activeTab === 'saved'"
          @click="activeTab = 'all'"
          class="mt-3 text-sm text-blue-600 hover:underline"
        >
          Browse listings
        </button>
      </div>

      <!-- Listings grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <PropertyCard
          v-for="property in displayedListings"
          :key="property.id"
          :property="property"
        />
      </div>

    </main>

    <!-- ── Footer ────────────────────────────────────────────────────────── -->
    <footer class="mt-12 border-t border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row
                  items-center justify-between gap-2 text-xs text-gray-400">
        <span>PropView — Tokyo Property Explorer</span>
        <span>Built with Vue 3 · Pinia · TypeScript · Chart.js · Tailwind CSS</span>
      </div>
    </footer>

  </div>
</template>