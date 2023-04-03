import * as yup from "yup";

interface MortgagePaymentParams {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  amortizationPeriod: number;
  schedule: "monthly" | "bi-weekly" | "accelerated-bi-weekly";
}

const ONE_MILLION = 1_000_000;
const FIVE_HUNDRED_THOUSAND = 500_000;

export const parseAndValidateParams = (
  requestParams: Record<string, unknown>
):
  | {
      success: true;
      params: MortgagePaymentParams;
    }
  | { success: false; error: string } => {
  const mortgageCalculatorSchema = yup
    .object({
      propertyPrice: yup.number().min(0).required(),
      downPayment: yup.number().min(0).required(),
      annualInterestRate: yup.number().min(0.01).max(100).required(),
      amortizationPeriod: yup.number().min(5).max(30).required(),
      schedule: yup
        .mixed<"monthly" | "bi-weekly" | "accelerated-bi-weekly">()
        .required()
        .oneOf(["monthly", "bi-weekly", "accelerated-bi-weekly"]),
    })
    .required();
  let parsedParams;
  try {
    parsedParams = mortgageCalculatorSchema.validateSync(requestParams, {
      abortEarly: true,
      stripUnknown: true,
    });
  } catch (e) {
    return { success: false, error: "Invalid request params" };
  }

  if (parsedParams.downPayment > parsedParams.propertyPrice) {
    return {
      success: false,
      error: "Down Payment must be less than or equal to Property Price",
    };
  }

  // Check down payment is sufficient
  // https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
  let minDownPayment = 0;
  if (parsedParams.propertyPrice <= FIVE_HUNDRED_THOUSAND) {
    minDownPayment = parsedParams.propertyPrice / 20;
  } else if (parsedParams.propertyPrice < ONE_MILLION) {
    minDownPayment =
      25_000 + (parsedParams.propertyPrice - FIVE_HUNDRED_THOUSAND) / 10;
  } else {
    minDownPayment = parsedParams.propertyPrice / 5;
  }

  if (minDownPayment > parsedParams.downPayment) {
    return {
      success: false,
      error: "Minimum down payment not reached",
    };
  }

  if (parsedParams.amortizationPeriod % 5 !== 0) {
    return {
      success: false,
      error: "Ammortization period must be a multiple of 5",
    };
  }

  return { success: true, params: parsedParams };
};

export const calculatePayment = (params: MortgagePaymentParams): string => {
  const principal = params.propertyPrice - params.downPayment;
  const numPaymentsPerYear = 12;
  const perScheduleRate =
    params.annualInterestRate / (100 * numPaymentsPerYear);
  const totalNumPayments = numPaymentsPerYear * params.amortizationPeriod;

  const compoundRate = Math.pow(1 + perScheduleRate, totalNumPayments);
  const numerator = perScheduleRate * compoundRate;
  const denominator = compoundRate - 1;

  const monthlyPayment = (principal * numerator) / denominator;

  if (params.schedule === "bi-weekly") {
    return ((monthlyPayment * 12) / 26).toFixed(2);
  } else if (params.schedule === "accelerated-bi-weekly") {
    return (monthlyPayment / 2).toFixed(2);
  }
  return monthlyPayment.toFixed(2);
};
