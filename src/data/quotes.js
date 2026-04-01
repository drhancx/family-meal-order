const quotes = [
  '做你爱吃的，是我最开心的事 ❤️',
  '你点的每一道菜，都是我的甜蜜任务 🍳',
  '有你在，每顿饭都是大餐 💕',
  '最幸福的事，就是和你一起吃饭 🥰',
  '爱你，从好好吃饭开始 💗',
  '你的胃，由我来守护 🛡️',
  '今天也要好好吃饭呀 🌟',
  '世间万物，唯有美食与你不可辜负 ✨',
  '为你下厨房，心甘情愿 👨‍🍳',
  '吃好喝好，才能好好爱你 💖',
  '你负责点菜，我负责好吃 😋',
  '和你吃饭，比任何餐厅都浪漫 🌹',
]

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export default quotes
