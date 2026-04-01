import { useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRandomQuote } from '../data/quotes'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function WelcomePage() {
  const navigate = useNavigate()
  const longPressTimer = useRef(null)
  const quote = useRef(getRandomQuote()).current

  const handlePressStart = useCallback((e) => {
    e.preventDefault()
    longPressTimer.current = setTimeout(() => {
      navigate('/manager')
    }, 800)
  }, [navigate])

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center px-6 pt-12 pb-10 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F0 0%, #FFE8E0 40%, #FFD4CC 70%, #FFB4B4 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-40px] w-40 h-40 rounded-full opacity-20" style={{ background: '#FF8C42' }} />
      <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full opacity-15" style={{ background: '#FF6B6B' }} />

      {/* Photo in frame */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="w-56 h-56 rounded-3xl overflow-hidden mb-8 flex-shrink-0"
        style={{
          border: '5px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 40px rgba(255,107,107,0.2), 0 4px 12px rgba(139,115,85,0.1)',
        }}
      >
        <img
          src="./photo.png"
          alt="我们的照片"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Title - long press to enter manager */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-handwriting text-3xl text-center mb-10 select-none"
        style={{ color: '#4A3228', WebkitTouchCallout: 'none' }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        亲爱的，今天想吃什么？
      </motion.h1>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-5 w-full max-w-xs"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/menu')}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
          }}
        >
          🍽️ 我要点菜
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/orders')}
          className="w-full py-4 rounded-2xl text-lg font-bold"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#5D3E2E',
            boxShadow: '0 4px 16px rgba(139, 115, 85, 0.12)',
          }}
        >
          👨‍🍳 查看订单
        </motion.button>
      </motion.div>

      {/* Bottom quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto pt-8 text-sm text-center"
        style={{ color: '#B08968' }}
      >
        {quote}
      </motion.p>
    </motion.div>
  )
}
