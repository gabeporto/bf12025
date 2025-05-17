"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { F1_DRIVERS } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Flag, Loader2 } from "lucide-react"

export interface RaceResults {
  polePosition: string
  positions: {
    [key: number]: string
  }
}

interface ResultsInputProps {
  onResultsChange: (results: RaceResults) => void
  isProcessing: boolean
}

export function ResultsInput({ onResultsChange, isProcessing }: ResultsInputProps) {
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

  // Usar um debounce para evitar atualizações muito frequentes
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const updateResults = useCallback(
    (newResults: RaceResults) => {
      // Limpar o timer anterior se existir
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Definir um novo timer para atualizar os resultados após 300ms
      debounceTimerRef.current = setTimeout(() => {
        onResultsChange(newResults)
      }, 300)
    },
    [onResultsChange],
  )

  const handlePoleChange = useCallback(
    (value: string) => {
      const newResults = {
        ...results,
        polePosition: value,
      }
      setResults(newResults)
      updateResults(newResults)
    },
    [results, updateResults],
  )

  const handlePositionChange = useCallback(
    (index: number, value: string) => {
      const newResults = {
        ...results,
        positions: {
          ...results.positions,
          [index]: value,
        },
      }
      setResults(newResults)
      updateResults(newResults)
    },
    [results, updateResults],
  )

  return (
    <Card className="border-0 shadow-xl overflow-hidden relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Processando resultados...</span>
          </div>
        </div>
      )}

      <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Flag size={18} />
          Resultados da Corrida
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="mb-2">
            <Label htmlFor="pole-position" className="flex items-center gap-2 mb-2 text-sm">
              Selecione todos os pilotos para atualizar os resultados!
            </Label>
            <div className="flex items-center gap-3 mt-5">
              <Badge variant="outline" className="w-12 flex justify-center shrink-0">
                POLE
              </Badge>
              <Select value={results.polePosition} onValueChange={handlePoleChange} disabled={isProcessing}>
                <SelectTrigger
                  id="pole-position"
                  className={
                    results.polePosition ? "border-2 border-green-500" : ""
                  }
                >
                  <SelectValue placeholder="Selecione o piloto" />
                </SelectTrigger>
                <SelectContent>
                  {F1_DRIVERS.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} ({driver.team})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 12 }).map((_, index) => {
              const currentValue = results.positions[index]
              const values = Object.values(results.positions).filter((_, i) => i !== index)
              const isDuplicate = currentValue && values.includes(currentValue)

              return (
                <div key={index} className="flex items-center gap-3">
                  <Badge variant="outline" className="w-12 flex justify-center shrink-0">
                    P{index + 1}
                  </Badge>
                  <div className="flex-1">
                    <Select
                      value={currentValue}
                      onValueChange={(value) => handlePositionChange(index, value)}
                      disabled={isProcessing}
                    >
                      <SelectTrigger
                        id={`position-${index}`}
                        className={
                          currentValue
                            ? isDuplicate
                              ? "border-red-500 border-2"
                              : "border-green-500 border-2"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Selecione o piloto" />
                      </SelectTrigger>
                      <SelectContent>
                        {F1_DRIVERS.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} ({driver.team})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
