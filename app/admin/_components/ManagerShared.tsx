export const EMOJI_OPTIONS = ['🖥️','🚗','🔨','🍽️','🏥','💼','🛍️','🌐','🏋️','💇','🐾','📸','🎓','🏠','⚖️','🔬','🎨','🏪','💈','📦','⚡','🛠️','🎬','📱']

export const COLOR_OPTIONS = [
  { label: 'Rot',    value: '#dc2626' },
  { label: 'Orange', value: '#d97706' },
  { label: 'Grün',   value: '#16a34a' },
  { label: 'Cyan',   value: '#0891b2' },
  { label: 'Blau',   value: '#2563eb' },
  { label: 'Lila',   value: '#7c3aed' },
  { label: 'Pink',   value: '#db2777' },
  { label: 'Grau',   value: '#4b5563' },
]

export function SmallToggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
        checked
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-gray-50 border-gray-200 text-gray-400'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      {label}
    </button>
  )
}

export function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {EMOJI_OPTIONS.map(e => (
        <button
          key={e}
          type="button"
          onClick={() => onChange(e)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-colors ${
            value === e ? 'border-brand bg-brand/10' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  )
}

export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_OPTIONS.map(c => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          title={c.label}
          className={`w-7 h-7 rounded-lg border-2 transition-all ${
            value === c.value ? 'border-gray-900 scale-110' : 'border-transparent'
          }`}
          style={{ background: c.value }}
        />
      ))}
    </div>
  )
}
