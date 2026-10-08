import { type FormEvent, useState } from 'react'
import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { getExamScore, type ExamScore } from '@/lib/exam-score-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export function ScoreSearch() {
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [searchedSbd, setSearchedSbd] = useState('')

  const scoreQuery = useMutation({
    mutationFn: getExamScore,
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const sbd = registrationNumber.trim()

    if (!sbd) return

    setSearchedSbd(sbd)
    scoreQuery.mutate(sbd)
  }

  const errorMessage =
    scoreQuery.error instanceof AxiosError
      ? scoreQuery.error.response?.data?.message
      : undefined

  return (
    <>
      <Header>
        <div className='me-auto text-sm font-medium'>Tra cứu điểm</div>
      </Header>

      <Main>
        <div className='mb-6 space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Tra cứu điểm thi
          </h1>

          <p className='text-muted-foreground'>
            Nhập số báo danh để xem chi tiết điểm các môn.
          </p>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardContent>
              <form
                className='flex flex-col gap-3 sm:flex-row sm:items-end'
                onSubmit={handleSubmit}
              >
                <div className='flex w-full items-center gap-3 sm:max-w-md'>
                  <label
                    htmlFor='registration-number'
                    className='shrink-0 text-sm font-medium'
                  >
                    Số báo danh
                  </label>
                  <Input
                    id='registration-number'
                    value={registrationNumber}
                    onChange={(event) =>
                      setRegistrationNumber(
                        event.target.value.replace(/\D/g, '')
                      )
                    }
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder='Nhập số báo danh'
                  />
                </div>

                <Button type='submit' disabled={scoreQuery.isPending}>
                  <Search className='size-4' />

                  {scoreQuery.isPending ? 'Đang tra cứu...' : 'Tra cứu'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết điểm</CardTitle>
            </CardHeader>

            <CardContent>
              {scoreQuery.isPending && (
                <p className='text-sm text-muted-foreground'>
                  Đang tải kết quả...
                </p>
              )}

              {scoreQuery.isError && (
                <p className='text-sm text-destructive'>
                  {errorMessage ?? 'Không thể tra cứu điểm. Vui lòng thử lại.'}
                </p>
              )}

              {scoreQuery.data && <ScoreTable score={scoreQuery.data} />}

              {searchedSbd &&
                !scoreQuery.isPending &&
                !scoreQuery.isError &&
                !scoreQuery.data && (
                  <p className='text-sm text-muted-foreground'>
                    Chưa có kết quả cho số báo danh {searchedSbd}.
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

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

function ScoreTable({ score }: { score: ExamScore }) {
  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Số báo danh</TableHead>

            {Object.entries(subjectLabels).map(([subject, label]) => (
              <TableHead key={subject} className='text-end whitespace-nowrap'>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell className='font-medium'>{score.sbd}</TableCell>

            {Object.keys(subjectLabels).map((subject) => {
              const value = score[subject as keyof ExamScore]
              return (
                <TableCell key={subject} className='text-end'>
                  {typeof value === 'number' ? value : '-'}
                </TableCell>
              )
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
