import React from 'react'

/**
 * Composant Heatmap (Carte de chaleur)
 * Affiche l'intensité des risques détectés par colonne dans un fichier
 * @param {Object} columnHeatmap Données de la heatmap issue de fileAnalyzer
 */
export default function Heatmap({ columnHeatmap }) {
  if (!columnHeatmap || Object.keys(columnHeatmap).length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 text-xs rounded-lg text-center">
        Aucune donnée de colonne disponible pour générer la carte de chaleur.
      </div>
    )
  }

  const categories = [
    { key: 'emails', label: 'Emails', color: 'bg-red-500', text: 'text-red-700' },
    { key: 'phones', label: 'Téléphones', color: 'bg-blue-500', text: 'text-blue-700' },
    { key: 'waveMoney', label: 'Mobile Money (Wave/OM)', color: 'bg-amber-500', text: 'text-amber-700' },
    { key: 'banking', label: 'Données Bancaires', color: 'bg-rose-600', text: 'text-rose-900' },
    { key: 'identity', label: 'Identité / CNI', color: 'bg-purple-500', text: 'text-purple-700' },
    { key: 'ninea', label: 'NINEA', color: 'bg-emerald-500', text: 'text-emerald-700' },
  ]

  const columns = Object.keys(columnHeatmap).slice(0, 8) // Limiter à 8 colonnes pour l'affichage

  // Déterminer la couleur de la cellule selon le nombre d'éléments détectés
  const getCellBg = (count) => {
    if (count === 0) return 'bg-[#F8FAFF] border-gray-100'
    if (count < 5) return 'bg-orange-100 border-orange-200 text-orange-800'
    if (count < 50) return 'bg-orange-300 border-orange-400 text-orange-950 font-medium'
    return 'bg-red-500 text-white border-red-600 font-bold'
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
          Carte de chaleur des risques par colonne (Heatmap)
        </h4>
        <div className="flex items-center gap-4 text-[10px] text-[#5F6368]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-[#F8FAFF] border border-gray-200 rounded" />
            <span>Sain</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-orange-100 border border-orange-200 rounded" />
            <span>Faible risque</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-orange-300 border border-orange-400 rounded" />
            <span>Risque moyen</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-red-500 rounded" />
            <span>Risque critique</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#DADCE0] rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#F1F3F4] border-b border-[#DADCE0]">
              <th className="py-2.5 px-3 text-left font-semibold text-[#5F6368] border-r border-[#DADCE0] w-48">
                Type de Donnée
              </th>
              {columns.map(col => (
                <th key={col} className="py-2.5 px-3 text-center font-semibold text-[#5F6368] truncate max-w-[120px] border-r border-[#DADCE0] last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.key} className="border-b border-[#DADCE0] last:border-b-0">
                <td className="py-2.5 px-3 font-medium text-[#202124] bg-white border-r border-[#DADCE0] flex items-center gap-2">
                  <span className={`w-1.5 h-3 rounded ${cat.color}`} />
                  {cat.label}
                </td>
                {columns.map(col => {
                  const count = columnHeatmap[col]?.[cat.key] || 0
                  return (
                    <td
                      key={col}
                      className={`py-2.5 px-3 text-center border-r border-[#DADCE0] last:border-r-0 transition-colors ${getCellBg(count)}`}
                    >
                      {count > 0 ? count.toLocaleString('fr-FR') : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Object.keys(columnHeatmap).length > 8 && (
        <p className="text-[10px] text-[#5F6368] italic">
          * Affichage limité aux 8 premières colonnes détectées pour la lisibilité.
        </p>
      )}
    </div>
  )
}
