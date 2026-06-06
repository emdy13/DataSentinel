import { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import FileUpload from './components/FileUpload'
import SensitiveDataPanel from './components/SensitiveDataPanel'
import AnonymizationPanel from './components/AnonymizationPanel'
import ThreatIntelPanel from './components/ThreatIntelPanel'
import PhishingSimulator from './components/PhishingSimulator'
import RiskRadar from './components/RiskRadar'
import CDPReport from './components/CDPReport'
import Timeline from './components/Timeline'
import DemoMode from './components/DemoMode'
import AIAssistant from './components/AIAssistant'
import Login from './components/Login'
import { generatePDFReport } from './utils/pdfReport'
import { computeRiskScore, riskLevel } from './utils/fileAnalyzer'
import { DOCUMENTS, RECENT_ALERTS, MOCK_CVE_DATABASE, MOCK_DARK_WEB_ALERTS } from './data/mockData'

/** Composant racine de DataSentinel */
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // État d'authentification de l'utilisateur
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('datasentinel_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const handleLogin = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('datasentinel_user', JSON.stringify(userData))
    } catch (e) {
      console.warn('LocalStorage non disponible :', e)
    }
  }

  const handleLogout = () => {
    setUser(null)
    try {
      localStorage.removeItem('datasentinel_user')
    } catch (e) {
      console.warn('LocalStorage non disponible :', e)
    }
  }

  // États partagés globaux
  const [docs, setDocs] = useState(DOCUMENTS)
  const [alerts, setAlerts] = useState(RECENT_ALERTS)
  const [resolvedAlerts, setResolvedAlerts] = useState([])
  const [triggerMessage, setTriggerMessage] = useState(null)
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  // États pour la stack technologique & les vulnérabilités CVE
  const [techStack, setTechStack] = useState([
    { name: 'WordPress', version: '6.2' },
    { name: 'phpMyAdmin', version: '5.1' }
  ])
  const [patchedCVEs, setPatchedCVEs] = useState([])

  // Chronologie initiale (Audit trail)
  const [timelineEvents, setTimelineEvents] = useState([
    {
      id: 1,
      type: 'system',
      category: 'Système',
      time: 'Il y a 3 jours',
      title: 'Agent de surveillance DataSentinel démarré',
      description: 'Surveillance active des répertoires et des bases de données de l\'entreprise.',
      details: 'En ligne'
    },
    {
      id: 2,
      type: 'upload',
      category: 'Fichier',
      time: 'Il y a 2 jours',
      title: 'Fichier analysé : base_clients_2024.csv',
      description: 'Détection de multiples informations identifiables.',
      details: 'CSV · 2.4 MB'
    },
    {
      id: 3,
      type: 'alert',
      category: 'Sécurité',
      time: 'Il y a 2 jours',
      title: 'Alerte critique levée sur base_clients_2024.csv',
      description: 'Présence de 342 comptes bancaires non masqués et 1 240 adresses email.',
      details: 'CRITIQUE'
    },
    {
      id: 4,
      type: 'upload',
      category: 'Fichier',
      time: 'Hier',
      title: 'Fichier analysé : employes_RH.xlsx',
      description: 'Détection de données d\'identité nationale sénégalaise (CNI).',
      details: 'Excel · 845 KB'
    }
  ])

  // Résolution d'une alerte fichier
  const handleResolveAlert = (alertId) => {
    setResolvedAlerts(prev => [...prev, alertId])
    
    // Trouver l'alerte résolue
    const alert = alerts.find(a => a.id === alertId)
    if (alert) {
      // Ajouter à la timeline
      setTimelineEvents(prev => [
        {
          id: Date.now(),
          type: 'resolve',
          category: 'Remédiation',
          time: 'À l\'instant',
          title: `Alerte résolue sur ${alert.file}`,
          description: `Action corrective appliquée : ${alert.message.split('exposées')[0]} sécurisé par chiffrement/masquage.`,
          details: 'RÉSOLU'
        },
        ...prev
      ])
    }
  }

  // Résolution/Correctif d'une CVE
  const handlePatchCVE = (cveId, techName, remediation) => {
    setPatchedCVEs(prev => [...prev, cveId])
    setResolvedAlerts(prev => [...prev, `cve-${cveId}`])

    // Ajouter à la timeline
    setTimelineEvents(prev => [
      {
        id: Date.now(),
        type: 'resolve',
        category: 'Remédiation',
        time: 'À l\'instant',
        title: `Vulnérabilité corrigée sur ${techName}`,
        description: `Mise à jour de sécurité appliquée : ${remediation}`,
        details: 'SÉCURISÉ'
      },
      ...prev
    ])
  }

  // Résolution d'une alerte unifiée (depuis le Dashboard)
  const handleResolveUnifiedAlert = (alertId) => {
    if (typeof alertId === 'string' && alertId.startsWith('cve-')) {
      const originalId = parseInt(alertId.replace('cve-', ''), 10)
      const cve = MOCK_CVE_DATABASE.find(c => c.id === originalId)
      if (cve) {
        handlePatchCVE(originalId, cve.tech, cve.remediation)
      }
    } else if (typeof alertId === 'string' && alertId.startsWith('dark-')) {
      setResolvedAlerts(prev => [...prev, alertId])
      const originalId = parseInt(alertId.replace('dark-', ''), 10)
      const dw = MOCK_DARK_WEB_ALERTS.find(d => d.id === originalId)
      if (dw) {
        setTimelineEvents(prev => [
          {
            id: Date.now(),
            type: 'resolve',
            category: 'Remédiation',
            time: 'À l\'instant',
            title: `Menace Dark Web atténuée sur ${dw.domain}`,
            description: `Incident résolu. Surveillance renforcée sur ${dw.source}.`,
            details: 'ATTÉNUÉ'
          },
          ...prev
        ])
      }
    } else {
      handleResolveAlert(alertId)
    }
  }

  // Recalcul dynamique des documents avec ajustement pour les alertes résolues
  const getAdjustedDocs = () => {
    return docs.map(doc => {
      const adjustedFields = { ...doc.detectedFields }
      let hasResolvedAlert = false
      
      // Si une alerte liée à ce fichier est marquée comme résolue, on met les compteurs correspondants à 0
      alerts.forEach(alert => {
        if (alert.file === doc.name && resolvedAlerts.includes(alert.id)) {
          hasResolvedAlert = true
          const msg = alert.message.toLowerCase()
          if (msg.includes('email') || msg.includes('adresse')) {
            adjustedFields.emails = 0
          }
          if (msg.includes('banque') || msg.includes('bancaire') || msg.includes('rib') || msg.includes('wave') || msg.includes('orange')) {
            adjustedFields.banking = 0
            adjustedFields.waveMoney = 0
          }
          if (msg.includes('cni') || msg.includes('identité') || msg.includes('cin')) {
            adjustedFields.identity = 0
          }
          if (msg.includes('ninea')) {
            adjustedFields.ninea = 0
          }
        }
      })
      
      const newScore = computeRiskScore(adjustedFields)
      // Un fichier est considéré sécurisé si une action correctrice y est appliquée
      const isSecured = hasResolvedAlert && newScore < 20

      return {
        ...doc,
        detectedFields: adjustedFields,
        riskScore: newScore,
        riskLevel: riskLevel(newScore),
        status: isSecured ? 'secured' : doc.status
      }
    })
  }

  const adjustedDocs = getAdjustedDocs()

  // Regroupe toutes les alertes (Fichiers + CVE + Dark Web) pour les remonter sur le Tableau de Bord
  const getUnifiedAlerts = () => {
    const list = []

    // 1. Alertes fichiers
    alerts.forEach(alert => {
      list.push({
        id: alert.id,
        severity: alert.severity,
        message: alert.message,
        time: alert.time,
        file: alert.file,
        type: 'file'
      })
    })

    // 2. Alertes CVE (pour la stack déclarée active)
    MOCK_CVE_DATABASE.forEach(cve => {
      const declared = techStack.find(t => t.name === cve.tech && t.version === cve.version)
      if (declared) {
        list.push({
          id: `cve-${cve.id}`,
          severity: cve.dangerLevel,
          message: `[CVE Faille] ${cve.tech} ${cve.version} présente la faille critique ${cve.cveCode} (${cve.title})`,
          time: 'Stack active',
          file: `${cve.tech} ${cve.version}`,
          type: 'cve'
        })
      }
    })

    // 3. Alertes Dark Web
    MOCK_DARK_WEB_ALERTS.forEach(dw => {
      list.push({
        id: `dark-${dw.id}`,
        severity: dw.dangerLevel,
        message: `[Dark Web] Mention de ${dw.domain} sur ${dw.source} : ${dw.description}`,
        time: 'Incident',
        file: dw.domain,
        type: 'darkweb'
      })
    })

    return list
  }

  const unifiedAlerts = getUnifiedAlerts()

  // Calcul du score global d'exposition basé sur tous les champs cumulés + CVE + Dark Web
  const getGlobalScore = () => {
    const globalFields = {
      emails: 0,
      phones: 0,
      banking: 0,
      identity: 0,
      ninea: 0,
      waveMoney: 0
    }
    
    adjustedDocs.forEach(d => {
      Object.keys(globalFields).forEach(k => {
        globalFields[k] += d.detectedFields[k] || 0
      })
    })

    // Score de base lié aux fichiers
    let score = computeRiskScore(globalFields)

    // Pénalités liées aux CVE actives (non patchées)
    const activeCVEs = MOCK_CVE_DATABASE.filter(cve => {
      const declared = techStack.find(t => t.name === cve.tech && t.version === cve.version)
      return declared && !patchedCVEs.includes(cve.id)
    })

    let cvePenalty = 0
    activeCVEs.forEach(cve => {
      cvePenalty += cve.cvss >= 9.0 ? 15 : 8
    })

    // Pénalités du Dark Web (8 points par menace active)
    const activeDarkWebAlerts = MOCK_DARK_WEB_ALERTS.filter(dw => !resolvedAlerts.includes(`dark-${dw.id}`))
    const darkWebPenalty = activeDarkWebAlerts.length * 8

    score = Math.min(100, score + cvePenalty + darkWebPenalty)
    return score
  }

  const globalScore = getGlobalScore()

  // Déclencher le téléchargement du rapport PDF
  const handleDownloadPDF = () => {
    generatePDFReport(adjustedDocs, globalScore)
  }

  // Fonctions pour le Mode Démo Guidé
  const handleAddDemoFile = () => {
    const demoFile = {
      id: 999,
      name: 'base_clients_dakarlab.csv',
      size: '1.8 MB',
      type: 'CSV',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'analyzed',
      riskLevel: 'critical',
      riskScore: 91,
      detectedFields: {
        emails: 840,
        phones: 500,
        waveMoney: 120, // Mobile Money Sénégalais
        banking: 95,
        identity: 64,  // CNI
        ninea: 18       // NINEA
      },
      uniqueEmails: [
        'diop.abdou@dakarlab.sn',
        'sarr.moustapha@dakarlab.sn',
        'ndiaye.fatima@dakarlab.sn',
        'cisse.cheikh@dakarlab.sn'
      ],
      columnHeatmap: {
        'Nom': { emails: 0, phones: 0, waveMoney: 0, banking: 0, identity: 0, ninea: 0 },
        'Email': { emails: 840, phones: 0, waveMoney: 0, banking: 0, identity: 0, ninea: 0 },
        'Telephone': { emails: 0, phones: 500, waveMoney: 120, banking: 0, identity: 0, ninea: 0 },
        'Rib': { emails: 0, phones: 0, waveMoney: 0, banking: 95, identity: 0, ninea: 0 },
        'Cni': { emails: 0, phones: 0, waveMoney: 0, banking: 0, identity: 64, ninea: 0 },
        'Ninea': { emails: 0, phones: 0, waveMoney: 0, banking: 0, identity: 0, ninea: 18 }
      },
      rowCount: 1200
    }

    // Ajouter le document
    setDocs(prev => [demoFile, ...prev])

    // Ajouter les alertes associées
    const newAlerts = [
      {
        id: 101,
        severity: 'critical',
        message: '95 coordonnées bancaires et 120 comptes Wave exposés dans base_clients_dakarlab.csv',
        time: 'À l\'instant',
        file: 'base_clients_dakarlab.csv',
      },
      {
        id: 102,
        severity: 'high',
        message: '64 numéros CNI et 18 NINEA non déclarés à la CDP dans base_clients_dakarlab.csv',
        time: 'À l\'instant',
        file: 'base_clients_dakarlab.csv',
      }
    ]
    setAlerts(prev => [...newAlerts, ...prev])

    // Ajouter à la timeline
    setTimelineEvents(prev => [
      {
        id: Date.now(),
        type: 'upload',
        category: 'Fichier',
        time: 'À l\'instant',
        title: 'Fichier démo importé : base_clients_dakarlab.csv',
        description: 'Analyse complétée. Données sensibles détectées (CNI, NINEA, Wave).',
        details: 'CSV · 1.8 MB'
      },
      {
        id: Date.now() + 1,
        type: 'alert',
        category: 'Sécurité',
        time: 'À l\'instant',
        title: 'Alerte critique levée sur base_clients_dakarlab.csv',
        description: 'Comptes bancaires et CNI en texte clair sans chiffrement.',
        details: 'CRITIQUE'
      },
      ...prev
    ])
  }

  const handleResolveDemoAlert = () => {
    // Résoudre l'alerte critique de démo (ID 101) et celle d'origine (ID 1)
    setResolvedAlerts(prev => [...prev, 1, 101])
    
    // Patcher également les CVE pour montrer une sécurité totale
    setPatchedCVEs([1, 2, 4]) // Patch les CVE critiques de la stack par défaut
    setResolvedAlerts(prev => [...prev, 'cve-1', 'cve-2', 'cve-4'])

    setTimelineEvents(prev => [
      {
        id: Date.now(),
        type: 'resolve',
        category: 'Remédiation',
        time: 'À l\'instant',
        title: 'Remédiation appliquée sur base_clients_dakarlab.csv',
        description: 'Chiffrement AES-256 appliqué sur les comptes bancaires et masquage Wave.',
        details: 'RÉSOLU'
      },
      {
        id: Date.now() + 1,
        type: 'resolve',
        category: 'Remédiation',
        time: 'À l\'instant',
        title: 'Vulnérabilités logicielles corrigées (WordPress & phpMyAdmin)',
        description: 'Mises à jour appliquées avec succès.',
        details: 'SÉCURISÉ'
      },
      {
        id: Date.now() + 2,
        type: 'resolve',
        category: 'Remédiation',
        time: 'À l\'instant',
        title: 'Remédiation appliquée sur base_clients_2024.csv',
        description: 'Masquage et tokenisation appliqués avec succès.',
        details: 'RÉSOLU'
      },
      ...prev
    ])
  }

  const handleTriggerAIChat = (message) => {
    setTriggerMessage(message)
    // Réinitialiser le trigger après un instant pour permettre de futurs envois
    setTimeout(() => setTriggerMessage(null), 1000)
  }

  const handleResetDemoState = () => {
    setDocs(DOCUMENTS)
    setAlerts(RECENT_ALERTS)
    setResolvedAlerts([])
    setTechStack([
      { name: 'WordPress', version: '6.2' },
      { name: 'phpMyAdmin', version: '5.1' }
    ])
    setPatchedCVEs([])
    setTriggerMessage(null)
    setTimelineEvents([
      {
        id: 1,
        type: 'system',
        category: 'Système',
        time: 'Il y a 3 jours',
        title: 'Agent de surveillance DataSentinel démarré',
        description: 'Surveillance active des répertoires et des bases de données de l\'entreprise.',
        details: 'En ligne'
      }
    ])
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Dashboard
              docs={adjustedDocs}
              alerts={unifiedAlerts}
              resolvedAlerts={resolvedAlerts}
              onResolveAlert={handleResolveUnifiedAlert}
              globalScore={globalScore}
              onDownloadPDF={handleDownloadPDF}
            />
            <div className="px-6 pb-6">
              <RiskRadar
                docs={adjustedDocs}
                patchedCVEs={patchedCVEs}
                resolvedAlerts={resolvedAlerts}
                globalScore={globalScore}
              />
            </div>
          </div>
        )
      case 'upload':
        return (
          <FileUpload
            docs={adjustedDocs}
            setDocs={setDocs}
            onAddTimelineEvent={(e) => setTimelineEvents(prev => [e, ...prev])}
          />
        )
      case 'data':
        return <SensitiveDataPanel docs={adjustedDocs} />
      case 'anonymize':
        return <AnonymizationPanel docs={adjustedDocs} />
      case 'threat_intel':
        return (
          <ThreatIntelPanel
            techStack={techStack}
            setTechStack={setTechStack}
            patchedCVEs={patchedCVEs}
            onPatchCVE={handlePatchCVE}
            docs={adjustedDocs}
            onAddTimelineEvent={(e) => setTimelineEvents(prev => [e, ...prev])}
          />
        )
      case 'phishing':
        return <PhishingSimulator docs={adjustedDocs} />
      case 'cdp_report':
        return <CDPReport docs={adjustedDocs} globalScore={globalScore} />
      default:
        return (
          <div className="space-y-6">
            <Dashboard
              docs={adjustedDocs}
              alerts={unifiedAlerts}
              resolvedAlerts={resolvedAlerts}
              onResolveAlert={handleResolveUnifiedAlert}
              globalScore={globalScore}
              onDownloadPDF={handleDownloadPDF}
            />
            <div className="px-6 pb-6">
              <RiskRadar
                docs={adjustedDocs}
                patchedCVEs={patchedCVEs}
                resolvedAlerts={resolvedAlerts}
                globalScore={globalScore}
              />
            </div>
          </div>
        )
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlerts={unifiedAlerts.filter(a => !resolvedAlerts.includes(a.id))}
        onResolveAlert={handleResolveUnifiedAlert}
        onStartDemoMode={() => setIsDemoOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      {/* AI Chatbot flottant */}
      <AIAssistant triggerMessage={triggerMessage} />

      {/* Mode Démo Guidé Overlay */}
      <DemoMode
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveTab={setActiveTab}
        onAddDemoFile={handleAddDemoFile}
        onResolveDemoAlert={handleResolveDemoAlert}
        onTriggerAIChat={handleTriggerAIChat}
        onResetDemoState={handleResetDemoState}
      />
    </div>
  )
}
