"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  listed: {
    label: "Listed",
    color: "var(--chart-1)",
  },
  average: {
    label: "Review average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type TastePoint = {
  kind: "listed" | "average";
  label: string;
  body: number;
  brightness: number;
  size: number;
};

export function CoffeeDotChart({
  body,
  brightness,
  avgBody,
  avgBrightness,
  className,
}: {
  body: number;
  brightness: number;
  avgBody: number | null;
  avgBrightness: number | null;
  className?: string;
}) {
  const listedPoint: TastePoint = {
    kind: "listed",
    label: "Listed",
    body: clampTaste(body),
    brightness: clampTaste(brightness),
    size: 170,
  };
  const averagePoint =
    avgBody !== null && avgBrightness !== null
      ? {
          kind: "average" as const,
          label: "Review average",
          body: clampTaste(avgBody),
          brightness: clampTaste(avgBrightness),
          size: 120,
        }
      : null;

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-80 gap-4 self-start lg:max-w-none",
        className,
      )}
    >
      <div className="relative aspect-square w-full">
        <TasteMapLabel className="left-1/2 top-1 -translate-x-1/2">
          Full body
        </TasteMapLabel>
        <TasteMapLabel className="bottom-1 left-1/2 -translate-x-1/2">
          Light body
        </TasteMapLabel>
        <TasteMapLabel className="left-0 top-1/2 -translate-y-1/2">
          Mellow
        </TasteMapLabel>
        <TasteMapLabel className="right-0 top-1/2 -translate-y-1/2">
          Fruity
        </TasteMapLabel>
        <ChartContainer
          className="aspect-auto h-full min-h-0 w-full"
          config={chartConfig}
        >
          <ScatterChart
            accessibilityLayer
            margin={{ bottom: 34, left: 42, right: 42, top: 34 }}
          >
            <CartesianGrid opacity={0.55} strokeDasharray="4 4" />
            <ReferenceLine stroke="var(--border)" strokeWidth={1.5} x={5.5} />
            <ReferenceLine stroke="var(--border)" strokeWidth={1.5} y={5.5} />
            <XAxis
              dataKey="brightness"
              domain={[1, 10]}
              hide
              name="Brightness"
              type="number"
            />
            <YAxis
              dataKey="body"
              domain={[1, 10]}
              hide
              name="Body"
              type="number"
            />
            <ZAxis dataKey="size" range={[120, 170]} type="number" />
            <ChartTooltip
              content={<CoffeeChartTooltip />}
              cursor={false}
              wrapperStyle={{ zIndex: 30 }}
            />
            <Scatter
              data={[listedPoint]}
              fill="var(--color-listed)"
              name="Listed"
              stroke="white"
              strokeWidth={2}
            />
            {averagePoint ? (
              <Scatter
                data={[averagePoint]}
                fill="var(--color-average)"
                name="Review average"
                stroke="white"
                strokeWidth={2}
              />
            ) : null}
          </ScatterChart>
        </ChartContainer>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-stone-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--chart-1)]" />
          Listed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--chart-2)]" />
          Review average
        </span>
      </div>
    </div>
  );
}

function TasteMapLabel({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 bg-white px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

function CoffeeChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: TastePoint }>;
}) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg bg-white px-3 py-2 text-xs text-stone-700 shadow-lg ring-1 ring-stone-950/10">
      <span className="font-semibold text-stone-950">{point.label}</span>
      <span>Body: {point.body}/10</span>
      <span>Brightness: {point.brightness}/10</span>
    </div>
  );
}

function clampTaste(value: number) {
  return Math.min(10, Math.max(1, Math.round(value)));
}
