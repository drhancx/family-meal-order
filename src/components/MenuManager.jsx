import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../data/dishes'
import useDishes from '../hooks/useDishes'
import toast from 'react-hot-toast'
import BackButton from './BackButton'

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

const emptyDish = { name: '', category: 'hot', description: '', emoji: '🍳' }

export default function MenuManager() {
  const { dishes, addDish, deleteDish } = useDishes()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ...emptyDish })

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast('请输入菜名哦~', { icon: '🙏' })
      return
    }
    addDish(formData)
    toast('菜品添加成功！', { icon: '✅' })
    setFormData({ ...emptyDish })
    setShowForm(false)
  }

  const handleDelete = (dish) => {
    deleteDish(dish.id)
    toast(`已删除 ${dish.name}`, { icon: '🗑️' })
  }

  const groupedDishes = CATEGORIES.map((cat) => ({
    ...cat,
    items: dishes.filter((d) => d.category === cat.key),
  }))

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
          <h1 className="text-lg font-bold" style={{ color: '#4A3228' }}>菜品管理</h1>
        </div>
      </div>

      {/* Dish list by category */}
      <div className="px-4">
        {groupedDishes.map((group) => (
          <div key={group.key} className="mb-6">
            <h2 className="text-sm font-bold mb-2 pl-1" style={{ color: '#8B7355' }}>
              {group.emoji} {group.label}（{group.items.length}）
            </h2>

            <div className="space-y-2">
              {group.items.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  className="bg-white rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ boxShadow: '0 1px 6px rgba(139, 115, 85, 0.06)' }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{dish.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: '#4A3228' }}>{dish.name}</p>
                      <p className="text-xs truncate" style={{ color: '#A08060' }}>{dish.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDelete(dish)}
                    className="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    style={{ color: '#C4A080', background: 'transparent' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>
              ))}

              {group.items.length === 0 && (
                <p className="text-sm text-center py-3" style={{ color: '#B8A080' }}>暂无菜品</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating add button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center z-50"
        style={{
          background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
          boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.button>

      {/* Add dish form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(74, 50, 40, 0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-lg"
              style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#4A3228' }}>添加新菜品</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#8B7355' }}>菜名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：红烧排骨"
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    style={{
                      background: '#FFF8F0',
                      color: '#4A3228',
                      border: '1.5px solid #FFE0D0',
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#8B7355' }}>分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    style={{
                      background: '#FFF8F0',
                      color: '#4A3228',
                      border: '1.5px solid #FFE0D0',
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#8B7355' }}>描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="简短描述，如：肥而不腻，入口即化"
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    style={{
                      background: '#FFF8F0',
                      color: '#4A3228',
                      border: '1.5px solid #FFE0D0',
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block" style={{ color: '#8B7355' }}>Emoji 图标</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="输入一个 emoji"
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-center text-2xl"
                    style={{
                      background: '#FFF8F0',
                      color: '#4A3228',
                      border: '1.5px solid #FFE0D0',
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl font-medium"
                  style={{ background: '#FFF0ED', color: '#8B7355' }}
                >
                  取消
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="flex-1 py-3 rounded-2xl text-white font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                    boxShadow: '0 4px 16px rgba(255, 107, 107, 0.35)',
                  }}
                >
                  添加
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
