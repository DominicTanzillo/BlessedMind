import { useState, type FormEvent } from 'react'
import { playWelcome } from '../../lib/sounds'

const VERSES = [
  { text: 'Come to me, all who are weary and heavy laden,\nand I will give you rest.', ref: 'Matthew 11:28' },
  { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
  { text: 'Cast all your anxieties on Him,\nbecause He cares for you.', ref: '1 Peter 5:7' },
  { text: 'The Lord is my shepherd;\nI shall not want. He makes me lie down\nin green pastures.', ref: 'Psalm 23:1-2' },
  { text: 'Peace I leave with you;\nmy peace I give to you.\nNot as the world gives do I give to you.', ref: 'John 14:27' },
  { text: 'Do not be anxious about anything,\nbut in everything by prayer\nand supplication with thanksgiving\nlet your requests be made known to God.', ref: 'Philippians 4:6' },
  { text: 'For I know the plans I have for you,\ndeclares the Lord,\nplans for welfare and not for evil,\nto give you a future and a hope.', ref: 'Jeremiah 29:11' },
  { text: 'Trust in the Lord with all your heart,\nand do not lean on your own understanding.', ref: 'Proverbs 3:5' },
]

function getVerse() {
  return VERSES[Math.floor(Math.random() * VERSES.length)]
}

interface Props {
  onLogin: (password: string) => Promise<boolean>
  error: string
}

export default function PasswordGate({ onLogin, error }: Props) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verse] = useState(getVerse)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const success = await onLogin(password)
    if (success) {
      playWelcome()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-sage-400 rounded-full animate-breathe" />
          </div>
          <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">BlessedMind</h1>
          <p className="text-stone-400 mt-4 text-sm leading-relaxed whitespace-pre-line italic">
            {verse.text}
          </p>
          <p className="text-stone-300 text-xs mt-2">{verse.ref}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4">
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-stone-200 bg-sage-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition text-center tracking-widest"
            placeholder="Enter your password"
            autoFocus
          />
          {error && (
            <p className="text-terracotta text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 rounded-xl bg-sage-500 text-white font-medium hover:bg-sage-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Opening...' : 'Enter His Rest'}
          </button>
        </form>

        <p className="text-center text-stone-300 text-xs mt-6">
          Lay down what weighs on you.
        </p>
      </div>
    </div>
  )
}
