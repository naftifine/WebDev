import { createFileRoute } from '@tanstack/react-router'
import { ScoreSearch } from '@/features/score-search'

export const Route = createFileRoute('/_authenticated/score-search')({
  component: ScoreSearch,
})
