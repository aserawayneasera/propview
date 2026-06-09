export type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Studio'

export interface Property {
  id: number
  title: string
  district: string
  address: string
  type: PropertyType
  price: number        // monthly rent in JPY (万円)
  bedrooms: number
  sqm: number
  imageUrl: string
  saved: boolean
}

export interface Filters {
  search: string
  type: PropertyType | 'All'
  minPrice: number
  maxPrice: number
  bedrooms: number | 'Any'
}