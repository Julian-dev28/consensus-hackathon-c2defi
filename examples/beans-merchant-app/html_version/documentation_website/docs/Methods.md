---
sidebar_position: 4
sidebar_title: 'Methods'
---

### `updateEnvironment(environment)`

Update the environment (development or staging).

- `environment`: The environment specified using `BeansMerchantEnvironment`.

### `fetchCurrencies(stellarAccountId)`

Fetches available Stellar currencies.

Returns a Promise that resolves to an array of currencies.

### `generateQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates a QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

Returns a Promise that resolves to the generated QR code.

### `generatePngQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates a PNG QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

Returns a Promise that resolves to the base64-encoded PNG QR code string.

### `generateSvgQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '')`

Generates an SVG QR code for a payment request.

- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `webhookUrl`: Optional webhook URL for payment received notification.

