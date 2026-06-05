import { useMemo } from 'react'
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react'

/**
 * RiskRadar — Radar chart SVG pur (aucune dépendance externe)
 * Visualise les 6 dimensions de risque cyber de l'entreprise.
 */

const DIMENSIONS = [
  { key: 'dataExposure',   label: 'Exposition Données',  maxLabel: 'PII exposées' },
  { key: 'breachRisk',     label: 'Risque Fuite',        maxLabel: 'Emails compromis' },
  { key: 'compliance',     label: 'Conformité CDP',      maxLabel: 'Non-déclaration' },
  { key: 'infrastructure', label: 'Infrastructure',      maxLabel: 'CVE actives' },
  { key: 'darkWeb',        label: 'Dark Web',            maxLabel: 'Mentions détectées' },
  { key: 'humanFactor',    label: 'Facteur Humain',      maxLabel: 'Phishing potentiel' },
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

function buildPolygonPoints(cx, cy, radius, values, count) {
  return values
    .map((v, i) => {
      const angle = (360 / count) * i
      const r = (v / 100) * radius
      const { x, y } = polarToCartesian(cx, cy, r, angle)
      return `${x},${y}`
    })
    .join(' ')
}

function RadarChart({ values, size = 300 }) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const count = DIMENSIONS.length
  const rings = [0.25, 0.5, 0.75, 1.0]

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] mx-auto">
      {/* Background rings */}
      {rings.map((scale, i) => {
        const r = radius * scale
        const pts = Array.from({ length: count }, (_, j) => {
          const angle = (360 / count) * j
          const { x, y } = polarToCartesian(cx, cy, r, angle)
          return `${x},${y}`
        }).join(' ')
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={i === rings.length - 1 ? 1.5 : 0.8}
            strokeDasharray={i < rings.length - 1 ? '3,3' : 'none'}
          />
        )
      })}

      {/* Axis lines + labels */}
      {DIMENSIONS.map((dim, i) => {
        const angle = (360 / count) * i
        const end = polarToCartesian(cx, cy, radius, angle)
        const labelPos = polarToCartesian(cx, cy, radius + 24, angle)
        return (
          <g key={dim.key}>
            <line
              x1={cx} y1={cy}
              x2={end.x} y2={end.y}
              stroke="#D1D5DB"
              strokeWidth={0.6}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] font-semibold"
              fill="#5F6368"
            >
              {dim.label}
            </text>
          </g>
        )
      })}

      {/* Data polygon */}
      <polygon
        points={buildPolygonPoints(cx, cy, radius, values, count)}
        fill="rgba(26, 115, 232, 0.15)"
        stroke="#1A73E8"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {values.map((v, i) => {
        const angle = (360 / count) * i
        const r = (v / 100) * radius
        const { x, y } = polarToCartesian(cx, cy, r, angle)
        const color = v >= 70 ? '#D93025' : v >= 40 ? '#F9AB00' : '#1E8E3E'
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={color} stroke="white" strokeWidth={2} />
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              className="text-[9px] font-bold"
              fill={color}
            >
              {v}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function RiskRadar({ docs, patchedCVEs = [], resolvedAlerts = [], globalScore }) {
  const scores = useMemo(() => {
    // 1. Exposition des données (basé sur le volume PII)
    const totalPII = docs.reduce((acc, d) => {
      const f = d.detectedFields
      return acc + (f.emails || 0) + (f.phones || 0) + (f.banking || 0) + (f.identity || 0) + (f.ninea || 0) + (f.waveMoney || 0)
    }, 0)
    const dataExposure = Math.min(100, Math.round((totalPII / 100) * 1.2))

    // 2. Risque de fuite (emails compromis ratio)
    const totalEmails = docs.reduce((acc, d) => acc + (d.detectedFields.emails || 0), 0)
    const uniqueEmails = []
    docs.forEach(d => {
      if (d.uniqueEmails) d.uniqueEmails.forEach(e => { if (!uniqueEmails.includes(e)) uniqueEmails.push(e) })
    })
    const compromisedCount = uniqueEmails.filter(e => {
      const el = e.toLowerCase()
      return el.includes('diop') || el.includes('sarr') || el.includes('cisse') || el.includes('ndiaye') ||
             el.includes('contact@') || el.includes('admin@') || el.includes('directeur@')
    }).length
    const breachRisk = uniqueEmails.length > 0
      ? Math.min(100, Math.round((compromisedCount / uniqueEmails.length) * 100) + 15)
      : 10

    // 3. Conformité CDP (NINEA + CNI non déclarés = risque élevé)
    const totalNinea = docs.reduce((a, d) => a + (d.detectedFields.ninea || 0), 0)
    const totalIdentity = docs.reduce((a, d) => a + (d.detectedFields.identity || 0), 0)
    const compliance = Math.min(100, Math.round(((totalNinea + totalIdentity) / 50) * 30) + 20)

    // 4. Infrastructure (CVE)
    const activeCVECount = 5 - patchedCVEs.length // 5 CVE total dans la base mock
    const infrastructure = Math.min(100, activeCVECount * 22)

    // 5. Dark Web
    const activeDarkWeb = 3 - resolvedAlerts.filter(id => typeof id === 'string' && id.startsWith('dark-')).length
    const darkWeb = Math.min(100, activeDarkWeb * 30)

    // 6. Facteur humain (basé sur emails + données bancaires exposées)
    const totalBanking = docs.reduce((a, d) => a + (d.detectedFields.banking || 0) + (d.detectedFields.waveMoney || 0), 0)
    const humanFactor = Math.min(100, Math.round(((totalEmails + totalBanking) / 100) * 5) + 10)

    return [dataExposure, breachRisk, compliance, infrastructure, darkWeb, humanFactor]
  }, [docs, patchedCVEs, resolvedAlerts])

  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const maxDimIdx = scores.indexOf(Math.max(...scores))
  const minDimIdx = scores.indexOf(Math.min(...scores))

  return (
    <div className="bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Shield size={18} className="text-[#0D47A1]" />
        <h2 className="text-sm font-semibold text-[#202124]">Radar de Risque Multi-Dimensionnel</h2>
      </div>
      <p className="text-xs text-[#5F6368] mb-4">
        Évaluation en temps réel de 6 vecteurs de menace pour votre organisation.
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Chart */}
        <div className="flex-1 w-full md:max-w-[380px]">
          <RadarChart values={scores} size={300} />
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3 w-full">
          {DIMENSIONS.map((dim, i) => {
            const val = scores[i]
            const color = val >= 70 ? '#D93025' : val >= 40 ? '#F9AB00' : '#1E8E3E'
            const bgColor = val >= 70 ? '#FEE2E2' : val >= 40 ? '#FEF3C7' : '#D1FAE5'
            const labelColor = val >= 70 ? '#991B1B' : val >= 40 ? '#92400E' : '#065F46'
            return (
              <div key={dim.key} className="flex items-center gap-3">
                <div className="w-28 text-xs font-medium text-[#5F6368] flex-shrink-0">
                  {dim.label}
                </div>
                <div className="flex-1 h-2.5 bg-[#F1F3F4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${val}%`, backgroundColor: color }}
                  />
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold flex-shrink-0"
                  style={{ backgroundColor: bgColor, color: labelColor }}
                >
                  {val}/100
                </span>
              </div>
            )
          })}

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-[#F1F3F4] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#202124]">Score moyen radar</span>
              <span className={`text-sm font-bold ${avgScore >= 60 ? 'text-[#D93025]' : avgScore >= 35 ? 'text-[#F9AB00]' : 'text-[#1E8E3E]'}`}>
                {avgScore}/100
              </span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertTriangle size={13} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-800 leading-relaxed">
                <span className="font-bold">Point critique :</span> {DIMENSIONS[maxDimIdx].label} ({scores[maxDimIdx]}/100).
                {' '}Priorisez les actions correctives sur ce vecteur.
              </p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <TrendingUp size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <span className="font-bold">Point fort :</span> {DIMENSIONS[minDimIdx].label} ({scores[minDimIdx]}/100).
                {' '}Continuez à maintenir ce niveau de sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
