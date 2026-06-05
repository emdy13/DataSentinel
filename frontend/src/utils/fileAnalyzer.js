/**
 * fileAnalyzer.js — Moteur d'analyse DataSentinel
 * Analyse réelle des fichiers CSV/Excel côté client
 * Détection de patterns sénégalais spécifiques
 */

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// ─────────────────────────────────────────────
// REGEX PATTERNS — Données personnelles générales
// ─────────────────────────────────────────────

const PATTERNS = {
  emails: {
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    label: 'Adresses email',
    risk: 'high',
  },
  phones: {
    // Numéros sénégalais : +221 7x, 77, 78, 70, 76, 75, 33 (fixes)
    // Aussi formats internationaux génériques
    regex: /(?:\+221\s?)?(?:(?:77|78|70|76|75|33)\s?(?:\d{3}\s?\d{2}\s?\d{2}|\d{7}))|(?:\+\d{1,3}[\s\-]?\d{6,12})/g,
    label: 'Numéros de téléphone',
    risk: 'medium',
  },
  banking: {
    // IBAN, numéros carte bancaire, RIB sénégalais, comptes Wave/OM
    regex: /(?:[0-9]{4}[\s\-]?){3}[0-9]{4}|SN\d{2}[A-Z0-9]{20,30}|(?:IBAN|RIB|Compte)\s*:?\s*[\dA-Z\s]{10,34}/gi,
    label: 'Données bancaires',
    risk: 'critical',
  },
  identity: {
    // CNI sénégalaise : 1 à 2 lettres + 9-12 chiffres, ou "CNI" près d'un numéro
    regex: /(?:(?:CNI|CIN|NI|Identité|carte\s+nationale)\s*:?\s*)?[0-9]{9,12}(?!\d)/g,
    label: 'Identité / CNI',
    risk: 'critical',
  },
  ninea: {
    // NINEA sénégalais : SN suivi de chiffres, ou 9 chiffres + 2 lettres, ou patterns courants
    regex: /(?:SN\d{9}|NINEA\s*:?\s*[\d]{7,9}[A-Z]{1,2}|\b\d{7}[A-Z]\d[A-Z]\b)/gi,
    label: 'Numéros NINEA',
    risk: 'high',
  },
  waveMoney: {
    // Numéros Wave Sénégal : 77 xxx xx xx (opérateur Wave = 77 principalement)
    regex: /\b(?:\+221\s?)?7[0-8]\d{7}\b/g,
    label: 'Numéros Mobile Money (Wave/OM)',
    risk: 'high',
    isSenegalese: true,
  },
}

// ─────────────────────────────────────────────
// ANALYSE D'UNE VALEUR TEXTUELLE
// ─────────────────────────────────────────────

function analyzeText(text) {
  const results = {}
  for (const [key, cfg] of Object.entries(PATTERNS)) {
    cfg.regex.lastIndex = 0
    const matches = text.match(cfg.regex) || []
    results[key] = matches.length
  }
  return results
}

// ─────────────────────────────────────────────
// ANALYSE PAR COLONNE (pour la heatmap)
// ─────────────────────────────────────────────

function analyzeColumns(rows) {
  if (!rows || rows.length === 0) return {}
  const headers = Object.keys(rows[0])
  const columnStats = {}

  for (const header of headers) {
    const combined = rows.map(r => String(r[header] || '')).join(' ')
    columnStats[header] = analyzeText(combined)
  }
  return columnStats
}

// ─────────────────────────────────────────────
// CALCUL DU SCORE DE RISQUE
// ─────────────────────────────────────────────

export function computeRiskScore(detectedFields) {
  const weights = {
    banking: 40,
    identity: 35,
    ninea: 25,
    waveMoney: 20,
    emails: 15,
    phones: 10,
  }
  let raw = 0
  for (const [key, count] of Object.entries(detectedFields)) {
    const w = weights[key] || 10
    if (count > 0) {
      raw += Math.min(w, w * Math.log10(count + 1) / 2)
    }
  }
  const score = Math.min(100, Math.round(raw))
  return score
}

export function riskLevel(score) {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}

// ─────────────────────────────────────────────
// PARSE CSV
// ─────────────────────────────────────────────

async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: reject,
    })
  })
}

// ─────────────────────────────────────────────
// PARSE EXCEL (xlsx)
// ─────────────────────────────────────────────

async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsBinaryString(file)
  })
}

// ─────────────────────────────────────────────
// PARSE TEXTE (PDF simulé / TXT / JSON)
// ─────────────────────────────────────────────

async function parseText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve([{ _content: e.target.result }])
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// ─────────────────────────────────────────────
// ANALYSEUR PRINCIPAL
// ─────────────────────────────────────────────

export async function analyzeFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  let rows = []
  try {
    if (ext === 'csv' || ext === 'txt') {
      rows = await parseCSV(file)
    } else if (['xlsx', 'xls'].includes(ext)) {
      rows = await parseExcel(file)
    } else if (ext === 'json') {
      const text = await file.text()
      try {
        const data = JSON.parse(text)
        rows = Array.isArray(data) ? data : [data]
      } catch {
        rows = [{ _content: text }]
      }
    } else {
      // PDF, etc. → lire comme texte brut
      rows = await parseText(file)
    }
  } catch {
    rows = []
  }

  // Analyse globale (tous champs combinés)
  const allText = rows.map(r => Object.values(r).join(' ')).join('\n')
  const detectedFields = analyzeText(allText)

  // Analyse par colonne pour la heatmap
  const columnHeatmap = analyzeColumns(rows)

  // Score et niveau
  const score = computeRiskScore(detectedFields)
  const level = riskLevel(score)

  // Taille fichier
  const sizeKB = (file.size / 1024).toFixed(0)
  const sizeStr = sizeKB > 1024
    ? `${(sizeKB / 1024).toFixed(1)} MB`
    : `${sizeKB} KB`

  // Extraire les emails réels trouvés (limité à 10 pour l'affichage de l'audit)
  const matchedEmails = allText.match(PATTERNS.emails.regex) || []
  const uniqueEmails = [...new Set(matchedEmails.map(e => e.toLowerCase()))].slice(0, 10)

  return {
    id: Date.now(),
    name: file.name,
    size: sizeStr,
    type: ext.toUpperCase(),
    uploadedAt: new Date().toISOString().split('T')[0],
    status: 'analyzed',
    riskLevel: level,
    riskScore: score,
    detectedFields,
    columnHeatmap,
    uniqueEmails,
    rowCount: rows.length,
  }
}

// Export des patterns labels pour affichage
export const FIELD_LABELS = Object.fromEntries(
  Object.entries(PATTERNS).map(([k, v]) => [k, v.label])
)
