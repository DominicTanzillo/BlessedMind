import { CATEGORY_EMOJI } from '../../lib/constants'
import type { Task } from '../../types'
import type { Category } from '../../lib/constants'

interface Props {
  tasks: Task[]
  onReactivate: (id: string) => void
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export default function WaitingView({ tasks, onReactivate, onComplete, onDelete }: Props) {
  const waitingTasks = tasks.filter(t => t.waiting)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Waiting On</h1>
        <p className="text-xs text-stone-400 mt-0.5">
          Follow-ups you're tracking. Not yet done.
        </p>
      </div>

      {waitingTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-stone-500 text-sm font-medium">Nothing pending</p>
          <p className="text-stone-400 text-xs mt-1">
            When you complete a task and need to follow up, it'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {waitingTasks.map(task => {
            const emoji = CATEGORY_EMOJI[task.category as Category] ?? '\u{1F4CB}'
            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl transition group hover:bg-white"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-amber-300 bg-amber-50 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-800">
                    {emoji} {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onReactivate(task.id)}
                    className="px-2 py-1 rounded-lg text-xs font-medium text-sage-600 hover:bg-sage-100 transition"
                    title="Send back to Mind"
                  >
                    Reactivate
                  </button>
                  <button
                    onClick={() => onComplete(task.id)}
                    className="px-2 py-1 rounded-lg text-xs font-medium text-complete hover:bg-complete-light/30 transition"
                    title="Mark truly done"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 rounded text-stone-300 hover:text-terracotta transition"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {waitingTasks.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-xs text-stone-400">
            {waitingTasks.length} item{waitingTasks.length !== 1 ? 's' : ''} waiting
          </p>
        </div>
      )}
    </div>
  )
}
