import { TODAY } from '@/data/mockData'
import { Matter, DeadlineItem } from '@/types/crm'

export function normalizePhone(value: string | undefined): string {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1)
  }
  return digits
}

export function formatDueDate(dateStr?: string): string {
  if (!dateStr) return 'Not set'
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12)
      return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    }
    return dateStr
  } catch {
    return dateStr
  }
}

export function formatClock(timeStr?: string): string {
  if (!timeStr) return ''
  try {
    const parts = timeStr.split(':')
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10)
      const m = parts[1]
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12}:${m} ${ampm}`
    }
    return timeStr
  } catch {
    return timeStr
  }
}

export function addDays(dateStr: string, days: number): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    const date = new Date(Date.UTC(y, m - 1, d + days))
    return date.toISOString().slice(0, 10)
  } catch {
    return dateStr
  }
}

export function getBusinessDaysOverdue(dueDate: string, todayDate: string = TODAY): number {
  if (!dueDate || dueDate >= todayDate) return 0
  let count = 0
  let curr = dueDate
  while (curr < todayDate && count < 365) {
    curr = addDays(curr, 1)
    const [y, m, d] = curr.split('-').map(Number)
    const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
  }
  return count
}

export function isOverdue(matter: Matter, todayDate: string = TODAY): boolean {
  return (
    Boolean(matter.due) &&
    matter.due < todayDate &&
    matter.ball !== 'Government' &&
    matter.ball !== 'Client' &&
    matter.stage < 6
  )
}

export function isStalled(matter: Matter, todayDate: string = TODAY): boolean {
  if (matter.stage >= 5 || matter.ball !== 'Case Manager') return false
  const overdueDays = getBusinessDaysOverdue(matter.lastActivity || todayDate, todayDate)
  return overdueDays >= 5
}

export function hasHardDeadlineSoon(matter: Matter, todayDate: string = TODAY): boolean {
  if (matter.stage >= 6) return false
  const threshold = addDays(todayDate, 7)
  return (matter.deadlineItems || []).some(
    (d) => d.kind === 'Hard Deadline' && d.status !== 'Resolved' && d.date <= threshold
  )
}

export function getHealthStatus(matter: Matter, todayDate: string = TODAY): { label: string; colorClass: string } {
  if (isOverdue(matter, todayDate) || isStalled(matter, todayDate) || !matter.owner || hasHardDeadlineSoon(matter, todayDate)) {
    return { label: 'Action required', colorClass: 'red' }
  }
  if (matter.ball === 'Client' || matter.docs.some((d) => d.status === 'Correction Required')) {
    return { label: 'Needs attention', colorClass: 'amber' }
  }
  return { label: 'Healthy', colorClass: 'green' }
}

export function getDaysDiff(targetDate: string, baseDate: string = TODAY): number {
  try {
    const t = new Date(targetDate + 'T12:00:00Z').getTime()
    const b = new Date(baseDate + 'T12:00:00Z').getTime()
    return Math.round((t - b) / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

export function getDeadlineCountdownLabel(deadline: DeadlineItem, baseDate: string = TODAY): string {
  const diff = getDaysDiff(deadline.date, baseDate)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Tomorrow'
  return `${diff}d left`
}
