import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/orbitron/latin-400.css'
import '@fontsource/orbitron/latin-600.css'
import '@fontsource/orbitron/latin-700.css'
import '@fontsource/orbitron/latin-900.css'
import '@fontsource/space-mono/latin-400.css'
import '@fontsource/space-mono/latin-700.css'
import '@fontsource/press-start-2p/latin-400.css'
import '@fontsource/vt323/latin-400.css'
import '@fontsource/rajdhani/latin-300.css'
import '@fontsource/rajdhani/latin-500.css'
import '@fontsource/rajdhani/latin-600.css'
import '@fontsource/rajdhani/latin-700.css'
import './styles/main.scss'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
