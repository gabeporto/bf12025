import { BettingForm } from "@/components/betting-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ListFilter } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/images/f1-background.png')] bg-cover bg-center">
      <div className="min-h-screen bg-black/70 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-red-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-center">BF1 Entre amigos</CardTitle>
              <CardDescription className="text-white/90 text-center text-lg">
                Faça suas apostas para o próximo Grande Prêmio!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <BettingForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
