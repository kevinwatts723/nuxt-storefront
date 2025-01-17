import { searchResults } from "@/gql/fragments"

export const searchProductsQuery = /* GraphQL */ `
  query ProductSearch(
    $query: String
    $startIndex: Int
    $filter: String
    $pageSize: Int
    $sortBy: String
    $facetHierValue: String
    $facetTemplate: String
    $facetValueFilter: String
  ) {
    products: productSearch(
      query: $query
      filter: $filter
      startIndex: $startIndex
      pageSize: $pageSize
      sortBy: $sortBy
      facetHierValue: $facetHierValue
      facetTemplate: $facetTemplate
      facetValueFilter: $facetValueFilter
    ) {
      ...searchResults
    }
  }
  ${searchResults}
`
