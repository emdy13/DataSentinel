import { useState } from 'react'
import { FileText, Download, CheckCircle, AlertCircle, Building, Calendar, User, Scale } from 'lucide-react'

/**
 * CDPReport — Générateur de pré-déclaration CDP (Commission des Données Personnelles du Sénégal)
 * Conforme à la Loi n° 2008-12 sur la protection des données à caractère personnel.
 */

const ARTICLES_CDP = [
  {
    ref: 'Art. 25 — Loi 2008-12',
    title: 'Obligation de déclaration préalable',
    desc: 'Tout traitement de données personnelles doit faire l\'objet d\'une déclaration préalable auprès de la CDP.',
    status: 'required'
  },
  {
    ref: 'Art. 42 — Loi 2008-12',
    title: 'Obligation de sécurité',
    desc: 'Le responsable du traitement doit mettre en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données.',
    status: 'required'
  },
  {
    ref: 'Art. 35 — Loi 2008-12',
    title: 'Consentement de la personne concernée',
    desc: 'Le traitement n\'est légitime que si la personne concernée a donné son consentement.',
    status: 'required'
  },
  {
    ref: 'Art. 50 — Loi 2008-12',
    title: 'Droit d\'accès et de rectification',
    desc: 'Toute personne peut demander au responsable d\'un traitement la communication de ses données et leur rectification.',
    status: 'info'
  },
  {
    ref: 'Art. 71 — Loi 2008-12',
    title: 'Sanctions pénales',
    desc: 'L\'infraction aux dispositions est punie d\'un emprisonnement de 1 à 7 ans et d\'une amende de 500 000 à 10 000 000 FCFA.',
    status: 'warning'
  }
]

