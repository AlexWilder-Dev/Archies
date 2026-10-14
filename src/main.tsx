import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/comfortaa/latin-300.css'
import '@fontsource/comfortaa/latin-700.css'
import '@fontsource/alegreya-sans/latin-400.css'
import '@fontsource/alegreya-sans/latin-400-italic.css'
import '@fontsource/alegreya-sans/latin-500.css'
import '@fontsource/alegreya-sans/latin-700.css'
import '@fontsource/alegreya-sans/latin-900.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/menu.css'
import './styles/hire.css'
import './styles/book.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </StrictMode>,
)
