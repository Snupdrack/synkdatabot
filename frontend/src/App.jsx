import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ChatBubble from './components/ChatBubble'
import ChatInput from './components/ChatInput'
import Header from './components/Header'
import LeadForm from './components/LeadForm'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

function App() {
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [contextInfo, setContextInfo] = useState(null)
  const chatContainerRef = useRef(null)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    // Mensaje inicial del bot
    setTimeout(() => {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: '¡Hola! 👋 Soy SynkBot, el asistente virtual de SynkData. Estoy aquí para ayudarte a encontrar la solución perfecta para tu negocio.\n\n¿Sobre qué te gustaría hablar? Puedo ayudarte con:\n\n• ⚡ **VentasPro** - Sistema de gestión de ventas y CRM\n• 🏥 **Laboratorio IMSS-Intel** - Integraciones gubernamentales\n• 🚀 **DevOps** - Migraciones y optimizaciones de infraestructura\n• 💬 **Agentes de IA** - Asistentes virtuales para tu negocio\n• 📱 **Desarrollo de apps y APIs**\n\n¡Cuéntame qué necesitas!'
      }])
      setInitialLoad(false)
    }, 800)
  }, [])

  useEffect(() => {
    // Scroll al último mensaje
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text) => {
    if (!text.trim()) return

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: text,
        session_id: sessionId
      })

      // Agregar respuesta del bot
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        sources: response.data.sources
      }
      setMessages(prev => [...prev, botMessage])

      // Guardar session_id
      if (response.data.session_id && !sessionId) {
        setSessionId(response.data.session_id)
      }

      // Detectar si el usuario está interesado en agendar
      const lowerContent = text.toLowerCase()
      if (
        lowerContent.includes('agendar') ||
        lowerContent.includes('llamada') ||
        lowerContent.includes('contacto') ||
        lowerContent.includes('hablar') ||
        lowerContent.includes('servicio')
      ) {
        setTimeout(() => {
          setShowLeadForm(true)
        }, 1000)
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Ups, algo salió mal 😅. ¿Podrías intentar de nuevo?'
      }])
    }

    setIsTyping(false)
  }

  const handleLeadSubmit = (leadData) => {
    console.log('Lead capturado:', leadData)
    setShowLeadForm(false)
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'assistant',
      content: `¡Perfecto, ${leadData.nombre}! 🎉 He recibido tu información. Uno de nuestros expertos se pondrá en contacto contigo en las próximas 24 horas.\n\nSi necesitas algo más, aquí estaré. ¡Que tengas un excelente día! 👋`
    }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-synth-dark via-synth-gray to-synth-dark flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-24">
        <div className="w-full max-w-3xl h-[calc(100vh-180px)] flex flex-col bg-synth-dark/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.role === 'user'}
                sources={msg.sources}
              />
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-synth-green/70">
                <div className="flex space-x-1">
                  <span className="typing-dot w-2 h-2 bg-synth-green rounded-full"></span>
                  <span className="typing-dot w-2 h-2 bg-synth-green rounded-full"></span>
                  <span className="typing-dot w-2 h-2 bg-synth-green rounded-full"></span>
                </div>
                <span className="text-sm">SynkBot está escribiendo...</span>
              </div>
            )}
          </div>

          {/* Lead Form */}
          {showLeadForm && (
            <LeadForm
              onSubmit={handleLeadSubmit}
              onClose={() => setShowLeadForm(false)}
            />
          )}

          {/* Input */}
          {!showLeadForm && (
            <ChatInput onSend={handleSend} disabled={isTyping} />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-white/40 text-sm">
          <p>SynkData • Código a Medida. Inteligencia en cada Dato.</p>
          <p className="mt-1 text-xs">Respuesta típica en menos de 24 horas para solicitudes de contacto</p>
        </div>
      </main>
    </div>
  )
}

export default App