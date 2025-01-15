import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

export type DataPoint = {
  [key: string]: string | number;
};

type BarChartCardProps = {
  data: DataPoint[];
  title?: string;
  description?: string;
  xAxisKey: string;
  bars: {
    key: string;
    label: string;
    color: string;
  }[];
  trendPercentage?: number;
  footerText?: string;
  className?: string;
};

const defaultProps = {
  title: "Bar Chart",
  description: "",
  trendPercentage: 0,
  footerText: "Showing data visualization",
  className: "",
};

export const BarChartCard = ({
  data,
  title,
  description,
  xAxisKey,
  bars,
  trendPercentage,
  footerText,
  className,
}: BarChartCardProps) => {
  const chartConfig = bars.reduce((config, bar) => {
    config[bar.key] = {
      label: bar.label,
      color: bar.color,
    };
    return config;
  }, {} as ChartConfig);

  const isTrendingUp = trendPercentage >= 0;
  const TrendIcon = isTrendingUp ? TrendingUp : TrendingDown;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              style={{color:"black" }}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => 
                typeof value === 'string' ? value.slice(0, 3) : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={`var(--color-${bar.key})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendPercentage !== 0 && (
          <div className="flex gap-2 font-medium leading-none">
            {isTrendingUp ? "Trending up" : "Trending down"} by{" "}
            {Math.abs(trendPercentage)}% this month{" "}
            <TrendIcon className="h-4 w-4" />
          </div>
        )}
        {footerText && (
          <div className="leading-none text-muted-foreground">
            {footerText}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};