import { motion, AnimatePresence } from 'framer-motion'

export default function CartBar({ cartItems, totalCount, onSubmit }) {
  return (
    <AnimatePresence>
      {totalCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: 'rgba(255, 252, 248, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 -4px 24px rgba(139, 115, 85, 0.1)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span
                className="text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                  boxShadow: '0 2px 6px rgba(255, 107, 107, 0.3)',
                }}
              >
                {totalCount}
              </span>
              <span className="text-sm" style={{ color: '#8B7355' }}>
                已选 <b style={{ color: '#5D3E2E' }}>{cartItems.length}</b> 道菜
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              className="px-7 py-2.5 rounded-full text-white font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
                boxShadow: '0 4px 16px rgba(255, 107, 107, 0.35)',
              }}
            >
              提交今日菜单
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
