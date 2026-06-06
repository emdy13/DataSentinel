import { useState } from 'react'
import { Shield, Download, Lock, Cpu, CheckCircle, AlertTriangle, Sparkles, FileText, Key } from 'lucide-react'
import { 
  simulateAIProcessing, 
  encryptData, 
  generateAnonymizationReport,
  ANONYMIZATION_STRATEGIES 
} from '../utils/anonymizer'
import { 
  exportAnonymizedData, 
  exportAsEncrypted, 
  exportReport 
} from '../utils/fileExporter'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const DATA_TYPES = [
  { id: 'emails', label: 'Adresses email', icon: '📧', risk: 'high', color: 'orange' },
  { id: 'phones', label: 'Numéros de téléphone', icon: '📱', risk: 'medium', color: 'yellow' },
  { id: 'waveMoney', label: 'Mobile Money (Wave/OM)', icon: '💰', risk: 'high', color: 'orange' },
  { id: 'banking', label: 'Données bancaires', icon: '💳', risk: 'critical', color: 'red' },
  { id: 'identity', label: 'Identité / CNI', icon: '🆔', risk: 'critical', color: 'red' },
  { id: 'ninea', label: 'Numéros NINEA', icon: '🏢', risk: 'high', color: 'orange' },
]

export default function AnonymizationPanel({ docs }) {
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [anonymized, setAnonymized] = useState(null)
  const [showEncryption, setShowEncryption] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [encrypted, setEncrypted] = useState(null)
  const [originalFileData, setOriginalFileData] = useState(null)

  // Charger les données du fichier original
  const loadFileData = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    
    try {
      if (ext === 'csv') {
        return new Promise((resolve) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
          })
        })
      } else if (['xlsx', 'xls'].includes(ext)) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
            resolve(rows)
          }
          reader.readAsBinaryString(file)
        })
      } else {
        // Pour les autres formats, retourner comme texte
        const text = await file.text()
        return text
      }
    } catch (error) {
      console.error('Erreur chargement fichier:', error)
      return null
    }
  }

  const handleSelectDoc = async (doc) => {
    setSelectedDoc(doc)
    setAnonymized(null)
    setEncrypted(null)
    setSelectedTypes([])
    
    // Charger les données du fichier
    // Note: En production, il faudrait stocker le fichier original ou le recharger
    // Ici on simule avec les données déjà analysées
    setOriginalFileData(null)
  }

  const toggleType = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  const handleAnonymize = async () => {
    if (!selectedDoc || selectedTypes.length === 0) return
    
    setProcessing(true)
    setProgress(0)
    setProgressMessage('Initialisation...')
    
    try {
      // Simuler les données du fichier
      // En production, on utiliserait originalFileData
      const mockData = generateMockData(selectedDoc)
      
      // Traitement IA simulé
      const result = await simulateAIProcessing(
        mockData,
        selectedTypes,
        (prog, msg) => {
          setProgress(prog)
          setProgressMessage(msg)
        }
      )
      
      const report = generateAnonymizationReport(mockData, result, selectedTypes)
      
      setAnonymized({
        data: result.anonymized,
        count: result.count,
        report,
        originalFilename: selectedDoc.name
      })
      
    } catch (error) {
      console.error('Erreur anonymisation:', error)
      alert('Erreur lors de l\'anonymisation')
    } finally {
      setProcessing(false)
    }
  }

  const handleEncrypt = () => {
    if (!anonymized) return
    
    if (password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    
    try {
      const encryptedResult = encryptData(anonymized.data, password)
      setEncrypted(encryptedResult)
      alert('✓ Données chiffrées avec succès (AES-256)')
    } catch (error) {
      alert('Erreur lors du chiffrement: ' + error.message)
    }
  }

  const handleDownload = (format) => {
    if (!anonymized) return
    exportAnonymizedData(anonymized.data, anonymized.originalFilename, format)
  }

  const handleDownloadEncrypted = () => {
    if (!encrypted || !anonymized) return
    const filename = anonymized.originalFilename.replace(/\.[^/.]+$/, '') + '_encrypted.enc'
    exportAsEncrypted(encrypted, filename)
  }

  const handleDownloadReport = () => {
    if (!anonymized) return
    exportReport(anonymized.report, anonymized.data)
  }

  // Sélectionner automatiquement tous les types détectés
  const selectAllDetected = () => {
    if (!selectedDoc) return
    const detected = DATA_TYPES
      .filter(type => selectedDoc.detectedFields[type.id] > 0)
      .map(type => type.id)
    setSelectedTypes(detected)
  }

  const docsWithSensitiveData = docs.filter(doc => 
    Object.values(doc.detectedFields).some(count => count > 0)
  )

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#202124] flex items-center gap-2">
            <Shield className="text-[#1A73E8]" size={24} />
            Anonymisation IA des documents
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Protégez vos données sensibles avec l'intelligence artificielle
          </p>
        </div>
        
        {anonymized && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm font-medium text-green-700">
              {anonymized.count} données anonymisées
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ÉTAPE 1: Sélection du document */}
        <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="text-base font-semibold text-[#202124]">Sélectionner le document</h2>
          </div>

          {docsWithSensitiveData.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#5F6368]">
              <AlertTriangle className="mx-auto mb-2 text-gray-400" size={32} />
              Aucun document avec données sensibles
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {docsWithSensitiveData.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedDoc?.id === doc.id
                      ? 'border-[#1A73E8] bg-[#E8F0FE]'
                      : 'border-[#DADCE0] hover:border-[#1A73E8] hover:bg-[#F8FAFF]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#202124]">{doc.name}</div>
                      <div className="text-xs text-[#5F6368] mt-0.5">
                        {Object.entries(doc.detectedFields)
                          .filter(([_, count]) => count > 0)
                          .length} types détectés
                      </div>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded ${
                      doc.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                      doc.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.riskScore}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ÉTAPE 2: Sélection des types à anonymiser */}
        <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h2 className="text-base font-semibold text-[#202124]">Types de données</h2>
          </div>

          {!selectedDoc ? (
            <div className="text-center py-8 text-sm text-[#5F6368]">
              Sélectionnez d'abord un document
            </div>
          ) : (
            <>
              <button
                onClick={selectAllDetected}
                className="w-full mb-3 px-3 py-2 text-xs font-medium text-[#1A73E8] border border-[#1A73E8] rounded-lg hover:bg-[#E8F0FE] transition-colors"
              >
                Tout sélectionner (détecté)
              </button>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {DATA_TYPES.map(type => {
                  const count = selectedDoc.detectedFields[type.id] || 0
                  const isSelected = selectedTypes.includes(type.id)
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => count > 0 && toggleType(type.id)}
                      disabled={count === 0}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        count === 0 
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-[#DADCE0] hover:border-[#1A73E8] hover:bg-[#F8FAFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{type.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-[#202124]">{type.label}</div>
                            <div className="text-xs text-[#5F6368]">
                              {count > 0 ? `${count} détecté${count > 1 ? 's' : ''}` : 'Non détecté'}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* ÉTAPE 3: Traitement IA */}
        <div className="card bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="text-base font-semibold text-[#202124]">Traitement IA</h2>
          </div>

          {!selectedDoc || selectedTypes.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#5F6368]">
              <Cpu className="mx-auto mb-2 text-gray-400" size={32} />
              {!selectedDoc 
                ? 'Sélectionnez un document'
                : 'Sélectionnez au moins un type'}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bouton lancer */}
              <button
                onClick={handleAnonymize}
                disabled={processing}
                className={`w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#1A73E8] hover:bg-[#1557B0]'
                }`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Lancer l'anonymisation IA
                  </>
                )}
              </button>

              {/* Barre de progression */}
              {processing && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1A73E8] to-[#34A853] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <Cpu className="animate-pulse" size={14} />
                    <span>{progressMessage}</span>
                  </div>
                </div>
              )}

              {/* Résultat */}
              {anonymized && !processing && (
                <div className="space-y-3 pt-4 border-t border-[#DADCE0]">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-2">
                      <CheckCircle size={16} />
                      Anonymisation réussie
                    </div>
                    <div className="text-xs text-green-600">
                      {anonymized.count} données sensibles protégées
                    </div>
                  </div>

                  {/* Boutons de téléchargement */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#5F6368] uppercase">Télécharger</div>
                    
                    <button
                      onClick={() => handleDownload('auto')}
                      className="w-full py-2 px-3 text-sm bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557B0] transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Format original
                    </button>
                    
                    <button
                      onClick={() => handleDownload('csv')}
                      className="w-full py-2 px-3 text-sm border border-[#DADCE0] text-[#5F6368] rounded-lg hover:bg-[#F8FAFF] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Export CSV
                    </button>
                    
                    <button
                      onClick={() => handleDownload('json')}
                      className="w-full py-2 px-3 text-sm border border-[#DADCE0] text-[#5F6368] rounded-lg hover:bg-[#F8FAFF] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Export JSON
                    </button>
                    
                    <button
                      onClick={handleDownloadReport}
                      className="w-full py-2 px-3 text-sm border border-[#DADCE0] text-[#5F6368] rounded-lg hover:bg-[#F8FAFF] transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Rapport d'anonymisation
                    </button>
                  </div>

                  {/* Section chiffrement */}
                  <div className="pt-3 border-t border-[#DADCE0]">
                    {!showEncryption ? (
                      <button
                        onClick={() => setShowEncryption(true)}
                        className="w-full py-2 px-3 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Lock size={16} />
                        Chiffrer les données (AES-256)
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#5F6368] uppercase flex items-center gap-1">
                          <Key size={12} />
                          Chiffrement AES-256
                        </div>
                        
                        <input
                          type="password"
                          placeholder="Mot de passe (min 8 caractères)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[#DADCE0] rounded-lg focus:outline-none focus:border-[#1A73E8]"
                        />
                        
                        <input
                          type="password"
                          placeholder="Confirmer le mot de passe"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[#DADCE0] rounded-lg focus:outline-none focus:border-[#1A73E8]"
                        />
                        
                        <button
                          onClick={handleEncrypt}
                          disabled={!password || !confirmPassword}
                          className="w-full py-2 px-3 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock size={16} />
                          Chiffrer maintenant
                        </button>
                        
                        {encrypted && (
                          <button
                            onClick={handleDownloadEncrypted}
                            className="w-full py-2 px-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Download size={16} />
                            Télécharger fichier chiffré
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stratégies IA utilisées */}
      {anonymized && (
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#202124] mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={18} />
            Modèles d'IA utilisés pour l'anonymisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {anonymized.report.strategies.map((strategy, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="font-medium text-sm text-[#202124] mb-1">{strategy.strategy}</div>
                <div className="text-xs text-[#5F6368]">{strategy.aiModel}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Générer des données mockées basées sur le document analysé
function generateMockData(doc) {
  const rowCount = Math.min(doc.rowCount || 100, 100)
  const data = []
  
  for (let i = 0; i < rowCount; i++) {
    const row = {
      id: i + 1,
      nom: `Personne ${i + 1}`,
    }
    
    if (doc.detectedFields.emails > 0) {
      row.email = `personne${i + 1}@example.sn`
    }
    if (doc.detectedFields.phones > 0) {
      row.telephone = `+221 77 123 45 ${String(i).padStart(2, '0')}`
    }
    if (doc.detectedFields.identity > 0) {
      row.cni = `1234567890${i}`
    }
    if (doc.detectedFields.banking > 0) {
      row.compte = `SN12 3456 7890 1234 5678 90${i}`
    }
    if (doc.detectedFields.ninea > 0) {
      row.ninea = `SN12345678${i}`
    }
    if (doc.detectedFields.waveMoney > 0) {
      row.wave = `+221 77 999 88 ${String(i).padStart(2, '0')}`
    }
    
    data.push(row)
  }
  
  return data
}
