import React, { useState } from 'react'
import { ShieldAlert, Globe, Server, Check, Search, AlertCircle, RefreshCw } from 'lucide-react'
import { MOCK_CVE_DATABASE, MOCK_DARK_WEB_ALERTS, MOCK_BREACH_SOURCES } from '../data/mockData'
import RiskBadge from './RiskBadge'

export default function ThreatIntelPanel({
  techStack,
  setTechStack,
  patchedCVEs,
  onPatchCVE,
  docs,
  onAddTimelineEvent
}) {
  const [subTab, setSubTab] = useState('breach') // 'breach' | 'darkweb' | 'cve'
  const [selectedTech, setSelectedTech] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')

  // Stack technologique disponible à l'ajout
  const AVAILABLE_TECH = [
    { name: 'WordPress', versions: ['6.2', '6.5'] },
    { name: 'WooCommerce', versions: ['7.4', '8.2'] },
    { name: 'phpMyAdmin', versions: ['5.1', '5.2'] },
    { name: 'Apache HTTP Server', versions: ['2.4.49', '2.4.52'] },
  ]

  // Ajouter une technologie déclarée
  const handleAddTech = () => {
    if (!selectedTech || !selectedVersion) return

    // Vérifier si déjà présent
    if (techStack.some(t => t.name === selectedTech)) {
      alert("Cette technologie est déjà déclarée.")
      return
    }

    const newTech = { name: selectedTech, version: selectedVersion }
    setTechStack(prev => [...prev, newTech])

    // Ajouter à la timeline
    onAddTimelineEvent({
      id: Date.now(),
      type: 'system',
      category: 'Déclaration',
      time: 'À l\'instant',
      title: `Stack modifiée : ${selectedTech} ${selectedVersion} ajouté`,
      description: `Déclaration manuelle effectuée par l\'administrateur pour audit CVE.`,
      details: 'Stack mis à jour'
    })

    // Vérifier si cette technologie a des vulnérabilités associées dans notre base
    const hasCVEs = MOCK_CVE_DATABASE.some(cve => cve.tech === selectedTech && cve.version === selectedVersion)
    if (hasCVEs) {
      onAddTimelineEvent({
        id: Date.now() + 1,
        type: 'alert',
        category: 'Sécurité',
        time: 'À l\'instant',
        title: `Vulnérabilités détectées sur ${selectedTech} ${selectedVersion}`,
        description: `Une ou plusieurs CVE actives ont été identifiées.`,
        details: 'RISQUE ÉLEVÉ'
      })
    }

    setSelectedTech('')
    setSelectedVersion('')
  }

  // Supprimer une technologie
  const handleRemoveTech = (name) => {
    setTechStack(prev => prev.filter(t => t.name !== name))
  }

  // Filtrer les CVE actives pour la stack déclarée
  const getActiveCVEs = () => {
    return MOCK_CVE_DATABASE.filter(cve => {
      // La tech doit être déclarée dans la stack
      const declared = techStack.find(t => t.name === cve.tech && t.version === cve.version)
      // Et ne doit pas être patchée
      return declared && !patchedCVEs.includes(cve.id)
    })
  }

  const activeCVEs = getActiveCVEs()

  // Calculer le total d'emails détectés dans nos fichiers pour Breach Intel
  const totalEmails = docs.reduce((acc, d) => acc + (d.detectedFields.emails || 0), 0)
  
  // Extraire et consolider tous les emails uniques de tous les fichiers
  const allUniqueEmails = []
  docs.forEach(d => {
    if (d.uniqueEmails) {
      d.uniqueEmails.forEach(email => {
        if (!allUniqueEmails.some(item => item.email === email)) {
          allUniqueEmails.push({ email, file: d.name })
        }
      })
    }
  })

  // Fonction de croisement de brèche simulée réaliste
  const getEmailBreachStatus = (email) => {
    const e = email.toLowerCase()
    if (e.includes('diop') || e.includes('sarr')) {
      return { status: 'compromised', source: 'LinkedIn Leak (2021)', details: 'Mot de passe hashé exposé', severity: 'medium' }
    }
    if (e.includes('cisse') || e.includes('ndiaye')) {
      return { status: 'compromised', source: 'Fuite Jumia (2023)', details: 'Adresse physique & téléphone', severity: 'high' }
    }
    if (e.includes('contact@') || e.includes('admin@') || e.includes('directeur@') || e.includes('datasentinel.sn')) {
      return { status: 'compromised', source: 'Logs de Stealers (Redline)', details: 'Identifiant en clair exposé', severity: 'critical' }
    }
    return { status: 'safe', source: '-', details: 'Aucune fuite détectée', severity: 'low' }
  }

  // Nombre d'emails compromis réels
  const compromisedEmailsCount = allUniqueEmails.filter(item => getEmailBreachStatus(item.email).status === 'compromised').length

  return (
    <div className="p-6 space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-semibold text-[#202124]">Intelligence des Menaces</h1>
        <p className="text-sm text-[#5F6368] mt-0.5">
          Suivi des fuites de comptes, du dark web et des vulnérabilités applicatives (CVE)
        </p>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-[#DADCE0]">
        <button
          onClick={() => setSubTab('breach')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            subTab === 'breach' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          <Search size={16} />
          Breach Intelligence (Fuites d'emails)
        </button>
        <button
          onClick={() => setSubTab('darkweb')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            subTab === 'darkweb' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          <Globe size={16} />
          Dark Web Monitoring (Surveillance)
        </button>
        <button
          onClick={() => setSubTab('cve')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            subTab === 'cve' ? 'border-[#1A73E8] text-[#1A73E8]' : 'border-transparent text-[#5F6368] hover:text-[#202124]'
          }`}
        >
          <Server size={16} />
          CVE & Vulnerability Intelligence (Stack)
        </button>
      </div>

      {/* BREACH INTELLIGENCE TAB */}
      {subTab === 'breach' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-[#5F6368] uppercase">Emails scannés</span>
              <div className="text-3xl font-bold text-[#202124] mt-2">{allUniqueEmails.length}</div>
              <span className="text-xs text-[#5F6368] mt-1 block">Adresses uniques identifiées</span>
            </div>
            <div className="card bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-[#D93025] uppercase">Emails compromis</span>
              <div className="text-3xl font-bold text-[#D93025] mt-2">{compromisedEmailsCount}</div>
              <span className="text-xs text-[#5F6368] mt-1 block">Identifiés dans des fuites publiques</span>
            </div>
            <div className="card bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-[#F9AB00] uppercase">Ratio de compromission</span>
              <div className="text-3xl font-bold text-[#F9AB00] mt-2">
                {allUniqueEmails.length > 0 ? `${Math.round((compromisedEmailsCount / allUniqueEmails.length) * 100)}%` : '0%'}
              </div>
              <span className="text-xs text-[#5F6368] mt-1 block">Taux d'exposition réel</span>
            </div>
          </div>

          {/* Audit détaillé par adresse email */}
          <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert size={18} className="text-[#0D47A1]" />
              <h2 className="text-sm font-semibold text-[#202124]">Audit détaillé par adresse email</h2>
            </div>
            <p className="text-xs text-[#5F6368] mb-4">
              Chaque email extrait des documents importés est croisé en temps réel avec notre base sémantique de fuites connues (Jumia, LinkedIn, etc.).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#DADCE0] bg-[#F8FAFF]">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Email</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Fichier Source</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Base de fuite</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Détails de l'exposition</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {allUniqueEmails.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-xs text-[#5F6368]">
                        Aucun email à auditer. Importez un fichier CSV ou Excel.
                      </td>
                    </tr>
                  ) : (
                    allUniqueEmails.map((item, i) => {
                      const breach = getEmailBreachStatus(item.email)
                      return (
                        <tr key={i} className="border-b border-[#F1F3F4] last:border-b-0 hover:bg-[#F8FAFF] transition-colors">
                          <td className="py-3 px-3 font-medium text-[#202124]">{item.email}</td>
                          <td className="py-3 px-3 text-xs">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                              {item.file}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs font-semibold text-[#202124]">{breach.source}</td>
                          <td className="py-3 px-3 text-xs text-[#5F6368]">{breach.details}</td>
                          <td className="py-3 px-3 text-center">
                            {breach.status === 'compromised' ? (
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                breach.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-850'
                              }`}>
                                COMPROMIS
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                                SÉCURISÉ
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#5F6368]" />
              <h2 className="text-sm font-semibold text-[#202124]">Bases de données de fuite connues (Historique Global)</h2>
            </div>
            <p className="text-xs text-[#5F6368] mb-4">
              Voici les sources référencées au Sénégal et à l'international ayant exposé les données d'identification de nos bases de démonstration.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#DADCE0]">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Source de la Fuite</th>
                    <th className="text-right py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Identifiants impactés</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase pl-6">Type d'Exposition</th>
                    <th className="text-center py-2.5 px-3 text-xs font-semibold text-[#5F6368] uppercase">Gravité</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BREACH_SOURCES.map((src, i) => (
                    <tr key={i} className="border-b border-[#F1F3F4] last:border-b-0 hover:bg-[#F8FAFF]">
                      <td className="py-3 px-3 font-semibold text-[#202124]">{src.name}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#D93025]">{src.count}</td>
                      <td className="py-3 px-3 text-xs text-[#5F6368] pl-6">{src.description}</td>
                      <td className="py-3 px-3 text-center">
                        <RiskBadge level={src.risk} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DARK WEB MONITORING TAB */}
      {subTab === 'darkweb' && (
        <div className="space-y-6">
          <div className="card bg-[#0F172A] border border-slate-700 text-slate-100 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
              <Globe size={18} className="text-[#38BDF8]" />
              <h2 className="text-sm font-semibold">Console de Surveillance Passive du Dark Web</h2>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Recherche automatisée de fuites et mentions de votre domaine <span className="font-semibold text-slate-100">datasentinel.sn</span> sur les salons IRC underground, les chats Telegram malveillants et les forums Tor.
            </p>

            <div className="space-y-4">
              {MOCK_DARK_WEB_ALERTS.map((alert) => (
                <div key={alert.id} className="border border-slate-800 bg-slate-900 rounded-lg p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-800">
                        {alert.type}
                      </span>
                      <span className="text-xs text-slate-400">Détecté sur : {alert.source}</span>
                      <span className="text-xs text-slate-500">Date : {alert.leakDate}</span>
                    </div>
                    <p className="text-sm text-slate-200">{alert.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                      alert.dangerLevel === 'critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {alert.dangerLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CVE & VULNERABILITY INTELLIGENCE TAB */}
      {subTab === 'cve' && (
        <div className="space-y-6">
          {/* Déclarateur de Stack */}
          <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[#202124] mb-2">Déclarer vos technologies & applications</h2>
            <p className="text-xs text-[#5F6368] mb-4">
              Indiquez les outils utilisés en interne (CMS WordPress, extensions, version de serveur web...) pour analyser automatiquement s'ils comportent des failles actives.
            </p>

            <div className="flex flex-col sm:flex-row items-end gap-3 bg-[#F8FAFF] p-4 rounded-lg border border-[#DADCE0]">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">Logiciel</label>
                <select
                  value={selectedTech}
                  onChange={e => {
                    setSelectedTech(e.target.value)
                    setSelectedVersion('')
                  }}
                  className="w-full text-xs px-3 py-2 border border-[#DADCE0] rounded-lg bg-white"
                >
                  <option value="">-- Sélectionner --</option>
                  {AVAILABLE_TECH.map(tech => (
                    <option key={tech.name} value={tech.name}>{tech.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">Version installée</label>
                <select
                  value={selectedVersion}
                  onChange={e => setSelectedVersion(e.target.value)}
                  disabled={!selectedTech}
                  className="w-full text-xs px-3 py-2 border border-[#DADCE0] rounded-lg bg-white disabled:opacity-50"
                >
                  <option value="">-- Sélectionner --</option>
                  {selectedTech && AVAILABLE_TECH.find(t => t.name === selectedTech).versions.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddTech}
                disabled={!selectedTech || !selectedVersion}
                className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex-shrink-0"
              >
                Ajouter à la stack
              </button>
            </div>

            {/* Liste de la Stack Déclarée */}
            {techStack.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">Stack déclarée actuellement</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map(t => (
                    <span
                      key={t.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F0FE] border border-[#ADCCF9] text-xs font-medium text-[#1A73E8]"
                    >
                      {t.name} {t.version}
                      <button
                        onClick={() => handleRemoveTech(t.name)}
                        className="text-[#D93025] hover:text-[#A50E0E] font-bold ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Failles Actives CVE */}
          <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#F1F3F4] pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-[#D93025]" />
                <h2 className="text-sm font-semibold text-[#202124]">CVE Vulnerabilities actives ({activeCVEs.length})</h2>
              </div>
              <span className="text-xs text-[#5F6368]">
                {patchedCVEs.length} faille(s) résolue(s)
              </span>
            </div>

            {activeCVEs.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#5F6368] flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">✓</div>
                Aucune faille active détectée sur votre stack. Ajoutez WordPress ou phpMyAdmin en version ancienne pour simuler l'analyse.
              </div>
            ) : (
              <div className="space-y-4">
                {activeCVEs.map(cve => (
                  <div key={cve.id} className="border border-[#DADCE0] hover:border-[#1A73E8] rounded-xl p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded">
                          {cve.cveCode}
                        </span>
                        <span className="text-xs font-semibold text-[#202124]">
                          {cve.tech} {cve.version}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-[#202124]">{cve.title}</h3>
                      <p className="text-xs text-[#5F6368] leading-relaxed">{cve.description}</p>
                      <div className="pt-1 text-[11px] text-[#1E8E3E] font-medium">
                        🛡️ Correction : {cve.remediation}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className={`text-xs px-2.5 py-1 rounded font-bold ${
                          cve.cvss >= 9.0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          CVSS {cve.cvss}
                        </span>
                      </div>
                      <button
                        onClick={() => onPatchCVE(cve.id, cve.tech, cve.remediation)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#1E8E3E] hover:bg-[#146c2e] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        <Check size={12} />
                        Patcher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
