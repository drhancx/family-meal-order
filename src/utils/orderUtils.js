const ORDERS_KEY = 'meal_orders'

export function generateOrderSummary(items) {
  const lines = ['📋 今日点菜单', '──────────']
  items.forEach((item) => {
    lines.push(`${item.emoji} ${item.name} × ${item.quantity}`)
  })
  lines.push('──────────')
  lines.push(`共 ${items.length} 道菜`)
  lines.push('期待大厨的手艺~ 💕')
  return lines.join('\n')
}

export async function copyToClipboard(text) {
  // Strategy 1: Modern Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback
    }
  }

  // Strategy 2: execCommand fallback (WeChat WebView compatible)
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;'
    document.body.appendChild(textarea)

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    if (isIOS) {
      textarea.contentEditable = 'true'
      textarea.readOnly = false
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, text.length)
    } else {
      textarea.select()
    }

    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch {
    return false
  }
}

export function saveOrder(items) {
  const now = new Date()
  const order = {
    id: Date.now().toString(36),
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5),
    items: items.map((item) => ({
      dishId: item.dishId,
      name: item.name,
      emoji: item.emoji,
      quantity: item.quantity,
    })),
    totalCount: items.length,
  }

  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return order
}

export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getOrdersGroupedByDate() {
  const orders = getOrders()
  const grouped = {}
  orders.forEach((order) => {
    if (!grouped[order.date]) {
      grouped[order.date] = []
    }
    grouped[order.date].push(order)
  })
  return grouped
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = weekDays[date.getDay()]
  return `${month}月${day}日 周${weekDay}`
}
