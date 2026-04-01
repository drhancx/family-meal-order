import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrdersGroupedByDate, formatDate } from '../utils/orderUtils'
import { getRandomQuote } from '../data/quotes'
import BackButton from './BackButton'

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export default function OrderPage() {
  const navigate = useNavigate()
  const [groupedOrders, setGroupedOrders] = useState({})
  const quote = getRandomQuote()

  useEffect(() => {
    setGroupedOrders(getOrdersGroupedByDate())
  }, [])

  const dates = Object.keys(groupedOrders).sort((a, b) => b.localeCompare(a))
  const isEmpty = dates.length === 0

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
      className="min-h-screen"
      style={{ background: '#FFF8F0' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40" style={{ background: 'rgba(255,248,240,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <h1 className="text-lg font-bold" style={{ color: '#4A3228' }}>订单记录</h1>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center pt-32 px-6">
          <span className="text-6xl mb-4">📝</span>
          <p className="text-center" style={{ color: '#A08060' }}>还没有订单记录哦~</p>
          <p className="text-center text-sm mt-1" style={{ color: '#B8A080' }}>快去点几道菜吧 🍽️</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="mt-6 px-8 py-3 rounded-full text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #FF9A5C, #FF6B6B)',
              boxShadow: '0 4px 16px rgba(255, 107, 107, 0.35)',
            }}
          >
            去点菜
          </motion.button>
        </div>
      )}

      {/* Orders grouped by date */}
      <div className="px-4 pb-8">
        {dates.map((date) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-bold mb-3 pl-1" style={{ color: '#8B7355' }}>
              📅 {formatDate(date)}
            </h2>

            {groupedOrders[date].map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 mb-3"
                style={{ boxShadow: '0 2px 12px rgba(139, 115, 85, 0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs" style={{ color: '#A08060' }}>
                    🕐 {order.time}
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#FF6B6B' }}>
                    共 {order.totalCount} 道菜
                  </span>
                </div>

                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span style={{ color: '#5D3E2E' }}>
                        {item.emoji} {item.name}
                      </span>
                      <span style={{ color: '#A08060' }}>× {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom quote */}
      {!isEmpty && (
        <div className="text-center pb-8 px-6">
          <p className="text-sm" style={{ color: '#B08968' }}>{quote}</p>
        </div>
      )}
    </motion.div>
  )
}
