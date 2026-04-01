import { useState, useCallback, useMemo } from 'react'
import { DEFAULT_DISHES } from '../data/dishes'

const CUSTOM_DISHES_KEY = 'custom_dishes'
const DELETED_IDS_KEY = 'deleted_dish_ids'

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function useDishes() {
  const [customDishes, setCustomDishes] = useState(() => loadFromStorage(CUSTOM_DISHES_KEY, []))
  const [deletedIds, setDeletedIds] = useState(() => loadFromStorage(DELETED_IDS_KEY, []))

  const dishes = useMemo(() => {
    const filtered = DEFAULT_DISHES.filter((d) => !deletedIds.includes(d.id))
    return [...filtered, ...customDishes]
  }, [customDishes, deletedIds])

  const addDish = useCallback((dish) => {
    const newDish = { ...dish, id: `custom-${Date.now()}` }
    setCustomDishes((prev) => {
      const next = [...prev, newDish]
      saveToStorage(CUSTOM_DISHES_KEY, next)
      return next
    })
  }, [])

  const updateDish = useCallback((id, updates) => {
    // Update in custom dishes
    setCustomDishes((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      saveToStorage(CUSTOM_DISHES_KEY, next)
      return next
    })
  }, [])

  const deleteDish = useCallback((id) => {
    if (id.startsWith('custom-')) {
      setCustomDishes((prev) => {
        const next = prev.filter((d) => d.id !== id)
        saveToStorage(CUSTOM_DISHES_KEY, next)
        return next
      })
    } else {
      setDeletedIds((prev) => {
        const next = [...prev, id]
        saveToStorage(DELETED_IDS_KEY, next)
        return next
      })
    }
  }, [])

  const restoreDish = useCallback((id) => {
    setDeletedIds((prev) => {
      const next = prev.filter((did) => did !== id)
      saveToStorage(DELETED_IDS_KEY, next)
      return next
    })
  }, [])

  return { dishes, addDish, updateDish, deleteDish, restoreDish }
}
