import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useListingsStore } from '../listings'

// A fresh Pinia instance is created before each test so state
// never leaks between tests — this is the standard Pinia testing pattern.
beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useListingsStore — initial state', () => {
  it('loads all 12 mock listings on init', () => {
    const store = useListingsStore()
    expect(store.listings).toHaveLength(12)
  })

  it('returns all listings when no filters are applied', () => {
    const store = useListingsStore()
    expect(store.filteredListings).toHaveLength(12)
  })

  it('has zero saved listings on init', () => {
    const store = useListingsStore()
    expect(store.savedListings).toHaveLength(0)
  })

  it('initialises filters with correct defaults', () => {
    const store = useListingsStore()
    expect(store.filters.search).toBe('')
    expect(store.filters.type).toBe('All')
    expect(store.filters.minPrice).toBe(0)
    expect(store.filters.maxPrice).toBe(100)
    expect(store.filters.bedrooms).toBe('Any')
  })
})

describe('useListingsStore — search filter', () => {
  it('filters by title (case-insensitive)', () => {
    const store = useListingsStore()
    store.setFilters({ search: 'shibuya' })
    const results = store.filteredListings
    expect(results.length).toBeGreaterThan(0)
    results.forEach(p => {
      const haystack = `${p.title} ${p.district} ${p.address}`.toLowerCase()
      expect(haystack).toContain('shibuya')
    })
  })

  it('filters by district', () => {
    const store = useListingsStore()
    store.setFilters({ search: 'Minato' })
    expect(store.filteredListings.length).toBeGreaterThan(0)
  })

  it('returns empty array when search matches nothing', () => {
    const store = useListingsStore()
    store.setFilters({ search: 'zzznomatchzzz' })
    expect(store.filteredListings).toHaveLength(0)
  })
})

describe('useListingsStore — type filter', () => {
  it('filters to only Studio listings', () => {
    const store = useListingsStore()
    store.setFilters({ type: 'Studio' })
    store.filteredListings.forEach(p => expect(p.type).toBe('Studio'))
  })

  it('filters to only House listings', () => {
    const store = useListingsStore()
    store.setFilters({ type: 'House' })
    store.filteredListings.forEach(p => expect(p.type).toBe('House'))
  })

  it('returns all listings when type is All', () => {
    const store = useListingsStore()
    store.setFilters({ type: 'Studio' })
    store.setFilters({ type: 'All' })
    expect(store.filteredListings).toHaveLength(12)
  })
})

describe('useListingsStore — price filter', () => {
  it('excludes listings above maxPrice', () => {
    const store = useListingsStore()
    store.setFilters({ maxPrice: 20 })
    store.filteredListings.forEach(p => expect(p.price).toBeLessThanOrEqual(20))
  })

  it('excludes listings below minPrice', () => {
    const store = useListingsStore()
    store.setFilters({ minPrice: 30 })
    store.filteredListings.forEach(p => expect(p.price).toBeGreaterThanOrEqual(30))
  })

  it('returns empty when min > max covers no listings', () => {
    const store = useListingsStore()
    store.setFilters({ minPrice: 95, maxPrice: 100 })
    expect(store.filteredListings).toHaveLength(0)
  })
})

describe('useListingsStore — bedroom filter', () => {
  it('filters to 0-bedroom (Studio) listings', () => {
    const store = useListingsStore()
    store.setFilters({ bedrooms: 0 })
    store.filteredListings.forEach(p => expect(p.bedrooms).toBe(0))
  })

  it('filters to 2-bedroom listings', () => {
    const store = useListingsStore()
    store.setFilters({ bedrooms: 2 })
    store.filteredListings.forEach(p => expect(p.bedrooms).toBe(2))
  })
})

describe('useListingsStore — toggleSaved', () => {
  it('saves a listing by id', () => {
    const store = useListingsStore()
    store.toggleSaved(1)
    expect(store.savedListings).toHaveLength(1)
    expect(store.savedListings[0].id).toBe(1)
  })

  it('unsaves a listing when toggled a second time', () => {
    const store = useListingsStore()
    store.toggleSaved(1)
    store.toggleSaved(1)
    expect(store.savedListings).toHaveLength(0)
  })

  it('can save multiple listings independently', () => {
    const store = useListingsStore()
    store.toggleSaved(1)
    store.toggleSaved(3)
    store.toggleSaved(5)
    expect(store.savedListings).toHaveLength(3)
  })

  it('does not affect other listings when one is toggled', () => {
    const store = useListingsStore()
    store.toggleSaved(2)
    const others = store.listings.filter(p => p.id !== 2)
    others.forEach(p => expect(p.saved).toBe(false))
  })
})

describe('useListingsStore — resetFilters', () => {
  it('restores all 12 listings after filters were applied', () => {
    const store = useListingsStore()
    store.setFilters({ search: 'shibuya', type: 'Studio', minPrice: 20 })
    store.resetFilters()
    expect(store.filteredListings).toHaveLength(12)
  })

  it('resets all filter fields to defaults', () => {
    const store = useListingsStore()
    store.setFilters({ search: 'test', type: 'House', bedrooms: 3 })
    store.resetFilters()
    expect(store.filters.search).toBe('')
    expect(store.filters.type).toBe('All')
    expect(store.filters.bedrooms).toBe('Any')
  })
})

describe('useListingsStore — priceDistribution', () => {
  it('returns exactly 5 price bands', () => {
    const store = useListingsStore()
    expect(store.priceDistribution).toHaveLength(5)
  })

  it('total count across all bands equals total listings', () => {
    const store = useListingsStore()
    const total = store.priceDistribution.reduce((sum, b) => sum + b.count, 0)
    expect(total).toBe(12)
  })

  it('each band has a label and a non-negative count', () => {
    const store = useListingsStore()
    store.priceDistribution.forEach(band => {
      expect(band.label).toBeTruthy()
      expect(band.count).toBeGreaterThanOrEqual(0)
    })
  })
})