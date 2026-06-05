import { useState } from 'react'
import { Mail, AlertTriangle, ChevronDown, ChevronUp, ShieldOff, Eye, RefreshCw, FileText } from 'lucide-react'

/**
 * PhishingSimulator — Génère un email de spear-phishing réaliste
 * basé sur les PII détectées dans les documents importés.
 * But pédagogique : démontrer l'impact concret d'une fuite de données.
 */

const PHISHING_TEMPLATES = [
  {
    id: 'banking',
    label: 'Fraude bancaire / Wave',
    icon: '💳',
    requires: ['banking', 'waveMoney'],
    generate: (victim, company) => ({
      from: 'securite-wave@wave-mobile-sn.com',
      subject: `⚠️ URGENT : Activité suspecte détectée sur votre compte Wave – Action requise`,
      body: `Bonjour ${victim.name},

Nous avons détecté une tentative d'accès non autorisée sur votre compte Wave enregistré sous le numéro ${victim.phone}.

Pour sécuriser immédiatement votre solde, veuillez confirmer votre identité en cliquant sur le lien ci-dessous dans les 24 heures :

👉 https://wave-securite-sn.com/confirm?token=a9f2e1&user=${encodeURIComponent(victim.email)}

Si vous ne confirmez pas, votre compte sera temporairement suspendu pour votre protection.

Cordialement,
L'équipe de Sécurité Wave Sénégal
Réf. incident : INC-${Math.floor(Math.random()*90000+10000)}`,
      riskNote: `Cet email exploite le numéro Wave ${victim.phone} issu de ${victim.sourceFile}. Le lien redirige vers un domaine typosquat (wave-mobile-sn.com ≠ wave.com).`
    })
  },
  {
    id: 'hr',
    label: 'Hameçonnage RH / CNI',
    icon: '🪪',
    requires: ['identity'],
    generate: (victim, company) => ({
      from: `rh-${company.toLowerCase().replace(/\s/g,'')}@mail-dakar.net`,
      subject: `Document RH – Mise à jour obligatoire de votre dossier employé`,
      body: `Cher(e) ${victim.name},

Dans le cadre de la mise à jour annuelle des dossiers RH conformément à la directive interne 2026-04, nous vous demandons de valider vos informations personnelles.

Nous avons en dossier votre numéro CNI : ${victim.cni}

Merci de confirmer ou corriger ces informations avant le vendredi 7 juin 2026 via notre portail RH sécurisé :

👉 https://rh-portail-${company.toLowerCase().replace(/\s/g,'')}.com/update-profile?emp=${victim.email}

Sans réponse, votre salaire du mois de juin pourrait être bloqué.

Direction des Ressources Humaines
${company}`,
      riskNote: `Cet email utilise le numéro CNI ${victim.cni} extrait de ${victim.sourceFile}. La crédibilité est renforcée par l'usage du vrai nom de l'entreprise dans l'URL du lien malveillant.`
    })
  },
  {
    id: 'ceo_fraud',
    label: 'Fraude au Président (NINEA)',
    icon: '🎯',
    requires: ['ninea'],
    generate: (victim, company) => ({
      from: `direction@${company.toLowerCase().replace(/\s/g,'')}-direction.sn`,
      subject: `[CONFIDENTIEL] Virement urgent – Partenaire stratégique`,
      body: `Bonjour ${victim.name},

Je vous contacte depuis mon adresse personnelle car je suis actuellement en déplacement à Abidjan pour une réunion confidentielle.

Nous finalisons un accord stratégique avec un partenaire qui requiert un virement immédiat de 2 750 000 FCFA. J'ai besoin que vous procédiez aujourd'hui même pour ne pas perdre l'opportunité.

Les informations fiscales de notre société (NINEA : ${victim.ninea}) ont déjà été transmises au partenaire. Il ne manque que la confirmation de votre côté.

Procédez au virement sur ce compte :
Banque : Ecobank Sénégal
IBAN : SN08-0010-0030-0000-0123456789
Bénéficiaire : GOLDTRADE DAKAR SARL

Ne répondez pas à cette adresse, appelez-moi directement si nécessaire. Discrétion totale requise.

Cordialement,
Le Directeur Général`,
      riskNote: `Cet email exploite le numéro NINEA ${victim.ninea} de ${victim.sourceFile} pour paraître légitime. C'est la forme la plus destructrice de fraude : le « BEC » (Business Email Compromise).`
    })
  },
  {
    id: 'newsletter',
    label: 'Phishing marketing / Promo',
    icon: '📧',
    requires: ['emails'],
    generate: (victim, company) => ({
      from: `promo@jumia-deals-dakar.sn`,
      subject: `🎁 ${victim.name}, vous avez gagné un bon d'achat de 50 000 FCFA – Réclamez maintenant`,
      body: `Bonjour ${victim.name},

Félicitations ! Vous êtes l'un(e) des 50 gagnants de notre tirage au sort Jumia de mai 2026.

Votre bon d'achat de 50 000 FCFA est prêt à être réclamé. Pour l'activer, confirmez simplement votre compte Jumia :

👉 https://jumia-dakar-promo.sn/claim?ref=${btoa(victim.email)}&code=JMX50K

⚠️ Offre valable 48h uniquement.

Merci d'être un client fidèle Jumia Sénégal !

L'équipe Marketing Jumia`,
      riskNote: `Cet email cible ${victim.email} extrait de ${victim.sourceFile}. La base de ${victim.totalEmails} emails constitue un vecteur d'attaque en masse (phishing de masse personnalisé).`
    })
  }
]

