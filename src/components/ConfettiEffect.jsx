import confetti from 'canvas-confetti'

export function fireConfetti() {
  const colors = ['#FF6B6B', '#FF8C42', '#FFB4B4', '#FFD700', '#FF69B4']

  // Left burst
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors,
  })

  // Right burst
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors,
  })

  // Center top
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 90,
      origin: { x: 0.5, y: 0.3 },
      colors,
    })
  }, 200)
}
