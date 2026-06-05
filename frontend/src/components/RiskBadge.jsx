/** Composant badge de risque réutilisable — affiché partout dans l'app */
export default function RiskBadge({ level, score }) {
  const config = {
    low:      { bg: '#E6F4EA', text: '#1E8E3E', label: 'Faible',    dot: '#1E8E3E' },
    medium:   { bg: '#FEF7E0', text: '#F9AB00', label: 'Modéré',    dot: '#F9AB00' },
    high:     { bg: '#FCE8E6', text: '#D93025', label: 'Élevé',     dot: '#D93025' },
    critical: { bg: '#F5C6C3', text: '#A50E0E', label: 'Critique',  dot: '#A50E0E' },
  }
  const c = config[level] || config.low
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-500"
      style={{ backgroundColor: c.bg, color: c.text, fontWeight: 500 }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {c.label}
      {score !== undefined && <span className="ml-1 font-semibold">{score}/100</span>}
    </span>
  )
}
