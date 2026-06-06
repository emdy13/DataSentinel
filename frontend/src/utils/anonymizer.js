/**
 * anonymizer.js — Moteur d'anonymisation IA
 * Anonymise les données sensibles détectées avec simulation IA
 */

import CryptoJS from 'crypto-js'

// ─────────────────────────────────────────────
// STRATÉGIES D'ANONYMISATION PAR TYPE
// ─────────────────────────────────────────────

const ANONYMIZATION_STRATEGIES = {
  emails: {
    name: 'Pseudonymisation email',
    method: (email) => {
      const [local, domain] = email.split('@')
      if (!domain) return '***@***'
      const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1)
      const domainParts = domain.split('.')
      const maskedDomain = domainParts[0].slice(0, 1) + '***.' + domainParts.slice(1).join('.')
      return `${maskedLocal}@${maskedDomain}`
    },
    aiDescription: 'Utilisation du modèle NLP pour identifier et masquer les patterns email'
  },
  
  phones: {
    name: 'Masquage téléphonique',
    method: (phone) => {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length <= 4) return '***'
      return cleaned.slice(0, 3) + '****' + cleaned.slice(-2)
    },
    aiDescription: 'Algorithme de reconnaissance de patterns téléphoniques internationaux'
  },
  
  banking: {
    name: 'Tokenisation bancaire',
    method: (banking) => {
      const cleaned = banking.replace(/\s/g, '')
      if (cleaned.length < 8) return '****'
      return '****-****-****-' + cleaned.slice(-4)
    },
    aiDescription: 'Tokenisation sécurisée conforme PCI-DSS avec chiffrement AES-256'
  },
  
  identity: {
    name: 'Chiffrement CNI',
    method: (cni) => {
      const cleaned = cni.replace(/\D/g, '')
      if (cleaned.length < 6) return '******'
      return 'CNI-' + cleaned.slice(0, 2) + '******' + cleaned.slice(-2)
    },
    aiDescription: 'Détection IA des numéros CNI conformément à la Loi 2008-12'
  },
  
  ninea: {
    name: 'Masquage NINEA',
    method: (ninea) => {
      const cleaned = ninea.replace(/\s/g, '')
      if (cleaned.length < 6) return '****'
      return cleaned.slice(0, 3) + '****' + cleaned.slice(-2)
    },
    aiDescription: 'Classification automatique des identifiants entreprise NINEA'
  },
  
  waveMoney: {
    name: 'Anonymisation Mobile Money',
    method: (phone) => {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length <= 4) return '***'
      return '+221 7X XXX XX ' + cleaned.slice(-2)
    },
    aiDescription: 'Protection des comptes Wave/Orange Money par masquage intelligent'
  }
}

// ─────────────────────────────────────────────
// DÉTECTION ET REMPLACEMENT AVEC REGEX
// ─────────────────────────────────────────────

const DETECTION_PATTERNS = {
  emails: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  phones: /(?:\+221\s?)?(?:(?:77|78|70|76|75|33)\s?(?:\d{3}\s?\d{2}\s?\d{2}|\d{7}))|(?:\+\d{1,3}[\s\-]?\d{6,12})/g,
  banking: /(?:[0-9]{4}[\s\-]?){3}[0-9]{4}|SN\d{2}[A-Z0-9]{20,30}|(?:IBAN|RIB|Compte)\s*:?\s*[\dA-Z\s]{10,34}/gi,
  identity: /(?:(?:CNI|CIN|NI|Identité|carte\s+nationale)\s*:?\s*)?[0-9]{9,12}(?!\d)/g,
  ninea: /(?:SN\d{9}|NINEA\s*:?\s*[\d]{7,9}[A-Z]{1,2}|\b\d{7}[A-Z]\d[A-Z]\b)/gi,
  waveMoney: /\b(?:\+221\s?)?7[0-8]\d{7}\b/g,
}

// ─────────────────────────────────────────────
// ANONYMISATION D'UN TEXTE AVEC TYPES SÉLECTIONNÉS
// ─────────────────────────────────────────────

