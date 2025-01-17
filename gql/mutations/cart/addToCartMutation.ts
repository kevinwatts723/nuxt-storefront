export const addToCartMutation = /* Graphql */ `
mutation addToCart($productToAdd:CartItemInput!){
    addItemToCurrentCart(cartItemInput: $productToAdd) {
    	id
      product {
        productCode
        name
        description
        imageUrl
        options {
          attributeFQN
          name
          value
        }
        properties {
          attributeFQN
          name
          values {
            value
          }
        }
        sku
        price {
          price
          salePrice
        }
        categories {
          id
        }
      }
      quantity
    }
}
`
