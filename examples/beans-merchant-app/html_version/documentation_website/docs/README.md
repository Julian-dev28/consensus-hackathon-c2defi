---
sidebar_position: 1
sidebar_label: 'Beans Merchant SDK'
---
# beans-merchant

[![npm version](https://badge.fury.io/js/beans-merchant.svg)](https://www.npmjs.com/package/beans-merchant-sdk)

Beans Merchant is a JavaScript library for interacting with the Beans Merchant API. It provides a convenient way to integrate Beans Merchant functionality into your web applications.

## Installation

You can install the package using npm:

```bash
npm install beans-merchant-sdk
```

## Usage

```bash
// Import the BeansMerchantSDK class and BeansMerchantEnvironment
import {BeansMerchantSDK, BeansMerchantEnvironment} from './index.js';

// Create an instance of BeansMerchantSDK
const merchant = new BeansMerchantSDK('your-api-key', BeansMerchantEnvironment.STAGING);

// Fetch currencies
merchant.fetchCurrencies('stellarAccountId')
  .then(currencies => {
    console.log('Available currencies:', currencies);
  })
  .catch(error => {
    console.error('Error fetching currencies:', error);
  });

// Generate QR code
merchant.generateSvgQRCode('stellarAccountId','currency-id', 'amount', 'memo')
  .then(qrCode => {
    console.log('Generated QR code:', qrCode);
  })
  .catch(error => {
    console.error('Error generating QR code:', error);
  });
```
## API Reference

### `BeansMerchantSDK(apiKey, environment)`

Constructor for creating a new instance of the BeansMerchantSDK class.

- `apiKey`: Your Beans Merchant API key.
- `environment`: The environment (development or staging) specified using `BeansMerchantEnvironment`.

### `BeansMerchantEnvironment`

An enumeration class that provides environment constants.

- `DEVELOP`: Development environment.
- `STAGING`: Staging environment.

### Methods:

#### `updateEnvironment(environment)`

Update the environment (development or staging).

- `environment`: The environment specified using `BeansMerchantEnvironment`.

#### `fetchCurrencies(stellarAccountId)`

Fetches available Stellar currencies.

Returns a Promise that resolves to an array of currencies.

#### `generateQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates a QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

Returns a Promise that resolves to the generated QR code.

#### `generatePngQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates a PNG QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

Returns a Promise that resolves to the base64-encoded PNG QR code string.

#### `generateSvgQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates an SVG QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

