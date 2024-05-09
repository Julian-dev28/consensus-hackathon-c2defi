<h1>Beans Merchant JavaScript SDK</h1>

[![npm version](https://badge.fury.io/js/beans-merchant.svg)](https://www.npmjs.com/package/beans-merchant-sdk)

- [Introduction](#introduction)
  - [Use Cases](#use-cases)
- [Getting Started](#getting-started)
  - [How to Request an Account](#how-to-request-an-account)
    - [Company Details](#company-details)
    - [Stellar Account Details](#stellar-account-details)
  - [Installation](#installation)
  - [Usage](#usage)
- [API Reference](#api-reference)
  - [BeansMerchantSdk](#beansmerchantsdk)
    - [Constructor](#constructor)
    - [Methods](#methods)
      - [Fetch Stellar Currencies](#fetch-stellar-currencies)
      - [Generate Deeplink](#generate-deeplink)
      - [Generate PNG QR Code](#generate-png-qr-code)
      - [Generate SVG QR Code](#generate-svg-qr-code)
  - [Webhook Notifications](#webhook-notifications)
- [Questions and Answers](#questions-and-answers)
  - [Do I have to use stroops?](#do-i-have-to-use-stroops)

# Introduction

The Beans Merchant SDK offers a comprehensive toolkit for integrating the advanced payment capabilities of the Beans platform directly into your JavaScript applications. This SDK is designed to simplify the integration process, allowing you to leverage the Beans Merchant API's full potential without needing to manage the intricacies of direct API calls. By incorporating the Beans Merchant SDK, developers can unlock a wide range of use cases.

## Use Cases

- **Build an In-Person Merchant POS:** Facilitate in-person point of sale at stores or restaurants by generating payment requests through QR codes. This combines the convenience of online transactions with the traditional in-store shopping experience.

- **Shopify App for Currency Flexibility:** Develop a Shopify application that empowers merchants to request payments in their preferred currency while offering customers the flexibility to pay in theirs. This functionality enhances the shopping experience, catering to a global customer base.

- **Integrate Beans as Your On/Off Ramp Partner:** Streamline your application's payment infrastructure by using Beans as your central on/off ramp partner. This integration saves significant development time and resources by eliminating the need to individually integrate multiple on/off ramp solutions.

- **Monetize Your GPT Applications:** For applications utilizing Generative Pre-trained Transformers (GPT), integrating Beans enables a monetization strategy where services can be accessed for free up to a certain limit, after which users are prompted to pay for additional usage or to purchase credits. This model is perfect for applications offering premium content or services on a per-use basis.

# Getting Started

## How to Request an Account

Welcome to Beans App! To start your journey as a merchant, please request an account by contacting us. Follow the steps below to ensure your application is processed smoothly.

Reach out to us via email at [merchants@beansapp.com](mailto:merchants@beansapp.com) with the following required details:

### Company Details

 - **Company Name:** Provide the official name of your company.
 - **Company Website:** Include the URL to your business website.
 - **Company Email Address:** This should be the official contact email for your business.
 - **Company Logo:** Attach a high-resolution logo (minimum dimensions 500x500 pixels).

### Stellar Account Details
To handle payments, please provide your Stellar account details:

 - **Beans App Account (reccomended):**
   - **Username:** Provide your Beans App username.
   - **Recommendation:** Using a Beans App account simplifies the withdrawal process.
   - **New Users:** To create a Beans App account, download the app [here](https://beansapp.com/download). 
 - **Custom Stellar Account:**
   - **Public Key:** Provide the public key if you prefer to receive payments in a custom Stellar account.

Thank you for choosing Beans App. We look forward to facilitating your business transactions!

## Installation

You can install the package using npm:

```bash
npm install beans-merchant-sdk
```

## Usage

```ts
import {BeansMerchantSdk, BeansMerchantSdkEnvironment}  from '../node_modules/beans-merchant-sdk/dist/sdk.js';

// Create an instance of BeansMerchantSdk
const sdk = new BeansMerchantSdk(BeansMerchantSdkEnvironment.STAGING, 'your-api-key');

// Fetch currencies
sdk.fetchCurrencies('stellarAccountId')
  .then((response: FetchStellarCurrenciesResponse) => {
    console.log('Available currencies:', response.stellarCurrencies);
  });

// Generate deeplink
sdk.generateDeeplink('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook')
  .then((response: DeeplinkResponse) => {
    console.log('Generated deeplink:', response.deeplink);
  });

// Generate SVG QR code
sdk.generateSvgQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: SvgQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated SVG QR code:', response.svgQrCode);
  });

// Generate PNG QR code
merchant.generatePngQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: PngQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated PNG QR code:', response.pngQrCodeBase64String);
  });
```

# API Reference

The Beans Merchant SDK provides a simple and intuitive interface for interacting with the Beans Merchant API. This section outlines the available methods and response objects provided by the SDK.

## BeansMerchantSdk

The `BeansMerchantSdk` class provides methods for interacting with the Beans Merchant API.

### Constructor

`BeansMerchantSdk(...)`: Initializes a new SDK instance.

Parameters:
- `environment`: API environment (STAGING or PRODUCTION).
- `apiKey`: Your Beans Merchant API key.

### Methods

#### Fetch Stellar Currencies

*Retrieves available Stellar currencies for the specified account.*

Method Signature:<br>
`Promise<FetchStellarCurrenciesResponse> fetchStellarCurrencies(...)`

Parameters:<br>
  - `stellarAccountId`: *Your Stellar account ID.*

Returns:<br>
`Promise<FetchStellarCurrenciesResponse>`: *A promise that resolves with the response object containing the available Stellar currencies.*

Return Object Properties:<br>
  - `stellarCurrencies`: *An array of Stellar currencies accessible for the specified Stellar Account.*

Example:<br>
```js
sdk.fetchCurrencies('stellarAccountId')
  .then((response: FetchStellarCurrenciesResponse) => {
    console.log('Available currencies:', response.stellarCurrencies);
  });
```

#### Generate Deeplink

*Creates a payment request deeplink.*

Method Signature:<br>
*`Promise<DeeplinkResponse> generateDeeplink(...)`*

Parameters:<br>
  - `stellarAccountId`: *Your Stellar account ID.*
  - `currencyId`: *Stellar currency ID.*
  - `amount`: *Amount for the payment request.*
  - `memo`: *Memo for the payment request.*
  - `maxAllowedPayments`: *(Optional) Maximum number of payments allowed for the payment request.*
    - *Unlimited is -1*
    - *Default is 1*
  - `webhookUrl`: *(Optional) Webhook URL for payment received notification.*

Returns:<br>
`Promise<DeeplinkResponse>`: A promise that resolves with the response object containing the payment request deeplink.

Return Object Properties:<br>
  - `id`: *The ID of the payment request.*
  - `deeplink`: *The Beans App deeplink for the payment request.*

Example:<br>
```js
sdk.generateDeeplink('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook')
  .then((response: DeeplinkResponse) => {
    console.log('Generated deeplink:', response.deeplink);
  });
```

#### Generate PNG QR Code

*Generates a PNG QR code for payment requests.*

Method Signature:<br>
*`Promise<PngQrCodeResponse> generatePngQrCode(...)`*

Parameters:<br>
  - `stellarAccountId`: *Your Stellar account ID.*
  - `currencyId`: *Stellar currency ID.*
  - `amount`: *Amount for the payment request.*
  - `memo`: *Memo for the payment request.*
  - `maxAllowedPayments`: *(Optional) Maximum number of payments allowed for the payment request.*
    - *Unlimited is -1*
    - *Default is 1*
  - `webhookUrl`: *(Optional) Webhook URL for payment received notification.*
  - `preferredSize`: *(Optional) Preferred size of the QR code. We will try to generate a QR code with a size as close as possible to the preferred size provided.*

Returns:<br>
`Promise<PngQrCodeResponse>`: *A promise that resolves with the response object containing the payment request PNG QR code.*

Return Object Properties:<br>
  - `id`: *The ID of the payment request.*
  - `deeplink`: *The Beans App deeplink for the payment request.*
  - `pngQrCodeBase64String`: *The base64 encoded PNG QR code containing the deeplink.*

Example:<br>
```js
sdk.generatePngQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: PngQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated PNG QR code:', response.pngQrCodeBase64String);
  });
```

#### Generate SVG QR Code

*Generates an SVG QR code for payment requests.*

Method Signature:<br>
*`Promise<SvgQrCodeResponse> generateSvgQrCode(...)`*

Parameters:<br>
  - `stellarAccountId`: *Your Stellar account ID.*
  - `currencyId`: *Stellar currency ID.*
  - `amount`: *Amount for the payment request.*
  - `memo`: *Memo for the payment request.*
  - `maxAllowedPayments`: *(Optional) Maximum number of payments allowed for the payment request.*
    - *Unlimited is -1*
    - *Default is 1*
  - `webhookUrl`: *(Optional) Webhook URL for payment received notification.*
  - `size`: *(Optional) Size of the QR code.*

Returns:<br>
`Promise<SvgQrCodeResponse>`: *A promise that resolves with the response object containing the payment request SVG QR code.*

Return Object Properties:<br>
  - `id`: *The ID of the payment request.*
  - `deeplink`: *The Beans App deeplink for the payment request.*
  - `svgQrCode`: *The SVG QR code containing the deeplink.*

Example:<br>
```js
sdk.generateSvgQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: SvgQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated SVG QR code:', response.svgQrCode);
  });
```

## Webhook Notifications

*Beans Merchant API sends a webhook notification to the provided URL when a payment is received.*

Example Webhook Payload:<br>
```json
{
  "PaymentRequestId": "e3cfa903-548f-475c-a9f2-ebf3f4e2fa17",
  "Memo": "example",
  "TransactionHash": "b7f4e42935eb120e3a6f43cdae3c6a511a346da77b7e17299aff0f8c72dcf3c0"
}
```

# Questions and Answers

## Do I have to use stroops?

Our platform utilizes Stellar blockchain technology to simplify digital transactions, making it accessible even to those unfamiliar with cryptocurrencies. We've streamlined the payment process using `Stellar Lumen (XLM)` and other cryptocurrencies, allowing you to transact in main currency units instead of dealing with complex conversions like `stroops`. For example, to request a payment of `1 XLM`, you just set the amoun to `"1"` and our system automatically handles the conversion to `10,000,000 stroops`, ensuring a user-friendly payment experience.