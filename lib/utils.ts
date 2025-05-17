import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para gerar as iniciais do piloto (3 letras)
export function getDriverInitials(name: string): string {
  // Para nomes como "Max Verstappen", retorna "VER"
  const parts = name.split(" ")

  if (parts.length === 1) {
    // Se for apenas um nome, pega as três primeiras letras
    return parts[0].substring(0, 3).toUpperCase()
  } else {
    // Para nomes compostos, pega a primeira letra do primeiro nome e as duas primeiras do sobrenome
    // Ou, se o sobrenome for curto, pega as três primeiras letras do sobrenome
    const lastName = parts[parts.length - 1]
    if (lastName.length <= 2) {
      return parts[parts.length - 1].toUpperCase()
    } else {
      return lastName.substring(0, 3).toUpperCase()
    }
  }
}
