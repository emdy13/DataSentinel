import { jsPDF } from 'jspdf'

/**
 * Génère un rapport de sécurité PDF complet pour le jury
 * @param {Array} docs Liste des documents analysés
 * @param {number} riskScore Score global d'exposition
 */
export function generatePDFReport(docs, riskScore) {
  const doc = new jsPDF()

  // Couleurs du design system DataSentinel
  const primaryColor = [13, 71, 161] // #0D47A1
  const secondaryColor = [26, 115, 232] // #1A73E8
  const warningColor = [249, 171, 0] // #F9AB00
  const dangerColor = [217, 48, 37] // #D93025
  const textColor = [32, 33, 36] // #202124
  const lightGray = [95, 99, 104] // #5F6368

  // En-tête du document
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('DATASENTINEL', 20, 25)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Rapport de Conformité & Risques de Données', 20, 32)

  // Date du rapport
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.setTextColor(255, 255, 255)
  doc.text(`Généré le : ${dateStr}`, 130, 25)

  // 1. Synthèse globale
  doc.setFontSize(14)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('1. Résumé Exécutif', 20, 55)

  // Carte du score de risque
  doc.setFillColor(248, 250, 255)
  doc.rect(20, 62, 170, 30, 'F')
  doc.setDrawColor(218, 220, 224)
  doc.rect(20, 62, 170, 30, 'S')

  doc.setFontSize(12)
  doc.setTextColor(...textColor)
  doc.text("Score d'Exposition Global :", 28, 72)

  doc.setFontSize(24)
  const scoreColor = riskScore >= 75 ? dangerColor : (riskScore >= 40 ? warningColor : [30, 142, 62])
  doc.setTextColor(...scoreColor)
  doc.text(`${riskScore} / 100`, 28, 84)

  // Texte d'appréciation du risque
  doc.setFontSize(10)
  doc.setTextColor(...lightGray)
  let statusText = 'Niveau de risque : FAIBLE. Vos données semblent correctement sécurisées.'
  if (riskScore >= 75) {
    statusText = 'Niveau de risque : CRITIQUE. Des actions correctives sont requises immédiatement !'
  } else if (riskScore >= 50) {
    statusText = 'Niveau de risque : ÉLEVÉ. Plusieurs données sensibles sont exposées sans protection.'
  } else if (riskScore >= 25) {
    statusText = 'Niveau de risque : MODÉRÉ. Quelques fuites mineures à corriger.'
  }
  doc.text(statusText, 95, 78)

  // 2. Fichiers analysés
  doc.setFontSize(14)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('2. Fichiers & Sources de Risques', 20, 105)

  let y = 115
  docs.forEach((d, index) => {
    // Vérification de débordement de page
    if (y > 260) {
      doc.addPage()
      y = 30
    }

    doc.setFontSize(11)
    doc.setTextColor(...textColor)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${d.name} (${d.type} · ${d.size})`, 20, y)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...lightGray)
    doc.text(`Score : ${d.riskScore}/100`, 160, y)

    y += 6

    const fields = Object.entries(d.detectedFields)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => {
        const labels = {
          emails: 'Emails',
          phones: 'Téléphones',
          banking: 'Infos Bancaires',
          identity: 'CNI / Identité',
          ninea: 'NINEA',
          waveMoney: 'Mobile Money'
        }
        return `${labels[name] || name}: ${count}`
      })
      .join(', ')

    doc.setFontSize(9)
    doc.text(fields ? `Éléments détectés : ${fields}` : "Aucune donnée sensible identifiée.", 25, y)
    
    y += 10
  })

  // 3. Obligations Légales (Sénégal CDP)
  if (y > 230) {
    doc.addPage()
    y = 30
  }

  doc.setFontSize(14)
  doc.setTextColor(...primaryColor)
  doc.setFont('helvetica', 'bold')
  doc.text('3. Cadre Réglementaire & Recommandations (CDP)', 20, y + 10)
  
  y += 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...textColor)

  const textParagraphs = [
    "Conformément à la loi sénégalaise n° 2008-12 sur la protection des données à caractère personnel, toute entreprise manipulant des informations sensibles (identifiants, numéros Wave/Orange Money, CNI, données financières) est tenue de garantir leur stricte sécurité.",
    "",
    "Recommandations de DataSentinel :",
    "- Masquage et pseudonymisation : Les numéros de téléphone et CNI doivent être masqués à l'affichage.",
    "- Chiffrement fort : Les fichiers de base de données contenant des NINEA ou RIB doivent être chiffrés en AES-256.",
    "- Tokenisation bancaire : Le stockage en clair des données de cartes ou comptes est passible de sanctions par la Commission de Protection des Données Personnelles (CDP) du Sénégal.",
    "- Limitation d'accès : Seules les personnes habilitées doivent avoir accès aux informations RH ou de facturation."
  ]

  textParagraphs.forEach(para => {
    if (y > 270) {
      doc.addPage()
      y = 30
    }
    const lines = doc.splitTextToSize(para, 170)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 2
  })

  // Footer sur chaque page
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...lightGray)
    doc.text(`DataSentinel © 2026 — Rapport de sécurité confidentiel — Page ${i} sur ${pageCount}`, 20, 287)
  }

  // Télécharger le rapport
  doc.save('DataSentinel_Rapport_Securite.pdf')
}
