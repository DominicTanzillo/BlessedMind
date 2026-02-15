import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { rankTasks } from '../lib/prioritize'
import { BATCH_SIZE } from '../lib/constants'
import type { Task, ActiveBatch } from '../types'

export function useActiveBatch(tasks: Task[]) {
  const [batch, setBatch] = useState<ActiveBatch | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBatch = useCallback(async () => {
    const { data } = await supabase
      .from('active_batch')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    setBatch(data as ActiveBatch | null)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBatch()
  }, [fetchBatch])

  // Get the tasks in the current batch
  const batchTasks = batch
    ? tasks.filter(t => batch.task_ids.includes(t.id))
    : []

  const completedInBatch = batchTasks.filter(t => t.completed).length
  const allCompleted = batchTasks.length > 0 && completedInBatch === batchTasks.length

  // The set of task IDs currently in the batch
  const batchTaskIds = new Set(batch?.task_ids ?? [])

  // Create a new batch from the top-ranked tasks
  const generateNewBatch = useCallback(async () => {
    const ranked = rankTasks(tasks)
    const topIds = ranked.slice(0, BATCH_SIZE).map(t => t.id)

    if (topIds.length === 0) {
      if (batch?.id) {
        await supabase.from('active_batch').delete().eq('id', batch.id)
      }
      setBatch(null)
      return
    }

    if (batch?.id) {
      await supabase.from('active_batch').delete().eq('id', batch.id)
    }

    const { data } = await supabase
      .from('active_batch')
      .insert({ task_ids: topIds, completed_task_ids: [] })
      .select()
      .single()

    if (data) {
      setBatch(data as ActiveBatch)
    }
  }, [tasks, batch?.id])

  // Pin a specific task into the focus batch (swap it in)
  const pinToFocus = useCallback(async (taskId: string) => {
    if (!batch) {
      // No batch yet - create one with just this task + fill from ranked
      const ranked = rankTasks(tasks).filter(t => t.id !== taskId)
      const ids = [taskId, ...ranked.slice(0, BATCH_SIZE - 1).map(t => t.id)]
      const { data } = await supabase
        .from('active_batch')
        .insert({ task_ids: ids, completed_task_ids: [] })
        .select()
        .single()
      if (data) setBatch(data as ActiveBatch)
      return
    }

    const currentIds = batch.task_ids
    if (currentIds.includes(taskId)) return // already in batch

    // Replace the last non-completed task, or append if room
    const incompleteBatchTasks = tasks.filter(
      t => currentIds.includes(t.id) && !t.completed
    )

    let newIds: string[]
    if (currentIds.length < BATCH_SIZE) {
      // Room to add
      newIds = [...currentIds, taskId]
    } else if (incompleteBatchTasks.length > 0) {
      // Swap out the last incomplete task
      const swapOutId = incompleteBatchTasks[incompleteBatchTasks.length - 1].id
      newIds = currentIds.map(id => (id === swapOutId ? taskId : id))
    } else {
      // All completed, just replace last
      newIds = [...currentIds.slice(0, BATCH_SIZE - 1), taskId]
    }

    const { error } = await supabase
      .from('active_batch')
      .update({ task_ids: newIds })
      .eq('id', batch.id)

    if (!error) {
      setBatch({ ...batch, task_ids: newIds })
    }
  }, [batch, tasks])

  // Remove a task from focus batch, backfill from algorithm (but never re-add the unpinned task)
  const unpinFromFocus = useCallback(async (taskId: string) => {
    if (!batch) return
    const newIds = batch.task_ids.filter(id => id !== taskId)

    // Fill from ranked tasks, excluding the one being unpinned
    const ranked = rankTasks(tasks).filter(t => t.id !== taskId && !newIds.includes(t.id))
    while (newIds.length < BATCH_SIZE && ranked.length > 0) {
      newIds.push(ranked.shift()!.id)
    }

    // Delete old batch and re-create to ensure persistence
    await supabase.from('active_batch').delete().eq('id', batch.id)

    if (newIds.length > 0) {
      const { data } = await supabase
        .from('active_batch')
        .insert({ task_ids: newIds, completed_task_ids: [] })
        .select()
        .single()
      if (data) {
        setBatch(data as ActiveBatch)
      } else {
        setBatch(null)
      }
    } else {
      setBatch(null)
    }
  }, [batch, tasks])

  // Initialize batch if none exists
  useEffect(() => {
    if (!loading && !batch && tasks.filter(t => !t.completed).length > 0) {
      generateNewBatch()
    }
  }, [loading, batch, tasks, generateNewBatch])

  return {
    batchTasks,
    completedInBatch,
    allCompleted,
    generateNewBatch,
    pinToFocus,
    unpinFromFocus,
    batchTaskIds,
    loading,
    hasBatch: !!batch,
  }
}
