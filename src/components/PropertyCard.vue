<script setup lang="ts">
import { useListingsStore } from '../stores/listings'
import type { Property } from '../types/property'

// Props: this component receives a single property object.
// defineProps is Vue 3's type-safe way to declare component inputs.
const props = defineProps<{ property: Property }>()

const store = useListingsStore()

// Format price from integer (万円) to display string
// e.g. 22 → "¥220,000 / mo"
function formatPrice(man: number): string {
  return `¥${(man * 10000).toLocaleString('ja-JP')} / mo`
}

// Badge colour per property type — keeps the UI scannable at a glance
const typeBadgeClass: Record<Property['type'], string> = {
  Studio:    'bg-violet-100 text-violet-700',
  Apartment: 'bg-blue-100 text-blue-700',
  House:     'bg-emerald-100 text-emerald-700',
  Condo:     'bg-amber-100 text-amber-700',
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
              hover:shadow-md transition-shadow duration-200 flex flex-col">

    <!-- Property image -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="property.imageUrl"
        :alt="property.title"
        class="w-full h-full object-cover"
      />

      <!-- Saved / bookmark toggle — positioned over the image -->
      <button
        @click="store.toggleSaved(property.id)"
        class="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm
               hover:bg-white transition-colors duration-150 shadow-sm"
        :aria-label="property.saved ? 'Remove from saved' : 'Save property'"
      >
        <!-- Filled heart when saved, outline when not -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-5 h-5 transition-colors duration-150"
          :class="property.saved ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-gray-400'"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 8.5c0-2.485-2.015-4.5-4.5-4.5-1.688 0-3.157.93-3.938
               2.306A4.493 4.493 0 0 0 9 4C6.515 4 4.5 6.015 4.5 8.5c0
               5.25 7.5 10.5 7.5 10.5s7.5-5.25 7.5-10.5z"
          />
        </svg>
      </button>

      <!-- Property type badge -->
      <span
        class="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold"
        :class="typeBadgeClass[property.type]"
      >
        {{ property.type }}
      </span>
    </div>

    <!-- Card body -->
    <div class="p-4 flex flex-col gap-2 flex-1">
      <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
        {{ property.title }}
      </h3>

      <!-- District + address -->
      <div class="flex items-center gap-1 text-gray-400 text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 21c-4.418-4.77-7-8.013-7-11A7 7 0 0 1 19 10c0 2.987-2.582
               6.23-7 11z"/>
          <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/>
        </svg>
        <span class="truncate">{{ property.address }}</span>
      </div>

      <!-- Stats row: bedrooms + sqm -->
      <div class="flex gap-3 text-xs text-gray-500 mt-1">
        <span class="flex items-center gap-1">
          <!-- Bed icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 12V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 12h18M3
                 12v5m18-5v5M3 17h18"/>
          </svg>
          {{ property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} BR` }}
        </span>
        <span class="flex items-center gap-1">
          <!-- Area icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
          </svg>
          {{ property.sqm }} m²
        </span>
      </div>

      <!-- Price — pushed to bottom of card -->
      <div class="mt-auto pt-3 border-t border-gray-50">
        <span class="text-base font-bold text-gray-900">
          {{ formatPrice(property.price) }}
        </span>
      </div>
    </div>
  </div>
</template>