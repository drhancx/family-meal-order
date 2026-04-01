import { motion, AnimatePresence } from 'framer-motion'

export default function DishCard({ dish, quantity, onAdd, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-3.5 flex flex-col items-center text-center"
      style={{
        boxShadow: '0 2px 12px rgba(139, 115, 85, 0.08), 0 1px 3px rgba(139, 115, 85, 0.05)',
      }}
    >
      <span className="text-4xl mb-2 drop-shadow-sm">{dish.emoji}</span>
      <h3 className="font-bold text-sm mb-1" style={{ color: '#4A3228' }}>{dish.name}</h3>
      <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: '#A08060' }}>
        {dish.description}
      </p>

      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onAdd(dish)}
            className="px-6 py-2 rounded-full text-sm font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
              boxShadow: '0 3px 12px rgba(255, 107, 107, 0.35)',
            }}
          >
            加入
          </motion.button>
        ) : (
          <motion.div
            key="qty-ctrl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onRemove(dish.id)}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
              style={{
                background: '#FFF0ED',
                color: '#E8574A',
                boxShadow: '0 2px 6px rgba(232, 87, 74, 0.15)',
              }}
            >
              −
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="font-bold w-5 text-center text-base"
              style={{ color: '#4A3228' }}
            >
              {quantity}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onAdd(dish)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
              }}
            >
              +
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