export default function PhishingSimulator({ docs }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generatedEmail, setGeneratedEmail] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showRiskNote, setShowRiskNote] = useState(false)
  const [victimIndex, setVictimIndex] = useState(0)

  // Consolider toutes les données PII extraites des documents
  const buildVictimProfile = () => {
    const allEmails = []
    let totalBanking = 0, totalWave = 0, totalIdentity = 0, totalNinea = 0
    let sampleCNI = '1 19840512 12345 67', sampleNINEA = 'SN-2019-B12345'
    let samplePhone = '+221 77 234 56 78', sampleFile = 'base_clients_2024.csv'

    docs.forEach(doc => {
      if (doc.uniqueEmails) allEmails.push(...doc.uniqueEmails.map(e => ({ email: e, file: doc.name })))
      totalBanking += doc.detectedFields.banking || 0
      totalWave += doc.detectedFields.waveMoney || 0
      totalIdentity += doc.detectedFields.identity || 0
      totalNinea += doc.detectedFields.ninea || 0
      if (doc.detectedFields.banking > 0) sampleFile = doc.name
    })

    const pickedEmail = allEmails[victimIndex % Math.max(allEmails.length, 1)]
    const email = pickedEmail?.email || 'client@example.sn'
    const emailFile = pickedEmail?.file || 'base_clients_2024.csv'

    // Dériver nom/prénom depuis l'email
    const parts = email.split('@')[0].replace(/[._]/g, ' ').split(' ')
    const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')

    return {
      name,
      email,
      phone: samplePhone,
      cni: sampleCNI,
      ninea: sampleNINEA,
      sourceFile: emailFile,
      totalEmails: allEmails.length,
      banking: totalBanking,
      waveMoney: totalWave,
      identity: totalIdentity,
      ninea_count: totalNinea
    }
  }

  const handleGenerate = () => {
    if (!selectedTemplate) return
    setIsGenerating(true)
    setGeneratedEmail(null)
    setShowRiskNote(false)

    setTimeout(() => {
      const victim = buildVictimProfile()
      const company = 'DataSentinel SA'
      const email = selectedTemplate.generate(victim, company)
      setGeneratedEmail(email)
      setIsGenerating(false)
    }, 1200)
  }

  const handleRotateVictim = () => {
    const allEmails = []
    docs.forEach(doc => {
      if (doc.uniqueEmails) allEmails.push(...doc.uniqueEmails)
    })
    setVictimIndex(prev => (prev + 1) % Math.max(allEmails.length, 1))
    if (selectedTemplate) handleGenerate()
  }

  const aggregated = {
    emails: docs.reduce((a, d) => a + (d.detectedFields.emails || 0), 0),
    banking: docs.reduce((a, d) => a + (d.detectedFields.banking || 0), 0),
    waveMoney: docs.reduce((a, d) => a + (d.detectedFields.waveMoney || 0), 0),
    identity: docs.reduce((a, d) => a + (d.detectedFields.identity || 0), 0),
    ninea: docs.reduce((a, d) => a + (d.detectedFields.ninea || 0), 0),
  }

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <ShieldOff size={20} className="text-red-700" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#202124]">Simulateur Spear-Phishing</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">
            Démontre en temps réel comment un attaquant exploiterait vos données PII exposées
            pour générer des emails de phishing hyper-ciblés.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Usage pédagogique uniquement.</span> Ces emails sont générés
          à partir des données réellement extraites de vos fichiers pour illustrer l'impact concret
          d'une violation de données. Ils ne sont jamais envoyés.
        </p>
      </div>

      {/* PII Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Emails', value: aggregated.emails, color: '#1A73E8' },
          { label: 'Comptes Wave', value: aggregated.waveMoney, color: '#D93025' },
          { label: 'Données bancaires', value: aggregated.banking, color: '#D93025' },
          { label: 'CNI / Identité', value: aggregated.identity, color: '#F9AB00' },
          { label: 'NINEA', value: aggregated.ninea, color: '#1E8E3E' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#DADCE0] rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold" style={{ color: stat.value > 0 ? stat.color : '#9AA0A6' }}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#5F6368] mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div className="bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
            <Mail size={16} className="text-[#1A73E8]" />
            Choisir le vecteur d'attaque
          </h2>
          <p className="text-xs text-[#5F6368]">
            Chaque vecteur est basé sur un type de donnée PII détecté dans vos fichiers.
          </p>

          <div className="space-y-2">
            {PHISHING_TEMPLATES.map(tpl => {
              const available = tpl.requires.some(req => aggregated[req] > 0)
              const isSelected = selectedTemplate?.id === tpl.id
              return (
                <button
                  key={tpl.id}
                  onClick={() => available && setSelectedTemplate(tpl)}
                  disabled={!available}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]'
                      : available
                        ? 'border-[#DADCE0] hover:border-[#1A73E8] text-[#202124]'
                        : 'border-[#DADCE0] text-[#9AA0A6] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-lg">{tpl.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{tpl.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      Exploite : {tpl.requires.join(', ')}
                      {!available && ' — données non détectées'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={!selectedTemplate || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D93025] hover:bg-[#A50E0E] disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Mail size={14} />
                  Générer l'email d'attaque
                </>
              )}
            </button>
            <button
              onClick={handleRotateVictim}
              disabled={!generatedEmail}
              title="Changer de victime"
              className="px-3 py-2.5 border border-[#DADCE0] hover:bg-[#F1F3F4] disabled:opacity-40 text-[#5F6368] rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Generated Email Preview */}
        <div className="bg-white border border-[#DADCE0] rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#DADCE0] bg-[#F8FAFF]">
            <Eye size={15} className="text-[#5F6368]" />
            <h2 className="text-sm font-semibold text-[#202124]">Aperçu de l'email généré</h2>
          </div>

          {!generatedEmail && !isGenerating && (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <Mail size={32} className="text-[#DADCE0] mb-3" />
              <p className="text-sm text-[#9AA0A6]">
                Sélectionnez un vecteur d'attaque et cliquez sur "Générer" pour voir un exemple d'email de phishing construit à partir de vos données.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <RefreshCw size={24} className="text-[#1A73E8] animate-spin" />
              <p className="text-sm text-[#5F6368]">Analyse des PII en cours...</p>
            </div>
          )}

          {generatedEmail && !isGenerating && (
            <div className="p-5 space-y-4 overflow-y-auto max-h-[480px]">
              {/* Email headers */}
              <div className="space-y-1.5 text-xs border-b border-[#F1F3F4] pb-4">
                <div className="flex gap-2">
                  <span className="text-[#5F6368] w-16 flex-shrink-0 font-medium">De :</span>
                  <span className="text-[#D93025] font-mono break-all">{generatedEmail.from}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#5F6368] w-16 flex-shrink-0 font-medium">Objet :</span>
                  <span className="font-semibold text-[#202124]">{generatedEmail.subject}</span>
                </div>
              </div>

              {/* Email body */}
              <pre className="text-xs text-[#202124] leading-relaxed whitespace-pre-wrap font-sans bg-[#F8FAFF] rounded-lg p-4 border border-[#DADCE0]">
                {generatedEmail.body}
              </pre>

              {/* Risk note toggle */}
              <button
                onClick={() => setShowRiskNote(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle size={13} />
                  Pourquoi cet email est dangereux
                </span>
                {showRiskNote ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {showRiskNote && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 leading-relaxed">
                  {generatedEmail.riskNote}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Impact Note */}
      <div className="bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-[#0D47A1]" />
          <h3 className="text-sm font-semibold text-[#202124]">Impact réel en cas de fuite — Chiffres de référence</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="font-bold text-red-700 text-base mb-1">94%</div>
            <div className="text-red-800">des attaques ciblées commencent par un email de phishing (Verizon DBIR 2024)</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="font-bold text-amber-700 text-base mb-1">3 min</div>
            <div className="text-amber-800">Le délai moyen entre réception et clic sur un lien malveillant dans une PME (IBM Security)</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="font-bold text-blue-700 text-base mb-1">4,88 M$</div>
            <div className="text-blue-800">Coût moyen mondial d'une violation de données en 2024 (IBM Cost of Data Breach Report)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
