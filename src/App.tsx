import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
  type ReactNode,
} from 'react'
import './App.css'
import {
  conversationStarters,
  dailySentenceUpgrades,
  dailyTips,
  knowledgeBriefs,
  slangDrops,
  speeches,
} from './data/content'
import { formatLongDate, getTodayKey, pickDailyItem } from './lib/daily'
import {
  reframeSentence,
  sentenceGoals,
  type SentenceSuggestion,
  type ToneId,
} from './lib/sentenceLab'
import {
  bootstrapProgress,
  calculateCompletionCount,
  calculateStreak,
  persistProgress,
  saveSentenceUpgrade,
  toggleBriefSave,
  toggleCompletion,
  toggleSpeechSave,
  type ProgressState,
} from './lib/storage'

type SectionId =
  | 'home'
  | 'explore'
  | 'sentence-lab'
  | 'speech-library'
  | 'smart-monitor'
  | 'progress'

type DailyModuleId =
  | 'tip'
  | 'starter'
  | 'brief'
  | 'sentence'
  | 'speech'
  | 'slang'

const sectionLabels: Array<{
  id: SectionId
  label: string
  shortKey: string
  subtitle: string
}> = [
  {
    id: 'home',
    label: 'Daily Dashboard',
    shortKey: '1',
    subtitle: 'Your warm-up for sharper conversations.',
  },
  {
    id: 'explore',
    label: 'Explore Topics',
    shortKey: '2',
    subtitle: 'Smart prompts, geopolitics, and social ammunition.',
  },
  {
    id: 'sentence-lab',
    label: 'Sentence Lab',
    shortKey: '3',
    subtitle: 'Turn weak phrasing into clear, confident English.',
  },
  {
    id: 'speech-library',
    label: 'Speech Library',
    shortKey: '4',
    subtitle: 'Study the communicators worth stealing from.',
  },
  {
    id: 'smart-monitor',
    label: 'Smart Monitor',
    shortKey: '5',
    subtitle: 'Break down how elite speakers think on stage.',
  },
  {
    id: 'progress',
    label: 'Growth Log',
    shortKey: '6',
    subtitle: 'Track streaks, saved wins, and daily momentum.',
  },
]

const sectionShortcutMap: Record<string, SectionId> = {
  '1': 'home',
  '2': 'explore',
  '3': 'sentence-lab',
  '4': 'speech-library',
  '5': 'smart-monitor',
  '6': 'progress',
}

const dailyModuleIds: DailyModuleId[] = [
  'tip',
  'starter',
  'brief',
  'sentence',
  'speech',
  'slang',
]

