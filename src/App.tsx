import { useState } from 'react'
import TopBar from './components/layout/TopBar'
import Tabs, { type TabKey } from './components/layout/Tabs'
import HomePage from './features/home/HomePage'
import ChartsPage from './features/charts/ChartsPage'
import CommandPage from './features/command/CommandPage'

export default function App() {
  const [tab, setTab] = useState<TabKey>('home')

  return (
    <div className="app">
      <TopBar />
      <Tabs active={tab} onChange={setTab} />
      <main className="content">
        {tab === 'home' && <HomePage />}
        {tab === 'charts' && <ChartsPage />}
        {tab === 'command' && <CommandPage />}
      </main>
    </div>
  )
}
