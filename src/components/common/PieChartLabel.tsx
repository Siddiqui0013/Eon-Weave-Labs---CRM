import { TrendingUp, TrendingDown } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type PieChartData = {
  label: string;
  value: number;
  fill: string;
};

type PieChartProps = {
  data: PieChartData[];
  title?: string;
  description?: string;
  valueKey?: string;
  labelKey?: string;
  trend?: {
    value: number;
    period?: string;
  };
  subtitle?: string;
  className?: string;
  maxHeight?: string;
  hideTooltipLabel?: boolean;
};

const defaultChartConfig: ChartConfig = {
  value: {
    label: "Value",
  },
};

export function PieChartComponent({
  data,
  title = "Pie Chart",
  description,
  valueKey = "value",
  labelKey = "label",
  trend,
  subtitle,
  className = "",
  maxHeight = "500px",
  hideTooltipLabel = false,
}: PieChartProps) {
  // Generate chart config from data
  const chartConfig = data.reduce((config, item) => {
    config[item[labelKey]] = {
      label: item[labelKey],
      color: item.fill,
    };
    return config;
  }, { ...defaultChartConfig });

  const isTrendPositive = trend?.value > 0;

  return (
    <Card className={`flex flex-col bg-card border-none text-white ${className}`}>
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent >
        <ChartContainer
          config={chartConfig}
          className={`max-h-[${maxHeight}] pb-0 [&_.recharts-pie-label-text]:fill-foreground`}
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel={hideTooltipLabel} />} />
            <Pie 
              data={data} 
              dataKey={valueKey} 
              nameKey={labelKey} 
              label 
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {trend && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {isTrendPositive ? "Trending up" : "Trending down"} by {Math.abs(trend.value)}% 
            {trend.period ? ` this ${trend.period}` : ""}
            {isTrendPositive ? 
              <TrendingUp className="h-4 w-4" /> : 
              <TrendingDown className="h-4 w-4" />
            }
          </div>
        )}
        {subtitle && (
          <div >
            {subtitle}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}