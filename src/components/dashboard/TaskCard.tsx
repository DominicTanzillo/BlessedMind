import { useState } from 'react'
import Badge from '../ui/Badge'
import { PRIORITIES, CATEGORY_EMOJI } from '../../lib/constants'
import { getCompletionMessage, shouldShowInsight } from '../../lib/celebrations'
import { playComplete, playStepComplete } from '../../lib/sounds'
import type { Task } from '../../types'
import type { Category } from '../../lib/constants'

interface Props {
  task: Task
  onComplete: (id: string) => void
  onCompleteStep: (id: string) => void
  index: number
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return 'No deadline'
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''} overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff <= 7) return `Due in ${diff} days`
  return `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

export default function TaskCard({ task, onComplete, onCompleteStep, index }: Props) {
  const [justCompleted, setJustCompleted] = useState(false)
  const [completionMsg, setCompletionMsg] = useState('')
  const [showRipple, setShowRipple] = useState(false)

  const priorityInfo = PRIORITIES.find(p => p.value === task.priority)
  const emoji = CATEGORY_EMOJI[task.category as Category] ?? '📋'
  const dateText = formatRelativeDate(task.due_date)
  const isOverdue = dateText.includes('overdue')
  const isCompleted = task.completed || justCompleted

  // Multi-step logic
  const hasSteps = task.steps && task.steps.length > 0
  const currentStepIndex = hasSteps ? task.steps!.findIndex(s => !s.completed) : -1
  const currentStep = hasSteps && currentStepIndex !== -1 ? task.steps![currentStepIndex] : null
  const completedSteps = hasSteps ? task.steps!.filter(s => s.completed).length : 0
  const totalSteps = hasSteps ? task.steps!.length : 0
  const isLastStep = hasSteps && currentStepIndex === totalSteps - 1

  function handleComplete() {
    if (isCompleted) return

    if (hasSteps && currentStep) {
      // Complete current step
      setShowRipple(true)

      if (isLastStep) {
        playComplete()
        setJustCompleted(true)
      } else {
        playStepComplete()
      }

      if (shouldShowInsight()) {
        setCompletionMsg(isLastStep
          ? getCompletionMessage()
          : `Step ${completedSteps + 1} of ${totalSteps} done.`)
      }

      setTimeout(() => {
        onCompleteStep(task.id)
        setShowRipple(false)
      }, 600)
    } else {
      // Simple task
      playComplete()
      setShowRipple(true)
      setJustCompleted(true)

      if (shouldShowInsight()) {
        setCompletionMsg(getCompletionMessage())
      }

      setTimeout(() => {
        onComplete(task.id)
      }, 600)
    }
  }

  return (
    <div
      className={`animate-reveal rounded-2xl border p-5 transition-all duration-500 ${
        isCompleted
          ? 'bg-complete-light/30 border-complete/20 scale-[0.98]'
          : 'bg-white border-stone-200 hover:shadow-md hover:border-sage-300'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Completion circle */}
        <div className="relative mt-1">
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`relative z-10 w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
              isCompleted
                ? 'bg-complete border-complete text-white scale-110'
                : 'border-stone-300 hover:border-sage-500 hover:scale-110 hover:bg-sage-50'
            }`}
          >
            {isCompleted && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="animate-check" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          {showRipple && (
            <div className="absolute inset-0 rounded-full bg-complete/30 animate-ripple" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-medium leading-snug transition-all duration-500 ${
            isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
          }`}>
            {emoji} {task.title}
          </p>

          {/* Current step display for multi-step tasks */}
          {hasSteps && !isCompleted && currentStep && (
            <div className="mt-2 pl-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-stone-400">
                  Step {completedSteps + 1} of {totalSteps}
                </span>
                {/* Mini step progress bar */}
                <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden max-w-20">
                  <div
                    className="h-full bg-sage-400 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-sage-700 font-medium">
                {currentStep.title}
              </p>
            </div>
          )}

          {task.description && !isCompleted && !currentStep && (
            <p className="text-sm text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          {completionMsg && (
            <p className="text-sm text-complete mt-2 animate-fade-up italic">
              {completionMsg}
            </p>
          )}

          {!isCompleted && (
            <div className="flex items-center gap-2 mt-3">
              {priorityInfo && (
                <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
              )}
              <span className={`text-xs ${isOverdue ? 'text-terracotta font-medium' : 'text-stone-400'}`}>
                {dateText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
