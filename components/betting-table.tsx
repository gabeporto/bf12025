"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { F1_DRIVERS, F1_TEAMS } from "@/lib/constants"
import { F1_THEME } from "@/lib/theme"
import { getDriverInitials } from "@/lib/utils"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RaceResults } from "./results-input"
import type { BettingScore } from "./leaderboard"
import { Loader2 } from "lucide-react"

// Dados de exemplo para demonstração com equipes e fotos
const SAMPLE_BETTINGS = [
  {
    id: "1",
    betterName: "Vitor Alexandre",
    photo: "/placeholder.svg?height=100&width=100&text=JS",
    team: "mclaren",
    polePosition: "norris",
    positions: {
      0: "norris",
      1: "leclerc",
      2: "verstappen",
      3: "hamilton",
      4: "russell",
      5: "sainz",
      6: "piastri",
      7: "albon",
      8: "alonso",
      9: "stroll",
      10: "gasly",
      11: "ocon",
    },
  },
  {
    id: "2",
    betterName: "Elisandra Patrick",
    photo: "/placeholder.svg?height=100&width=100&text=MO",
    team: "mclaren",
    polePosition: "leclerc",
    positions: {
      0: "leclerc",
      1: "verstappen",
      2: "sainz",
      3: "norris",
      4: "hamilton",
      5: "russell",
      6: "piastri",
      7: "albon",
      8: "alonso",
      9: "hulkenberg",
      10: "tsunoda",
      11: "antonelli",
    },
  },
  {
    id: "3",
    betterName: "Alan Jones",
    photo: "/placeholder.svg?height=100&width=100&text=CP",
    team: "ferrari",
    polePosition: "norris",
    positions: {
      0: "norris",
      1: "verstappen",
      2: "piastri",
      3: "leclerc",
      4: "hamilton",
      5: "sainz",
      6: "russell",
      7: "albon",
      8: "alonso",
      9: "stroll",
      10: "gasly",
      11: "colapinto",
    },
  },
  {
    id: "4",
    betterName: "Micha Bloom",
    photo: "/placeholder.svg?height=100&width=100&text=AS",
    team: "ferrari",
    polePosition: "hamilton",
    positions: {
      0: "hamilton",
      1: "russell",
      2: "verstappen",
      3: "leclerc",
      4: "norris",
      5: "sainz",
      6: "piastri",
      7: "albon",
      8: "alonso",
      9: "ocon",
      10: "gasly",
      11: "bearman",
    },
  },
  {
    id: "5",
    betterName: "Gilberto Rosário",
    photo: "/placeholder.svg?height=100&width=100&text=PS",
    team: "redbull",
    polePosition: "verstappen",
    positions: {
      0: "verstappen",
      1: "tsunoda",
      2: "leclerc",
      3: "sainz",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "alonso",
      9: "stroll",
      10: "lawson",
      11: "hadjar",
    },
  },
  {
    id: "6",
    betterName: "Bruno Conway",
    photo: "/placeholder.svg?height=100&width=100&text=FL",
    team: "redbull",
    polePosition: "leclerc",
    positions: {
      0: "leclerc",
      1: "sainz",
      2: "verstappen",
      3: "tsunoda",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "alonso",
      9: "stroll",
      10: "gasly",
      11: "ocon",
    },
  },
  {
    id: "7",
    betterName: "Ricardo Almeida",
    photo: "/placeholder.svg?height=100&width=100&text=RA",
    team: "mercedes",
    polePosition: "norris",
    positions: {
      0: "norris",
      1: "piastri",
      2: "verstappen",
      3: "leclerc",
      4: "russell",
      5: "antonelli",
      6: "sainz",
      7: "albon",
      8: "alonso",
      9: "stroll",
      10: "tsunoda",
      11: "lawson",
    },
  },
  {
    id: "8",
    betterName: "Juliana Costa",
    photo: "/placeholder.svg?height=100&width=100&text=JC",
    team: "mercedes",
    polePosition: "hamilton",
    positions: {
      0: "hamilton",
      1: "russell",
      2: "verstappen",
      3: "leclerc",
      4: "norris",
      5: "piastri",
      6: "sainz",
      7: "albon",
      8: "alonso",
      9: "stroll",
      10: "antonelli",
      11: "colapinto",
    },
  },
  {
    id: "9",
    betterName: "Fernando Jardim",
    photo: "/placeholder.svg?height=100&width=100&text=LM",
    team: "astonmartin",
    polePosition: "alonso",
    positions: {
      0: "alonso",
      1: "stroll",
      2: "verstappen",
      3: "leclerc",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "sainz",
      9: "albon",
      10: "ocon",
      11: "gasly",
    },
  },
  {
    id: "10",
    betterName: "Patrick Santos",
    photo: "/placeholder.svg?height=100&width=100&text=CR",
    team: "astonmartin",
    polePosition: "verstappen",
    positions: {
      0: "verstappen",
      1: "alonso",
      2: "leclerc",
      3: "sainz",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "albon",
      9: "stroll",
      10: "ocon",
      11: "gasly",
    },
  },
  {
    id: "11",
    betterName: "Roberto Gomes",
    photo: "/placeholder.svg?height=100&width=100&text=RG",
    team: "williams",
    polePosition: "albon",
    positions: {
      0: "albon",
      1: "sainz",
      2: "verstappen",
      3: "leclerc",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "alonso",
      9: "stroll",
      10: "gasly",
      11: "colapinto",
    },
  },
  {
    id: "12",
    betterName: "Patrícia Lopes",
    photo: "/placeholder.svg?height=100&width=100&text=PL",
    team: "williams",
    polePosition: "verstappen",
    positions: {
      0: "verstappen",
      1: "albon",
      2: "sainz",
      3: "leclerc",
      4: "hamilton",
      5: "russell",
      6: "norris",
      7: "piastri",
      8: "alonso",
      9: "stroll",
      10: "gasly",
      11: "colapinto",
    },
  },
  {
    id: "13",
    betterName: "Marcos Vieira",
    photo: "/placeholder.svg?height=100&width=100&text=MV",
    team: "alpine",
    polePosition: "gasly",
    positions: {
      0: "gasly",
      1: "colapinto",
      2: "verstappen",
      3: "leclerc",
      4: "sainz",
      5: "hamilton",
      6: "russell",
      7: "norris",
      8: "piastri",
      9: "albon",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "14",
    betterName: "Carla Dias",
    photo: "/placeholder.svg?height=100&width=100&text=CD",
    team: "alpine",
    polePosition: "gasly",
    positions: {
      0: "gasly",
      1: "colapinto",
      2: "verstappen",
      3: "leclerc",
      4: "sainz",
      5: "hamilton",
      6: "russell",
      7: "norris",
      8: "piastri",
      9: "albon",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "15",
    betterName: "Cláudio Franco",
    photo: "/placeholder.svg?height=100&width=100&text=FM",
    team: "racingbulls",
    polePosition: "lawson",
    positions: {
      0: "lawson",
      1: "hadjar",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "16",
    betterName: "Sr. Isaias",
    photo: "/placeholder.svg?height=100&width=100&text=DC",
    team: "racingbulls",
    polePosition: "hadjar",
    positions: {
      0: "hadjar",
      1: "lawson",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "17",
    betterName: "Gustavo Nunes",
    photo: "/placeholder.svg?height=100&width=100&text=GN",
    team: "haas",
    polePosition: "ocon",
    positions: {
      0: "ocon",
      1: "bearman",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "18",
    betterName: "Bianca Ferreira",
    photo: "/placeholder.svg?height=100&width=100&text=BF",
    team: "haas",
    polePosition: "bearman",
    positions: {
      0: "bearman",
      1: "ocon",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "19",
    betterName: "Gabriel Portoleto",
    photo: "/placeholder.svg?height=100&width=100&text=HC",
    team: "sauber",
    polePosition: "hulkenberg",
    positions: {
      0: "hulkenberg",
      1: "bortoleto",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
  {
    id: "20",
    betterName: "Roberto Portoleto",
    photo: "/placeholder.svg?height=100&width=100&text=IM",
    team: "sauber",
    polePosition: "bortoleto",
    positions: {
      0: "bortoleto",
      1: "hulkenberg",
      2: "verstappen",
      3: "tsunoda",
      4: "leclerc",
      5: "sainz",
      6: "hamilton",
      7: "russell",
      8: "norris",
      9: "piastri",
      10: "alonso",
      11: "stroll",
    },
  },
]

// Função para agrupar apostas em conjuntos de 4
function chunkArray<T>(array: T[], size: number): T[][] {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// Tabela de pontuação
const POINTS = {
  pole: 5,
  positions: [20, 16, 14, 12, 10, 8, 7, 6, 5, 4, 3, 2], // Pontos para P1-P12
}

// Componente para exibir uma aposta individual
function BettingCard({
  betting,
  results,
  score,
  rank,
  isLoading,
  detailedScores,
}: {
  betting: (typeof SAMPLE_BETTINGS)[0]
  results: RaceResults
  score: number
  rank: number
  isLoading: boolean
  detailedScores: {
    exactMatches: number[]
    partialMatches: string[]
    polePoints: number
    totalExactPoints: number
    totalPartialPoints: number
    hasAtLeastOneExactMatch: boolean
  }
}) {
  // Obter informações da equipe
  const team = F1_TEAMS.find((t) => t.id === betting.team)
  const isPodium = rank <= 3

  // Função para renderizar o piloto
  const renderDriver = (
    driverId: string,
    position: number | "pole",
    isCorrect: boolean,
    points: number | null = null,
    isPartialMatch = false,
  ) => {
    const driver = F1_DRIVERS.find((d) => d.id === driverId)
    if (!driver) return "???"

    const driverTeam = F1_TEAMS.find((t) => t.id === driver.teamId)
    const initials = getDriverInitials(driver.name)

    return (
      <div
        className={`flex items-center gap-2 p-1 rounded ${isCorrect ? "bg-green-100 border border-green-300" : isPartialMatch ? "bg-yellow-50 border border-yellow-200" : ""}`}
      >
        <div
          className="h-6 w-6 relative rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: driverTeam?.color || "#e2e2e2" }}
        >
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
        <span className="text-sm flex-grow">{driver.name}</span>
        {points !== null && points > 0 && (
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${isCorrect ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}
          >
            +{points}
          </span>
        )}
      </div>
    )
  }

  // Verificar se a pole position está correta
  const isPoleCorrect = betting.polePosition === results.polePosition && results.polePosition !== ""
  const polePoints = detailedScores.polePoints

  // Determinar a cor da borda com base na posição
  const getBorderColor = () => {
    if (rank === 1) return F1_THEME.podium.gold
    if (rank === 2) return F1_THEME.podium.silver
    if (rank === 3) return F1_THEME.podium.bronze
    return "transparent"
  }

  return (
    <Card
      className={`h-full relative overflow-hidden ${isPodium ? "shadow-xl" : "shadow-md"}`}
      style={{
        borderColor: getBorderColor(),
        borderWidth: isPodium ? "2px" : "1px",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
        </div>
      )}
      {/* Barra superior com a cor da equipe */}
      {team && <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: team.color }} />}

      <div
        className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-bold z-10 text-white"
        style={{
          backgroundColor: isPodium
            ? rank === 1
              ? F1_THEME.podium.gold
              : rank === 2
                ? F1_THEME.podium.silver
                : F1_THEME.podium.bronze
            : "#2b2b2b",
        }}
      >
        {score} pts
      </div>

      <div
        className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold z-10"
        style={{
          backgroundColor:
            rank === 1 ? F1_THEME.podium.gold : rank === 2 ? F1_THEME.podium.silver : rank === 3 ? F1_THEME.podium.bronze : F1_THEME.secondary,
        }}
      >
        {rank}º
      </div>

      <CardHeader className="pb-2 pt-8 flex flex-row items-center gap-3">
        <div
          className={`relative h-12 w-12 rounded-full overflow-hidden border-2 "h-12 w-12"`}
          style={{
            borderColor: team?.color || "gray",
            boxShadow: isPodium ? "0 0 10px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <Image
            src={betting.photo || "/placeholder.svg"}
            alt={betting.betterName}
            fill
            sizes={isPodium ? "56px" : "48px"}
            className="object-cover"
          />
        </div>
        <div>
          <CardTitle className={`${isPodium ? "text-xl" : "text-lg"}`}>{betting.betterName}</CardTitle>
          {team && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }} />
              {team.name}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 w-8 flex justify-center">
              PO
            </Badge>
            {renderDriver(
              betting.polePosition,
              "pole",
              isPoleCorrect,
              detailedScores.hasAtLeastOneExactMatch && isPoleCorrect ? polePoints : 0,
            )}
          </div>
        </div>

        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, index) => {
            const driverId = betting.positions[index as keyof typeof betting.positions]
            const isExactMatch = driverId === results.positions[index] && results.positions[index] !== ""
            const isPartialMatch = !isExactMatch && detailedScores.partialMatches.includes(driverId)

            // Determinar pontos
            let points = null
            if (isExactMatch) {
              points = POINTS.positions[index]
            } else if (isPartialMatch && detailedScores.hasAtLeastOneExactMatch) {
              points = 1
            }

            return (
              <div key={index} className="flex items-center">
                <Badge variant="outline" className="mr-2 w-8 flex justify-center">
                  P{index + 1}
                </Badge>
                {renderDriver(driverId, index, isExactMatch, points, isPartialMatch)}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface BettingTableProps {
  results: RaceResults
  onScoresCalculated: (scores: BettingScore[]) => void
  isLoading: boolean
}

export function BettingTable({ results, onScoresCalculated, isLoading }: BettingTableProps) {
  const [bettings] = useState(SAMPLE_BETTINGS)
  const [calculationInProgress, setCalculationInProgress] = useState(false)
  const [detailedScores, setDetailedScores] = useState<Record<string, any>>({})

  // Calcular pontuações quando os resultados mudam - otimizado com useCallback
  const calculateScores = useCallback(() => {
    if (!results.polePosition && Object.values(results.positions).every((pos) => !pos)) {
      // Se não houver resultados, não calcule pontuações
      onScoresCalculated([])
      return
    }

    setCalculationInProgress(true)

    // Usar setTimeout para não bloquear a UI
    setTimeout(() => {
      const newScores: BettingScore[] = []
      const newDetailedScores: Record<string, any> = {}

      // Criar um array com os IDs dos pilotos nos resultados oficiais
      const resultDriverIds = Object.values(results.positions).filter((id) => id !== "")

      bettings.forEach((betting) => {
        let score = 0
        let correctPredictions = 0
        const exactMatches: number[] = []
        const partialMatches: string[] = []

        // Verificar acertos exatos
        for (let i = 0; i < 12; i++) {
          const betPosition = betting.positions[i as keyof typeof betting.positions]
          const resultPosition = results.positions[i]

          if (betPosition === resultPosition && resultPosition !== "") {
            score += POINTS.positions[i]
            correctPredictions++
            exactMatches.push(i)
          }
        }

        // Verificar se tem pelo menos um acerto exato
        const hasAtLeastOneExactMatch = exactMatches.length > 0

        // Verificar acertos parciais (piloto certo, posição errada)
        if (hasAtLeastOneExactMatch) {
          for (let i = 0; i < 12; i++) {
            const betPosition = betting.positions[i as keyof typeof betting.positions]
            const resultPosition = results.positions[i]

            // Se não é um acerto exato, mas o piloto está entre os resultados
            if (betPosition !== resultPosition && resultDriverIds.includes(betPosition) && betPosition !== "") {
              score += 1 // +1 ponto por acerto parcial
              partialMatches.push(betPosition)
            }
          }
        }

        // Verificar pole position - só soma se tiver pelo menos um acerto exato
        let polePoints = 0
        if (hasAtLeastOneExactMatch && betting.polePosition === results.polePosition && results.polePosition !== "") {
          polePoints = POINTS.pole
          score += polePoints
          correctPredictions++
        }

        // Calcular totais para exibição
        const totalExactPoints = exactMatches.reduce((sum, pos) => sum + POINTS.positions[pos], 0)
        const totalPartialPoints = partialMatches.length

        // Salvar detalhes da pontuação
        newDetailedScores[betting.id] = {
          exactMatches,
          partialMatches,
          polePoints,
          totalExactPoints,
          totalPartialPoints,
          hasAtLeastOneExactMatch,
        }

        newScores.push({
          id: betting.id,
          betterName: betting.betterName,
          team: betting.team,
          photo: betting.photo,
          score,
          correctPredictions: correctPredictions,
        })
      })

      setDetailedScores(newDetailedScores)
      onScoresCalculated(newScores)
      setCalculationInProgress(false)
    }, 100)
  }, [results, bettings, onScoresCalculated])

  // Usar useEffect com dependências otimizadas
  useEffect(() => {
    calculateScores()
  }, [calculateScores])

  // Ordenar as apostas por pontuação e agrupar por equipe - otimizado com useMemo
  const sortedBettingsWithScores = useMemo(() => {
    if (Object.keys(detailedScores).length === 0) {
      return []
    }

    // Calcular pontuações
    const scoresMap = new Map<string, number>()

    bettings.forEach((betting) => {
      const details = detailedScores[betting.id]
      if (!details) return

      let score = 0

      // Acertos exatos
      score += details.totalExactPoints

      // Acertos parciais
      if (details.hasAtLeastOneExactMatch) {
        score += details.totalPartialPoints

        // Pole position
        if (betting.polePosition === results.polePosition && results.polePosition !== "") {
          score += POINTS.pole
        }
      }

      scoresMap.set(betting.id, score)
    })

    // Agrupar por equipe e ordenar por pontuação dentro de cada equipe
    const teamGroups = new Map<string, { betting: (typeof bettings)[0]; score: number }[]>()

    bettings.forEach((betting) => {
      const score = scoresMap.get(betting.id) || 0
      const team = betting.team

      if (!teamGroups.has(team)) {
        teamGroups.set(team, [])
      }

      teamGroups.get(team)!.push({ betting, score })
    })

    // Ordenar cada grupo de equipe por pontuação
    teamGroups.forEach((group) => {
      group.sort((a, b) => b.score - a.score)
    })

    // Ordenar as equipes por pontuação total
    const teamTotalScores = new Map<string, number>()
    teamGroups.forEach((group, team) => {
      const totalScore = group.reduce((sum, item) => sum + item.score, 0)
      teamTotalScores.set(team, totalScore)
    })

    const sortedTeams = [...teamGroups.keys()].sort(
      (a, b) => (teamTotalScores.get(b) || 0) - (teamTotalScores.get(a) || 0),
    )

    // Criar lista final ordenada por equipe e depois por pontuação individual
    const result: { betting: (typeof bettings)[0]; score: number }[] = []
    sortedTeams.forEach((team) => {
      result.push(...(teamGroups.get(team) || []))
    })

    return result
  }, [bettings, results, detailedScores])

  // Criar um mapa de classificação geral
  const rankMap = useMemo(() => {
    const map = new Map<string, number>()
    const allScores = [...sortedBettingsWithScores].sort((a, b) => b.score - a.score)

    allScores.forEach((item, index) => {
      map.set(item.betting.id, index + 1)
    })

    return map
  }, [sortedBettingsWithScores])

  // Agrupar apostas em conjuntos de 4
  const bettingRows = useMemo(() => {
    return chunkArray(sortedBettingsWithScores, 4)
  }, [sortedBettingsWithScores])

  return (
    <div className="space-y-10 relative">
      {(isLoading || calculationInProgress) && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
            <Loader2 className="h-10 w-10 animate-spin text-red-600 mb-2" />
            <span className="text-lg font-medium text-gray-800">Atualizando apostas...</span>
          </div>
        </div>
      )}

      {bettingRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {row.map(({ betting, score }) => (
            <BettingCard
              key={betting.id}
              betting={betting}
              results={results}
              score={score}
              rank={rankMap.get(betting.id) || 0}
              isLoading={isLoading || calculationInProgress}
              detailedScores={
                detailedScores[betting.id] || {
                  exactMatches: [],
                  partialMatches: [],
                  polePoints: 0,
                  totalExactPoints: 0,
                  totalPartialPoints: 0,
                  hasAtLeastOneExactMatch: false,
                }
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}
