import { useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { getRandomQuote } from '../data/quotes'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function WelcomePage() {
  const navigate = useNavigate()
  const longPressTimer = useRef(null)
  const quote = useRef(getRandomQuote()).current
  const [showQR, setShowQR] = useState(false)

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

  const currentUrl = window.location.href

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Full-screen photo background */}
      <div className="absolute inset-0">
        <img
          src="./photo.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay - lighter on top to show photo, deeper at bottom for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,248,240,0.1) 0%, rgba(255,248,240,0.3) 35%, rgba(255,232,224,0.75) 55%, rgba(255,200,190,0.92) 70%, rgba(255,180,180,0.97) 100%)',
          }}
        />
      </div>

      {/* Content - positioned at bottom half */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 pb-8">
        {/* Title - long press to enter manager */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-handwriting text-2xl text-center mb-6 select-none"
          style={{ color: '#4A3228', textShadow: '0 1px 8px rgba(255,255,255,0.5)', WebkitTouchCallout: 'none' }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full max-w-xs mx-auto"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/menu')}
            className="w-full py-3.5 rounded-2xl text-base font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
              boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
            }}
          >
            🍽️ 我要点菜
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/orders')}
            className="w-full py-3.5 rounded-2xl text-base font-bold"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#5D3E2E',
              boxShadow: '0 4px 16px rgba(139, 115, 85, 0.15)',
            }}
          >
            👨‍🍳 查看订单
          </motion.button>
        </motion.div>

        {/* Bottom: quote + QR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <p className="text-xs" style={{ color: '#8B6B55' }}>{quote}</p>

          <button
            onClick={() => setShowQR(!showQR)}
            className="mt-2 text-xs px-3 py-1 rounded-full"
            style={{ color: '#8B6B55', background: 'rgba(255,255,255,0.4)' }}
          >
            {showQR ? '收起二维码' : '📱 扫码访问'}
          </button>

          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md inline-flex flex-col items-center"
            >
              <QRCodeSVG value={currentUrl} size={120} fgColor="#4A3228" />
              <p className="text-xs mt-1.5" style={{ color: '#8B6B55' }}>扫码在手机上打开</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
