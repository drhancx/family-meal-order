import { useRef, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
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
  const [imgError, setImgError] = useState(false)
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
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FFF8F0 0%, #FFE8E0 40%, #FFD4CC 70%, #FFB4B4 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-40px] w-40 h-40 rounded-full opacity-20" style={{ background: '#FF8C42' }} />
      <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 rounded-full opacity-15" style={{ background: '#FF6B6B' }} />

      {/* Photo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="w-44 h-44 rounded-3xl overflow-hidden mb-6 shadow-[0_8px_30px_rgba(255,107,107,0.25)]"
        style={{ border: '4px solid rgba(255,255,255,0.8)' }}
      >
        {!imgError ? (
          <img
            src="./photo.png"
            alt="我们的照片"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/50">
            <span className="text-5xl">💕</span>
          </div>
        )}
      </motion.div>

      {/* Title - long press to enter manager */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-handwriting text-3xl text-center mb-8 select-none"
        style={{ color: '#5D3E2E', WebkitTouchCallout: 'none' }}
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
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/menu')}
          className="w-full py-4 rounded-2xl text-lg font-bold text-white shadow-[0_6px_20px_rgba(255,107,107,0.4)] active:shadow-[0_2px_8px_rgba(255,107,107,0.3)] transition-shadow"
          style={{ background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)' }}
        >
          🍽️ 我要点菜
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/orders')}
          className="w-full py-4 rounded-2xl text-lg font-bold shadow-[0_6px_20px_rgba(255,180,180,0.4)] active:shadow-[0_2px_8px_rgba(255,180,180,0.3)] transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #FFDDD2, #FFB4B4)',
            color: '#5D3E2E',
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
        className="mt-10 text-sm text-center"
        style={{ color: '#B08968' }}
      >
        {quote}
      </motion.p>

      {/* QR Code toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setShowQR(!showQR)}
        className="mt-4 text-xs px-4 py-1.5 rounded-full transition-colors"
        style={{ color: '#B08968', background: 'rgba(255,255,255,0.5)' }}
      >
        {showQR ? '收起二维码' : '📱 扫码访问'}
      </motion.button>

      {showQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-4 bg-white rounded-2xl shadow-lg flex flex-col items-center"
        >
          <QRCodeSVG value={currentUrl} size={140} fgColor="#5D3E2E" />
          <p className="text-xs mt-2" style={{ color: '#B08968' }}>
            扫码在手机上打开
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
