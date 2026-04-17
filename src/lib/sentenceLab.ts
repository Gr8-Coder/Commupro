export type ToneId =
  | 'confident'
  | 'professional'
  | 'warm'
  | 'concise'
  | 'persuasive'
  | 'diplomatic'

export type SentenceSuggestion = {
  label: string
  output: string
  why: string
  moves: string[]
}

export const sentenceGoals: Array<{
  id: ToneId
  label: string
  description: string
}> = [
  {
    id: 'confident',
    label: 'Confident',
    description: 'Cuts hedging and lands the point cleanly.',
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Sharper for work, meetings, and written updates.',
  },
  {
    id: 'warm',
    label: 'Warm',
    description: 'Keeps the message human and easy to receive.',
  },
  {
    id: 'concise',
    label: 'Concise',
    description: 'Shortens the sentence without losing the intent.',
  },
  {
    id: 'persuasive',
    label: 'Persuasive',
    description: 'Links the recommendation to a practical payoff.',
  },
  {
    id: 'diplomatic',
    label: 'Diplomatic',
    description: 'Protects tone while still guiding the conversation.',
  },
]

const fillerPatterns = [
  /\bjust\b/gi,
  /\bmaybe\b/gi,
  /\bactually\b/gi,
  /\bbasically\b/gi,
  /\bkind of\b/gi,
  /\bsort of\b/gi,
  /\bliterally\b/gi,
]

const phraseUpgrades: Array<[RegExp, string]> = [
  [/\btalk about\b/gi, 'discuss'],
  [/\bfigure out\b/gi, 'work through'],
  [/\bokay with it\b/gi, 'aligned'],
  [/\ba lot\b/gi, 'significantly'],
  [/\btry to\b/gi, 'aim to'],
  [/\bfix\b/gi, 'resolve'],
  [/\bcheck if\b/gi, 'confirm whether'],
]

export function reframeSentence(input: string, preferredTone: ToneId) {
  const normalized = normalizeSentence(input)
  const concise = makeConcise(normalized)
  const professional = makeProfessional(concise)
  const confident = makeConfident(concise)
  const warm = makeWarm(concise)
  const persuasive = makePersuasive(concise)
  const diplomatic = makeDiplomatic(concise)

  const toneLookup: Record<ToneId, SentenceSuggestion> = {
    confident: {
      label: 'Confident version',
      output: confident,
      why: 'This version removes hesitation and lands on a clearer decision or ask.',
      moves: ['cut hedging', 'stronger verbs', 'clean ending'],
    },
    professional: {
      label: 'Professional version',
      output: professional,
      why: 'This version sounds more polished for work settings and written communication.',
      moves: ['formal phrasing', 'tighter structure', 'clear ask'],
    },
    warm: {
      label: 'Warm version',
      output: warm,
      why: 'This version protects the relationship while keeping the sentence direct.',
      moves: ['human tone', 'softened entry', 'clear intent'],
    },
    concise: {
      label: 'Concise version',
      output: concise,
      why: 'This version shortens the idea so it reaches the point faster.',
      moves: ['fewer words', 'less filler', 'faster landing'],
    },
    persuasive: {
      label: 'Persuasive version',
      output: persuasive,
      why: 'This version supports the recommendation with a practical upside.',
      moves: ['show the benefit', 'decision framing', 'forward motion'],
    },
    diplomatic: {
      label: 'Diplomatic version',
      output: diplomatic,
      why: 'This version keeps the tone collaborative while still guiding the room.',
      moves: ['bridge language', 'shared outcome', 'gentle steer'],
    },
  }

  const secondaryOrder: ToneId[] = ['concise', 'professional', 'warm']
  const remainingSuggestions = secondaryOrder
    .filter((tone) => tone !== preferredTone)
    .map((tone) => toneLookup[tone])

  return {
    suggestions: [toneLookup[preferredTone], ...remainingSuggestions].slice(0, 3),
    coachNotes: buildCoachNotes(input, concise),
  }
}

function normalizeSentence(input: string) {
  const compact = input.trim().replace(/\s+/g, ' ')

  if (!compact) {
    return 'Share the point you want to express.'
  }

  return ensureSentencePunctuation(capitalizeFirst(compact))
}