function App() {
  const todayKey = getTodayKey()
  const [progress, setProgress] = useState<ProgressState>(() =>
    bootstrapProgress(todayKey),
  )
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [topicSearch, setTopicSearch] = useState('')
  const [speechSearch, setSpeechSearch] = useState('')
  const [sentenceInput, setSentenceInput] = useState(
    dailySentenceUpgrades[0].original,
  )
  const [selectedTone, setSelectedTone] = useState<ToneId>('confident')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const deferredTopicSearch = useDeferredValue(topicSearch.trim().toLowerCase())
  const deferredSpeechSearch = useDeferredValue(speechSearch.trim().toLowerCase())

  const dailyTip = pickDailyItem(dailyTips, todayKey, 'tip')
  const dailyStarter = pickDailyItem(conversationStarters, todayKey, 'starter')
  const dailyBrief = pickDailyItem(knowledgeBriefs, todayKey, 'brief')
  const dailySentence = pickDailyItem(
    dailySentenceUpgrades,
    todayKey,
    'sentence',
  )
  const dailySpeech = pickDailyItem(speeches, todayKey, 'speech')
  const dailySlang = pickDailyItem(slangDrops, todayKey, 'slang')

  const activeSpeechId = progress.activeSpeechId ?? dailySpeech.id
  const activeSpeech =
    speeches.find((speech) => speech.id === activeSpeechId) ?? dailySpeech
  const completionCount = calculateCompletionCount(progress, todayKey)
  const streak = calculateStreak(progress.visitedDates, todayKey)
  const sentenceSession = reframeSentence(sentenceInput, selectedTone)

  const filteredBriefs = knowledgeBriefs.filter((brief) => {
    if (!deferredTopicSearch) {
      return true
    }

    const searchSpace = [
      brief.title,
      brief.category,
      brief.summary,
      brief.sampleLine,
      ...brief.conversationAngles,
    ]
      .join(' ')
      .toLowerCase()

    return searchSpace.includes(deferredTopicSearch)
  })

  const filteredSpeeches = speeches.filter((speech) => {
    if (!deferredSpeechSearch) {
      return true
    }

    const searchSpace = [
      speech.title,
      speech.speaker,
      speech.type,
      speech.context,
      speech.communicationSignature,
      ...speech.lessons,
    ]
      .join(' ')
      .toLowerCase()

    return searchSpace.includes(deferredSpeechSearch)
  })

  const savedSpeeches = speeches.filter((speech) =>
    progress.savedSpeechIds.includes(speech.id),
  )
  const savedBriefs = knowledgeBriefs.filter((brief) =>
    progress.savedBriefIds.includes(brief.id),
  )

  const syncProgress = (updater: (current: ProgressState) => ProgressState) => {
    setProgress((current) => {
      const next = updater(current)
      persistProgress(next)
      return next
    })
  }

  const showStatus = (message: string) => {
    setStatusMessage(message)
  }

  const handleSectionShortcut = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    const tagName = target?.tagName
    const isTypingSurface =
      tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable

    if (
      isTypingSurface ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return
    }

    const nextSection = sectionShortcutMap[event.key]

    if (nextSection) {
      event.preventDefault()
      startTransition(() => {
        setActiveSection(nextSection)
      })
    }
  })

  const handleWindowFocus = useEffectEvent(() => {
    setProgress(bootstrapProgress(getTodayKey()))
  })

  useEffect(() => {
    window.addEventListener('keydown', handleSectionShortcut)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      window.removeEventListener('keydown', handleSectionShortcut)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [])

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage(null)
    }, 2200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [statusMessage])

  const openSection = (section: SectionId) => {
    startTransition(() => {
      setActiveSection(section)
    })
  }

  const handleSaveSentence = () => {
    syncProgress((current) =>
      saveSentenceUpgrade(current, sentenceInput, selectedTone, sentenceSession),
    )
    showStatus('Sentence upgrade saved to your Growth Log.')
  }

  const handleCopySentence = async (suggestion: SentenceSuggestion) => {
    if (!navigator.clipboard) {
      showStatus('Copy is not available in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(suggestion.output)
      showStatus(`Copied the ${suggestion.label.toLowerCase()}.`)
    } catch {
      showStatus('Could not copy that sentence.')
    }
  }

  const renderHome = () => (
    <div className="section-stack">
      <div className="card-grid card-grid--daily">
        <DailyCard
          title="Tip of the Day"
          eyebrow="Coach"
          accent="sunrise"
          complete={progress.completedByDate[todayKey]?.includes('tip') ?? false}
          onToggle={() =>
            syncProgress((current) => toggleCompletion(current, todayKey, 'tip'))
          }
        >
          <h3>{dailyTip.title}</h3>
          <p>{dailyTip.summary}</p>
          <ul className="list-stack">
            {dailyTip.playbook.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="micro-note">Coach note: {dailyTip.coachNote}</p>
        </DailyCard>

        <DailyCard
          title="Starter of the Day"
          eyebrow="Conversation"
          accent="teal"
          complete={
            progress.completedByDate[todayKey]?.includes('starter') ?? false
          }
          onToggle={() =>
            syncProgress((current) =>
              toggleCompletion(current, todayKey, 'starter'),
            )
          }
        >
          <h3>{dailyStarter.scenario}</h3>
          <p className="quote-block">“{dailyStarter.opener}”</p>
          <p>
            <strong>Bridge:</strong> {dailyStarter.followUp}
          </p>
          <p className="micro-note">{dailyStarter.whyItWorks}</p>
        </DailyCard>

        <DailyCard
          title="Geo + Knowledge Drop"
          eyebrow="Explore"
          accent="ink"
          complete={progress.completedByDate[todayKey]?.includes('brief') ?? false}
          onToggle={() =>
            syncProgress((current) =>
              toggleCompletion(current, todayKey, 'brief'),
            )
          }
        >
          <div className="inline-row">
            <span className="badge badge--soft">{dailyBrief.category}</span>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                syncProgress((current) => toggleBriefSave(current, dailyBrief.id))
                showStatus(
                  progress.savedBriefIds.includes(dailyBrief.id)
                    ? 'Brief removed from saved topics.'
                    : 'Brief saved to your Growth Log.',
                )
              }}
            >
              {progress.savedBriefIds.includes(dailyBrief.id)
                ? 'Saved'
                : 'Save topic'}
            </button>
          </div>
          <h3>{dailyBrief.title}</h3>
          <p>{dailyBrief.summary}</p>
          <p className="micro-note">Try this line: {dailyBrief.sampleLine}</p>
        </DailyCard>

        <DailyCard
          title="Sentence Upgrade"
          eyebrow="Framing"
          accent="clay"
          complete={
            progress.completedByDate[todayKey]?.includes('sentence') ?? false
          }
          onToggle={() =>
            syncProgress((current) =>
              toggleCompletion(current, todayKey, 'sentence'),
            )
          }
        >
          <p className="label-text">Original</p>
          <p className="quote-block quote-block--plain">{dailySentence.original}</p>
          <p className="label-text">Stronger version</p>
          <p className="quote-block">“{dailySentence.upgraded}”</p>
          <p className="micro-note">{dailySentence.why}</p>
        </DailyCard>

        <DailyCard
          title="Speech of the Day"
          eyebrow="Library"
          accent="gold"
          complete={
            progress.completedByDate[todayKey]?.includes('speech') ?? false
          }
          onToggle={() =>
            syncProgress((current) =>
              toggleCompletion(current, todayKey, 'speech'),
            )
          }
        >
          <div className="inline-row">
            <span className="badge">{dailySpeech.type}</span>
            <span className="meta-chip">{dailySpeech.year}</span>
          </div>
          <h3>{dailySpeech.title}</h3>
          <p className="speaker-line">
            {dailySpeech.speaker} • {dailySpeech.duration}
          </p>
          <p>{dailySpeech.description}</p>
          <div className="button-row">
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                syncProgress((current) => ({
                  ...current,
                  activeSpeechId: dailySpeech.id,
                }))
                openSection('smart-monitor')
              }}
            >
              Inspect speech
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => {
                syncProgress((current) => toggleSpeechSave(current, dailySpeech.id))
                showStatus(
                  progress.savedSpeechIds.includes(dailySpeech.id)
                    ? 'Speech removed from saved list.'
                    : 'Speech saved to your Growth Log.',
                )
              }}
            >
              {progress.savedSpeechIds.includes(dailySpeech.id)
                ? 'Saved'
                : 'Save speech'}
            </button>
          </div>
        </DailyCard>

        <DailyCard
          title="Slang of the Day"
          eyebrow="Current English"
          accent="rose"
          complete={progress.completedByDate[todayKey]?.includes('slang') ?? false}
          onToggle={() =>
            syncProgress((current) =>
              toggleCompletion(current, todayKey, 'slang'),
            )
          }
        >
          <div className="inline-row">
            <h3>{dailySlang.term}</h3>
            <span className="badge badge--soft">{dailySlang.vibe}</span>
          </div>
          <p>{dailySlang.meaning}</p>
          <p className="micro-note">Example: {dailySlang.example}</p>
          <p className="micro-note">Use with care: {dailySlang.caution}</p>
        </DailyCard>
      </div>
    </div>
  )

  const renderExplore = () => (
    <div className="section-stack">
      <div className="section-panel section-panel--search">
        <div>
          <p className="eyebrow">Explore Topics</p>
          <h2>Topic cards built to make you sound informed fast.</h2>
        </div>
        <label className="search-field">
          <span>Search topics</span>
          <input
            type="text"
            value={topicSearch}
            placeholder="Search geopolitics, culture, work, or social talking points"
            onChange={(event) => setTopicSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="card-grid">
        {filteredBriefs.map((brief) => {
          const isSaved = progress.savedBriefIds.includes(brief.id)

          return (
            <article className="content-card" key={brief.id}>
              <div className="inline-row">
                <span className="badge">{brief.category}</span>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    syncProgress((current) => toggleBriefSave(current, brief.id))
                    showStatus(
                      isSaved
                        ? 'Topic removed from saved list.'
                        : 'Topic saved to your Growth Log.',
                    )
                  }}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
              <h3>{brief.title}</h3>
              <p>{brief.summary}</p>
              <p className="micro-note">{brief.whyItMatters}</p>
              <div className="detail-block">
                <p className="label-text">Conversation angles</p>
                <ul className="list-stack">
                  {brief.conversationAngles.map((angle) => (
                    <li key={angle}>{angle}</li>
                  ))}
                </ul>
              </div>
              <p className="quote-block quote-block--plain">{brief.sampleLine}</p>
            </article>
          )
        })}
      </div>
    </div>
  )

  const renderSentenceLab = () => (
    <div className="section-stack">
      <div className="section-panel sentence-lab">
        <div className="panel-copy">
          <p className="eyebrow">Sentence Lab</p>
          <h2>Practice saying more with fewer words.</h2>
          <p>
            Drop in something weak, hesitant, or messy. Commupro will turn it
            into sharper English with different communication goals.
          </p>
        </div>

        <div className="sentence-workbench">
          <label className="field-block">
            <span>Your sentence</span>
            <textarea
              rows={5}
              value={sentenceInput}
              onChange={(event) => setSentenceInput(event.target.value)}
              placeholder="Type the sentence you want to upgrade..."
            />
          </label>

          <div className="chip-grid">
            {sentenceGoals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                className={
                  goal.id === selectedTone
                    ? 'tone-chip tone-chip--active'
                    : 'tone-chip'
                }
                onClick={() => setSelectedTone(goal.id)}
              >
                <span>{goal.label}</span>
                <small>{goal.description}</small>
              </button>
            ))}
          </div>

          <div className="button-row">
            <button className="primary-button" type="button" onClick={handleSaveSentence}>
              Save upgrade
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSentenceInput(dailySentence.original)
                setSelectedTone(dailySentence.targetTone)
              }}
            >
              Load daily exercise
            </button>
          </div>
        </div>
      </div>

      <div className="card-grid">
        {sentenceSession.suggestions.map((suggestion) => (
          <article className="content-card" key={suggestion.label}>
            <div className="inline-row">
              <span className="badge">{suggestion.label}</span>
              <button
                className="ghost-button"
                type="button"
                onClick={() => void handleCopySentence(suggestion)}
              >
                Copy
              </button>
            </div>
            <p className="quote-block">“{suggestion.output}”</p>
            <p>{suggestion.why}</p>
            <div className="tag-row">
              {suggestion.moves.map((move) => (
                <span className="meta-chip" key={move}>
                  {move}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="section-panel">
        <div className="inline-row inline-row--stretch">
          <div>
            <p className="eyebrow">Coach Notes</p>
            <h3>What changed in the rewrite</h3>
          </div>
        </div>
        <ul className="list-stack list-stack--wide">
          {sentenceSession.coachNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderSpeechLibrary = () => (
    <div className="section-stack">
      <div className="section-panel section-panel--search">
        <div>
          <p className="eyebrow">Speech Library</p>
          <h2>Curated speeches and pitches worth studying line by line.</h2>
        </div>
        <label className="search-field">
          <span>Search speeches</span>
          <input
            type="text"
            value={speechSearch}
            placeholder="Search speaker, speech type, or communication skill"
            onChange={(event) => setSpeechSearch(event.target.value)}
          />
        </label>
      </div>

      <div className="card-grid">
        {filteredSpeeches.map((speech) => {
          const isSaved = progress.savedSpeechIds.includes(speech.id)
          const isActive = activeSpeech.id === speech.id

          return (
            <article className="content-card content-card--speech" key={speech.id}>
              <div className="inline-row">
                <span className="badge">{speech.type}</span>
                <span className="meta-chip">{speech.year}</span>
              </div>
              <h3>{speech.title}</h3>
              <p className="speaker-line">
                {speech.speaker} • {speech.duration}
              </p>
              <p>{speech.description}</p>
              <p className="micro-note">
                Signature move: {speech.communicationSignature}
              </p>
              <div className="tag-row">
                {speech.lessons.slice(0, 3).map((lesson) => (
                  <span className="meta-chip" key={lesson}>
                    {lesson}
                  </span>
                ))}
              </div>
              <div className="button-row">
                <button
                  className={isActive ? 'primary-button' : 'secondary-button'}
                  type="button"
                  onClick={() => {
                    syncProgress((current) => ({
                      ...current,
                      activeSpeechId: speech.id,
                    }))
                    openSection('smart-monitor')
                  }}
                >
                  {isActive ? 'In monitor' : 'Open monitor'}
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    syncProgress((current) => toggleSpeechSave(current, speech.id))
                    showStatus(
                      isSaved
                        ? 'Speech removed from saved list.'
                        : 'Speech saved to your Growth Log.',
                    )
                  }}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )

  const renderSmartMonitor = () => (
    <div className="section-stack section-stack--monitor">
      <div className="section-panel monitor-panel">
        <div className="monitor-header">
          <div>
            <p className="eyebrow">Smart Monitor</p>
            <h2>{activeSpeech.title}</h2>
            <p className="speaker-line">
              {activeSpeech.speaker} • {activeSpeech.year} • {activeSpeech.type}
            </p>
          </div>
          <div className="tag-row">
            <span className="meta-chip">{activeSpeech.duration}</span>
            <span className="meta-chip">{activeSpeech.context}</span>
          </div>
        </div>

        <p className="lead-text">{activeSpeech.description}</p>

        <div className="metric-grid">
          <MetricCard
            title="Hook"
            value={activeSpeech.monitor.hook}
            detail="How the speaker opens and earns attention."
            compact
          />
          <MetricCard
            title="Trust"
            value={activeSpeech.monitor.trust}
            detail="How credibility and warmth are built early."
            compact
          />
          <MetricCard
            title="Clarity"
            value={activeSpeech.monitor.clarity}
            detail="How the message stays easy to follow."
            compact
          />
          <MetricCard
            title="Lift"
            value={activeSpeech.monitor.lift}
            detail="How the speaker raises stakes or emotion."
            compact
          />
        </div>
      </div>

      <div className="card-grid card-grid--monitor">
        <article className="content-card">
          <p className="eyebrow">Structure</p>
          <h3>How the argument is built</h3>
          <div className="timeline">
            {activeSpeech.structure.map((step) => (
              <div className="timeline-step" key={step.label}>
                <span className="timeline-dot" />
                <div>
                  <p className="label-text">{step.label}</p>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="content-card">
          <p className="eyebrow">Articulation Moves</p>
          <h3>What this speaker does well</h3>
          <ul className="list-stack">
            {activeSpeech.lessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
          <p className="micro-note">
            Watch for: {activeSpeech.monitor.stealThisMove}
          </p>
        </article>

        <article className="content-card">
          <p className="eyebrow">Practice Prompt</p>
          <h3>Train the pattern, not just the content</h3>
          <p>{activeSpeech.practicePrompt}</p>
          <p className="micro-note">
            Commupro focus: {activeSpeech.communicationSignature}
          </p>
        </article>
      </div>

      <div className="section-panel">
        <div className="inline-row inline-row--stretch">
          <div>
            <p className="eyebrow">Switch Source</p>
            <h3>Choose another speech to inspect</h3>
          </div>
        </div>
        <div className="rail-list">
          {speeches.map((speech) => (
            <button
              key={speech.id}
              type="button"
              className={
                activeSpeech.id === speech.id
                  ? 'rail-item rail-item--active'
                  : 'rail-item'
              }
              onClick={() =>
                syncProgress((current) => ({ ...current, activeSpeechId: speech.id }))
              }
            >
              <span>{speech.title}</span>
              <small>
                {speech.speaker} • {speech.type}
              </small>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProgress = () => (
    <div className="section-stack">
      <div className="metric-grid metric-grid--hero">
        <MetricCard
          title="Current streak"
          value={`${streak} day${streak === 1 ? '' : 's'}`}
          detail="Open Commupro daily to keep your communication reps going."
        />
        <MetricCard
          title="Today complete"
          value={`${completionCount}/${dailyModuleIds.length}`}
          detail="Finish all six modules to complete today’s communication loop."
        />
        <MetricCard
          title="Saved speeches"
          value={`${progress.savedSpeechIds.length}`}
          detail="A personal library of examples worth revisiting."
        />
        <MetricCard
          title="Saved upgrades"
          value={`${progress.savedSentenceUpgrades.length}`}
          detail="Your best reframed sentences stay in one place."
        />
      </div>

      <div className="section-panel">
        <p className="eyebrow">Saved speeches</p>
        <h3>Your communication role models</h3>
        {savedSpeeches.length > 0 ? (
          <div className="saved-list">
            {savedSpeeches.map((speech) => (
              <button
                key={speech.id}
                type="button"
                className="saved-tile"
                onClick={() => {
                  syncProgress((current) => ({
                    ...current,
                    activeSpeechId: speech.id,
                  }))
                  openSection('smart-monitor')
                }}
              >
                <strong>{speech.title}</strong>
                <span>{speech.speaker}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Save speeches from the library to build your personal benchmark list.
          </div>
        )}
      </div>

      <div className="section-panel">
        <p className="eyebrow">Saved topics</p>
        <h3>Conversation fuel you want to revisit</h3>
        {savedBriefs.length > 0 ? (
          <div className="saved-list">
            {savedBriefs.map((brief) => (
              <article className="saved-topic" key={brief.id}>
                <div className="inline-row">
                  <strong>{brief.title}</strong>
                  <span className="meta-chip">{brief.category}</span>
                </div>
                <p>{brief.sampleLine}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Save a few Explore cards and Commupro will turn them into your
            personal talk-track bank.
          </div>
        )}
      </div>

      <div className="section-panel">
        <p className="eyebrow">Saved sentence upgrades</p>
        <h3>Your strongest rewrites</h3>
        {progress.savedSentenceUpgrades.length > 0 ? (
          <div className="saved-list">
            {progress.savedSentenceUpgrades.map((entry) => (
              <article className="saved-topic" key={entry.id}>
                <div className="inline-row">
                  <strong>{entry.input}</strong>
                  <span className="meta-chip">
                    {sentenceGoals.find((goal) => goal.id === entry.tone)?.label}
                  </span>
                </div>
                <p>{entry.savedAt}</p>
                <p className="quote-block quote-block--plain">
                  {entry.suggestions[0]?.output}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Save your best rewrites from Sentence Lab and they will show up here.
          </div>
        )}
      </div>
    </div>
  )

  const activeSectionMeta =
    sectionLabels.find((section) => section.id === activeSection) ?? sectionLabels[0]

  return (
    <div className="app-shell">
      <div className="ambient ambient--top" />
      <div className="ambient ambient--bottom" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="brand-name">Commupro</p>
            <p className="brand-tagline">Speak sharper. Think clearer. Connect better.</p>
          </div>
        </div>

        <div className="topbar-summary">
          <div className="summary-chip">
            <strong>{formatLongDate(todayKey)}</strong>
            <span>Daily communication gym</span>
          </div>
          <div className="summary-chip">
            <strong>{completionCount}/6 complete</strong>
            <span>{streak} day streak</span>
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="hero-panel">
            <p className="eyebrow">Today’s Mission</p>
            <h1>Build a voice that sounds informed, concise, and alive.</h1>
            <p>
              Commupro blends sentence coaching, conversation practice, role
              model speeches, and current language awareness into one daily flow.
            </p>

            <div className="progress-cluster">
              <div>
                <span className="stat-number">{completionCount}</span>
                <span className="stat-label">modules done</span>
              </div>
              <div>
                <span className="stat-number">{progress.savedSpeechIds.length}</span>
                <span className="stat-label">speeches saved</span>
              </div>
              <div>
                <span className="stat-number">{progress.savedBriefIds.length}</span>
                <span className="stat-label">topics saved</span>
              </div>
            </div>

            <div className="hero-meter">
              <div
                className="hero-meter__fill"
                style={{
                  width: `${(completionCount / dailyModuleIds.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <nav className="section-nav" aria-label="Commupro sections">
            {sectionLabels.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  section.id === activeSection
                    ? 'section-button section-button--active'
                    : 'section-button'
                }
                onClick={() => openSection(section.id)}
              >
                <span className="section-button__key">{section.shortKey}</span>
                <span className="section-button__text">
                  <strong>{section.label}</strong>
                  <small>{section.subtitle}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className="sidebar-note">
            <p className="eyebrow">Habit loop</p>
            <p>
              Tip, starter, knowledge bite, sentence upgrade, speech study, slang.
              Six reps per day. Small lifts compound fast.
            </p>
          </div>
        </aside>

        <main className="content">
          <section className="section-hero">
            <p className="eyebrow">{activeSectionMeta.label}</p>
            <div className="section-hero__row">
              <div>
                <h2>{activeSectionMeta.subtitle}</h2>
                <p>
                  Built for English communication practice that feels practical,
                  modern, and repeatable.
                </p>
              </div>
              <div className="section-hero__callout">
                <span className="meta-chip">Keys 1-6 jump between sections</span>
                <span className="meta-chip">Your progress saves locally</span>
              </div>
            </div>
          </section>

          {activeSection === 'home' && renderHome()}
          {activeSection === 'explore' && renderExplore()}
          {activeSection === 'sentence-lab' && renderSentenceLab()}
          {activeSection === 'speech-library' && renderSpeechLibrary()}
          {activeSection === 'smart-monitor' && renderSmartMonitor()}
          {activeSection === 'progress' && renderProgress()}
        </main>
      </div>

      {statusMessage ? <div className="toast">{statusMessage}</div> : null}
    </div>
  )
}

type DailyCardProps = {
  title: string
  eyebrow: string
  accent: 'sunrise' | 'teal' | 'ink' | 'clay' | 'gold' | 'rose'
  complete: boolean
  onToggle: () => void
  children: ReactNode
}

function DailyCard({
  title,
  eyebrow,
  accent,
  complete,
  onToggle,
  children,
}: DailyCardProps) {
  return (
    <article className={`daily-card daily-card--${accent}`}>
      <div className="inline-row inline-row--stretch">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <button
          className={complete ? 'complete-pill complete-pill--done' : 'complete-pill'}
          type="button"
          onClick={onToggle}
        >
          {complete ? 'Done' : 'Mark done'}
        </button>
      </div>
      <div className="daily-card__body">{children}</div>
    </article>
  )
}

type MetricCardProps = {
  title: string
  value: string
  detail: string
  compact?: boolean
}

function MetricCard({
  title,
  value,
  detail,
  compact = false,
}: MetricCardProps) {
  return (
    <article className={compact ? 'metric-card metric-card--compact' : 'metric-card'}>
      <p className="eyebrow">{title}</p>
      <h3>{value}</h3>
      <p>{detail}</p>
    </article>
  )
}

export default App
