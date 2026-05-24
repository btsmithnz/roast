import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function TextField({
  label,
  name,
  required,
  type = "text",
  value,
  min,
  max,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  value?: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <Field className={cn("gap-1.5", className)}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        defaultValue={value}
        key={`${name}:${value ?? ""}`}
        max={max}
        min={min}
        name={name}
        required={required}
        type={type}
      />
    </Field>
  );
}

export function TextareaField({
  label,
  name,
  required,
  value,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  value?: string;
  className?: string;
}) {
  return (
    <Field className={cn("gap-1.5", className)}>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        defaultValue={value}
        key={`${name}:${value ?? ""}`}
        name={name}
        required={required}
      />
    </Field>
  );
}
