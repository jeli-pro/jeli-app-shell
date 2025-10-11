import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AppShellProvider } from './context/AppShellContext'
import { useAppStore } from './store/appStore'
import './index.css'

function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AppShellProvider>
        <AppShell />
      </AppShellProvider>
    </div>
  )
}

export default App