function ChatBubble({ message, isUser, sources }) {
  // Parsear el mensaje para detectar code blocks
  const parseMessage = (text) => {
    const parts = []
    const codeBlockRegex = /```[\s\S]*?```|`[^`]+`/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Texto antes del code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      // Code block
      const codeContent = match[0].replace(/```\w*\n?/g, '').replace(/`/g, '')
      parts.push({
        type: 'code',
        content: codeContent
      })
      lastIndex = match.index + match[0].length
    }

    // Texto restante
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts
  }

  const messageParts = parseMessage(message)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[80%] px-5 py-4 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-synth-green to-synth-cyan text-synth-dark'
            : 'bg-white/5 border border-white/10 backdrop-blur-sm'
        }`}
      >
        {/* Mensaje */}
        <div className="space-y-2">
          {messageParts.map((part, i) => {
            if (part.type === 'code') {
              return (
                <pre key={i} className="bg-synth-dark/80 rounded-lg p-3 overflow-x-auto text-sm">
                  <code className="text-synth-green">{part.content}</code>
                </pre>
              )
            }

            // Parsear bold y links
            const content = part.content
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-synth-cyan">$1</strong>')
              .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-synth-green hover:underline" target="_blank">$1</a>')
              .replace(/\n/g, '<br/>')

            return (
              <p
                key={i}
                className={`text-sm leading-relaxed ${isUser ? '' : 'text-white/90'}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )
          })}
        </div>

        {/* Fuentes */}
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 mb-2">Fuentes consultadas:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, i) => (
                <span
                  key={i}
                  className="text-xs bg-synth-purple/20 text-synth-purple px-2 py-1 rounded-full"
                >
                  📄 {source}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {!isUser && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-synth-green">SynkBot</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs text-white/30">Ahora</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBubble