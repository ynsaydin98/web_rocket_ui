export type TabKey = 'home' | 'charts' | 'command'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Ana Sayfa' },
  { key: 'charts', label: 'Grafikler' },
  { key: 'command', label: 'Komut & Sekans' },
]

interface Props {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export default function Tabs({ active, onChange }: Props) {
  return (
    <nav className="tabs" role="tablist">
      {TABS.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={t.key === active}
          className={`tab${t.key === active ? ' active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
