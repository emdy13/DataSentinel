import { Mail, Phone, CreditCard, Fingerprint, Building2, Wallet } from 'lucide-react'
import RiskBadge from './RiskBadge'

const FIELD_CONFIG = {
  emails:    { label: 'Adresses email',             icon: Mail,        risk: 'high',     rec: 'Pseudonymiser ou masquer le domaine' },
  phones:    { label: 'Numéros de téléphone',       icon: Phone,       risk: 'medium',   rec: 'Masquer les 4 derniers chiffres' },
  waveMoney: { label: 'Mobile Money (Wave/OM)',     icon: Wallet,      risk: 'high',     rec: 'Masquer les numéros de comptes et transactionnels' },
  banking:   { label: 'Données bancaires',          icon: CreditCard,  risk: 'critical', rec: 'Tokeniser — conformité CDP sénégalaise requise' },
  identity:  { label: 'Identité / CNI',             icon: Fingerprint, risk: 'critical', rec: 'Chiffrer AES-256 obligatoire (Loi 2008-12)' },
  ninea:     { label: 'Numéros NINEA',              icon: Building2,   risk: 'high',     rec: 'Accès restreint aux seuls administrateurs' },
}

/** Carte de synthèse par type de donnée */
function TypeCard({ fieldKey, total, fileCount }) {
  const cfg = FIELD_CONFIG[fieldKey]
  if (!cfg) return null
  const Icon = cfg.icon

  return (
    <div className="card flex flex-col gap-3 bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded bg-[#E8F0FE]">
          <Icon size={16} className="text-[#1A73E8]" />
        </div>
        <span className="text-sm font-semibold text-[#202124]">{cfg.label}</span>
      </div>
      <div className="text-2xl font-bold text-[#202124]">{total.toLocaleString('fr-FR')}</div>
      <div className="flex items-center justify-between">
        <RiskBadge level={cfg.risk} />
        <span className="text-xs text-[#5F6368]">dans {fileCount} fichier{fileCount > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

/** Page des données sensibles détectées */
export default function SensitiveDataPanel({ docs }) {
  // Calcul des totaux par type
  const totals = {}
  const fileCounts = {}
  
  Object.keys(FIELD_CONFIG).forEach(k => {
    totals[k] = docs.reduce((sum, d) => sum + (d.detectedFields[k] || 0), 0)
    fileCounts[k] = docs.filter(d => d.detectedFields[k] > 0).length
  })

  // Rows pour le tableau détaillé
  const rows = []
  docs.forEach(doc => {
    Object.keys(FIELD_CONFIG).forEach(k => {
      if (doc.detectedFields[k] > 0) {
        rows.push({ doc, fieldKey: k, count: doc.detectedFields[k] })
      }
    })
  })

  return (
    <div className="p-6 space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-semibold text-[#202124]">Données sensibles détectées</h1>
        <p className="text-sm text-[#5F6368] mt-0.5">
          Synthèse des informations personnelles identifiées dans vos documents analysés
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.keys(FIELD_CONFIG).map(k => (
          <TypeCard key={k} fieldKey={k} total={totals[k]} fileCount={fileCounts[k]} />
        ))}
      </div>

      {/* Detailed table */}
      <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[#202124] mb-4">Détail par document et catégorie</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#DADCE0]">
                {['Catégorie','Fichier source','Nombre détecté','Niveau de risque','Recommandation'].map(h => (
                  <th key={h} className="text-left py-3 pr-4 text-xs font-semibold text-[#5F6368] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-xs text-[#5F6368]">
                    Aucune donnée sensible détectée.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => {
                  const cfg = FIELD_CONFIG[row.fieldKey]
                  if (!cfg) return null
                  const Icon = cfg.icon
                  return (
                    <tr key={i} className="border-b border-[#F1F3F4] hover:bg-[#F8FAFF] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-[#1A73E8]" />
                          <span className="text-[#202124] font-medium">{cfg.label}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#E8F0FE] text-[#1A73E8]">
                          {row.doc.name}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="font-bold" style={{
                          color: row.count > 100 ? '#D93025' : row.count > 20 ? '#F9AB00' : '#1E8E3E'
                        }}>
                          {row.count.toLocaleString('fr-FR')}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <RiskBadge level={cfg.risk} />
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#5F6368]">{cfg.rec}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
