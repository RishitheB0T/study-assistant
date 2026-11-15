import { z } from 'zod'

// Text that is still not empty after spaces are trimmed off both ends.
const text = z.string().trim().min(1)

// One flip card.
export const FlashcardSchema = z.object({
  type: z.literal('flashcard'),
  id: text,
  front: text,
  back: text,
})

// One multiple-choice question: exactly 4 options, answerIndex points at one of them.
export const McqSchema = z.object({
  type: z.literal('mcq'),
  id: text,
  question: text,
  options: z.array(text).length(4),
  answerIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
})

// Any item: Zod reads `type` first, then checks the item with the matching rules.
export const ItemSchema = z.discriminatedUnion('type', [FlashcardSchema, McqSchema])

// Only the outer shape. Items are checked one by one in parseStudySet,
// so one bad card does not reject the whole set.
export const StudySetShapeSchema = z.object({
  title: text,
  items: z.array(z.unknown()),
})
