import { motion, AnimatePresence } from 'framer-motion'

export default function DishCard({ dish, quantity, onAdd, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-3 flex flex-col items-center text-center"
      style={{
        boxShadow: '0 2px 12px rgba(139, 115, 85, 0.08), 0 1px 3px rgba(139, 115, 85, 0.05)',
      }}
    >
      <span className="text-3xl mb-1.5 drop-shadow-sm">{dish.emoji}</span>
      <h3 className="font-bold text-xs mb-0.5" style={{ color: '#4A3228' }}>{dish.name}</h3>
      <p className="text-[10px] line-clamp-2 mb-2 leading-relaxed" style={{ color: '#A08060' }}>
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
            className="px-4 py-1 rounded-full text-xs font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
              boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
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
            className="flex items-center gap-2.5"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onRemove(dish.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: '#FFF0ED',
                color: '#E8574A',
                boxShadow: '0 1px 4px rgba(232, 87, 74, 0.15)',
              }}
            >
              −
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="font-bold w-4 text-center text-sm"
              style={{ color: '#4A3228' }}
            >
              {quantity}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onAdd(dish)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                boxShadow: '0 1px 6px rgba(255, 107, 107, 0.3)',
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
