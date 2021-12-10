import { Location } from "../types"
import { Cart, CartItem, Maybe, CrProductOption } from "~~/server/types/GraphQL"

export const getCartItems = (cart: Cart): Maybe<CartItem>[] => cart?.items || []

export const getCartItemName = (item: CartItem) => item?.product?.name

export const getCartItemImage = (item: CartItem) => item?.product?.imageUrl

export const getCartItemPrice = (
  item: CartItem
): { regular: Maybe<String> | undefined; special: Maybe<String> | undefined } => {
  return {
    regular: `$${item.productDiscounts?.length ? item.subtotal : item.total}`,
    ...(item.productDiscounts?.length && { special: `$${item.total}` }),
  }
}

export const getCartItemQty = (item: CartItem): number => item?.quantity

export const getCartItemAttributes = (
  item: CartItem,
  filterByAttributeName: string
): Record<string, string> => {
  const attributes: Record<string, string> = {}
  if (Array.isArray(filterByAttributeName) && filterByAttributeName.length) {
    filterByAttributeName.forEach((attr: string) => {
      attributes[attr] = "N/A"
      item?.product?.options?.filter((o) => {
        if (
          filterByAttributeName.includes(o?.name?.toLowerCase()) &&
          attr === o?.name?.toLowerCase()
        ) {
          attributes[attr] = o.value
          return true
        }
        return false
      })
    })
  } else {
    const options = item.product?.options || []
    options?.forEach((opt: Maybe<CrProductOption>) => {
      if (opt?.name) attributes[opt.name] = opt?.value
    })
  }

  return attributes
}

export const getCartItemSku = (item: CartItem) =>
  item?.product?.sku || item?.product?.upc || item?.product?.productCode

function getTotals(cart: Cart) {
  return {
    total: `$${cart?.orderDiscounts?.length ? cart?.discountedSubtotal : cart?.total}`,
    subtotal: `$${cart?.subtotal}`,
    ...(cart?.orderDiscounts.length && { special: `$${cart?.discountedTotal}` }),
  }
}

export const getCartShippingPrice = (cart: Cart) => cart?.shippingTotal

export const getCartTotalItems = (cart: Cart): number => cart?.items?.length || 0

export const getFormattedPrice = (price: number): string => String(price)

export const getCoupons = (cart: Cart) =>
  cart?.orderDiscounts
    ?.filter((d) => d?.couponCode !== null)
    .map((d) => ({
      id: d?.discount?.id.toString(),
      name: d?.discount?.name,
      code: d?.couponCode,
      value: d?.impact,
    }))

export const getDiscounts = (cart: Cart) => {
  return cart?.orderDiscounts?.map((d) => ({
    id: d?.discount?.id.toString(),
    name: d?.discount?.name,
    description: d?.discount?.name,
    value: d?.impact,
    code: d?.couponCode,
  }))
}

export const getCartFulfillmentOptions = (item: CartItem, purchaseLocation: Location) =>
  item?.product.fulfillmentTypesSupported.map((option) => ({
    name: "fulfillment",
    value: option,
    label: option === "DirectShip" ? "Ship to Home" : "Pickup in Store",
    details:
      option === "DirectShip"
        ? "Available to Ship"
        : purchaseLocation?.name
        ? `Available at: ${purchaseLocation.name}`
        : "",
    required: "false",
  }))

export const cartGetters = {
  getTotals,
  getShippingPrice: getCartShippingPrice,
  getItems: getCartItems,
  getItemName: getCartItemName,
  getItemImage: getCartItemImage,
  getItemPrice: getCartItemPrice,
  getItemQty: getCartItemQty,
  getItemAttributes: getCartItemAttributes,
  getItemSku: getCartItemSku,
  getFormattedPrice,
  getTotalItems: getCartTotalItems,
  getCoupons,
  getDiscounts,
  getCartFulfillmentOptions,
}
