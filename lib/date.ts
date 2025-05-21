import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns"

export function getDateRange(period: "day" | "week" | "month" | "year" = "day") {
  const now = new Date()

  switch (period) {
    case "day":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      }
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    case "year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      }
    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      }
  }
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
