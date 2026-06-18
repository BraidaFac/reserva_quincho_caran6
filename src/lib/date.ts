import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string | number): string {
  return format(new Date(date), "EEEE d 'de' MMMM", { locale: es });
}

export function formatMonth(date: Date | string | number): string {
  return format(new Date(date), "MMMM 'de' yyyy", { locale: es });
}

export function formatShortDate(date: Date | string | number): string {
  return format(new Date(date), "d MMM", { locale: es });
}
