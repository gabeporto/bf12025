"use client"

import { useState, useCallback, useRef, useMemo } from "react"
import { BettingTable } from "@/components/betting-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flag, Trophy } from "lucide-react"
import { ResultsInput, type RaceResults } from "@/components/results-input"
import { Leaderboard, type BettingScore } from "@/components/leaderboard"
import { F1_THEME } from "@/lib/theme"

export default function BettingsPage() {
  const [results, setResults] = useState<RaceResults>({
    polePosition: "",
    positions: {
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: "",
      11: "",
    },
  })
  const [scores, setScores] = useState<BettingScore[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar se todos os inputs estão preenchidos
  const allInputsFilled = useMemo(() => {
    const poleIsFilled = results.polePosition !== ""
    const allPositionsFilled = Object.values(results.positions).every((pos) => pos !== "")
    return poleIsFilled && allPositionsFilled
  }, [results])

  const handleResultsChange = useCallback((newResults: RaceResults) => {
  const poleIsFilled = newResults.polePosition !== ""
  const allPositionsFilled = Object.values(newResults.positions).every((pos) => pos !== "")
  const allFilled = poleIsFilled && allPositionsFilled

  // Limpar o timer anterior se existir
  if (processingTimerRef.current) {
    clearTimeout(processingTimerRef.current)
  }

  if (allFilled) {
    setIsProcessing(true)

    processingTimerRef.current = setTimeout(() => {
      setResults(newResults)

      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }, 100)
  }
}, [])

  const handleScoresCalculated = useCallback((newScores: BettingScore[]) => {
    setScores(newScores)
  }, [])

  return (
    <div className="min-h-screen bg-[url('/images/f1-background.png')] bg-cover bg-center">
      <div className="min-h-screen bg-black/80 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6">
            <Button
              variant="outline"
              asChild
              className="bg-white/90 hover:bg-white border-red-600 text-red-600 hover:text-red-700"
            >
              <Link href="/bet" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Voltar para apostas
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <ResultsInput onResultsChange={handleResultsChange} isProcessing={isProcessing} />
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
                <CardTitle className="text-3xl font-bold text-center">Grande Prêmio da Emilia-Romagna</CardTitle>
              </div>
              <CardDescription className="text-center text-white">
                <p className="text-lg">Resultados da corrida</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <BettingTable results={results} onScoresCalculated={handleScoresCalculated} isLoading={isProcessing && allInputsFilled} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
