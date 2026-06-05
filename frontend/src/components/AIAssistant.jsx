import { useState, useRef, useEffect } from 'react'
import { Shield, Send } from 'lucide-react'
import { getAIResponse } from '../data/mockData'

const SUGGESTIONS = [
  'Quel est mon niveau de risque ?',
  'Quel fichier est le plus dangereux ?',
  'Que faire en priorité ?',
  'Expliquez les données bancaires',
  'Quels sont mes NINEA exposés ?',
]

/** Formate les réponses avec du markdown basique (gras, italique, listes à puces et ordonnées) */
function FormattedText({ text }) {
  const lines = text.split('\n')
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        let trimmed = line.trim()
        if (!trimmed) return <div key={index} className="h-1" />

        // Détection des listes à puces (- ou * ou • suivis d'un espace)
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')
        if (isBullet) {
          trimmed = trimmed.replace(/^[-*•]\s+/, '')
        }

        // Détection des listes ordonnées (ex: 1. ou 2. suivis d'un espace)
        const isNumbered = /^\d+\.\s+/.test(trimmed)
        let numberPrefix = ''
        if (isNumbered) {
          numberPrefix = trimmed.match(/^\d+\.\s+/)[0]
          trimmed = trimmed.substring(numberPrefix.length)
        }

        // Parseur interne pour le gras et l'italique
        const parseFormatting = (str) => {
          const boldParts = str.split(/\*\*(.*?)\*\*/g)
          return boldParts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="font-bold text-[#202124]">{parseItalic(part)}</strong>
            }
            return parseItalic(part)
          })
        }

        const parseItalic = (str) => {
          const italicParts = str.split(/\*(.*?)\*/g)
          return italicParts.map((part, i) => {
            if (i % 2 === 1) {
              return <em key={i} className="italic text-[#1A73E8] font-medium">{part}</em>
            }
            return part
          })
        }

        const parsedContent = parseFormatting(trimmed)

        if (isBullet) {
          return (
            <div key={index} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-[#1A73E8] text-xs leading-none select-none mt-1.5">•</span>
              <p className="text-xs leading-relaxed text-[#202124] flex-1">{parsedContent}</p>
            </div>
          )
        }

        if (isNumbered) {
          return (
            <div key={index} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-[#1A73E8] font-bold text-xs leading-relaxed select-none">{numberPrefix}</span>
              <p className="text-xs leading-relaxed text-[#202124] flex-1">{parsedContent}</p>
            </div>
          )
        }

        return (
          <p key={index} className="text-xs leading-relaxed text-[#202124]">
            {parsedContent}
          </p>
        )
      })}
    </div>
  )
}

