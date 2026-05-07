export type CountryCode = "US" | "UK" | "CA" | "AU" | "EU";

export type Country = {
  code: CountryCode;
  label: string;
  currencySymbol: string;
  paymentPercent: number;
  paymentFlat: number;
  regulatoryOperatingPercent: number;
};

export const COUNTRIES: Record<CountryCode, Country> = {
  US: {
    code: "US",
    label: "United States",
    currencySymbol: "$",
    paymentPercent: 0.03,
    paymentFlat: 0.25,
    regulatoryOperatingPercent: 0,
  },
  UK: {
    code: "UK",
    label: "United Kingdom",
    currencySymbol: "£",
    paymentPercent: 0.04,
    paymentFlat: 0.20,
    regulatoryOperatingPercent: 0.0032,
  },
  CA: {
    code: "CA",
    label: "Canada",
    currencySymbol: "$",
    paymentPercent: 0.03,
    paymentFlat: 0.25,
    regulatoryOperatingPercent: 0.0115,
  },
  AU: {
    code: "AU",
    label: "Australia",
    currencySymbol: "$",
    paymentPercent: 0.03,
    paymentFlat: 0.25,
    regulatoryOperatingPercent: 0,
  },
  EU: {
    code: "EU",
    label: "European Union",
    currencySymbol: "€",
    paymentPercent: 0.04,
    paymentFlat: 0.30,
    regulatoryOperatingPercent: 0,
  },
};

export const COUNTRY_LIST = Object.values(COUNTRIES);
