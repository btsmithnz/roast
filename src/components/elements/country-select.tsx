import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { supportedCountries } from "@/lib/countries";

const DEFAULT_COUNTRY_CODE = "AU";

export function CountrySelect({
  label = "Country",
  name = "country",
  required,
  value,
}: {
  label?: string;
  name?: string;
  required?: boolean;
  value?: string;
}) {
  const defaultValue = value ?? DEFAULT_COUNTRY_CODE;

  return (
    <Field className="gap-1">
      <FieldLabel>{label}</FieldLabel>
      <Select
        defaultValue={defaultValue}
        key={`${name}:${defaultValue}`}
        name={name}
        required={required}
        items={supportedCountries}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent align="start">
          {supportedCountries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
