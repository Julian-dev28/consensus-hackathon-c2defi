import { BeansMerchantSdkEnvironment } from "./environment";
import { StellarCurrency } from "./models/stellar_currency";
import { FetchStellarCurrenciesResponse } from "./models/fetch_stellar_currencies_response";
import {
  PaymentRequestResponse,
  DeeplinkResponse,
  SvgQrCodeResponse,
  PngQrCodeResponse,
} from "./models/qr_code_response";

export {
  BeansMerchantSdkEnvironment,
  StellarCurrency,
  FetchStellarCurrenciesResponse,
  SvgQrCodeResponse,
  PngQrCodeResponse,
};

export class BeansMerchantSdk {
  constructor(apiEndpoint: string, apiKey: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
  }

  private apiEndpoint: string;
  private apiKey: string;

  async fetchStellarCurrencies(
    stellarAccountId: string
  ): Promise<FetchStellarCurrenciesResponse> {
    const url = `https://${this.apiEndpoint}/v3/companies/me/accounts/${stellarAccountId}/stellar-currencies`;

    const response = await fetch(url, {
      headers: {
        "X-Beans-Company-Api-Key": this.apiKey,
      },
    });
    const data: FetchStellarCurrenciesResponse = await response.json();
    return data;
  }

  async generateDeeplink(
    stellarAccountId: string,
    stellarCurrencyId: string,
    amount: number,
    memo: string,
    maxAllowedPayments: number | null = null,
    webhookUrl: string | null = null
  ): Promise<DeeplinkResponse> {
    const response = await this.generatePaymentRequest<DeeplinkResponse>(
      stellarAccountId,
      {
        stellarCurrencyId: stellarCurrencyId,
        amount: amount,
        memo: memo,
        maxAllowedPayments: maxAllowedPayments,
        paymentReceivedWebHookUrl: webhookUrl,
        deeplink: {
          include: true,
        },
      }
    );
    return response;
  }

  async generatePngQrCode(
    stellarAccountId: string,
    stellarCurrencyId: string,
    amount: number,
    memo: string,
    maxAllowedPayments: number | null = null,
    webhookUrl: string | null = null,
    preferredSize: number | null = null
  ): Promise<PngQrCodeResponse> {
    const response = await this.generatePaymentRequest<PngQrCodeResponse>(
      stellarAccountId,
      {
        stellarCurrencyId: stellarCurrencyId,
        amount: amount,
        memo: memo,
        maxAllowedPayments: maxAllowedPayments,
        paymentReceivedWebHookUrl: webhookUrl,
        deeplink: {
          include: true,
        },
        pngQrCodeBase64String: {
          include: true,
          preferredSize: preferredSize,
        },
      }
    );
    return response;
  }

  async generateSvgQrCode(
    stellarAccountId: string,
    stellarCurrencyId: string,
    amount: number,
    memo: string,
    maxAllowedPayments: number | null = null,
    webhookUrl: string | null = null,
    size: number | null = null
  ): Promise<SvgQrCodeResponse> {
    const response = await this.generatePaymentRequest<SvgQrCodeResponse>(
      stellarAccountId,
      {
        stellarCurrencyId: stellarCurrencyId,
        amount: amount,
        memo: memo,
        maxAllowedPayments: maxAllowedPayments,
        paymentReceivedWebHookUrl: webhookUrl,
        deeplink: {
          include: true,
        },
        svgQrCode: {
          include: true,
          size: size,
        },
      }
    );
    return response;
  }

  private async generatePaymentRequest<T extends PaymentRequestResponse>(
    stellarAccountId: string,
    body: any
  ): Promise<T> {
    const url = `https://${this.apiEndpoint}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Beans-Company-Api-Key": this.apiKey,
      },
      body: JSON.stringify(body),
    });
    const data: T = await response.json();
    return data;
  }
}
