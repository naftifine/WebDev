import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { SubjectStatisticsResponse } from '@/lib/exam-score-api'

const subjectLabels: Record<string, string> = {
  math: 'Toán',
  literature: 'Ngữ văn',
  foreignLanguage: 'Ngoại ngữ',
  physics: 'Vật lý',
  chemistry: 'Hóa học',
  biology: 'Sinh học',
  history: 'Lịch sử',
  geography: 'Địa lý',
  civics: 'GDCD',
}

const subjectOrder = [
  'math',
  'literature',
  'foreignLanguage',
  'physics',
  'chemistry',
  'biology',
  'history',
  'geography',
  'civics',
]

const levelOrder = [
  { dataKey: 'level4', name: '< 4 điểm', fill: '#ef4444' },
  { dataKey: 'level3', name: '4 – 6 điểm', fill: '#f59e0b' },
  { dataKey: 'level2', name: '6 – 8 điểm', fill: '#16a34a' },
  { dataKey: 'level1', name: '≥ 8 điểm', fill: '#2563eb' },
] as const

export function Overview({
  data: statistics = {},
}: {
  data?: SubjectStatisticsResponse
}) {
  const data = subjectOrder.flatMap((subject) => {
    const value = statistics[subject]
    if (!value || typeof value === 'string') return []

    return [{
      name: subjectLabels[subject] ?? subject,
      level4: value.level4,
      level3: value.level3,
      level2: value.level2,
      level1: value.level1,
    }]
  })

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        {levelOrder.map((level) => (
          <Bar
            key={level.dataKey}
            dataKey={level.dataKey}
            name={level.name}
            fill={level.fill}
            radius={[4, 4, 0, 0]}
          />
        ))}
        <Legend
          content={() => (
            <div className='flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm'>
              {levelOrder.map((level) => (
                <div key={level.dataKey} className='flex items-center gap-2'>
                  <span
                    className='size-3 rounded-sm'
                    style={{ backgroundColor: level.fill }}
                  />
                  <span>{level.name}</span>
                </div>
              ))}
            </div>
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
