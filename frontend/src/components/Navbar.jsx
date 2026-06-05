import { useState } from 'react'
import { Shield, Bell, LayoutDashboard, FileText, Database, History, ShieldAlert, Crosshair, Radar, Scale, Check, HelpCircle } from 'lucide-react'

/** Barre de navigation principale avec onglets */
export default function Navbar({ activeTab, setActiveTab, activeAlerts = [], onResolveAlert, onStartDemoMode }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const tabs = [
    { id: 'dashboard',    label: 'Tableau de bord',       icon: LayoutDashboard },
    { id: 'upload',       label: 'Documents',             icon: FileText },
    { id: 'data',         label: 'Données sensibles',     icon: Database },
    { id: 'threat_intel', label: 'Intelligence Menaces',  icon: ShieldAlert },
    { id: 'phishing',     label: 'Spear-Phishing',       icon: Crosshair },
    { id: 'cdp_report',   label: 'Conformité CDP',       icon: Scale },
    { id: 'timeline',     label: 'Historique / Audit',    icon: History },
  ]

  return (
    <header className="bg-white border-b border-[#DADCE0] h-16 flex items-center px-6 gap-8 sticky top-0 z-50 animate-fade-in"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Shield size={22} color="#1A73E8" strokeWidth={2.5} />
        <span className="text-lg font-semibold text-[#0D47A1] tracking-tight">
          Data<span className="text-[#1A73E8]">Sentinel</span>
        </span>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-1 flex-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 h-16 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === id ? '#1A73E8' : '#5F6368',
              borderBottom: activeTab === id ? '2px solid #1A73E8' : '2px solid transparent',
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onStartDemoMode}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DADCE0] hover:bg-[#F1F3F4] text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <HelpCircle size={13} className="text-slate-500" />
          Guide d'évaluation
        </button>

        {/* Cloche de notifications avec menu déroulant */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-full hover:bg-[#F1F3F4] transition-colors"
          >
            <Bell size={18} color="#5F6368" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D93025] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              {/* Overlay pour fermer au clic à l'extérieur */}
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-96 bg-white border border-[#DADCE0] rounded-xl shadow-xl z-50 overflow-hidden text-slate-800">
                {/* En-tête */}
                <div className="px-4 py-3 border-b border-[#DADCE0] bg-[#F8FAFF] flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#0D47A1]">Alertes Actives ({activeAlerts.length})</span>
                  {activeAlerts.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#FAD2E1] text-[#7A0C2E] rounded text-[10px] font-bold uppercase">
                      Attention
                    </span>
                  )}
                </div>

                {/* Liste des notifications */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {activeAlerts.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      Aucune alerte active détectée.
                    </div>
                  ) : (
                    activeAlerts.map(alert => (
                      <div key={alert.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5 items-start text-xs">
                        {/* Indicateur de sévérité */}
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          alert.severity === 'critical' ? 'bg-[#D93025]' :
                          alert.severity === 'high' ? 'bg-[#F2994A]' : 'bg-[#1A73E8]'
                        }`} />

                        {/* Détails de l'alerte */}
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 text-[11px] leading-relaxed">{alert.message}</p>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                            <span>{alert.time}</span>
                            <button
                              onClick={() => {
                                onResolveAlert(alert.id)
                              }}
                              className="text-[#1A73E8] hover:text-[#0D47A1] hover:underline font-semibold flex items-center gap-0.5"
                            >
                              <Check size={10} strokeWidth={2.5} />
                              Résoudre
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">PM</span>
        </div>
      </div>
    </header>
  )
}
