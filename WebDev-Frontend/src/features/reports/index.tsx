import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Card, CardContent} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Overview } from '@/features/dashboard/components/overview'
import { getSubjectStatistics } from '@/lib/exam-score-api'

export function Reports() {
  const statisticsQuery = useQuery({
    queryKey: ['subject-statistics'],
    queryFn: getSubjectStatistics,
  })
  const errorMessage =
    statisticsQuery.error instanceof AxiosError
      ? statisticsQuery.error.response?.data?.message
      : undefined

  return (
    <>
      <Header>
        <div className='me-auto text-sm font-medium'>Báo cáo thống kê</div>
      </Header>
      <Main>
        <div className='mb-6 space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Báo cáo thống kê</h1>
          <p className='text-muted-foreground'>
            Thống kê số lượng thí sinh theo từng mức điểm và môn học.
          </p>
        </div>
        <Card>
          <CardContent className='ps-2'>
            {statisticsQuery.isPending && (
              <p className='px-4 py-12 text-sm text-muted-foreground'>Đang tải thống kê...</p>
            )}
            {statisticsQuery.isError && (
              <p className='px-4 py-12 text-sm text-destructive'>
                {errorMessage ?? 'Không thể tải thống kê. Vui lòng thử lại.'}
              </p>
            )}
            {statisticsQuery.data && <Overview data={statisticsQuery.data} />}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
