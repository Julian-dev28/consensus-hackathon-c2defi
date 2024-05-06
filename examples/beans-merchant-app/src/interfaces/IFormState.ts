import exp from "constants";
import { StellarCurrency } from "../sdk/sdk";

interface IFormState {
  environment: string;
  customEnvironment: string;
  apiKey: string;
  stellarAccountId: string;
  selectedCurrency: StellarCurrency | null;
  amount: string;
  memo: string;
  maxAllowedPayments: number;
  webhookUrl: string;
}

export type { IFormState };
