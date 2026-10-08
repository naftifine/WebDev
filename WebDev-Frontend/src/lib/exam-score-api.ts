import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export type ExamScore = {
  sbd: string
  math?: number
  literature?: number
  foreignLanguage?: number
  physics?: number
  chemistry?: number
  biology?: number
  history?: number
  geography?: number
  civics?: number
  languageCode?: string
  combinations?: {
    a00?: number
    a01?: number
  }
}

export type SubjectStatistics = {
  level1: number
  level2: number
  level3: number
  level4: number
}

export type SubjectStatisticsResponse = Record<
  string,
  SubjectStatistics | string
>

export type RankingEntry = {
  sbd: string
  combinations?: {
    a00?: number
    a01?: number
  }
}

export async function getExamScore(sbd: string) {
  const response = await api.post<{ data: ExamScore }>('/exam-scores', { sbd })
  return response.data.data
}

export async function getSubjectStatistics() {
  const response = await api.get<{ data: SubjectStatisticsResponse }>(
    '/statistics/subjects'
  )
  return response.data.data
}

export async function getTopExamScores(
  combination: 'a00' | 'a01',
  limit: 10 | 100
) {
  const response = await api.post<{
    data: RankingEntry[]
  }>('/rankings', { combination, limit })
  return response.data.data
}
