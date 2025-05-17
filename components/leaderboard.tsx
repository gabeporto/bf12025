"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { F1_TEAMS } from "@/lib/constants"
import { F1_THEME } from "@/lib/theme"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export interface BettingScore {
  id: string
  betterName: string
  team: string
  photo: string
  score: number
  correctPredictions: number
}

interface LeaderboardProps {
  scores: BettingScore[]
  isLoading: boolean
}

export function Leaderboard({ scores, isLoading }: LeaderboardProps) {
  // Ordenar por pontuação (maior para menor)
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  // Calcular pontuação por equipe
  const teamScores = new Map<string, number>()
  scores.forEach((score) => {
    const currentTeamScore = teamScores.get(score.team) || 0
    teamScores.set(score.team, currentTeamScore + score.score)
  })

  // Ordenar equipes por pontuação
  const sortedTeams = [...teamScores.entries()].sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Atualizando classificação...</span>
            </div>
          </div>
        )}

        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white">
          <CardTitle className="text-xl">Classificação da Corrida</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[60px]">Pos.</TableHead>
                <TableHead>Piloto</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
                <TableHead className="text-right">Acertos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScores.map((score, index) => {
                const team = F1_TEAMS.find((t) => t.id === score.team)
                const isPodium = index < 3

                return (
                  <TableRow
                    key={score.id}
                    style={{
                      backgroundColor: score.score === 0 ? '#fcf0f2' : isPodium ? '#edfff5' : 'white',
                      height: isPodium ? '60px' : 'auto',
                    }}
                  >
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {isPodium && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? F1_THEME.podium.gold
                                  : index === 1
                                    ? F1_THEME.podium.silver
                                    : F1_THEME.podium.bronze,
                            }}
                          >
                            {index + 1}
                          </div>
                        )}
                        {!isPodium && `${index + 1}º`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`${isPodium ? "w-10 h-10" : "w-8 h-8"} rounded-full overflow-hidden border`}>
                          <Image
                            src={score.photo || "/placeholder.svg"}
                            alt={score.betterName}
                            width={isPodium ? 40 : 32}
                            height={isPodium ? 40 : 32}
                            className="object-cover"
                          />
                        </div>
                        <span className={isPodium ? "font-bold text-lg" : ""}>{score.betterName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {team && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                          <span>{team.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {isPodium ? (
                        <span
                          className="text-lg"
                        >
                          {score.score}
                        </span>
                      ) : (
                        score.score
                      )}
                    </TableCell>
                    <TableCell className="text-right" >{score.correctPredictions}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Atualizando classificação...</span>
            </div>
          </div>
        )}

        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white">
          <CardTitle className="text-xl">Classificação por Equipe</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[60px]">Pos.</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map(([teamId, teamScore], index) => {
                const team = F1_TEAMS.find((t) => t.id === teamId)
                const isPodium = index < 3

                return (
                  <TableRow
                    key={teamId}
                    className={isPodium ? "bg-gray-50" : ""}
                    style={{ height: isPodium ? "50px" : "auto" }}
                  >
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {isPodium && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? F1_THEME.podium.gold
                                  : index === 1
                                    ? F1_THEME.podium.silver
                                    : F1_THEME.podium.bronze,
                            }}
                          >
                            {index + 1}
                          </div>
                        )}
                        {!isPodium && `${index + 1}º`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {team && (
                          <>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
                            <span className={isPodium ? "font-bold text-lg" : ""}>{team.name}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {isPodium ? (
                        <span
                          className="text-lg"
                          style={{
                            color:
                              index === 0
                                ? F1_THEME.podium.gold
                                : index === 1
                                  ? F1_THEME.podium.silver
                                  : F1_THEME.podium.bronze,
                          }}
                        >
                          {teamScore}
                        </span>
                      ) : (
                        teamScore
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
