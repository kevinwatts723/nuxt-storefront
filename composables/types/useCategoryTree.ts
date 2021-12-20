import type { Ref } from "@vue/composition-api"
import type { ApolloQueryResult } from "apollo-client"
import * as GraphQL from "@/server/types/GraphQL"

// QueryResponse
export type QueryResponse<K extends string, V> = ApolloQueryResult<Record<K, V>>

export interface getFacetsFromURLResponse {
  categoryCode: string
  page: number
  itemsPerPage: number
  phrase: string
  filters: {}
  sort: string
}
export interface uiHelpersReturnType {
  getCatLink?: (category: GraphQL.PrCategory) => string
  getFacetsFromURL: () => getFacetsFromURLResponse
  setTermForUrl: (query: string) => void
  getProductLink: (productCode: string) => string
  changeFilters: (filters) => void
}

// categories
export type CategoriesResponse = QueryResponse<"items", GraphQL.PrCategory>

// useCategoryTree
export type UseCategoryTreeResponse = {
  load: () => Promise<void>
  categories: Ref<GraphQL.PrCategory[]>
  loading: Ref<boolean>
  error: Ref<string | {}>
}
