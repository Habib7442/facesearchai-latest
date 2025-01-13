"use client"

import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface UsageChartProps {
  data: {
    searches: number
    credits: {
      used: number
      remaining: number
      total: number
    }
  }
}

export function UsageChart({ data }: UsageChartProps) {
  const { t } = useTranslation();
  
  const creditsUsedPercentage = Math.round((data.credits.used / data.credits.total) * 100);
  const creditsRemainingPercentage = Math.round((data.credits.remaining / data.credits.total) * 100);

  const chartData = [
    {
      name: t('usage.credits'),
      Used: data.credits.used,
      Remaining: data.credits.remaining,
    },
    {
      name: t('usage.searches'),
      Total: data.searches,
    }
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{t('usage.title')}</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('usage.credits_usage')}</span>
              <span className="font-medium">{creditsUsedPercentage}%</span>
            </div>
            <Progress value={creditsUsedPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('usage.used', { count: data.credits.used })}</span>
              <span>{t('usage.total', { count: data.credits.total })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
              <div className="text-sm text-muted-foreground">{t('usage.available_credits')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data.credits.remaining}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="text-sm text-muted-foreground">{t('usage.total_searches')}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.searches}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 