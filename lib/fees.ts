import { COUNTRIES, type CountryCode } from "./countries";

export const LISTING_FEE = 0.20;
export const TRANSACTION_FEE_RATE = 0.065;
export const OFFSITE_ADS_RATE_UNDER_10K = 0.15;
export const OFFSITE_ADS_RATE_AT_10K = 0.12;
export const OFFSITE_ADS_FEE_CAP = 100;

export type CalculatorInputs = {
  itemPrice: number;
  shippingCharged: number;
  manufacturingCost: number;
  actualShippingCost: number;
  country: CountryCode;
  offsiteAdsEnabled: boolean;
  atOrAbove10k: boolean;
};

export type FeeBreakdown = {
  label: string;
  amount: number;
  detail?: string;
};

export type CalculatorResult = {
  gross: number;
  costOfGoods: number;
  fees: FeeBreakdown[];
  totalFees: number;
  netProfit: number;
  marginPercent: number;
  effectiveFeeRate: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const {
    itemPrice,
    shippingCharged,
    manufacturingCost,
    actualShippingCost,
    country,
    offsiteAdsEnabled,
    atOrAbove10k,
  } = inputs;

  const gross = itemPrice + shippingCharged;
  const costOfGoods = manufacturingCost + actualShippingCost;
  const countrySpec = COUNTRIES[country];

  const listingFee = LISTING_FEE;
  const transactionFee = gross * TRANSACTION_FEE_RATE;

  const paymentBase = gross;
  const paymentProcessingFee =
    paymentBase * countrySpec.paymentPercent + countrySpec.paymentFlat;

  const regulatoryOperatingFee =
    countrySpec.regulatoryOperatingPercent > 0
      ? gross * countrySpec.regulatoryOperatingPercent
      : 0;

  let offsiteAdsFee = 0;
  if (offsiteAdsEnabled) {
    const rate = atOrAbove10k
      ? OFFSITE_ADS_RATE_AT_10K
      : OFFSITE_ADS_RATE_UNDER_10K;
    offsiteAdsFee = Math.min(gross * rate, OFFSITE_ADS_FEE_CAP);
  }

  const fees: FeeBreakdown[] = [
    { label: "Listing Fee", amount: round2(listingFee), detail: "$0.20 flat" },
    {
      label: "Transaction Fee",
      amount: round2(transactionFee),
      detail: "6.5% of item + shipping",
    },
    {
      label: "Payment Processing",
      amount: round2(paymentProcessingFee),
      detail: `${(countrySpec.paymentPercent * 100).toFixed(0)}% + ${countrySpec.currencySymbol}${countrySpec.paymentFlat.toFixed(2)}`,
    },
  ];

  if (regulatoryOperatingFee > 0) {
    fees.push({
      label: "Regulatory Operating Fee",
      amount: round2(regulatoryOperatingFee),
      detail: `${(countrySpec.regulatoryOperatingPercent * 100).toFixed(2)}% (${countrySpec.code})`,
    });
  }

  if (offsiteAdsEnabled) {
    const rate = atOrAbove10k
      ? OFFSITE_ADS_RATE_AT_10K
      : OFFSITE_ADS_RATE_UNDER_10K;
    const capped = gross * rate > OFFSITE_ADS_FEE_CAP;
    fees.push({
      label: "Off-Site Ads Fee",
      amount: round2(offsiteAdsFee),
      detail: capped
        ? `${(rate * 100).toFixed(0)}% capped at $100`
        : `${(rate * 100).toFixed(0)}% of order`,
    });
  }

  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const netProfit = round2(gross - totalFees - costOfGoods);
  const marginPercent = itemPrice > 0 ? netProfit / itemPrice : 0;
  const effectiveFeeRate = gross > 0 ? totalFees / gross : 0;

  return {
    gross: round2(gross),
    costOfGoods: round2(costOfGoods),
    fees,
    totalFees: round2(totalFees),
    netProfit,
    marginPercent,
    effectiveFeeRate,
  };
}
