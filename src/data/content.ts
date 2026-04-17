import type { ToneId } from '../lib/sentenceLab'

export type DailyTip = {
  id: string
  title: string
  summary: string
  playbook: string[]
  coachNote: string
}

export type ConversationStarter = {
  id: string
  scenario: string
  opener: string
  followUp: string
  whyItWorks: string
}

export type KnowledgeBrief = {
  id: string
  category: 'GeoPulse' | 'Culture Cue' | 'Work Talk' | 'Big Idea'
  title: string
  summary: string
  whyItMatters: string
  conversationAngles: string[]
  sampleLine: string
}

export type SentenceUpgrade = {
  id: string
  original: string
  targetTone: ToneId
  upgraded: string
  why: string
}

export type SpeechEntry = {
  id: string
  title: string
  speaker: string
  year: string
  type: string
  context: string
  duration: string
  description: string
  communicationSignature: string
  lessons: string[]
  structure: Array<{
    label: string
    detail: string
  }>
  monitor: {
    hook: string
    trust: string
    clarity: string
    lift: string
    stealThisMove: string
  }
  practicePrompt: string
}

export type SlangDrop = {
  id: string
  term: string
  meaning: string
  vibe: string
  example: string
  caution: string
}

export const dailyTips: DailyTip[] = [
  {
    id: 'open-with-observation',
    title: 'Open with a crisp observation before the question.',
    summary:
      'People relax faster when you show that you are paying attention before you ask them to respond.',
    playbook: [
      'Notice something specific about the context, pace, or shared moment.',
      'Keep the observation short enough to feel natural.',
      'Turn it into a question that invites an easy first answer.',
    ],
    coachNote:
      'Observation first, question second is usually smoother than leading with a cold ask.',
  },
  {
    id: 'replace-filler-with-pause',
    title: 'Replace filler words with one clean pause.',
    summary:
      'A short pause sounds more confident than a chain of “just,” “maybe,” and “I think.”',
    playbook: [
      'Finish the idea in your head before you start speaking.',
      'Pause where you would normally hedge.',
      'Deliver the point as a full sentence, then stop.',
    ],
    coachNote:
      'Confidence often sounds like clean pacing, not bigger vocabulary.',
  },
  {
    id: 'lead-with-outcome',
    title: 'Lead work conversations with the outcome you want.',
    summary:
      'Busy people process direction faster when the result is clear before the context arrives.',
    playbook: [
      'Start with the ask, recommendation, or next step.',
      'Give the reason in one sentence after that.',
      'End with what needs to happen next.',
    ],
    coachNote:
      'Outcome-first framing makes you sound organized and easier to follow.',
  },
  {
    id: 'mirror-before-answer',
    title: 'Mirror the problem before offering your answer.',
    summary:
      'When people feel understood, they become more open to your solution.',
    playbook: [
      'Restate the issue in simple language.',
      'Confirm the pressure or constraint around it.',
      'Offer one clean recommendation instead of five options.',
    ],
    coachNote:
      'Mirroring is not repeating everything back. It is showing that you grasp the core tension.',
  },
  {
    id: 'layered-follow-up',
    title: 'Use layered follow-ups instead of one broad question.',
    summary:
      'A great follow-up moves from broad to specific and keeps the other person talking without pressure.',
    playbook: [
      'Ask a broad opener first.',
      'Pick one detail and go deeper.',
      'Close with a future-facing or reflective question.',
    ],
    coachNote:
      'Good follow-ups create flow because they feel like curiosity, not interrogation.',
  },
  {
    id: 'disagree-with-bridge',
    title: 'Use a bridge line before you disagree.',
    summary:
      'Bridging keeps the tone collaborative even when your idea moves in a different direction.',
    playbook: [
      'Acknowledge what makes the other point valid.',
      'Add your concern or alternative in one line.',
      'Re-anchor on the shared goal.',
    ],
    coachNote:
      'You can be direct without sounding combative when you show the link between both views.',
  },
]

