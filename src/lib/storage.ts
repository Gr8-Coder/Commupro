import { shiftDateKey } from './daily'
import type { SentenceSuggestion, ToneId } from './sentenceLab'

export type SavedSentenceUpgrade = {
  id: string
  input: string
  tone: ToneId
  savedAt: string
  suggestions: SentenceSuggestion[]
}

export type ProgressState = {
  visitedDates: string[]
  completedByDate: Record<string, string[]>
  savedSpeechIds: string[]
  savedBriefIds: string[]
  savedSentenceUpgrades: SavedSentenceUpgrade[]
  activeSpeechId?: string
}

const STORAGE_KEY = 'commupro.progress.v1'

export function bootstrapProgress(todayKey: string) {
  const loaded = loadProgress()

  if (!loaded.visitedDates.includes(todayKey)) {
    loaded.visitedDates = [...loaded.visitedDates, todayKey].sort()
    persistProgress(loaded)
  }

  return loaded
}

export function persistProgress(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function toggleCompletion(
  state: ProgressState,
  dateKey: string,
  moduleId: string,
) {
  const current = state.completedByDate[dateKey] ?? []
  const nextDayState = current.includes(moduleId)
    ? current.filter((item) => item !== moduleId)
    : [...current, moduleId]

  return {
    ...state,
    completedByDate: {
      ...state.completedByDate,
      [dateKey]: nextDayState,
    },
  }
}

export function toggleSpeechSave(state: ProgressState, speechId: string) {
  const next = state.savedSpeechIds.includes(speechId)
    ? state.savedSpeechIds.filter((item) => item !== speechId)
    : [...state.savedSpeechIds, speechId]

  return {
    ...state,
    savedSpeechIds: next,
  }
}

export function toggleBriefSave(state: ProgressState, briefId: string) {
  const next = state.savedBriefIds.includes(briefId)
    ? state.savedBriefIds.filter((item) => item !== briefId)
    : [...state.savedBriefIds, briefId]

  return {
    ...state,
    savedBriefIds: next,
  }
}

export function saveSentenceUpgrade(
  state: ProgressState,
  input: string,
  tone: ToneId,
  session: { suggestions: SentenceSuggestion[] },
) {
  const entry: SavedSentenceUpgrade = {
    id: `${Date.now()}`,
    input,
    tone,
    savedAt: new Date().toLocaleString(),
    suggestions: session.suggestions,
  }

  return {
    ...state,
    savedSentenceUpgrades: [entry, ...state.savedSentenceUpgrades].slice(0, 12),
  }
}

export function calculateCompletionCount(state: ProgressState, todayKey: string) {
  return state.completedByDate[todayKey]?.length ?? 0
}

export function calculateStreak(visitedDates: string[], todayKey: string) {
  const visited = new Set(visitedDates)
  let streak = 0
  let cursor = todayKey

  while (visited.has(cursor)) {
    streak += 1
    cursor = shiftDateKey(cursor, -1)
  }

  return streak
}

function loadProgress(): ProgressState {
  const fallback: ProgressState = {
    visitedDates: [],
    completedByDate: {},
    savedSpeechIds: [],
    savedBriefIds: [],
    savedSentenceUpgrades: [],
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<ProgressState>

    return {
      visitedDates: Array.isArray(parsed.visitedDates)
        ? parsed.visitedDates.filter(Boolean)
        : [],
      completedByDate:
        parsed.completedByDate && typeof parsed.completedByDate === 'object'
          ? parsed.completedByDate
          : {},
      savedSpeechIds: Array.isArray(parsed.savedSpeechIds)
        ? parsed.savedSpeechIds.filter(Boolean)
        : [],
      savedBriefIds: Array.isArray(parsed.savedBriefIds)
        ? parsed.savedBriefIds.filter(Boolean)
        : [],
      savedSentenceUpgrades: Array.isArray(parsed.savedSentenceUpgrades)
        ? parsed.savedSentenceUpgrades
        : [],
      activeSpeechId:
        typeof parsed.activeSpeechId === 'string'
          ? parsed.activeSpeechId
          : undefined,
    }
  } catch {
    return fallback
  }
}
