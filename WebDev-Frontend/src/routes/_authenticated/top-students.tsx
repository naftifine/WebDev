import { createFileRoute } from '@tanstack/react-router'
import { TopStudents } from '@/features/top-students'

export const Route = createFileRoute('/_authenticated/top-students')({
  component: TopStudents,
})
