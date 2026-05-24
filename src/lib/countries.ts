export const supportedCountries = [
  { label: "Australia", value: "AU" },
  { label: "New Zealand", value: "NZ" },
] as const;

export type CountryCode = (typeof supportedCountries)[number]["value"];

export function getCountryName(value: string) {
  return supportedCountries.find((country) => country.value === value)?.label ?? value;
}
