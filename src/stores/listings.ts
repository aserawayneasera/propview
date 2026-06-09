import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockListings } from '../data/listings'
import type { Property, Filters } from '../types/property'

export const useListingsStore = defineStore('listings', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  // All listings loaded once from mock data — in a real app this would be
  // an API call. We use ref() so Vue can track changes reactively.
  const listings = ref<Property[]>(mockListings.map(p => ({ ...p })))

  // Filters live in the store so any component can read or update them
  // without prop-drilling. This is Pinia's core value proposition.
  const filters = ref<Filters>({
    search: '',
    type: 'All',
    minPrice: 0,
    maxPrice: 100,
    bedrooms: 'Any',
  })

  // ─── Getters (computed) ───────────────────────────────────────────────────
  // computed() inside a setup store becomes a Pinia getter.
  // It re-runs automatically whenever listings or filters change.
  const filteredListings = computed<Property[]>(() => {
    return listings.value.filter(p => {
      // 1. Full-text search across title, district, and address
      const searchLower = filters.value.search.toLowerCase()
      const matchesSearch =
        !searchLower ||
        p.title.toLowerCase().includes(searchLower) ||
        p.district.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower)

      // 2. Property type filter — 'All' means no filtering
      const matchesType =
        filters.value.type === 'All' || p.type === filters.value.type

      // 3. Price range — price is stored in 万円 (e.g. 12 = ¥120,000/mo)
      const matchesPrice =
        p.price >= filters.value.minPrice && p.price <= filters.value.maxPrice

      // 4. Bedroom count — 'Any' means no filtering
      const matchesBedrooms =
        filters.value.bedrooms === 'Any' || p.bedrooms === filters.value.bedrooms

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms
    })
  })

  // Saved listings getter — used by the "Saved" tab / badge count
  const savedListings = computed<Property[]>(() =>
    listings.value.filter(p => p.saved)
  )

  // Price distribution for the Chart.js bar chart.
  // Buckets listings into price bands so the chart is meaningful.
  const priceDistribution = computed(() => {
    const bands = [
      { label: '¥0–15万', min: 0, max: 15 },
      { label: '¥15–25万', min: 15, max: 25 },
      { label: '¥25–40万', min: 25, max: 40 },
      { label: '¥40–60万', min: 40, max: 60 },
      { label: '¥60万+', min: 60, max: Infinity },
    ]
    return bands.map(band => ({
      label: band.label,
      count: listings.value.filter(p => p.price >= band.min && p.price < band.max).length,
    }))
  })

  // ─── Actions ─────────────────────────────────────────────────────────────
  // Actions are plain functions inside a setup store.
  // They mutate state directly — Pinia handles reactivity automatically.

  // Update any subset of filters in one call.
  // Partial<Filters> means callers only need to pass what changed.
  function setFilters(updated: Partial<Filters>) {
    filters.value = { ...filters.value, ...updated }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      type: 'All',
      minPrice: 0,
      maxPrice: 100,
      bedrooms: 'Any',
    }
  }

  // Toggle saved status on a listing by id.
  // We mutate the listing inside the store so savedListings
  // getter updates instantly everywhere in the app.
  function toggleSaved(id: number) {
    const listing = listings.value.find(p => p.id === id)
    if (listing) listing.saved = !listing.saved
  }

  return {
    listings,
    filters,
    filteredListings,
    savedListings,
    priceDistribution,
    setFilters,
    resetFilters,
    toggleSaved,
  }
})