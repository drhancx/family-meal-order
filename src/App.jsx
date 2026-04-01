import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import WelcomePage from './components/WelcomePage'
import MenuPage from './components/MenuPage'
import OrderPage from './components/OrderPage'
import MenuManager from './components/MenuManager'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/manager" element={<MenuManager />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFF8F0',
            color: '#4A3728',
            borderRadius: '12px',
            border: '1px solid #FFB4B4',
          },
        }}
      />
      <AnimatedRoutes />
    </HashRouter>
  )
}
