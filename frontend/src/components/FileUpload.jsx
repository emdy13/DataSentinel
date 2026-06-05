import { useState, useRef } from 'react'
import { UploadCloud, Eye, X, File } from 'lucide-react'
import RiskBadge from './RiskBadge'
import Heatmap from './Heatmap'
import { analyzeFile } from '../utils/fileAnalyzer'

/** Modal de détail d'un document */
function DetailModal({ doc, onClose }) {
  const fields = [
    { key: 'emails',    label: 'Adresses email',       rec: 'Masquer le domaine ou tokeniser' },
    { key: 'phones',    label: 'Numéros de téléphone', rec: 'Masquer les 4 derniers chiffres' },
    { key: 'waveMoney', label: 'Mobile Money (Wave/OM)', rec: 'Masquer le numéro de compte' },
    { key: 'banking',   label: 'Données bancaires',    rec: 'Tokeniser — conformité CDP requise' },
    { key: 'identity',  label: 'Identité / CNI',       rec: 'Chiffrer AES-256 obligatoire (Loi 2008-12)' },
    { key: 'ninea',     label: 'Numéros NINEA',        rec: 'Accès restreint aux seuls admins' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl border border-[#DADCE0] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DADCE0] sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-semibold text-lg text-[#202124]">{doc.name}</h3>
            <p className="text-xs text-[#5F6368] mt-0.5">{doc.type} · {doc.size} · {doc.uploadedAt}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F3F4] transition-colors">
            <X size={18} color="#5F6368" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5F6368] font-medium">Niveau de risque global :</span>
            <RiskBadge level={doc.riskLevel} score={doc.riskScore} />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              Détails des données détectées
            </h4>
            <div className="overflow-x-auto border border-[#DADCE0] rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFF] border-b border-[#DADCE0]">
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-[#5F6368]">Catégorie</th>
                    <th className="text-right py-2.5 px-4 text-xs font-semibold text-[#5F6368]">Nombre détecté</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-[#5F6368]">Recommandation</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(f => doc.detectedFields[f.key] > 0 && (
                    <tr key={f.key} className="border-b border-[#F1F3F4] last:border-b-0 hover:bg-[#F8FAFF]">
                      <td className="py-2.5 px-4 text-[#202124] font-medium">{f.label}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-[#D93025]">
                        {doc.detectedFields[f.key].toLocaleString('fr-FR')}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-[#5F6368]">{f.rec}</td>
                    </tr>
                  ))}
                  {fields.every(f => !(doc.detectedFields[f.key] > 0)) && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-xs text-[#5F6368]">
                        Aucune donnée sensible trouvée dans ce fichier.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cartes de chaleur (Heatmap) */}
          <Heatmap columnHeatmap={doc.columnHeatmap} />
        </div>
      </div>
    </div>
  )
}

/** Page d'upload et gestion des documents */
export default function FileUpload({ docs, setDocs, onAddTimelineEvent }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPhase, setUploadPhase] = useState('') // 'uploading' | 'analyzing' | ''
  const [selectedDoc, setSelectedDoc] = useState(null)
  const fileRef = useRef()

  // Analyse d'un fichier réel
  const processFile = async (file) => {
    setUploading(true)
    setUploadProgress(10)
    setUploadPhase('uploading')

    // Simulation visuelle de progression rapide
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 100)

    try {
      // Analyse réelle du fichier côté client
      const analyzedDoc = await analyzeFile(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadPhase('analyzing')

      setTimeout(() => {
        // Enregistrer le document
        setDocs(prev => [analyzedDoc, ...prev])
        setUploading(false)
        setUploadPhase('')

        // Logguer l'événement dans la timeline
        const dangerTypes = Object.entries(analyzedDoc.detectedFields)
          .filter(([_, count]) => count > 0)
          .map(([name]) => name === 'waveMoney' ? 'Mobile Money' : name)
          .join(', ')

        onAddTimelineEvent({
          id: Date.now(),
          type: 'upload',
          category: 'Fichier',
          time: 'À l\'instant',
          title: `Fichier analysé : ${analyzedDoc.name}`,
          description: `Analyse complétée avec succès. ${analyzedDoc.rowCount || 0} lignes scannées. Score : ${analyzedDoc.riskScore}/100.`,
          details: dangerTypes ? `Données : ${dangerTypes}` : 'Sain'
        })

        // Si des alertes critiques sont trouvées, lever une alerte
        if (analyzedDoc.riskScore >= 50) {
          onAddTimelineEvent({
            id: Date.now() + 1,
            type: 'alert',
            category: 'Sécurité',
            time: 'À l\'instant',
            title: `Alerte de sécurité levée sur ${analyzedDoc.name}`,
            description: `Le score de risque est élevé (${analyzedDoc.riskScore}/100). Contient des données personnelles non protégées.`,
            details: analyzedDoc.riskLevel.toUpperCase()
          })
        }
      }, 1000)

    } catch (error) {
      clearInterval(progressInterval)
      setUploading(false)
      setUploadPhase('')
      alert(`Erreur lors de l'analyse du fichier : ${error.message}`)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    processFile(file)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    processFile(file)
  }

  const scoreColor = (s) => s >= 75 ? '#D93025' : s >= 40 ? '#F9AB00' : '#1E8E3E'

  return (
    <div className="p-6 space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-semibold text-[#202124]">Documents</h1>
        <p className="text-sm text-[#5F6368] mt-0.5">Uploadez vos fichiers pour détecter les données sensibles en temps réel</p>
      </div>

      {/* Drop Zone */}
      <div
        className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all hover:bg-[#E8F0FE]/30"
        style={{ borderColor: '#1A73E8', backgroundColor: '#E8F0FE'/10 }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current.click()}
      >
        <UploadCloud size={48} className="text-[#1A73E8]" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-sm font-semibold text-[#0D47A1]">Glissez vos fichiers ici ou cliquez pour parcourir</p>
          <p className="text-xs text-[#5F6368] mt-1">Formats supportés : CSV, Excel (XLSX/XLS), JSON, TXT — Max 10 MB</p>
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange}
          accept=".csv,.xlsx,.xls,.pdf,.json,.txt" />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="card bg-white border border-[#DADCE0] rounded-xl p-5 shadow-sm fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#202124]">
              {uploadPhase === 'uploading' ? 'Chargement et lecture du fichier...' : '🔍 Analyse sémantique & Détection de patterns...'}
            </span>
            <span className="text-xs text-[#5F6368] font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#E8F0FE] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1A73E8] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[#202124] mb-4">Fichiers analysés ({docs.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DADCE0]">
                {['Nom du fichier','Type','Taille','Date','Score','Risque','Action'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold text-[#5F6368] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id} className="border-b border-[#F1F3F4] hover:bg-[#F8FAFF] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <File size={14} className="text-[#5F6368]" />
                      <span className="font-semibold text-[#202124] truncate max-w-[200px]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#E8F0FE] text-[#1A73E8]">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#5F6368]">{doc.size}</td>
                  <td className="py-3 pr-4 text-[#5F6368]">{doc.uploadedAt}</td>
                  <td className="py-3 pr-4">
                    <span className="font-bold text-sm" style={{ color: scoreColor(doc.riskScore) }}>
                      {doc.riskScore}
                    </span>
                    <span className="text-xs text-[#5F6368]">/100</span>
                  </td>
                  <td className="py-3 pr-4">
                    <RiskBadge level={doc.riskLevel} />
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#DADCE0] hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all"
                    >
                      <Eye size={13} />
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoc && <DetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </div>
  )
}