export const conversationStarters: ConversationStarter[] = [
  {
    id: 'networking-room',
    scenario: 'Networking event',
    opener: 'What are you spending most of your energy on right now?',
    followUp:
      'That sounds interesting. What makes that problem worth solving for you?',
    whyItWorks:
      'It avoids the flat “what do you do?” opener and gets people talking about momentum, not titles.',
  },
  {
    id: 'coffee-chat',
    scenario: 'Coffee chat with a senior professional',
    opener:
      'You’ve seen a lot of shifts in your space. What feels most different now from two years ago?',
    followUp:
      'How are you adjusting the way you work because of that?',
    whyItWorks:
      'It flatters experience while giving the other person room to share perspective instead of biography.',
  },
  {
    id: 'first-team-call',
    scenario: 'First team call',
    opener:
      'Before we jump in, what would make this conversation useful for you by the end?',
    followUp:
      'Great. I can structure my part around that so we stay efficient.',
    whyItWorks:
      'It makes you sound intentional and shows you care about relevance, not just speaking time.',
  },
  {
    id: 'friends-gathering',
    scenario: 'Casual social gathering',
    opener: 'What is one surprisingly good thing you’ve found recently?',
    followUp:
      'Why did that one stick with you more than the rest?',
    whyItWorks:
      'Easy to answer, positive in tone, and strong enough to create stories instead of yes-or-no replies.',
  },
  {
    id: 'mentor-reachout',
    scenario: 'Message to a mentor',
    opener:
      'I’m trying to get better at communicating more clearly under pressure. What shifted that for you?',
    followUp:
      'If you were practicing from scratch again, what would you do weekly?',
    whyItWorks:
      'It frames the ask around growth and makes it easy for the mentor to give focused advice.',
  },
  {
    id: 'client-intro',
    scenario: 'Client introduction',
    opener:
      'Before we discuss ideas, what would success from this engagement look like on your side?',
    followUp:
      'That helps. We can shape the conversation around that outcome.',
    whyItWorks:
      'Clients respond well when you organize around their result instead of your process first.',
  },
]

