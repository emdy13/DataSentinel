import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, FileSearch, AlertTriangle, ShieldAlert, Download, CheckCircle2 } from 'lucide-react'
import { EXPOSURE_TREND } from '../data/mockData'
import AlertItem from './AlertItem'

/** Carte de statistique en haut du dashboard */
function StatCard({ icon: Icon, title, value, sub, valueColor, trend }) {
  return (
    <div className="card flex flex-col gap-2 bg-white border border-[#DADCE0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#5F6368] uppercase tracking-wide">{title}</span>
        <Icon size={18} className="text-[#5F6368]" />
      </div>
      <div className="text-3.5xl font-bold tracking-tight mt-1" style={{ color: valueColor || '#202124', fontSize: '1.8rem', lineHeight: '2.25rem' }}>{value}</div>
      <div className="text-xs text-[#5F6368] mt-1">{sub}</div>
      {trend && (
        <div className="text-xs font-medium mt-1" style={{ color: trend.startsWith('↓') ? '#1E8E3E' : '#D93025' }}>
          {trend} ce mois
        </div>
      )}
    </div>
  )
}

/** Tooltip personnalisé pour le line chart */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#DADCE0] rounded-lg px-3 py-2 shadow-md">
        <p className="text-xs font-semibold text-[#202124]">{label}</p>
        <p className="text-xs text-[#1A73E8]">Score : {payload[0]?.value}/100</p>
      </div>
    )
  }
  return null
}

/** Page principale du tableau de bord */
export default function Dashboard({
  docs,
  alerts,
  resolvedAlerts,
  onResolveAlert,
  globalScore,
  onDownloadPDF
}) {
  // Calculs dynamiques basés sur les documents
  const totalFiles = docs.length
  
  // Somme totale des tailles de fichiers
  const totalSize = docs.reduce((acc, d) => {
    const sizeVal = parseFloat(d.size)
    return acc + (isNaN(sizeVal) ? 0 : sizeVal)
  }, 0).toFixed(1)

  // Somme totale des champs sensibles détectés
  let totalSensitiveFields = 0
  const categoryTotals = {
    emails: 0,
    phones: 0,
    banking: 0,
    identity: 0,
    ninea: 0,
    waveMoney: 0,
  }

  docs.forEach(doc => {
    Object.keys(categoryTotals).forEach(key => {
      const val = doc.detectedFields[key] || 0
      categoryTotals[key] += val
      totalSensitiveFields += val
    })
  })

  // Formatage des catégories pour le diagramme circulaire
  const dataPie = [
    { name: 'Emails', value: categoryTotals.emails, color: '#1A73E8' },
    { name: 'Téléphones', value: categoryTotals.phones, color: '#0D47A1' },
    { name: 'Wave / OM', value: categoryTotals.waveMoney, color: '#F9AB00' },
    { name: 'Données bancaires', value: categoryTotals.banking, color: '#D93025' },
    { name: 'Identité / CNI', value: categoryTotals.identity, color: '#9C27B0' },
    { name: 'NINEA', value: categoryTotals.ninea, color: '#1E8E3E' },
  ].filter(item => item.value > 0) // N'afficher que les catégories qui ont des données

  // Si aucun document ou aucune donnée n'est détectée
  const fallbackPie = [{ name: 'Aucun risque', value: 1, color: '#E8F0FE' }]
  const activePieData = dataPie.length > 0 ? dataPie : fallbackPie

  // Nombre d'alertes actives (non résolues)
  const activeAlertsCount = alerts.filter(a => !resolvedAlerts.includes(a.id)).length

  // Évolution dynamique du graphique linéaire (le dernier point est le score réel actuel)
  const updatedTrend = EXPOSURE_TREND.map(point => {
    if (point.month === 'Jun') {
      return { ...point, score: globalScore }
    }
    return point
  })

  const scoreColor = globalScore >= 75 ? '#D93025' : (globalScore >= 40 ? '#F9AB00' : '#1E8E3E')

  return (
    <div className="p-6 space-y-6 fade-in">

      {/* En-tête avec Bouton de téléchargement PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#202124]">Tableau de bord</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">Rapport de sécurité — Juin 2026</p>
        </div>
        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Download size={16} />
          Télécharger le Rapport PDF
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={ShieldAlert}
          title="Score d'exposition"
          value={globalScore}
          sub="Indice global de risque"
          valueColor={scoreColor}
          trend={globalScore > 60 ? "↑ Critique" : "↓ Modéré"}
        />
        <StatCard
          icon={FileSearch}
          title="Fichiers analysés"
          value={totalFiles}
          sub={`${totalSize} MB total analysé`}
          valueColor="#202124"
        />
        <StatCard
          icon={TrendingUp}
          title="Données sensibles"
          value={totalSensitiveFields.toLocaleString('fr-FR')}
          sub="Champs détectés au total"
          valueColor="#0D47A1"
        />
        <StatCard
          icon={AlertTriangle}
          title="Alertes actives"
          value={activeAlertsCount}
          sub={`${resolvedAlerts.length} résolue(s)`}
          valueColor={activeAlertsCount > 0 ? "#F9AB00" : "#1E8E3E"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Line Chart */}
        <div className="card lg:col-span-3">
          <h2 className="text-sm font-semibold text-[#202124] mb-4">Évolution du score d'exposition</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={updatedTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F4" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5F6368' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#5F6368' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#1A73E8"
                strokeWidth={2.5}
                dot={{ fill: '#1A73E8', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#0D47A1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-[#202124] mb-4">Répartition des données exposées</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={activePieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {activePieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 11, color: '#5F6368' }}>{value}</span>}
              />
              <Tooltip
                formatter={(value, name) => [value.toLocaleString('fr-FR'), name]}
                contentStyle={{ fontSize: 12, borderColor: '#DADCE0', borderRadius: 6 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 border-b border-[#F1F3F4] pb-3">
          <h2 className="text-sm font-semibold text-[#202124]">Alertes actives & Remédiation</h2>
          <span className="text-xs text-[#5F6368] font-medium">
            {activeAlertsCount} alerte{activeAlertsCount > 1 ? 's' : ''} en attente
          </span>
        </div>
        <div className="divide-y divide-[#DADCE0]">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#5F6368]">Aucune alerte en cours.</div>
          ) : (
            alerts.map(alert => (
              <AlertItem
                key={alert.id}
                alert={alert}
                resolved={resolvedAlerts.includes(alert.id)}
                onResolve={onResolveAlert}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
