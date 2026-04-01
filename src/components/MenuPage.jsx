import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  const { dishes, addDish } = useDishes()
  const { cartItems, totalCount, addItem, removeItem, clearCart, getQuantity } = useCart()
  const [activeCategory, setActiveCategory] = useState('cold')
  const [showModal, setShowModal] = useState(false)
  const [orderSummary, setOrderSummary] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDishName, setNewDishName] = useState('')
  const [newDishEmoji, setNewDishEmoji] = useState('🍽️')
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

  const handleAddCustomDish = () => {
    if (!newDishName.trim()) {
      toast('请输入菜名~', { icon: '🙏' })
      return
    }
    addDish({
      name: newDishName.trim(),
      category: activeCategory,
      description: '自定义菜品',
      emoji: newDishEmoji || '🍽️',
    })
    toast(`已添加 ${newDishName}`, { icon: '✅' })
    setNewDishName('')
    setNewDishEmoji('🍽️')
    setShowAddForm(false)
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
          <h1 className="text-base font-bold" style={{ color: '#4A3228' }}>选菜单</h1>
        </div>

        {/* Category tabs */}
        <div
          ref={tabsRef}
          className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={
                activeCategory === cat.key
                  ? {
                      background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(255, 107, 107, 0.3)',
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

        {/* Add custom dish card */}
        <motion.button
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-white/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center min-h-[130px]"
          style={{
            border: '2px dashed rgba(255, 154, 92, 0.3)',
          }}
        >
          <span className="text-2xl mb-1" style={{ color: '#FFa070' }}>+</span>
          <span className="text-xs font-medium" style={{ color: '#C0956E' }}>想吃别的</span>
        </motion.button>
      </div>

      {/* Empty state */}
      {filteredDishes.length === 0 && (
        <div className="text-center py-10" style={{ color: '#A08060' }}>
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm">这个分类还没有菜品哦~</p>
        </div>
      )}

      {/* Cart bar */}
      <CartBar cartItems={cartItems} totalCount={totalCount} onSubmit={handleSubmit} />

      {/* Add custom dish form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(74, 50, 40, 0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: 250 }}
              animate={{ y: 0 }}
              exit={{ y: 250 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl p-5 w-full max-w-lg"
              style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold mb-4" style={{ color: '#4A3228' }}>
                添加想吃的菜
              </h3>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newDishEmoji}
                  onChange={(e) => setNewDishEmoji(e.target.value)}
                  className="w-14 h-11 rounded-xl text-center text-xl focus:outline-none"
                  style={{ background: '#FFF8F0', border: '1.5px solid #FFE0D0' }}
                  placeholder="🍽️"
                />
                <input
                  type="text"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="输入菜名，如：红烧排骨"
                  className="flex-1 h-11 px-4 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#FFF8F0', color: '#4A3228', border: '1.5px solid #FFE0D0' }}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: '#FFF0ED', color: '#8B7355' }}
                >
                  取消
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCustomDish}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                    boxShadow: '0 3px 12px rgba(255, 107, 107, 0.3)',
                  }}
                >
                  添加
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h2 className="text-base font-bold mt-2" style={{ color: '#4A3228' }}>
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
                className="w-full py-3 rounded-2xl text-white font-bold text-sm"
                style={{
                  background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.35)',
                }}
              >
                📋 复制到剪贴板
              </motion.button>
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 rounded-2xl font-medium text-sm"
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