/** Sidebar chatbot IA avec option demi-plein écran (style Claude/ChatGPT) et effet de frappe progressif */
export default function AIAssistant({ triggerMessage }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: 'Bonjour ! Je suis votre assistant DataSentinel. Je peux analyser vos risques, identifier vos fichiers sensibles et vous donner des recommandations personnalisées.',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const bottomRef = useRef()
  const intervalRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (triggerMessage) {
      setIsExpanded(true)
      sendMessage(triggerMessage)
    }
  }, [triggerMessage])

  // Nettoyage de l'intervalle d'effet de frappe si le composant s'unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Fonction pour afficher progressivement le texte mot par mot
  function streamText(aiText) {
    const aiMsgId = Date.now() + 1
    
    // Initialise le message de l'IA à vide
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'ai',
      text: '',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }])
    setThinking(false)

    const words = aiText.split(' ')
    let currentText = ''
    let wordIndex = 0

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex]
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m))
        wordIndex++
      } else {
        clearInterval(intervalRef.current)
      }
    }, 25) // 25ms par mot pour une écriture fluide et dynamique
  }

  async function sendMessage(text) {
    if (!text.trim() || thinking) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setThinking(true)

    try {
      const systemPrompt = `Tu es l'assistant IA officiel de DataSentinel, une plateforme professionnelle sénégalaise de protection des données et de cybersécurité. 
Tu aides les auditeurs et le jury académique à comprendre les risques de sécurité et d'exposition des PII (Données d'Identification Personnelles) au Sénégal.
Directives importantes :
- Sois concis, direct et réponds toujours en français.
- Réfère-toi souvent à la loi sénégalaise n° 2008-12 sur la protection des données personnelles, à la CDP (Commission de protection des Données Personnelles du Sénégal).
- Cite les risques et ressources de l'application : le fichier critique 'base_clients_2024.csv' (1 240 emails, numéros de cartes, numéros Wave/Orange Money non masqués), la vulnérabilité CVE-2023-32243 sur WordPress 6.2 (score CVSS 9.8), et l'historique d'audit stocké en base H2.
- Utilise des puces et du gras pour structurer tes recommandations.`;

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: text.trim() }
      ];

      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Clé API Groq non configurée');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Erreur API Groq');
      }

      const data = await response.json();
      const aiText = data.choices[0].message.content;
      streamText(aiText)
    } catch (error) {
      console.warn('Fallback sur les réponses simulées de DataSentinel suite à une erreur :', error);
      streamText(getAIResponse(text))
    }
  }


  // Rendu du contenu interne du chat (plein écran uniquement)
  const renderChatContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#DADCE0]">
        <div className="w-8 h-8 rounded-full bg-[#1A73E8] flex items-center justify-center">
          <Shield size={16} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#202124]">Assistant DataSentinel</p>
          <p className="text-[10px] text-[#1E8E3E] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E8E3E] inline-block" />
            En ligne · Llama 3.1 via Groq
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="ml-auto p-2 rounded-lg text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] transition-colors"
          title="Fermer l'assistant"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Suggested questions */}
      <div className="px-4 py-3 border-b border-[#F1F3F4] bg-[#F8F9FA]">
        <p className="text-[11px] text-[#5F6368] mb-2 font-medium uppercase tracking-wide">Questions suggérées</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs px-2.5 py-1.5 rounded-full border border-[#DADCE0] text-[#1A73E8] bg-white hover:bg-[#E8F0FE] hover:border-[#1A73E8] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-white" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield size={13} color="white" />
              </div>
            )}
            <div className="max-w-[75%]">
              <div
                className="rounded-2xl px-4 py-3"
                style={msg.role === 'user'
                  ? { backgroundColor: '#1A73E8', color: '#fff', borderBottomRightRadius: '4px' }
                  : { backgroundColor: '#F1F3F4', color: '#202124', borderBottomLeftRadius: '4px' }
                }
              >
                {msg.role === 'ai'
                  ? <FormattedText text={msg.text} />
                  : <p className="text-sm">{msg.text}</p>
                }
              </div>
              <p className="text-[10px] text-[#9AA0A6] mt-1 px-1">{msg.time}</p>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0">
              <Shield size={13} color="white" />
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#F1F3F4', borderBottomLeftRadius: '4px' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#DADCE0] bg-[#F8F9FA]">
        <div className="flex gap-2 items-end bg-white border border-[#DADCE0] rounded-xl px-3 py-2 focus-within:border-[#1A73E8] transition-colors">
          <textarea
            rows={1}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Posez votre question… (Entrée pour envoyer)"
            className="flex-1 text-sm resize-none outline-none bg-transparent text-[#202124] placeholder-[#9AA0A6] leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            className="p-2 rounded-lg transition-all flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: input.trim() && !thinking ? '#1A73E8' : '#E8EAED',
              color: input.trim() && !thinking ? 'white' : '#9AA0A6',
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-[#9AA0A6] text-center mt-2">Maj+Entrée pour aller à la ligne</p>
      </div>
    </>
  )

  return (
    <>
      {/* Bouton flottant animé (FAB) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 z-40 group"
          title="Ouvrir l'assistant IA DataSentinel"
          aria-label="Ouvrir l'assistant IA"
        >
          {/* Cercles d'animation de pulsation */}
          <span className="absolute inset-0 rounded-full bg-[#1A73E8] opacity-20 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-[#1A73E8] opacity-10 animate-ping" style={{ animationDelay: '0.5s' }} />
          
          {/* Bouton principal */}
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1A73E8] shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
              <circle cx="12" cy="10" r="3" fill="white" stroke="none" />
            </svg>
          </span>

          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#202124] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Assistant IA DataSentinel
          </span>
        </button>
      )}

      {/* Overlay plein écran (mode discussion Claude/ChatGPT) */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#202124]/60 backdrop-blur-sm">
          {/* Clic en dehors = fermer */}
          <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />
          
          {/* Fenêtre de discussion */}
          <div
            className="relative w-full max-w-3xl h-[88vh] bg-white rounded-2xl border border-[#DADCE0] flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              animation: 'chatFadeIn 0.2s ease-out'
            }}
          >
            {renderChatContent()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  )
}