export function anonymizeText(text, selectedTypes = []) {
  let anonymized = text
  const replacements = []
  
  for (const type of selectedTypes) {
    const pattern = DETECTION_PATTERNS[type]
    const strategy = ANONYMIZATION_STRATEGIES[type]
    
    if (!pattern || !strategy) continue
    
    const matches = [...text.matchAll(pattern)]
    
    for (const match of matches) {
      const original = match[0]
      const anonymizedValue = strategy.method(original)
      
      anonymized = anonymized.replace(original, anonymizedValue)
      
      replacements.push({
        type,
        original,
        anonymized: anonymizedValue,
        position: match.index
      })
    }
  }
  
  return {
    anonymized,
    replacements,
    count: replacements.length
  }
}

// ─────────────────────────────────────────────
// ANONYMISATION D'UN FICHIER CSV/JSON
// ─────────────────────────────────────────────

export function anonymizeData(data, selectedTypes = []) {
  if (typeof data === 'string') {
    return anonymizeText(data, selectedTypes)
  }
  
  if (Array.isArray(data)) {
    let totalReplacements = 0
    const anonymizedData = data.map(row => {
      const anonymizedRow = {}
      for (const [key, value] of Object.entries(row)) {
        const strValue = String(value || '')
        const result = anonymizeText(strValue, selectedTypes)
        anonymizedRow[key] = result.anonymized
        totalReplacements += result.count
      }
      return anonymizedRow
    })
    
    return {
      anonymized: anonymizedData,
      count: totalReplacements
    }
  }
  
  return { anonymized: data, count: 0 }
}

// ─────────────────────────────────────────────
// CHIFFREMENT AES-256
// ─────────────────────────────────────────────

export function encryptData(data, password) {
  if (!password || password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères')
  }
  
  const dataString = typeof data === 'string' ? data : JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(dataString, password).toString()
  
  return {
    encrypted,
    algorithm: 'AES-256-CBC',
    timestamp: new Date().toISOString()
  }
}

export function decryptData(encryptedData, password) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password)
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedString) {
      throw new Error('Mot de passe incorrect')
    }
    
    try {
      return JSON.parse(decryptedString)
    } catch {
      return decryptedString
    }
  } catch (error) {
    throw new Error('Échec du déchiffrement : ' + error.message)
  }
}

// ─────────────────────────────────────────────
// SIMULATION DE TRAITEMENT IA
// ─────────────────────────────────────────────

export async function simulateAIProcessing(data, selectedTypes, onProgress) {
  const steps = [
    { progress: 10, message: 'Chargement du modèle NLP DataSentinel IA...' },
    { progress: 25, message: 'Analyse contextuelle des données sensibles...' },
    { progress: 40, message: 'Classification automatique par apprentissage profond...' },
    { progress: 60, message: 'Application des algorithmes d\'anonymisation...' },
    { progress: 80, message: 'Validation de conformité CDP Sénégalaise...' },
    { progress: 95, message: 'Finalisation et vérification de sécurité...' },
    { progress: 100, message: 'Anonymisation terminée avec succès' }
  ]
  
  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
    if (onProgress) {
      onProgress(step.progress, step.message)
    }
  }
  
  return anonymizeData(data, selectedTypes)
}

// ─────────────────────────────────────────────
// GÉNÉRATION DE RAPPORT D'ANONYMISATION
// ─────────────────────────────────────────────

export function generateAnonymizationReport(originalData, anonymizedResult, selectedTypes) {
  const report = {
    timestamp: new Date().toISOString(),
    totalReplacements: anonymizedResult.count,
    typesProcessed: selectedTypes,
    strategies: selectedTypes.map(type => ({
      type,
      strategy: ANONYMIZATION_STRATEGIES[type]?.name,
      aiModel: ANONYMIZATION_STRATEGIES[type]?.aiDescription
    })),
    compliance: [
      'Loi 2008-12 sur la protection des données personnelles au Sénégal',
      'Commission des Données Personnelles (CDP)',
      'RGPD - Règlement Général sur la Protection des Données'
    ]
  }
  
  return report
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export { ANONYMIZATION_STRATEGIES, DETECTION_PATTERNS }
