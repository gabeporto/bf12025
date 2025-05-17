"use client"

import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { F1_DRIVERS, F1_TEAMS, BF1_TEAMS } from "@/lib/constants"
import { getDriverInitials } from "@/lib/utils"

interface DriverSelectorProps {
  position: number
  form: UseFormReturn<any>
  index: number
}

export function DriverSelector({ position, form, index }: DriverSelectorProps) {
  const [selectedDriver, setSelectedDriver] = useState<(typeof F1_DRIVERS)[0] | null>(null)

  // Update selected driver when form value changes
  useEffect(() => {
    const currentValue = form.getValues(`positions.${index}`)
    if (currentValue) {
      const driver = F1_DRIVERS.find((d) => d.id === currentValue)
      if (driver) {
        setSelectedDriver(driver)
      }
    } else {
      setSelectedDriver(null)
    }
  }, [form, index])

  return (
    <FormField
      control={form.control}
      name={`positions.${index}`}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-2 w-full">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base font-medium">Posição {position}</FormLabel>
            {selectedDriver && (
              <div className="text-sm font-semibold text-gray-700">{getDriverInitials(selectedDriver.name)}</div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full">
            {selectedDriver ? (
              <div
                className="h-16 w-16 relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor: F1_TEAMS.find((t) => t.id === selectedDriver.teamId)?.color || "#e2e2e2",
                  border: "2px solid #e2e2e2",
                }}
              >
                <span className="text-lg font-bold text-white">{getDriverInitials(selectedDriver.name)}</span>
              </div>
            ) : (
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xs">Piloto</span>
              </div>
            )}

            <div className="flex-grow">
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  const driver = F1_DRIVERS.find((d) => d.id === value)
                  setSelectedDriver(driver || null)
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Selecione o piloto`} />
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

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
