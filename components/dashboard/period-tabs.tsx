"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PeriodTabsProps {
  period: string
  onChange: (value: string) => void
}

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  return (
    <Tabs defaultValue={period} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="today">Hoy</TabsTrigger>
        <TabsTrigger value="week">Esta Semana</TabsTrigger>
        <TabsTrigger value="month">Este Mes</TabsTrigger>
        <TabsTrigger value="year">Este Año</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
