import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CATEGORIES } from '../data/dishes'
import useDishes from '../hooks/useDishes'
import useCart from '../hooks/useCart'
import DishCard from './DishCard'
import CartBar from './CartBar'
import BackButton from './BackButton'
import { fireConfetti } from './ConfettiEffect'
import { generateOrderSummary, copyToClipboard, saveOrder } from '../utils/orderUtils'

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export default function MenuPage() {
  const navigate = useNavigate()
  const { dishes } = useDishes()
  const { cartItems, totalCount, addItem, removeItem, clearCart, getQuantity } = useCart()
  const [activeCategory, setActiveCategory] = useState('cold')
  const [showModal, setShowModal] = useState(false)
  const [orderSummary, setOrderSummary] = useState('')
  const tabsRef = useRef(null)

  const filteredDishes = dishes.filter((d) => d.category === activeCategory)

  const handleSubmit = () => {
    if (totalCount === 0) return
    const summary = generateOrderSummary(cartItems)
    saveOrder(cartItems)
    setOrderSummary(summary)
    fireConfetti()
    setShowModal(true)
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(orderSummary)
    if (success) {
      toast('已复制到剪贴板，快去微信发给 TA 吧~ 💌', { icon: '✅' })
    } else {
      toast('复制失败，请手动选择文字复制', { icon: '😅' })
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    clearCart()
    navigate('/')
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
      className="min-h-screen pb-24"
      style={{ background: '#FFF8F0' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40" style={{ background: 'rgba(255,248,240,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <h1 className="text-lg font-bold" style={{ color: '#4A3228' }}>选菜单</h1>
        </div>

        {/* Category tabs */}
        <div
          ref={tabsRef}
          className="flex gap-2.5 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeCategory === cat.key
                  ? {
                      background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                      color: '#fff',
                      boxShadow: '0 3px 12px rgba(255, 107, 107, 0.3)',
                    }
                  : {
                      background: '#fff',
                      color: '#8B7355',
                      boxShadow: '0 1px 4px rgba(139, 115, 85, 0.08)',
                      border: '1px solid rgba(139, 115, 85, 0.1)',
                    }
              }
            >
              {cat.emoji} {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dish grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {filteredDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            quantity={getQuantity(dish.id)}
            onAdd={addItem}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredDishes.length === 0 && (
        <div className="text-center py-16" style={{ color: '#A08060' }}>
          <p className="text-4xl mb-3">🍽️</p>
          <p>这个分类还没有菜品哦~</p>
        </div>
      )}

      {/* Cart bar */}
      <CartBar cartItems={cartItems} totalCount={totalCount} onSubmit={handleSubmit} />

      {/* Submit success modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(74, 50, 40, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: '0 20px 60px rgba(74, 50, 40, 0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <span className="text-4xl">💕</span>
              <h2 className="text-lg font-bold mt-2" style={{ color: '#4A3228' }}>
                已告诉大厨啦~
              </h2>
            </div>

            <pre
              className="rounded-2xl p-4 text-sm whitespace-pre-wrap mb-4 leading-relaxed"
              style={{ background: '#FFF8F0', color: '#5D3E2E' }}
            >
              {orderSummary}
            </pre>

            <div className="flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="w-full py-3 rounded-2xl text-white font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.35)',
                }}
              >
                📋 复制到剪贴板
              </motion.button>
              <button
                onClick={handleCloseModal}
                className="w-full py-3 rounded-2xl font-medium"
                style={{ background: '#FFF0ED', color: '#8B7355' }}
              >
                返回首页
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
