import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte una fecha guardada como UTC midnight a un Date local correcto.
 * Sin esto, "2025-06-30T00:00:00Z" en NZ (UTC+12) se muestra como 30 jun a medianoche
 * pero en UTC-3 se mostraría como 29 jun. Extraer el string ISO evita la conversión de timezone.
 */
export function parseBookingDate(date: Date | string): Date {
  const iso = new Date(date).toISOString().slice(0, 10); // "2025-06-30"
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d); // local midnight — timezone-safe para display y comparaciones
}
