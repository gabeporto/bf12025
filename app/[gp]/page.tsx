'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { BettingTable } from '@/components/betting-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ResultsInput, type RaceResults } from '@/components/results-input'
import { Leaderboard, type BettingScore } from '@/components/leaderboard'
import { F1_THEME } from '@/lib/theme'
import * as constants from '@/lib/constants'
import { useRouter } from 'next/navigation'

export default function BettingsPage() {
  const [results, setResults] = useState<RaceResults>({
    polePosition: '',
    positions: {
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: '',
      10: '',
      11: '',
    },
  })
  const [scores, setScores] = useState<BettingScore[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Obter o nome do GP com base na URL
  const pathname = usePathname()
  const gp = useMemo(() => {
    const path = pathname.split('/').pop()
    return constants.F1_GPS.find((gp) => gp.id === path)?.name || 'GP não disponível'
  }, [pathname])

  // Verificar se todos os inputs estão preenchidos
  const allInputsFilled = useMemo(() => {
    const poleIsFilled = results.polePosition !== ''
    const allPositionsFilled = Object.values(results.positions).every((pos) => pos !== '')
    return poleIsFilled && allPositionsFilled
  }, [results])

  const handleResultsChange = useCallback((newResults: RaceResults) => {
    setResults(newResults)
  }, [])

  const handleScoresCalculated = useCallback((newScores: BettingScore[]) => {
    setScores(newScores)
  }, [])

  // Hook useRouter para navegação
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[url('/images/f1-background.png')] bg-cover bg-center">
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <button
            onClick={handleGoBack}
            className="mb-6 px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-800"
          >
            Voltar
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <ResultsInput onResultsChange={handleResultsChange} isProcessing={isProcessing} gpName={gp} gpId={pathname} />
            </div>
            <div className="lg:col-span-3">
              <Leaderboard scores={scores} isLoading={isProcessing && allInputsFilled} />
            </div>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader
              className="text-white"
              style={{
                background: F1_THEME.gradients.header,
                borderBottom: `4px solid ${F1_THEME.primary}`,
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Flag size={24} className="text-white" />
                <CardTitle className="text-3xl font-bold text-center">{gp}</CardTitle>
              </div>
              <CardDescription className="text-center text-white">
                <p className="text-lg">Resultados da corrida</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <BettingTable results={results} onScoresCalculated={handleScoresCalculated} isLoading={false} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
