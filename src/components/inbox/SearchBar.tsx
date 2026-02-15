import { CATEGORIES } from '../../lib/constants'
import type { TaskFilter } from '../../types'

interface Props {
  filter: TaskFilter
  onChange: (filter: TaskFilter) => void
}

export default function SearchBar({ filter, onChange }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={filter.search}
        onChange={e => onChange({ ...filter, search: e.target.value })}
        placeholder="Search tasks..."
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 transition"
      />
      <div className="flex gap-2 flex-wrap">
        <select
          value={filter.category}
          onChange={e => onChange({ ...filter, category: e.target.value })}
          className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-sage-400 transition"
        >
          <option value="">All categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select
          value={filter.priority ?? ''}
          onChange={e => onChange({ ...filter, priority: e.target.value ? Number(e.target.value) : null })}
          className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-sage-400 transition"
        >
          <option value="">All priorities</option>
          <option value="1">Urgent</option>
          <option value="2">Normal</option>
          <option value="3">Low</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.showCompleted}
            onChange={e => onChange({ ...filter, showCompleted: e.target.checked })}
            className="rounded accent-sage-500"
          />
          Show completed
        </label>
      </div>
    </div>
  )
}
