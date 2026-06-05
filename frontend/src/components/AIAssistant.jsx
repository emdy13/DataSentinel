import { useState, useRef, useEffect } from 'react'
import { Shield, Send, Dot } from 'lucide-react'
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

/** Sidebar chatbot IA toujours visible */
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
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (triggerMessage) {
      sendMessage(triggerMessage)
    }
  }, [triggerMessage])

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

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.warn('Fallback sur les réponses simulées de DataSentinel suite à une erreur :', error);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setThinking(false)
    }
  }

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-[#DADCE0] flex flex-col h-full" style={{ minHeight: 0 }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#DADCE0]">
        <Shield size={16} color="#1A73E8" />
        <span className="text-sm font-semibold text-[#202124]">Assistant DataSentinel</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#1E8E3E]" />
          <span className="text-xs text-[#1E8E3E]">En ligne</span>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="px-3 py-3 border-b border-[#F1F3F4]">
        <p className="text-xs text-[#5F6368] mb-2 font-medium">Questions suggérées</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs px-2.5 py-1 rounded border border-[#DADCE0] text-[#1A73E8] hover:bg-[#E8F0FE] hover:border-[#1A73E8] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              <div
                className="rounded-lg px-3 py-2"
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
      <div className="px-3 py-3 border-t border-[#DADCE0]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Posez votre question..."
            className="flex-1 text-xs px-3 py-2 rounded border border-[#DADCE0] focus:outline-none focus:border-[#1A73E8] bg-white text-[#202124]"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            className="p-2 rounded transition-colors flex-shrink-0"
            style={{
              backgroundColor: input.trim() && !thinking ? '#1A73E8' : '#DADCE0',
              color: 'white',
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
