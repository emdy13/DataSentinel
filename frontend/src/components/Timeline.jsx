import React from 'react'
import { CheckCircle2, AlertTriangle, FileUp, Shield, Activity, Play } from 'lucide-react'

/**
 * Composant de suivi chronologique (Audit Trail / Historique)
 * @param {Array} events Liste des événements de l'historique
 */
export default function Timeline({ events, onStartDemoMode }) {
  const getIcon = (type) => {
    switch (type) {
      case 'upload':
        return <FileUp size={16} className="text-[#1A73E8]" />
      case 'alert':
        return <AlertTriangle size={16} className="text-[#D93025]" />
      case 'resolve':
        return <CheckCircle2 size={16} className="text-[#1E8E3E]" />
      case 'system':
      default:
        return <Shield size={16} className="text-[#0D47A1]" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'upload': return 'bg-[#E8F0FE]'
      case 'alert': return 'bg-[#FCE8E6]'
      case 'resolve': return 'bg-[#E6F4EA]'
      case 'system':
      default:
        return 'bg-[#E8F0FE]'
    }
  }

  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#202124]">Historique & Piste d'Audit</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">
            Suivi chronologique des téléversements de fichiers, des alertes levées et des résolutions
          </p>
        </div>
        <button
          onClick={onStartDemoMode}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Play size={11} fill="currentColor" />
          Simuler un jeu d'essai
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6 border-b border-[#F1F3F4] pb-4">
          <Activity size={18} className="text-[#1A73E8]" />
          <h2 className="text-sm font-semibold text-[#202124]">Rapports de conformité en temps réel</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-[#5F6368] text-sm">
            Aucun événement enregistré dans l'historique d'audit.
          </div>
        ) : (
          <div className="relative border-l border-[#DADCE0] ml-4 pl-8 space-y-8 py-2">
            {events.map((event) => (
              <div key={event.id} className="relative group">
                {/* Point de la timeline avec icône */}
                <div className={`absolute -left-[44px] top-1 p-2 rounded-full border border-white shadow-sm flex items-center justify-center ${getBgColor(event.type)}`}>
                  {getIcon(event.type)}
                </div>

                {/* Contenu de l'événement */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white border border-[#DADCE0] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] bg-[#F1F3F4] px-2 py-0.5 rounded">
                        {event.category || 'Système'}
                      </span>
                      <span className="text-xs text-[#9AA0A6]">{event.time}</span>
                    </div>
                    <p className="text-sm font-medium text-[#202124]">{event.title}</p>
                    <p className="text-xs text-[#5F6368]">{event.description}</p>
                  </div>

                  {event.details && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#E8F0FE] text-[#1A73E8]">
                        {event.details}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