export const knowledgeBriefs: KnowledgeBrief[] = [
  {
    id: 'semiconductor-race',
    category: 'GeoPulse',
    title: 'Semiconductors are now a geopolitical power asset, not just a tech supply chain.',
    summary:
      'Countries are treating chip design, fabrication, and tooling as strategic leverage because the same systems drive AI, defense, cloud infrastructure, and consumer electronics.',
    whyItMatters:
      'If you understand semiconductor politics, you understand why trade policy, subsidies, and national security are now tightly linked.',
    conversationAngles: [
      'Why supply chain resilience now matters as much as cost efficiency.',
      'How chip policy affects AI competition between major powers.',
      'Why talent, tooling, and energy matter as much as factories.',
    ],
    sampleLine:
      'One useful way to read current tech policy is that chips are becoming economic infrastructure, not just hardware.',
  },
  {
    id: 'red-sea-shipping',
    category: 'GeoPulse',
    title: 'Shipping disruptions change prices long before most people notice the headlines.',
    summary:
      'When major maritime routes become risky, delivery times lengthen, insurance rises, and pressure spreads through retail pricing, manufacturing, and inventory planning.',
    whyItMatters:
      'It is a smart conversation topic because it connects geopolitics to everyday business and consumer effects.',
    conversationAngles: [
      'Why logistics shocks show up slowly and then all at once.',
      'How companies choose between speed, safety, and cost.',
      'Why alternate routes reshape margins and timelines.',
    ],
    sampleLine:
      'Global tensions often become visible in business through shipping timelines before they show up clearly in consumer conversation.',
  },
  {
    id: 'water-stress',
    category: 'Big Idea',
    title: 'Water stress may become one of the defining urban issues of the next decade.',
    summary:
      'Heat, migration, infrastructure pressure, and uneven rainfall are making water resilience a major planning challenge for fast-growing cities.',
    whyItMatters:
      'It is a strong knowledge topic because it touches climate, governance, public health, and economic planning in one frame.',
    conversationAngles: [
      'Why infrastructure problems are often really governance problems.',
      'How climate adaptation is becoming a design and policy issue.',
      'Why resilience conversations will increasingly matter in business too.',
    ],
    sampleLine:
      'A lot of future city competitiveness may come down to whether basic systems like water and heat resilience are handled early.',
  },
  {
    id: 'ai-managers',
    category: 'Work Talk',
    title: 'AI tools are changing expectations around speed, not just output.',
    summary:
      'As teams adopt AI assistants, managers often start expecting faster drafts, quicker iteration, and more strategic thinking from the same amount of time.',
    whyItMatters:
      'It opens a sharp conversation about where human judgment still creates advantage even when tools accelerate production.',
    conversationAngles: [
      'Why faster tools can quietly increase pressure rather than reduce it.',
      'How communication quality becomes a differentiator when output volume rises.',
      'Why judgment, framing, and editing still matter even with AI support.',
    ],
    sampleLine:
      'The interesting shift with AI at work is that the value may move from producing first drafts to framing better decisions.',
  },
  {
    id: 'creator-trust',
    category: 'Culture Cue',
    title: 'Audiences increasingly reward creators who build community, not just reach.',
    summary:
      'People are getting better at detecting empty content volume, so creators who cultivate taste, trust, and identity often hold stronger long-term attention.',
    whyItMatters:
      'Useful for conversations about branding, media, influence, and why distribution alone is no longer enough.',
    conversationAngles: [
      'Why trust compounds faster than virality over time.',
      'How niche identity can outperform broad but forgettable reach.',
      'Why audience quality is often more useful than audience size.',
    ],
    sampleLine:
      'A lot of modern influence feels less like broadcasting and more like building a room people want to keep returning to.',
  },
  {
    id: 'quiet-luxury',
    category: 'Culture Cue',
    title: 'Quiet luxury is really a signal about taste, not just spending.',
    summary:
      'Minimal, understated aesthetics often communicate control, confidence, and insider recognition rather than obvious status display.',
    whyItMatters:
      'It is a good conversation angle because it crosses fashion, branding, culture, and psychology.',
    conversationAngles: [
      'Why subtle status signals often feel more powerful than loud ones.',
      'How brands design for recognition by the right people, not everyone.',
      'What this trend says about modern ideas of aspiration.',
    ],
    sampleLine:
      'Quiet luxury is interesting because it turns status from visible logos into coded taste and restraint.',
  },
  {
    id: 'diaspora-capital',
    category: 'GeoPulse',
    title: 'Diaspora communities increasingly shape trade, reputation, and soft power.',
    summary:
      'Skilled global communities do more than send remittances. They also move networks, trust, business opportunities, and narratives across borders.',
    whyItMatters:
      'This topic helps you connect migration to economics, identity, entrepreneurship, and diplomacy.',
    conversationAngles: [
      'Why social trust can move faster than formal institutions.',
      'How diaspora links create business bridges between markets.',
      'Why reputation and storytelling matter in global influence.',
    ],
    sampleLine:
      'Diaspora influence is not only financial. It also shapes who trusts whom, who collaborates, and how countries are perceived abroad.',
  },
  {
    id: 'career-cushioning',
    category: 'Work Talk',
    title: 'Career cushioning is becoming a normal professional behavior.',
    summary:
      'More people are quietly building optionality through side projects, networking, and skill stacking even when they are not actively planning to leave.',
    whyItMatters:
      'It creates a sharp conversation around job markets, confidence, and how professionals manage uncertainty.',
    conversationAngles: [
      'Why modern ambition now includes optionality, not just promotion.',
      'How economic uncertainty changes communication at work.',
      'What visible reliability looks like when everyone wants backup plans.',
    ],
    sampleLine:
      'A lot of professionals are no longer waiting for a crisis to build options. They are cushioning early.',
  },
]

export const dailySentenceUpgrades: SentenceUpgrade[] = [
  {
    id: 'deck-review',
    original:
      'I just wanted to check if maybe we can talk tomorrow about the deck because I think it still needs a few changes.',
    targetTone: 'confident',
    upgraded:
      'Can we review the deck tomorrow? I want to tighten the final changes before we send it.',
    why:
      'Lead with the ask, cut the hedging, and explain the reason in one clear follow-up line.',
  },
  {
    id: 'meeting-shift',
    original:
      'I think this meeting is kind of going in too many directions and maybe we should try to focus a little more.',
    targetTone: 'diplomatic',
    upgraded:
      'Can we narrow this to the main decision so we leave with a clear next step?',
    why:
      'The rewrite protects the tone while still steering the room back toward an outcome.',
  },
  {
    id: 'follow-up-request',
    original:
      'I wanted to ask if you had any updates on this whenever you get a chance.',
    targetTone: 'professional',
    upgraded:
      'Could you share a quick update on this when you have a moment?',
    why:
      'It stays polite, but the sentence gets cleaner and more direct.',
  },
  {
    id: 'team-alignment',
    original:
      'Maybe we should all try to be on the same page before we go ahead with it.',
    targetTone: 'concise',
    upgraded:
      'Let’s align before we move forward.',
    why:
      'A shorter sentence often sounds stronger because the idea lands faster.',
  },
  {
    id: 'warm-check-in',
    original:
      'I just wanted to see how you were feeling about everything after the call.',
    targetTone: 'warm',
    upgraded:
      'How are you feeling after that call? I wanted to check in.',
    why:
      'This version sounds warmer because it leads with the person, not the speaker’s hesitation.',
  },
  {
    id: 'persuade-shift',
    original:
      'I think we should probably focus on the smaller version first because it may be easier.',
    targetTone: 'persuasive',
    upgraded:
      'We should start with the smaller version. It gets us to traction faster and lowers execution risk.',
    why:
      'Persuasion gets stronger when you attach the recommendation to a concrete gain.',
  },
]