export default function CDPReport({ docs, globalScore }) {
  const [companyName, setCompanyName] = useState('DataSentinel SA')
  const [responsable, setResponsable] = useState('Papa Moussa Diop')
  const [fonction, setFonction] = useState('Directeur Général')
  const [isGenerated, setIsGenerated] = useState(false)

  // Agréger les PII détectés
  const aggregated = {
    emails: docs.reduce((a, d) => a + (d.detectedFields.emails || 0), 0),
    phones: docs.reduce((a, d) => a + (d.detectedFields.phones || 0), 0),
    banking: docs.reduce((a, d) => a + (d.detectedFields.banking || 0), 0),
    identity: docs.reduce((a, d) => a + (d.detectedFields.identity || 0), 0),
    ninea: docs.reduce((a, d) => a + (d.detectedFields.ninea || 0), 0),
    waveMoney: docs.reduce((a, d) => a + (d.detectedFields.waveMoney || 0), 0),
  }

  const totalPII = Object.values(aggregated).reduce((a, b) => a + b, 0)
  const criticalFiles = docs.filter(d => d.riskScore >= 70).length
  const today = new Date().toLocaleDateString('fr-SN', { day: '2-digit', month: 'long', year: 'numeric' })

  const handleGenerate = () => {
    setIsGenerated(true)
  }

  // Déterminer le statut de conformité
  const getComplianceItems = () => {
    const items = []
    if (aggregated.identity > 0) {
      items.push({
        label: 'Données d\'identité nationale (CNI)',
        count: aggregated.identity,
        status: 'non_conforme',
        action: 'Déclaration obligatoire à la CDP + chiffrement AES-256'
      })
    }
    if (aggregated.ninea > 0) {
      items.push({
        label: 'Numéros NINEA (identification fiscale)',
        count: aggregated.ninea,
        status: 'non_conforme',
        action: 'Déclaration obligatoire + registre des traitements'
      })
    }
    if (aggregated.banking > 0 || aggregated.waveMoney > 0) {
      items.push({
        label: 'Données financières (bancaires + Mobile Money)',
        count: aggregated.banking + (aggregated.waveMoney || 0),
        status: 'non_conforme',
        action: 'Tokenisation obligatoire + consentement explicite'
      })
    }
    if (aggregated.emails > 0) {
      items.push({
        label: 'Adresses email personnelles',
        count: aggregated.emails,
        status: aggregated.emails > 500 ? 'non_conforme' : 'attention',
        action: aggregated.emails > 500 ? 'Pseudonymisation des listes + déclaration CDP' : 'Vérifier le consentement des personnes'
      })
    }
    if (aggregated.phones > 0) {
      items.push({
        label: 'Numéros de téléphone',
        count: aggregated.phones,
        status: aggregated.phones > 200 ? 'attention' : 'conforme',
        action: 'S\'assurer du consentement pour le démarchage'
      })
    }
    return items
  }

  const complianceItems = getComplianceItems()
  const nonConformeCount = complianceItems.filter(i => i.status === 'non_conforme').length

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Scale size={20} className="text-[#0D47A1]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#202124]">Rapport de Conformité CDP</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">
            Pré-déclaration automatique conforme à la Loi n° 2008-12 du Sénégal sur la protection des données personnelles
          </p>
        </div>
      </div>

      {/* Référentiel juridique */}
      <div className="bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={16} className="text-[#0D47A1]" />
          <h2 className="text-sm font-semibold text-[#202124]">Référentiel juridique applicable</h2>
        </div>
        <div className="space-y-2">
          {ARTICLES_CDP.map((art, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
                art.status === 'warning'
                  ? 'bg-red-50 border-red-200'
                  : art.status === 'required'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-100'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {art.status === 'warning' ? (
                  <AlertCircle size={14} className="text-red-600" />
                ) : art.status === 'required' ? (
                  <AlertCircle size={14} className="text-amber-600" />
                ) : (
                  <CheckCircle size={14} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    art.status === 'warning' ? 'bg-red-200 text-red-800' : 'bg-[#E8F0FE] text-[#1A73E8]'
                  }`}>
                    {art.ref}
                  </span>
                  <span className="text-xs font-semibold text-[#202124]">{art.title}</span>
                </div>
                <p className="text-xs text-[#5F6368] mt-1 leading-relaxed">{art.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire entreprise */}
      <div className="bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building size={16} className="text-[#0D47A1]" />
          <h2 className="text-sm font-semibold text-[#202124]">Informations du responsable de traitement</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Raison sociale</label>
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DADCE0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Responsable</label>
            <input
              value={responsable}
              onChange={e => setResponsable(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DADCE0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Fonction</label>
            <input
              value={fonction}
              onChange={e => setFonction(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DADCE0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <FileText size={15} />
          Générer le rapport de conformité
        </button>
      </div>

      {/* Rapport Généré */}
      {isGenerated && (
        <div className="bg-white border-2 border-[#1A73E8] rounded-xl shadow-sm overflow-hidden fade-in">
          {/* Header officiel */}
          <div className="bg-[#0D47A1] text-white px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">
                  République du Sénégal — Commission des Données Personnelles
                </div>
                <h2 className="text-lg font-bold">RAPPORT DE PRÉ-DÉCLARATION DE TRAITEMENT</h2>
                <p className="text-xs text-blue-200 mt-1">
                  Loi n° 2008-12 du 25 janvier 2008 sur la Protection des Données à Caractère Personnel
                </p>
              </div>
              <div className="text-right text-xs text-blue-200 flex-shrink-0">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar size={12} />
                  {today}
                </div>
                <div className="font-mono text-[10px]">Réf : DS-CDP-{new Date().getFullYear()}-{String(Math.floor(Math.random()*9000+1000))}</div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Section 1 : Identité */}
            <div>
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[10px] font-bold text-[#1A73E8]">1</span>
                Identification du responsable de traitement
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFF] rounded-lg">
                  <div className="text-[#5F6368] mb-0.5">Raison sociale</div>
                  <div className="font-semibold text-[#202124]">{companyName}</div>
                </div>
                <div className="p-3 bg-[#F8FAFF] rounded-lg">
                  <div className="text-[#5F6368] mb-0.5">Responsable</div>
                  <div className="font-semibold text-[#202124]">{responsable} — {fonction}</div>
                </div>
                <div className="p-3 bg-[#F8FAFF] rounded-lg">
                  <div className="text-[#5F6368] mb-0.5">Date d'analyse</div>
                  <div className="font-semibold text-[#202124]">{today}</div>
                </div>
                <div className="p-3 bg-[#F8FAFF] rounded-lg">
                  <div className="text-[#5F6368] mb-0.5">Score d'exposition global</div>
                  <div className={`font-bold ${globalScore >= 60 ? 'text-[#D93025]' : globalScore >= 30 ? 'text-[#F9AB00]' : 'text-[#1E8E3E]'}`}>
                    {globalScore}/100 — {globalScore >= 60 ? 'CRITIQUE' : globalScore >= 30 ? 'ÉLEVÉ' : 'MODÉRÉ'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 : Inventaire des données */}
            <div>
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[10px] font-bold text-[#1A73E8]">2</span>
                Inventaire des données à caractère personnel détectées
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFF] border-b border-[#DADCE0]">
                      <th className="text-left px-4 py-2.5 font-semibold text-[#5F6368]">Catégorie de données</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-[#5F6368]">Volume détecté</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#5F6368]">Classification CDP</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-[#5F6368]">Obligation légale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: 'Adresses email', vol: aggregated.emails, classif: 'Donnée personnelle', obligation: 'Consentement (Art. 35)' },
                      { cat: 'Numéros de téléphone', vol: aggregated.phones, classif: 'Donnée personnelle', obligation: 'Consentement (Art. 35)' },
                      { cat: 'Données bancaires', vol: aggregated.banking, classif: 'Donnée sensible', obligation: 'Déclaration + Chiffrement (Art. 42)' },
                      { cat: 'Mobile Money (Wave/OM)', vol: aggregated.waveMoney || 0, classif: 'Donnée sensible', obligation: 'Déclaration + Tokenisation (Art. 42)' },
                      { cat: 'Identité nationale (CNI)', vol: aggregated.identity, classif: 'Donnée très sensible', obligation: 'Autorisation CDP (Art. 25+42)' },
                      { cat: 'NINEA (identification fiscale)', vol: aggregated.ninea, classif: 'Donnée très sensible', obligation: 'Déclaration obligatoire (Art. 25)' },
                    ].filter(r => r.vol > 0).map((row, i) => (
                      <tr key={i} className="border-b border-[#F1F3F4] hover:bg-[#F8FAFF]">
                        <td className="px-4 py-2.5 font-medium text-[#202124]">{row.cat}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-[#D93025]">{row.vol.toLocaleString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            row.classif.includes('très') ? 'bg-red-100 text-red-800' :
                            row.classif.includes('sensible') ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {row.classif}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#5F6368]">{row.obligation}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F8FAFF] border-t-2 border-[#DADCE0]">
                      <td className="px-4 py-2.5 font-bold text-[#202124]">TOTAL PII</td>
                      <td className="px-4 py-2.5 text-right font-bold text-[#D93025]">{totalPII.toLocaleString()}</td>
                      <td colSpan={2} className="px-4 py-2.5 text-xs text-[#5F6368]">
                        dans {docs.length} fichiers analysés dont {criticalFiles} en risque critique
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Section 3 : Diagnostic de conformité */}
            <div>
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[10px] font-bold text-[#1A73E8]">3</span>
                Diagnostic de conformité — Actions correctives requises
              </h3>
              <div className="space-y-2">
                {complianceItems.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${
                      item.status === 'non_conforme'
                        ? 'bg-red-50 border-red-200'
                        : item.status === 'attention'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {item.status === 'non_conforme' ? (
                        <AlertCircle size={14} className="text-red-600" />
                      ) : item.status === 'attention' ? (
                        <AlertCircle size={14} className="text-amber-600" />
                      ) : (
                        <CheckCircle size={14} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#202124]">{item.label}</span>
                        <span className="text-[10px] text-[#5F6368]">({item.count.toLocaleString()} occurrences)</span>
                      </div>
                      <p className="text-xs text-[#5F6368] mt-0.5">Action : {item.action}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold flex-shrink-0 ${
                      item.status === 'non_conforme'
                        ? 'bg-red-200 text-red-800'
                        : item.status === 'attention'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {item.status === 'non_conforme' ? 'NON CONFORME' : item.status === 'attention' ? 'ATTENTION' : 'CONFORME'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4 : Fichiers concernés */}
            <div>
              <h3 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[10px] font-bold text-[#1A73E8]">4</span>
                Fichiers concernés par la déclaration
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFF] border-b border-[#DADCE0]">
                      <th className="text-left px-4 py-2 font-semibold text-[#5F6368]">Fichier</th>
                      <th className="text-left px-4 py-2 font-semibold text-[#5F6368]">Type</th>
                      <th className="text-right px-4 py-2 font-semibold text-[#5F6368]">Score risque</th>
                      <th className="text-center px-4 py-2 font-semibold text-[#5F6368]">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc.id} className="border-b border-[#F1F3F4]">
                        <td className="px-4 py-2.5 font-medium text-[#202124]">{doc.name}</td>
                        <td className="px-4 py-2.5 text-[#5F6368]">{doc.type} · {doc.size}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`font-bold ${
                            doc.riskScore >= 70 ? 'text-[#D93025]' : doc.riskScore >= 40 ? 'text-[#F9AB00]' : 'text-[#1E8E3E]'
                          }`}>
                            {doc.riskScore}/100
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            doc.status === 'secured' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {doc.status === 'secured' ? 'SÉCURISÉ' : 'À TRAITER'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conclusion */}
            <div className="border-t-2 border-[#DADCE0] pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202124]">Conclusion du diagnostic automatisé</span>
                <span className={`text-xs px-3 py-1 rounded font-bold ${
                  nonConformeCount > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {nonConformeCount > 0 ? `${nonConformeCount} NON-CONFORMITÉ(S)` : 'CONFORME'}
                </span>
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Ce rapport a été généré automatiquement par la plateforme <strong>DataSentinel</strong> à partir de l'analyse de
                {' '}<strong>{docs.length} fichiers</strong> contenant <strong>{totalPII.toLocaleString()} données personnelles</strong>.
                {nonConformeCount > 0 && (
                  <> Il identifie <strong className="text-[#D93025]">{nonConformeCount} point(s) de non-conformité</strong> nécessitant une
                  action corrective immédiate avant toute déclaration formelle auprès de la CDP du Sénégal.</>
                )}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#9AA0A6]">
                <User size={11} />
                Document préparé pour {responsable} — {companyName} — {today}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
