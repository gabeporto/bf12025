import { BettingForm } from "@/components/betting-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="py-6 sm:py-8 lg:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-red-600 text-white rounded-t-lg px-4 py-6 sm:px-6 sm:py-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">F1 Betting Challenge</CardTitle>
            <CardDescription className="text-white/90 text-center text-base sm:text-lg">
              Faça suas apostas para o próximo Grande Prêmio!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <BettingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
