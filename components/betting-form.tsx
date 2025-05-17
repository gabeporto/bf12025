"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { DriverSelector } from "./driver-selector"
import { F1_DRIVERS, F1_TEAMS } from "@/lib/constants"
import { getDriverInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Criar um objeto com 12 posições
const positionsSchema = {}
for (let i = 0; i < 12; i++) {
  positionsSchema[i] = z.string().min(1, "Selecione um piloto")
}

const formSchema = z.object({
  betterName: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  polePosition: z.string({
    required_error: "Selecione um piloto para a pole position.",
  }),
  positions: z.object(positionsSchema),
})

export function BettingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPoleDriver, setSelectedPoleDriver] = useState<(typeof F1_DRIVERS)[0] | null>(null)

  // Criar valores padrão para 12 posições
  const defaultPositions = {}
  for (let i = 0; i < 12; i++) {
    defaultPositions[i] = ""
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      betterName: "",
      polePosition: "",
      positions: defaultPositions,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Convert positions object to array for backend processing if needed
    const positionsArray = Object.values(values.positions)

    // Simulando envio para um servidor
    setTimeout(() => {
      console.log({
        ...values,
        positionsArray,
      })
      toast({
        title: "Aposta enviada com sucesso!",
        description: `${values.betterName}, sua aposta foi registrada.`,
      })
      setIsSubmitting(false)
      form.reset()
      setSelectedPoleDriver(null)
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações do seu nome</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="betterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormDescription>Este é o nome de piloto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pole Position</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="polePosition"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    {selectedPoleDriver ? (
                      <div
                        className="h-20 w-20 relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: F1_TEAMS.find((t) => t.id === selectedPoleDriver.teamId)?.color || "#e2e2e2",
                          border: "2px solid #FFD700",
                        }}
                      >
                        <span className="text-2xl font-bold text-white">
                          {getDriverInitials(selectedPoleDriver.name)}
                        </span>
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-sm">Piloto</span>
                      </div>
                    )}

                    <div className="flex-grow flex flex-col gap-2">
                      {selectedPoleDriver && (
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{selectedPoleDriver.name}</div>
                          <div className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">
                            {getDriverInitials(selectedPoleDriver.name)}
                          </div>
                        </div>
                      )}

                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          const driver = F1_DRIVERS.find((d) => d.id === value)
                          setSelectedPoleDriver(driver || null)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o piloto da pole position" />
                          </SelectTrigger>
                        </FormControl>
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
                  <FormDescription>Quem você acha que fará a pole position?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posições da Corrida (1-12)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <DriverSelector key={index} position={index + 1} form={form} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Aposta"}
        </Button>
      </form>
    </Form>
  )
}
