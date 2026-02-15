// Variable reward messages - shown intermittently after completing tasks
// Variability triggers dopamine prediction error (Schultz, 1997)
const COMPLETION_MESSAGES = [
  'One less thing on your mind.',
  'That weight just lifted.',
  'Closed that loop. Your brain thanks you.',
  'Done. Your mind is a little clearer.',
  'You handled that. Feel it settle.',
  'Another open loop closed.',
  'Your future self is grateful.',
  'That one\'s off your plate.',
]

const BATCH_COMPLETE_MESSAGES = [
  'You\'ve done enough today. Go be blessed.',
  'All clear. Your mind can rest now.',
  'Three for three. Breathe that in.',
  'Focus complete. You earned this stillness.',
  'Everything that mattered today is handled.',
  'Your mind is free. This is the reward.',
]

const EMPTY_STATE_MESSAGES = [
  'Nothing pressing. Just breathe.',
  'Your mind is clear. Enjoy this moment.',
  'All quiet. This is what peace feels like.',
  'No open loops. You\'re free.',
]

const BRAIN_DUMP_MESSAGES = [
  'loop closed. Your working memory just freed up.',
  'thought captured. It\'s safe here now.',
  'item offloaded. That\'s one less thing spinning in your head.',
]

export function getCompletionMessage(): string {
  return COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]
}

export function getBatchCompleteMessage(): string {
  return BATCH_COMPLETE_MESSAGES[Math.floor(Math.random() * BATCH_COMPLETE_MESSAGES.length)]
}

export function getEmptyStateMessage(): string {
  return EMPTY_STATE_MESSAGES[Math.floor(Math.random() * EMPTY_STATE_MESSAGES.length)]
}

export function getBrainDumpMessage(count: number): string {
  const suffix = BRAIN_DUMP_MESSAGES[Math.floor(Math.random() * BRAIN_DUMP_MESSAGES.length)]
  return `${count} ${suffix}`
}

// Show insight ~40% of the time (variable ratio schedule)
export function shouldShowInsight(): boolean {
  return Math.random() < 0.4
}

// Time-of-day aware greeting
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Wind down time'
}

export function getTimeContext(): string {
  const hour = new Date().getHours()
  if (hour >= 21 || hour < 6) {
    return 'These are captured. Your brain can let go tonight.'
  }
  if (hour < 12) {
    return 'Your focus for today is set.'
  }
  return 'You know what matters. The rest can wait.'
}
