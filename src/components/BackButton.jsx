import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => navigate('/')}
      className="w-10 h-10 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
      style={{
        background: 'rgba(93, 62, 46, 0.08)',
        color: '#5D3E2E',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </motion.button>
  )
}
