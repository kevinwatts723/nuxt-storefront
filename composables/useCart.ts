import { Cart } from "./types/useCart"
import { useNuxtApp, useState } from "#app"
import { getCartQuery } from "@/gql/queries/cart"
import {
  addToCartMutation,
  deleteCartItemMutation,
  updateCartCouponMutation,
  updateCartQuantityMutation,
  deleteCartCouponMutation,
} from "@/gql/mutations"

export const useCart = () => {
  const cart = useState(`use-cart-result`, () => {
    return {} as Cart
  })
  const loading = useState(`use-cart-loading`, () => false)
  const error = useState(`use-cart-error`, () => null)
  const nuxt = useNuxtApp()
  const fetcher = nuxt.nuxt2Context.$gqlFetch

  const getCart = async (): Promise<Object> => {
    const cartResponse = await fetcher({
      query: getCartQuery,
    })
    return cartResponse.data.currentCart
  }

  const load = async () => {
    try {
      loading.value = true
      cart.value = await getCart()
    } catch (error) {
      cart.value = {}
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (params: { product: Object; quantity: number }) => {
    try {
      loading.value = true
      const { product, quantity } = params
      const productToAdd = {
        product,
        quantity,
      }
      await fetcher({
        query: addToCartMutation,
        variables: { productToAdd },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      loading.value = false
      cart.value = await getCart()
    }
  }

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    const variables = {
      itemId: cartItemId,
      quantity,
    }

    try {
      loading.value = true
      await fetcher({
        query: updateCartQuantityMutation,
        variables,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const removeCartItem = async (cartItemId: string) => {
    const variables = {
      itemId: cartItemId,
    }
    try {
      loading.value = true
      await fetcher({
        query: deleteCartItemMutation,
        variables,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      loading.value = false
      cart.value = await getCart()
    }
  }

  const applyCoupon = async (couponCode: string) => {
    try {
      const response = await fetcher({
        query: updateCartCouponMutation,
        variables: { cartId: cart.value?.id, couponCode },
      })
      cart.value = response.data.updateCartCoupon
    } catch (err) {
      loading.value = false
    }
  }

  // TODO
  const removeCoupon = async (couponCode: string) => {
    try {
      const response = await fetcher({
        query: deleteCartCouponMutation,
        variables: { cartId: cart.value?.id, couponCode },
      })
      cart.value = response.data.updateCartCoupon
    } catch (err) {
      loading.value = false
    }
  }

  return {
    loading,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    load,
    applyCoupon,
    removeCoupon,
    cart,
    error,
  }
}
