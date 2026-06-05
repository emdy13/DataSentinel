import { useState } from 'react'
import { Shield, Mail, Lock, ArrowRight, Database, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const defaultEmail = 'moustapha.diop@cdp.sn'
  const defaultPassword = 'Dakar2026!'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    if (email === defaultEmail && password === defaultPassword) {
      setLoading(true)
      // Simuler une petite transition de connexion pour faire premium
      setTimeout(() => {
        setLoading(false)
        onLogin({
          name: 'Moustapha Diop',
          email: defaultEmail,
          role: 'DPO & Auditeur Principal',
          avatarInitials: 'MD'
        })
      }, 1000)
    } else {
      setError('Identifiants invalides. Veuillez vérifier l\'email ou le mot de passe.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFF] overflow-hidden">
      
      {/* SECTION GAUCHE : PRÉSENTATION DE LA PLATEFORME (FOND BLANC, STYLE PRO & IA) */}
      <div className="relative md:w-7/12 bg-white flex flex-col justify-between p-8 md:p-16 text-slate-800 border-r border-slate-200/80 overflow-hidden">
        
        {/* Lignes de couleurs discrètes rappelant le drapeau du Sénégal */}
        <div className="absolute top-0 left-0 w-full h-[4px] flex">
          <div className="w-1/3 h-full bg-[#1E8E3E]" />
          <div className="w-1/3 h-full bg-[#FFD300]" />
          <div className="w-1/3 h-full bg-[#D93025]" />
        </div>

        {/* Trame de fond géométrique & Connexions IA ultra-subtiles */}
        <div className="absolute inset-0 opacity-[0.6] pointer-events-none select-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F5F9" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Lignes et nœuds de réseau IA légers */}
            <g stroke="#1A73E8" strokeWidth="0.8" strokeOpacity="0.08" fill="#1A73E8" fillOpacity="0.06">
              <line x1="80" y1="160" x2="220" y2="100" />
              <line x1="220" y1="100" x2="380" y2="240" />
              <line x1="80" y1="160" x2="280" y2="380" />
              <line x1="280" y1="380" x2="380" y2="240" />
              <line x1="380" y1="240" x2="520" y2="160" />
              <line x1="280" y1="380" x2="500" y2="440" />
              <line x1="520" y1="160" x2="500" y2="440" />
              
              <circle cx="80" cy="160" r="4.5" />
              <circle cx="220" cy="100" r="3" />
              <circle cx="380" cy="240" r="5.5" />
              <circle cx="280" cy="380" r="4.5" />
              <circle cx="520" cy="160" r="3.5" />
              <circle cx="500" cy="440" r="4" />
            </g>
          </svg>
        </div>

        {/* En-tête / Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1A73E8] to-[#1E8E3E] flex items-center justify-center shadow-md shadow-[#1A73E8]/10">
            <Shield size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Data<span className="text-[#1A73E8]">Sentinel</span>
          </span>
        </div>

        {/* Cœur de la présentation */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-2xl">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F5F9] border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#1E8E3E] inline-block animate-pulse" />
              Sénégal · Cybersécurité & Conformité
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
              Protégez vos données. <br />
              <span className="bg-gradient-to-r from-[#1A73E8] via-[#0D47A1] to-[#1E8E3E] bg-clip-text text-transparent">
                Sécurisez votre Sénégal numérique.
              </span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-lg leading-relaxed">
              La solution d'audit automatisée pour l'identification des données personnelles exposées, l'atténuation des menaces et la mise en conformité réglementaire CDP.
            </p>
          </div>

          {/* Grille des caractéristiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            
            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E8E3E]/8 flex items-center justify-center flex-shrink-0 text-[#1E8E3E] border border-[#1E8E3E]/10">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Conformité Loi 2008-12</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Alignez vos traitements de données sur les directives strictes de la Commission de Protection des Données (CDP).
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/8 flex items-center justify-center flex-shrink-0 text-[#1A73E8] border border-[#1A73E8]/10">
                <Database size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Analyse Smart PII</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Détection des identités sénégalaises (CNI, NINEA) et masquage des comptes mobiles Wave/Orange Money.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#D93025]/8 flex items-center justify-center flex-shrink-0 text-[#D93025] border border-[#D93025]/10">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Rapports d'Impact</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Générez instantanément des rapports PDF exhaustifs détaillant les risques de fuites et les correctifs prioritaires.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#5F6368]/8 flex items-center justify-center flex-shrink-0 text-slate-700 border border-[#5F6368]/10">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Audits Actifs</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Surveillance des vulnérabilités applicatives (CVE) et simulation proactive d'attaques de phishing.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bas de page / Footer gauche */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-100">
          <span>© 2026 DataSentinel Sénégal</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E8E3E]" />
            Conforme CDP
          </span>
        </div>
      </div>

      {/* SECTION DROITE : FORMULAIRE DE CONNEXION */}
      <div className="md:w-5/12 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portail d'accès</h2>
            <p className="text-sm text-slate-500">Connectez-vous pour accéder à l'interface d'audit de sécurité.</p>
          </div>

          {/* Formulaire principal */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex gap-2">
                  <span className="font-bold flex-shrink-0">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                  Adresse e-mail professionnelle
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-slate-400" size={16} />
                  <input
                    id="email"
                    type="email"
                    placeholder="nom.prenom@cdp.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 outline-none rounded-xl transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400" size={16} />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]/20 outline-none rounded-xl transition-all text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#1A73E8] hover:bg-[#0D47A1] active:bg-[#0D47A1] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 group disabled:opacity-75"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Accès réservé aux auditeurs académiques et aux membres de la Commission de Protection des Données Personnelles du Sénégal (CDP).
          </p>

        </div>
      </div>
      
    </div>
  )
}
