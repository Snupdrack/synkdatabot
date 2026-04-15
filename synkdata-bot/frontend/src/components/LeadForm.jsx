import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

function LeadForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    interes: 'Consulta general',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await axios.post(`${API_URL}/lead`, formData)
      onSubmit(formData)
    } catch (err) {
      setError('Algo salió mal. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-t from-synth-green/10 to-transparent border-t border-synth-green/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-synth-green">
          📅 ¡Agendemos una llamada!
        </h3>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-synth-green/50 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-synth-green/50 focus:outline-none"
              placeholder="Nombre de tu empresa"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-synth-green/50 focus:outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-synth-green/50 focus:outline-none"
              placeholder="+52 990 000 0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">¿Qué servicio te interesa?</label>
          <select
            name="interes"
            value={formData.interes}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-synth-green/50 focus:outline-none"
          >
            <option value="Consulta general">Consulta general</option>
            <option value="VentasPro">VentasPro - CRM y ventas</option>
            <option value="Laboratorio IMSS-Intel">Laboratorio IMSS-Intel</option>
            <option value="DevOps y Migraciones">DevOps y Migraciones</option>
            <option value="Desarrollo de Apps/APIs">Desarrollo de Apps/APIs</option>
            <option value="Agentes de IA">Agentes de IA</option>
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-synth-green to-synth-cyan text-synth-dark py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar contacto →'}
        </button>
      </form>
    </div>
  )
}

export default LeadForm