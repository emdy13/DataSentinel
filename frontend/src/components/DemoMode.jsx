import React, { useState } from 'react'
import { Play, X, ArrowRight, Check, Shield, RefreshCw } from 'lucide-react'

export default function DemoMode({
  isOpen,
  onClose,
  setActiveTab,
  onAddDemoFile,
  onResolveDemoAlert,
  onTriggerAIChat,
  onResetDemoState
}) {
  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      title: "1. Chargement & Analyse automatisée",
      description: "Découvrez la détection de données sensibles en temps réel. Nous allons simuler le chargement d'un fichier client ('base_clients_dakarlab.csv') contenant des numéros Wave, des CNI sénégalaises et des adresses email non chiffrées.",
      actionLabel: "Simuler l'ingestion",
      action: () => {
        onAddDemoFile()
        setActiveTab('upload')
        setStep(1)
      }
    },
    {
      title: "2. Tableau de bord & Cartographie des risques",
      description: "Le score d'exposition global a grimpé à 91/100 (niveau CRITIQUE). Voyons le tableau de bord avec les indicateurs mis à jour et la répartition des alertes.",
      actionLabel: "Consulter le Tableau de bord",
      action: () => {
        setActiveTab('dashboard')
        setStep(2)
      }
    },
    {
      title: "3. Diagnostic réglementaire (Loi CDP)",
      description: "DataSentinel audite la conformité par rapport à la loi sénégalaise n° 2008-12. Utilisons l'assistant IA intégré pour obtenir des recommandations et planifier nos actions prioritaires.",
      actionLabel: "Solliciter l'IA de conformité",
      action: () => {
        onTriggerAIChat("Quelles sont mes obligations légales sous la loi 2008-12 pour ces données ?")
        setStep(3)
      }
    },
    {
      title: "4. Remédiation & Sécurisation active",
      description: "Appliquez une mesure corrective. En résolvant l'alerte sur les données critiques, la plateforme applique un chiffrement virtuel/masquage et le score global de risque diminue immédiatement.",
      actionLabel: "Appliquer la remédiation",
      action: () => {
        onResolveDemoAlert(1)
        setStep(4)
      }
    },
    {
      title: "5. Production du Rapport d'Audit CDP",
      description: "Accédez à l'onglet Conformité CDP pour visualiser la pré-déclaration officielle requise par la Commission de Protection des Données Personnelles du Sénégal.",
      actionLabel: "Aller au Rapport CDP",
      action: () => {
        setActiveTab('cdp_report')
        setStep(5)
      }
    }
  ]

  const current = steps[step]

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden fade-in">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-blue-400" />
          <span className="font-semibold text-sm">Guide d'Évaluation Interactif</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white">
          <X size={15} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {step < 5 ? (
          <>
            <div className="space-y-2">
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                Étape {step + 1} sur 5
              </span>
              <h3 className="font-semibold text-sm text-slate-100">{current.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  onResetDemoState()
                  setStep(0)
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={11} />
                Réinitialiser
              </button>
              <button
                onClick={current.action}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-md transition-colors"
              >
                <span>{current.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mx-auto text-white">
              <Check size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-100">Parcours d'évaluation terminé !</h3>
              <p className="text-xs text-slate-300">
                Vous avez exploré tout le cycle produit : ingestion de fichiers, analyse d'exposition, audit de conformité sénégalaise (CDP), remédiation active et rapport de pré-déclaration.
              </p>
            </div>
            <div className="pt-2 flex gap-2 justify-center">
              <button
                onClick={() => {
                  onResetDemoState()
                  setStep(0)
                }}
                className="px-3 py-1.5 rounded border border-slate-700 text-xs font-medium hover:bg-slate-800 text-white"
              >
                Recommencer
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-[#1A73E8] text-xs font-semibold hover:bg-[#1557B0] text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