export const speeches: SpeechEntry[] = [
  {
    id: 'obama-2004',
    title: '2004 Democratic National Convention Keynote',
    speaker: 'Barack Obama',
    year: '2004',
    type: 'Political keynote',
    context: 'National convention stage',
    duration: '17 min study',
    description:
      'A masterclass in narrative lift, rhythm, and making a broad political message feel personal and memorable.',
    communicationSignature:
      'He moves from story to scale without losing warmth.',
    lessons: [
      'Uses clean contrasts to make ideas feel memorable.',
      'Builds trust through biography before expanding into national meaning.',
      'Alternates short, landing lines with longer emotional arcs.',
      'Repeats themes just enough to feel musical rather than redundant.',
    ],
    structure: [
      {
        label: 'Personal grounding',
        detail:
          'He begins with roots and identity so the audience trusts the voice before the message expands.',
      },
      {
        label: 'Shared aspiration',
        detail:
          'The speech then connects individual story to a bigger collective ambition.',
      },
      {
        label: 'Memorable contrast',
        detail:
          'Clear contrasts make the message easier to repeat after the speech ends.',
      },
      {
        label: 'Lift and cadence',
        detail:
          'The ending becomes more rhythmic and emotionally elevated without becoming vague.',
      },
    ],
    monitor: {
      hook: 'Personal origin story that earns immediate curiosity.',
      trust: 'Warmth first, authority second.',
      clarity: 'Big themes are broken into simple, repeatable frames.',
      lift: 'Rhythm gradually rises so the ending feels inevitable.',
      stealThisMove:
        'Build from one human story into a larger idea people can carry with them.',
    },
    practicePrompt:
      'Take a personal experience and explain why it points to a larger lesson for your team, community, or audience.',
  },
  {
    id: 'jobs-stanford',
    title: 'Stanford Commencement Address',
    speaker: 'Steve Jobs',
    year: '2005',
    type: 'Commencement speech',
    context: 'Graduation ceremony',
    duration: '15 min study',
    description:
      'Simple language, deliberate storytelling, and clear chaptering make this one of the strongest examples of memorable long-form communication.',
    communicationSignature:
      'He simplifies big ideas into story chapters that people can retell.',
    lessons: [
      'Breaks the speech into clear story blocks, which helps memory.',
      'Uses plain language instead of performing intelligence.',
      'Lets pauses and restraint carry emotional weight.',
      'Keeps the through-line simple enough to survive repetition.',
    ],
    structure: [
      {
        label: 'Frame the promise',
        detail: 'He states that the speech will be a few stories and keeps that promise.',
      },
      {
        label: 'Story chapters',
        detail:
          'Each story stands alone but also contributes to the same larger message.',
      },
      {
        label: 'Lesson extraction',
        detail:
          'The meaning is pulled out cleanly, without sounding like a lecture.',
      },
      {
        label: 'Compact close',
        detail:
          'The ending lands because it is short, distilled, and easy to remember.',
      },
    ],
    monitor: {
      hook: 'Sets a low-ego, story-driven frame instantly.',
      trust: 'Honesty and vulnerability create credibility.',
      clarity: 'Chaptering keeps the audience oriented at all times.',
      lift: 'Emotional depth rises through accumulation, not volume.',
      stealThisMove:
        'Promise a simple structure early, then deliver exactly that structure.',
    },
    practicePrompt:
      'Explain a career lesson through three short stories instead of one abstract explanation.',
  },
  {
    id: 'adichie-single-story',
    title: 'The Danger of a Single Story',
    speaker: 'Chimamanda Ngozi Adichie',
    year: '2009',
    type: 'TED talk',
    context: 'Idea talk',
    duration: '18 min study',
    description:
      'An outstanding example of conversational eloquence, cultural clarity, and using personal narrative to dismantle a larger assumption.',
    communicationSignature:
      'She sounds intimate and intelligent at the same time.',
    lessons: [
      'Uses concrete anecdotes to make abstract cultural critique accessible.',
      'Balances humor, honesty, and intellectual sharpness.',
      'Keeps the language elegant without making it heavy.',
      'Returns to one theme from multiple angles until it becomes undeniable.',
    ],
    structure: [
      {
        label: 'Personal entry point',
        detail: 'She begins with lived experience rather than theory.',
      },
      {
        label: 'Pattern reveal',
        detail:
          'The anecdotes gradually reveal the larger pattern beneath them.',
      },
      {
        label: 'Concept naming',
        detail:
          'Once the audience feels the pattern, she names it clearly and memorably.',
      },
      {
        label: 'Moral expansion',
        detail:
          'The close widens the idea into responsibility, perception, and power.',
      },
    ],
    monitor: {
      hook: 'A personal anecdote that feels vivid and specific.',
      trust: 'Credibility comes from reflective honesty rather than force.',
      clarity: 'The central idea is revisited through multiple examples.',
      lift: 'Insight deepens steadily, making the ending feel earned.',
      stealThisMove:
        'Use small personal examples to make a large cultural idea easier to accept.',
    },
    practicePrompt:
      'Take a stereotype, assumption, or oversimplified idea and dismantle it through one personal story and one broader observation.',
  },
  {
    id: 'king-dream',
    title: 'I Have a Dream',
    speaker: 'Martin Luther King Jr.',
    year: '1963',
    type: 'Movement speech',
    context: 'Mass public rally',
    duration: '17 min study',
    description:
      'A definitive model for cadence, repetition, and moral clarity that turns a speech into a shared emotional event.',
    communicationSignature:
      'He uses repetition like structure, not decoration.',
    lessons: [
      'Repetition becomes the engine that carries meaning and memory.',
      'Moral framing is paired with concrete imagery.',
      'Cadence rises gradually instead of peaking too early.',
      'The message stays clear even as the emotion intensifies.',
    ],
    structure: [
      {
        label: 'Moral premise',
        detail:
          'He begins from a clear moral claim that gives the speech its spine.',
      },
      {
        label: 'Urgency',
        detail:
          'The present problem is defined with enough force that action feels necessary.',
      },
      {
        label: 'Vision',
        detail:
          'The speech shifts into image-rich future language that people can see and feel.',
      },
      {
        label: 'Collective release',
        detail:
          'The ending becomes communal, rhythmic, and emotionally expansive.',
      },
    ],
    monitor: {
      hook: 'Begins with moral weight, not small talk.',
      trust: 'Conviction is supported by structure and control.',
      clarity: 'Repeated phrasing keeps the audience oriented.',
      lift: 'Cadence and imagery create a rising emotional wave.',
      stealThisMove:
        'When the stakes are high, repeat the core idea with variation until it becomes unforgettable.',
    },
    practicePrompt:
      'Take one principle you care about and build a short talk that repeats it with rising intensity and changing imagery.',
  },
  {
    id: 'sinek-why',
    title: 'How Great Leaders Inspire Action',
    speaker: 'Simon Sinek',
    year: '2009',
    type: 'TED talk',
    context: 'Idea talk',
    duration: '18 min study',
    description:
      'An excellent example of simple conceptual framing that makes an abstract idea easy to remember and explain to others.',
    communicationSignature:
      'He packages an idea into a clean framework people can immediately repeat.',
    lessons: [
      'Uses one memorable model to organize the entire talk.',
      'Explains the same idea from multiple practical angles.',
      'Keeps the language plain so the framework spreads easily.',
      'Balances theory with recognizable examples.',
    ],
    structure: [
      {
        label: 'Pattern introduction',
        detail: 'The talk opens by naming a pattern that feels familiar but underexplained.',
      },
      {
        label: 'Framework',
        detail:
          'A simple model becomes the anchor for everything that follows.',
      },
      {
        label: 'Examples',
        detail:
          'Examples are chosen to reinforce the framework, not distract from it.',
      },
      {
        label: 'Application',
        detail:
          'The talk ends by making the idea usable beyond the stage.',
      },
    ],
    monitor: {
      hook: 'Begins with a recognizable puzzle or pattern.',
      trust: 'Trust grows because the logic feels portable and testable.',
      clarity: 'The framework is simple enough to teach in one sentence.',
      lift: 'Momentum comes from recognition and repeatability.',
      stealThisMove:
        'Give your audience one framework simple enough to repeat after hearing it once.',
    },
    practicePrompt:
      'Build a two-minute explanation of an idea using one simple model instead of a loose collection of points.',
  },
  {
    id: 'oprah-golden-globes',
    title: 'Golden Globes Acceptance Speech',
    speaker: 'Oprah Winfrey',
    year: '2018',
    type: 'Award speech',
    context: 'Cultural moment',
    duration: '10 min study',
    description:
      'A powerful study in sincerity, authority, and how to combine personal history with a message that feels larger than the self.',
    communicationSignature:
      'She sounds emotionally full without losing command.',
    lessons: [
      'Personal story is used to unlock collective meaning.',
      'Warmth and strength coexist rather than compete.',
      'Transitions are graceful, so the audience follows the emotional movement.',
      'The close expands from gratitude into significance.',
    ],
    structure: [
      {
        label: 'Moment anchoring',
        detail:
          'She grounds the speech in a vivid memory and the meaning of the current moment.',
      },
      {
        label: 'Personal testimony',
        detail:
          'Her story creates legitimacy and emotional connection together.',
      },
      {
        label: 'Shared significance',
        detail:
          'The message expands from biography into something collective and timely.',
      },
      {
        label: 'Forward energy',
        detail:
          'The ending feels like an opening into possibility, not a final sentence.',
      },
    ],
    monitor: {
      hook: 'Begins with emotional sincerity, not performance.',
      trust: 'Authority grows from calm conviction and lived perspective.',
      clarity: 'Transitions make the speech feel guided and intentional.',
      lift: 'Emotion accumulates into a hopeful close.',
      stealThisMove:
        'Use one personal memory to create a doorway into a larger message people share.',
    },
    practicePrompt:
      'Describe one experience that shaped your values, then connect it to what you want a group to believe or do.',
  },
]

