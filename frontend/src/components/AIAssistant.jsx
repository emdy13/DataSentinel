import { useState, useRef, useEffect } from 'react'
import { Shield, Send, Maximize2, Minimize2 } from 'lucide-react'
import { getAIResponse } from '../data/mockData'

const SUGGESTIONS = [
  'Quel est mon niveau de risque ?',
  'Quel fichier est le plus dangereux ?',
  'Que faire en priorité ?',
  'Expliquez les données bancaires',
  'Quels sont mes NINEA exposés ?',
]

/** Formate les réponses avec markdown basique (gras, listes) */
function FormattedText({ text }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return null
        // Bold with **
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="text-xs leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
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

  // Rendu de l'ossature interne du chat (partagé entre mode barre et mode plein écran)
  const renderChatContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#DADCE0]">
        <Shield size={16} color="#1A73E8" />
        <span className="text-sm font-semibold text-[#202124]">Assistant DataSentinel</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#1E8E3E]" />
            <span className="text-xs text-[#1E8E3E]">En ligne</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124] transition-colors flex items-center justify-center"
            title={isExpanded ? "Réduire au volet latéral" : "Agrandir en mode discussion"}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="px-3 py-3 border-b border-[#F1F3F4] bg-[#F8F9FA]">
        <p className="text-xs text-[#5F6368] mb-2 font-medium">Questions suggérées</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs px-2.5 py-1 rounded border border-[#DADCE0] text-[#1A73E8] bg-white hover:bg-[#E8F0FE] hover:border-[#1A73E8] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              <div
                className="rounded-lg px-3.5 py-2.5 shadow-xs"
                style={msg.role === 'user'
                  ? { backgroundColor: '#1A73E8', color: '#fff' }
                  : { backgroundColor: '#F1F3F4', color: '#202124' }
                }
              >
                {msg.role === 'ai'
                  ? <FormattedText text={msg.text} />
                  : <p className="text-xs">{msg.text}</p>
                }
              </div>
              <p className="text-[10px] text-[#9AA0A6] mt-1 px-1">{msg.time}</p>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: '#F1F3F4' }}>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#9AA0A6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[#DADCE0] bg-[#F8F9FA]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Posez votre question..."
            className="flex-1 text-xs px-3 py-2.5 rounded border border-[#DADCE0] focus:outline-none focus:border-[#1A73E8] bg-white text-[#202124]"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            className="p-2.5 rounded transition-colors flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: input.trim() && !thinking ? '#1A73E8' : '#DADCE0',
              color: 'white',
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-[#202124]/50 backdrop-blur-xs flex items-center justify-center p-4">
        {/* Click sur le fond pour réduire */}
        <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />
        
        {/* Conteneur de discussion au milieu de la page (style Claude) */}
        <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-xl shadow-2xl border border-[#DADCE0] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {renderChatContent()}
        </div>
      </div>
    )
  }

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-[#DADCE0] flex flex-col h-full" style={{ minHeight: 0 }}>
      {renderChatContent()}
    </aside>
  )
}

