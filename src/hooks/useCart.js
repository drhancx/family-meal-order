import { useReducer, useCallback, useMemo } from 'react'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { dish } = action
      const existing = state[dish.id]
      return {
        ...state,
        [dish.id]: {
          dishId: dish.id,
          name: dish.name,
          emoji: dish.emoji,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    }
    case 'REMOVE_ITEM': {
      const { dishId } = action
      const existing = state[dishId]
      if (!existing) return state
      if (existing.quantity <= 1) {
        const next = { ...state }
        delete next[dishId]
        return next
      }
      return {
        ...state,
        [dishId]: { ...existing, quantity: existing.quantity - 1 },
      }
    }
    case 'CLEAR_CART':
      return {}
    default:
      return state
  }
}

export default function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, {})

  const addItem = useCallback((dish) => {
    dispatch({ type: 'ADD_ITEM', dish })
  }, [])

  const removeItem = useCallback((dishId) => {
    dispatch({ type: 'REMOVE_ITEM', dishId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const cartItems = useMemo(() => Object.values(cart), [cart])
  const totalCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  const getQuantity = useCallback((dishId) => {
    return cart[dishId]?.quantity || 0
  }, [cart])

  return { cart, cartItems, totalCount, addItem, removeItem, clearCart, getQuantity }
}
