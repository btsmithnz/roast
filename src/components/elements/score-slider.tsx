"use client";

import { useId, useState } from "react";
import { Field, FieldTitle } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.min(10, Math.max(1, Math.round(value)));
}

export function ScoreSlider({
  name,
  label,
  fromLabel,
  toLabel,
  defaultValue = 5,
  className,
}: {
  name: string;
  label: string;
  fromLabel: string;
  toLabel: string;
  defaultValue?: number;
  className?: string;
}) {
  const id = useId();
  const [value, setValue] = useState(() => clampScore(defaultValue));

  return (
    <Field className={cn("gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <FieldTitle className="text-sm font-semibold" id={id}>
          {label}
        </FieldTitle>
        <output className="min-w-10 rounded-full bg-primary px-2.5 py-1 text-center text-xs font-semibold text-primary-foreground">
          {value}/10
        </output>
      </div>
      <Slider
        aria-labelledby={id}
        max={10}
        min={1}
        onValueChange={(nextValue) => {
          setValue(clampScore(Array.isArray(nextValue) ? (nextValue[0] ?? value) : nextValue));
        }}
        step={1}
        value={[value]}
      />
      <input name={name} type="hidden" value={value} />
      <div className="flex items-start justify-between gap-3 text-xs font-medium text-muted-foreground">
        <span>{fromLabel}</span>
        <span className="text-right">{toLabel}</span>
      </div>
    </Field>
  );
}
