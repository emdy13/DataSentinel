/**
 * fileExporter.js — Export de fichiers anonymisés
 * Génération et téléchargement de fichiers CSV, JSON, Excel
 */

import * as XLSX from 'xlsx'

// ─────────────────────────────────────────────
// EXPORT CSV
// ─────────────────────────────────────────────

export function exportAsCSV(data, filename = 'anonymized_data.csv') {
  let csvContent = ''
  
  if (Array.isArray(data) && data.length > 0) {
    // Headers
    const headers = Object.keys(data[0])
    csvContent = headers.join(',') + '\n'
    
    // Rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""')
        return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped
      })
      csvContent += values.join(',') + '\n'
    })
  } else if (typeof data === 'string') {
    csvContent = data
  }
  
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

// ─────────────────────────────────────────────
// EXPORT JSON
// ─────────────────────────────────────────────

export function exportAsJSON(data, filename = 'anonymized_data.json') {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;')
}

// ─────────────────────────────────────────────
// EXPORT EXCEL
// ─────────────────────────────────────────────

export function exportAsExcel(data, filename = 'anonymized_data.xlsx') {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Données invalides pour export Excel')
    return
  }
  
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Données Anonymisées')
  
  // Génération du fichier
  XLSX.writeFile(workbook, filename)
}

// ─────────────────────────────────────────────
// EXPORT TEXTE CHIFFRÉ
// ─────────────────────────────────────────────

export function exportAsEncrypted(encryptedData, filename = 'encrypted_data.enc') {
  const content = JSON.stringify({
    version: '1.0',
    algorithm: encryptedData.algorithm,
    timestamp: encryptedData.timestamp,
    data: encryptedData.encrypted
  }, null, 2)
  
  downloadFile(content, filename, 'application/octet-stream')
}

// ─────────────────────────────────────────────
// EXPORT RAPPORT PDF (format texte)
// ─────────────────────────────────────────────

export function exportReport(report, anonymizedData, filename = 'rapport_anonymisation.txt') {
  let content = '═══════════════════════════════════════════════════════\n'
  content += '    RAPPORT D\'ANONYMISATION - DATASENTINEL IA\n'
  content += '═══════════════════════════════════════════════════════\n\n'
  
  content += `Date: ${new Date(report.timestamp).toLocaleString('fr-FR')}\n`
  content += `Nombre total de remplacements: ${report.totalReplacements}\n\n`
  
  content += '─────────────────────────────────────────────────────\n'
  content += 'TYPES DE DONNÉES ANONYMISÉES\n'
  content += '─────────────────────────────────────────────────────\n\n'
  
  report.strategies.forEach(strategy => {
    content += `• ${strategy.strategy}\n`
    content += `  IA: ${strategy.aiModel}\n\n`
  })
  
  content += '─────────────────────────────────────────────────────\n'
  content += 'CONFORMITÉ RÉGLEMENTAIRE\n'
  content += '─────────────────────────────────────────────────────\n\n'
  
  report.compliance.forEach(rule => {
    content += `✓ ${rule}\n`
  })
  
  content += '\n─────────────────────────────────────────────────────\n'
  content += 'APERÇU DES DONNÉES ANONYMISÉES\n'
  content += '─────────────────────────────────────────────────────\n\n'
  
  if (Array.isArray(anonymizedData)) {
    content += `Nombre d'enregistrements: ${anonymizedData.length}\n\n`
    if (anonymizedData.length > 0) {
      content += 'Exemple (première ligne):\n'
      content += JSON.stringify(anonymizedData[0], null, 2)
    }
  }
  
  content += '\n\n═══════════════════════════════════════════════════════\n'
  content += 'Généré par DataSentinel IA - Protection des données\n'
  content += '═══════════════════════════════════════════════════════\n'
  
  downloadFile(content, filename, 'text/plain;charset=utf-8;')
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// UTILITAIRE DE TÉLÉCHARGEMENT
// ─────────────────────────────────────────────────────────────────────────────────────────

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────
// DÉTECTION DU FORMAT ORIGINAL
// ─────────────────────────────────────────────

export function getExportFormat(originalFilename) {
  const ext = originalFilename.split('.').pop().toLowerCase()
  
  const formats = {
    csv: 'csv',
    txt: 'csv',
    xlsx: 'excel',
    xls: 'excel',
    json: 'json'
  }
  
  return formats[ext] || 'csv'
}

// ─────────────────────────────────────────────
// EXPORT AUTOMATIQUE SELON FORMAT
// ─────────────────────────────────────────────

export function exportAnonymizedData(data, originalFilename, format = 'auto') {
  const timestamp = new Date().toISOString().split('T')[0]
  const baseName = originalFilename.replace(/\.[^/.]+$/, '')
  
  const detectedFormat = format === 'auto' ? getExportFormat(originalFilename) : format
  
  switch (detectedFormat) {
    case 'csv':
      exportAsCSV(data, `${baseName}_anonymized_${timestamp}.csv`)
      break
    case 'json':
      exportAsJSON(data, `${baseName}_anonymized_${timestamp}.json`)
      break
    case 'excel':
      exportAsExcel(data, `${baseName}_anonymized_${timestamp}.xlsx`)
      break
    default:
      exportAsCSV(data, `${baseName}_anonymized_${timestamp}.csv`)
  }
}
