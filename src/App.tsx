import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MobileBar } from './components/MobileBar'
import { ModeProvider } from './lib/mode'
import { Book } from './pages/Book'
import { Home } from './pages/Home'
import { MenuPage } from './pages/Menu'
import { PrivateHire } from './pages/PrivateHire'

const TITLES: Record<string, string> = {
  '/': "Archie's Herne Hill · All-day Latin American dining",
  '/menu': "Menus · Archie's Herne Hill",
  '/private-hire': "Private hire · Archie's Herne Hill",
  '/book': "Book a table · Archie's Herne Hill",
}

function useScrollManagement() {
  const loc = useLocation()
  useEffect(() => {
    const target = (loc.state as { scrollTo?: string } | null)?.scrollTo
    document.title = TITLES[loc.pathname] ?? TITLES['/']
    if (target) {
      const t = window.setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 380)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [loc.pathname, loc.key, loc.state])
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ModeProvider>
        <Shell />
      </ModeProvider>
    </MotionConfig>
  )
}

function Shell() {
  const loc = useLocation()
  useScrollManagement()
  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          tabIndex={-1}
          key={loc.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/private-hire" element={<PrivateHire />} />
            <Route path="/book" element={<Book key={loc.key} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileBar />
    </>
  )
}
