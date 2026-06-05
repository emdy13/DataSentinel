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
      }, 1200)
    } else {
      setError('Identifiants invalides. Veuillez vérifier l\'email ou le mot de passe.')
    }
  }

  const handleAutofill = () => {
    setEmail(defaultEmail)
    setPassword(defaultPassword)
    setError('')
    
    // Auto-connexion pour une expérience fluide
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin({
        name: 'Moustapha Diop',
        email: defaultEmail,
        role: 'DPO & Auditeur Principal',
        avatarInitials: 'MD'
      })
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFF] overflow-hidden">
      
      {/* SECTION GAUCHE : PRÉSENTATION & IDENTITÉ VISUELLE SÉNÉGALAISE */}
      <div className="relative md:w-7/12 bg-slate-950 flex flex-col justify-between p-8 md:p-16 text-white overflow-hidden">
        {/* Glows d'ambiance décoratifs */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-[#1A73E8]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-[#1E8E3E]/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-[#D93025]/5 blur-[90px] pointer-events-none" />

        {/* Lignes de couleurs discrètes rappelant le drapeau du Sénégal */}
        <div className="absolute top-0 left-0 w-full h-[4px] flex">
          <div className="w-1/3 h-full bg-[#1E8E3E]" />
          <div className="w-1/3 h-full bg-[#FFD300]" />
          <div className="w-1/3 h-full bg-[#D93025]" />
        </div>

        {/* En-tête / Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1A73E8] to-[#1E8E3E] flex items-center justify-center shadow-lg shadow-[#1A73E8]/20">
            <Shield size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Data<span className="text-[#1A73E8]">Sentinel</span>
          </span>
        </div>

        {/* Cœur de la présentation */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-2xl">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#1A73E8] border border-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#1E8E3E] inline-block animate-pulse" />
              Sénégal · Cybersécurité & Conformité
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Protégez vos données. <br />
              <span className="bg-gradient-to-r from-[#1A73E8] via-[#FFD300] to-[#1E8E3E] bg-clip-text text-transparent">
                Sécurisez votre Sénégal numérique.
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
              La solution d'audit automatisée pour l'identification des données personnelles exposées, l'atténuation des menaces et la mise en conformité réglementaire CDP.
            </p>
          </div>

          {/* Grille des caractéristiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            
            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#1E8E3E]">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Conformité Loi 2008-12</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Alignez vos traitements de données sur les directives strictes de la Commission de Protection des Données (CDP).
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#1A73E8]">
                <Database size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Analyse Smart PII</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Détection des identités sénégalaises (CNI, NINEA) et masquage des comptes mobiles Wave/Orange Money.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#D93025]">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Rapports d'Impact</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Générez instantanément des rapports PDF exhaustifs détaillant les risques de fuites et les correctifs prioritaires.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Audits Actifs</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Surveillance des vulnérabilités applicatives (CVE) et simulation proactive d'attaques de phishing.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bas de page / Footer gauche */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-white/5">
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

            <div className="relative flex py-2 items-center text-slate-300">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Mode Évaluation</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Carte d'accès Démo rapide */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-base mt-0.5 select-none">🇸🇳</span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Compte de test officiel CDP</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Utilisez ce compte préconfiguré de l'Auditeur Général pour explorer toutes les données de simulation.
                  </p>
                </div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200/50 text-[10px] font-mono text-slate-600 flex flex-col gap-0.5">
                <div>Email : <span className="font-bold text-slate-800">{defaultEmail}</span></div>
                <div>Pass  : <span className="font-bold text-slate-800">{defaultPassword}</span></div>
              </div>
              <button
                onClick={handleAutofill}
                disabled={loading}
                className="w-full py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-75 shadow-sm shadow-emerald-600/10"
              >
                ⚡ Démo en un clic
              </button>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Accès réservé aux auditeurs académiques et aux membres de la Commission de Protection des Données Personnelles du Sénégal (CDP).
          </p>

        </div>
      </div>
      
    </div>
  )
}
