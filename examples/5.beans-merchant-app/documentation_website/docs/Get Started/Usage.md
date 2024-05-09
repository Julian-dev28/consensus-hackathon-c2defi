---
sidebar_position: 2
---
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