export const slangDrops: SlangDrop[] = [
  {
    id: 'no-cap',
    term: 'No cap',
    meaning: 'It means “for real” or “I am not exaggerating.”',
    vibe: 'casual emphasis',
    example: 'That presentation was the clearest one today, no cap.',
    caution:
      'Use it only in very casual settings. It sounds forced fast if your tone does not naturally fit it.',
  },
  {
    id: 'cooked',
    term: 'Cooked',
    meaning: 'It usually means someone is finished, overwhelmed, or in a bad position.',
    vibe: 'playful alarm',
    example: 'If I miss this deadline, I am cooked.',
    caution:
      'Fine with friends. Too casual for professional communication unless you are joking with a close team.',
  },
  {
    id: 'bet',
    term: 'Bet',
    meaning: 'A short way to say “okay,” “agreed,” or “I am in.”',
    vibe: 'quick agreement',
    example: 'Bet, I will send it by evening.',
    caution:
      'Very natural in chat, but it can feel abrupt in formal communication.',
  },
  {
    id: 'delulu',
    term: 'Delulu',
    meaning: 'Short for delusional, often used jokingly for unrealistic hope or fantasy.',
    vibe: 'self-aware humor',
    example: 'My delulu side thinks I can finish all of this by lunch.',
    caution:
      'Useful only when the tone is playful and shared. Not suitable for serious contexts.',
  },
  {
    id: 'lore-drop',
    term: 'Lore drop',
    meaning: 'New backstory, context, or hidden information suddenly revealed.',
    vibe: 'internet-native',
    example: 'That interview was basically a lore drop about how the company really started.',
    caution:
      'Works best when your audience is already familiar with online culture.',
  },
  {
    id: 'aura',
    term: 'Aura',
    meaning: 'A funny way to describe someone’s coolness, presence, or social energy.',
    vibe: 'playful approval',
    example: 'He did not say much, but the room still felt his aura.',
    caution:
      'This is more about playful social commentary than serious description.',
  },
]