function ensureSentencePunctuation(input: string) {
  if (/[.!?]$/.test(input)) {
    return input
  }

  return `${input}.`
}

function capitalizeFirst(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

function stripFillers(input: string) {
  return fillerPatterns.reduce((current, pattern) => {
    return current.replace(pattern, '')
  }, input)
}

function improvePhrases(input: string) {
  return phraseUpgrades.reduce((current, [pattern, replacement]) => {
    return current.replace(pattern, replacement)
  }, input)
}

function cleanupSpacing(input: string) {
  return input
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
}

function makeConcise(input: string) {
  const withoutFillers = stripFillers(input)
    .replace(/\bI think\b/gi, '')
    .replace(/\bI just wanted to\b/gi, '')
    .replace(/\bI wanted to\b/gi, '')
    .replace(/\bwe should probably\b/gi, 'we should')
    .replace(/\bwhenever you get a chance\b/gi, 'when you have a moment')

  const upgraded = improvePhrases(withoutFillers)

  return capitalizeFirst(cleanupSpacing(upgraded))
}

function makeProfessional(input: string) {
  const upgraded = improvePhrases(input)
    .replace(/\bCan you\b/gi, 'Could you')
    .replace(/\bI want to\b/gi, "I'd like to")

  const cleaned = cleanupSpacing(upgraded)

  if (/^Could you/i.test(cleaned) || /^We should/i.test(cleaned) || /^I'd like/i.test(cleaned)) {
    return ensureSentencePunctuation(cleaned)
  }

  return ensureSentencePunctuation(`To move this forward, ${cleaned.replace(/[.!?]$/, '')}`)
}

function makeConfident(input: string) {
  const upgraded = input
    .replace(/\bI think\b/gi, 'I recommend')
    .replace(/\bCan we\b/gi, 'Let’s')
    .replace(/\bCan you\b/gi, 'Please')
    .replace(/\bI would like to\b/gi, 'I want to')
    .replace(/\bI’d like to\b/gi, 'I want to')

  return ensureSentencePunctuation(capitalizeFirst(cleanupSpacing(upgraded))).replace(
    /\?$/,
    '.',
  )
}

function makeWarm(input: string) {
  const warmed = cleanupSpacing(
    input
      .replace(/\bCan you\b/gi, 'Could you')
      .replace(/\bPlease\b/gi, 'Could you')
      .replace(/\bWe should\b/gi, 'I would love us to'),
  )

  return ensureSentencePunctuation(`I wanted to check in here. ${warmed.replace(/[.!?]$/, '')}`)
}

function makePersuasive(input: string) {
  const concise = makeConcise(input).replace(/[.!?]$/, '')
  return `${concise}. It gives us a clearer path forward.`
}

function makeDiplomatic(input: string) {
  const cleaned = cleanupSpacing(
    input
      .replace(/\bwe should\b/gi, 'we might want to')
      .replace(/\bneed to\b/gi, 'might need to')
      .replace(/\bthis is\b/gi, 'this feels')
      .replace(/\bwrong\b/gi, 'off track'),
  ).replace(/[.!?]$/, '')

  return `Could we reframe this around the main outcome? ${capitalizeFirst(cleaned)}.`
}

function buildCoachNotes(original: string, conciseVersion: string) {
  const notes = [
    'Lead with the point or request first, then add context only if it helps the listener decide faster.',
    'Prefer one clear verb over a stack of softeners like “just,” “maybe,” or “kind of.”',
    'End on the action, recommendation, or next step so the sentence feels complete.',
  ]

  const fillerCount = fillerPatterns.reduce((count, pattern) => {
    const matches = original.match(pattern)
    return count + (matches?.length ?? 0)
  }, 0)

  if (fillerCount > 0) {
    notes.unshift(
      `The rewrite removes ${fillerCount} filler${fillerCount === 1 ? '' : 's'}, which immediately increases clarity.`,
    )
  }

  if (original.split(/\s+/).length - conciseVersion.split(/\s+/).length >= 4) {
    notes.push('The concise version trims extra setup so your meaning lands sooner.')
  }

  return notes
}
