import { useState, useRef } from 'react'

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !disabled) {
      onSend(text)
      setText('')
      inputRef.current?.focus()
    }
  }

  const quickReplies = [
    '¿Qué es VentasPro?',
    '¿Cuánto cuesta un MVP?',
    'Quiero agendar una llamada'
  ]

  return (
    <div className="p-4 bg-white/5 border-t border-white/10">
      {/* Quick replies */}
      {text === '' && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => {
                setText(reply)
                inputRef.current?.focus()
              }}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-synth-green/50 transition-all"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={disabled}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-synth-green/50 transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="bg-gradient-to-r from-synth-green to-synth-cyan text-synth-dark p-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Hint */}
      <p className="mt-2 text-xs text-white/30 text-center">
        SynkBot puede cometer errores. Verifica información importante.
      </p>
    </div>
  )
}

export default ChatInput