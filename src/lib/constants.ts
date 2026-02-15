export const PRIORITIES = [
  { value: 1, label: 'Urgent', color: 'bg-terracotta text-white' },
  { value: 2, label: 'Normal', color: 'bg-sage-200 text-sage-800' },
  { value: 3, label: 'Low', color: 'bg-stone-200 text-stone-600' },
] as const

export const CATEGORIES = [
  'general',
  'work',
  'health',
  'finance',
  'home',
  'personal',
  'creative',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_EMOJI: Record<Category, string> = {
  general: '📋',
  work: '💼',
  health: '🧘',
  finance: '💰',
  home: '🏠',
  personal: '🌱',
  creative: '🎨',
}

export const BATCH_SIZE = 3
