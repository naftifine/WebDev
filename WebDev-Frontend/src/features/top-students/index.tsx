import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { getTopExamScores } from '@/lib/exam-score-api'
import { useState } from 'react'

export function TopStudents() {
  const [combination, setCombination] = useState<'a00' | 'a01'>('a00')
  const [limit, setLimit] = useState<10 | 100>(10)
  const rankingQuery = useQuery({
    queryKey: ['rankings', combination, limit],
    queryFn: () => getTopExamScores(combination, limit),
  })
  const errorMessage =
    rankingQuery.error instanceof AxiosError
      ? rankingQuery.error.response?.data?.message
      : undefined

  return (
    <>
      <Header>
        <div className='me-auto text-sm font-medium'>Xếp hạng khối A</div>
      </Header>
      <Main>
        <div className='mb-6 space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Xếp hạng khối A</h1>
          <p className='text-muted-foreground'>
            Danh sách top 10 hoặc top 100 theo tổ hợp A00 (Toán, Vật lý, Hóa học)
            và A01 (Toán, Vật lý, Ngoại ngữ).
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              Bảng xếp hạng
              <div className='flex gap-2'>
                <Select value={combination} onValueChange={(value) => setCombination(value as 'a00' | 'a01')}>
                  <SelectTrigger className='w-28'><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='a00'>Khối A00</SelectItem>
                    <SelectItem value='a01'>Khối A01</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value) as 10 | 100)}>
                  <SelectTrigger className='w-28'><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='10'>Top 10</SelectItem>
                    <SelectItem value='100'>Top 100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
            <CardDescription>Danh sách thí sinh theo tổng điểm tổ hợp đã chọn.</CardDescription>
          </CardHeader>
          <CardContent>
            {rankingQuery.isPending && <p className='text-sm text-muted-foreground'>Đang tải bảng xếp hạng...</p>}
            {rankingQuery.isError && (
              <p className='text-sm text-destructive'>{errorMessage ?? 'Không thể tải bảng xếp hạng.'}</p>
            )}
            {rankingQuery.data && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'>#</TableHead>
                    <TableHead>Số báo danh</TableHead>
                    <TableHead className='text-end'>Tổng điểm {combination.toUpperCase()}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankingQuery.data.map((student, index) => (
                    <TableRow key={student.sbd}>
                      <TableCell className='font-medium'>{index + 1}</TableCell>
                      <TableCell>{student.sbd}</TableCell>
                      <TableCell className='text-end font-semibold'>
                        {student.combinations?.[combination] ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
