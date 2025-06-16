"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { F1_THEME } from "@/lib/theme"
import { BF1_DRIVERS, BF1_TEAMS, F1_DRIVERS, F1_GPS, F1_GPS_FINISHED } from "@/lib/constants"
import { Flag, Trophy, Calendar, MapPin, CheckCircle, Circle, Play, Zap } from "lucide-react"
import { redirect } from "next/navigation"
import Image from "next/image"

export default function CorridasPage() {
  const getStatusInfo = (race: (typeof F1_GPS)[0]) => {
    if (race.isFinished) {
      return {
        status: "completed",
        badge: (
          <Badge className="bg-green-500 hover:bg-green-600 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Concluída</span>
            <span className="sm:hidden">Concluída</span>
          </Badge>
        ),
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    } else if (race.active) {
      return {
        status: "active",
        badge: (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
            <Play className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ativa</span>
            <span className="sm:hidden">Ativa</span>
          </Badge>
        ),
        icon: <Play className="w-4 h-4 text-blue-500" />,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    } else {
      return {
        status: "upcoming",
        badge: (
          <Badge variant="outline" className="text-xs">
            <Circle className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Agendada</span>
            <span className="sm:hidden">Agendada</span>
          </Badge>
        ),
        icon: <Circle className="w-4 h-4 text-gray-400" />,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
      full: date.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  const handleRaceClick = (raceId: string, type: "race" | "sprint") => {
    if (type === "sprint") {
      redirect(`/${raceId}/sprint`)
    } else {
      redirect(`/${raceId}`)
    }
  }

  const getWinnerInfo = (race: (typeof F1_GPS)[0]) => {
    if (!race.isFinished) return null

    const winnerDriver = BF1_DRIVERS.find((d) => d.id === race.driverWinnerId)
    const teamOfWinner = BF1_TEAMS.find((t) => t.id === winnerDriver?.team)
    if (!winnerDriver) return null
    const winnerDriverWithTeam = {
      ...winnerDriver,
      teamOfWinner,
    }

    const winnerTeam = BF1_TEAMS.find((t) => t.id === race.teamWinnerId)
    return {
      driver: winnerDriverWithTeam,
      team: winnerTeam,
    }
  }

  // Contar corridas sprint
  const sprintRacesCount = F1_GPS.filter((race) => race.hasSprint).length

  return (
    <div className="py-4 sm:py-6 lg:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header da Temporada */}
        <div className="mb-6 lg:mb-8">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader
              className="text-white text-center px-4 py-6 sm:px-6 sm:py-8"
              style={{
                background: F1_THEME.gradients.header,
                borderBottom: `4px solid ${F1_THEME.primary}`,
              }}
            >
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                {/* <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" /> */}
                <span>Corridas</span>
                {/* <Flag className="w-8 h-8 sm:w-10 sm:h-10" /> */}
              </CardTitle>
              <CardDescription className="text-white/90 text-base sm:text-lg lg:text-xl mt-2">
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Grid de Corridas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {F1_GPS.map((race) => {
            const statusInfo = getStatusInfo(race)
            const dateInfo = formatDate(race.date)
            const winnerInfo = getWinnerInfo(race)

            return (
              <Card
                key={race.id}
                className={`transition-all duration-300 border-2 hover:shadow-xl hover:scale-105
                  ${statusInfo.bgColor} ${statusInfo.borderColor}
                  ${!race.hasData ? 'opacity-50 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
              >
                <CardHeader className="pb-3 px-4 pt-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl">{race.country}</span>
                      {statusInfo.icon}
                      {race.hasSprint && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Sprint</span>
                          <span className="sm:hidden">S</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex-shrink-0">{statusInfo.badge}</div>
                  </div>
                  
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <CardTitle className="text-base sm:text-lg font-bold leading-tight flex-grow">
                          {race.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{race.location}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base sm:text-lg font-bold text-red-600">{dateInfo.day}</div>
                        <div className="text-xs text-gray-500">{dateInfo.month}</div>
                      </div>
                    </div>

                    {winnerInfo && (
                      <div className="pt-2 border-t border-gray-200 space-y-3">
                        {/* Vencedor da Corrida */}
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Piloto vencedor</div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              <Image
                                src={winnerInfo.driver.teamOfWinner?.logo|| "/placeholder.svg"}
                                alt={winnerInfo.team?.name || "Piloto"}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            <span className="font-bold text-xs sm:text-sm truncate">{winnerInfo.driver.betterName}</span>
                          </div>
                        </div>

                        {/* Equipe Vencedora */}
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Equipe vencedora</div>
                          <div className="flex items-center gap-2 ">
                            <div className="w-6 h-6 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              <Image
                                src={winnerInfo.team?.logo || "/placeholder.svg"}
                                alt={winnerInfo.team?.name || "Equipe"}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            <span className="font-bold text-xs sm:text-sm truncate">{winnerInfo.team?.name}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="pt-3 border-t border-gray-200">
                      {race.hasSprint ? (
                        <div className="space-y-2">
                          <Button
                            onClick={() => handleRaceClick(race.id, "sprint")}
                            variant="outline"
                            size="sm"
                            className={`w-full flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm ${race.hasData ? '' : 'hidden'}`}
                            disabled={!race.isFinished && !race.active}
                          >
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Ver Sprint</span>
                            <span className="sm:hidden">Sprint</span>
                          </Button>
                          <Button
                            onClick={() => handleRaceClick(race.id, "race")}
                            size="sm"
                            className={`w-full flex items-center gap-2 text-xs sm:text-sm ${race.hasData ? '' : 'hidden'}`}
                            style={{ backgroundColor: F1_THEME.primary }}
                            disabled={!race.isFinished && !race.active}
                          >
                            <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Ver Corrida</span>
                            <span className="sm:hidden">Corrida</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleRaceClick(race.id, "race")}
                          size="sm"
                          className={`w-full flex items-center gap-2 text-xs sm:text-sm ${race.hasData ? '' : 'hidden'}`}
                          style={{ backgroundColor: F1_THEME.primary }}
                          disabled={!race.isFinished && !race.active}
                        >
                          <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Ver Corrida</span>
                          <span className="sm:hidden">Corrida</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
