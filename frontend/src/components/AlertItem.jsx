/** Composant ligne d'alerte de sécurité */
export default function AlertItem({ alert, onResolve, resolved }) {
  const colors = {
    critical: '#A50E0E',
    high:     '#D93025',
    medium:   '#F9AB00',
    low:      '#1E8E3E',
  }
  const labels = {
    critical: 'Critique',
    high:     'Élevé',
    medium:   'Modéré',
    low:      'Faible',
  }
  const color = colors[alert.severity] || colors.low

  return (
    <div className={`flex items-start gap-3 py-3 border-b border-[#DADCE0] last:border-0 ${resolved ? 'opacity-60' : ''}`}>
      <div className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: resolved ? '#1E8E3E' : color }} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${resolved ? 'line-through text-[#5F6368]' : 'text-[#202124]'}`}>{alert.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: '#E8F0FE', color: '#1A73E8', fontWeight: 500 }}
          >
            {alert.file}
          </span>
          <span className="text-xs text-[#5F6368]">{alert.time}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ color: resolved ? '#1E8E3E' : color, backgroundColor: resolved ? '#E6F4EA' : color + '15', fontWeight: 500 }}
        >
          {resolved ? 'Résolu' : labels[alert.severity]}
        </span>
        {!resolved && onResolve && alert.type !== 'cve' && (
          <button
            onClick={() => onResolve(alert.id)}
            className="text-xs px-2.5 py-1 font-semibold border border-[#1A73E8] text-[#1A73E8] rounded hover:bg-[#E8F0FE] transition-colors"
          >
            Corriger
          </button>
        )}
      </div>
    </div>
  )
}
