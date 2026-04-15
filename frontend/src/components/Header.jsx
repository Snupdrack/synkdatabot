function Header() {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-synth-green to-synth-cyan rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-synth-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SynkBot</h1>
            <p className="text-sm text-synth-green">Asistente Virtual</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-synth-green rounded-full animate-pulse"></span>
          <span className="text-sm text-white/70">En línea</span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="https://synkdata.online" className="text-white/70 hover:text-synth-green transition-colors">
            Website
          </a>
          <a href="mailto:contacto@synkdata.online" className="text-white/70 hover:text-synth-green transition-colors">
            Contacto
          </a>
          <a
            href="https://synkdata.online#contacto"
            className="bg-synth-green text-synth-dark px-4 py-2 rounded-lg font-semibold hover:bg-synth-green/90 transition-colors"
          >
            Solicitar Demo
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header