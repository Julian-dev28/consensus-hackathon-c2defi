import React, { useState, useEffect } from "react";
import Header from "./Header"; // Adjust path as necessary
import {
  BeansMerchantSdk,
  SvgQrCodeResponse,
  FetchStellarCurrenciesResponse,
  StellarCurrency,
} from "../sdk/sdk";
import { BeansMerchantSdkEnvironment } from "../sdk/environment";
import { IFormState } from "../interfaces/IFormState";
import * as StellarSdk from "@stellar/stellar-sdk";
import "./styles.css";
import Account from "./Account";
const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");
const accountId = `${BeansMerchantSdkEnvironment.ACCOUNT_ID}`;

const QrCodeGenerator: React.FC = () => {
  const [formData, setFormData] = useState<IFormState>({
    environment: `${BeansMerchantSdkEnvironment.PRODUCTION}`,
    customEnvironment: "",
    apiKey: `${BeansMerchantSdkEnvironment.API_KEY}`,
    stellarAccountId: `${BeansMerchantSdkEnvironment.ACCOUNT_ID}`,
    selectedCurrency: null,
    amount: "10",
    memo: "Vertex Community Payment",
    maxAllowedPayments: 1,
    webhookUrl: "",
  });
  const [currencies, setCurrencies] = useState<StellarCurrency[]>([]);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sdk, setSdk] = useState<BeansMerchantSdk | null>(null);

  useEffect(() => {
    const newSdk = new BeansMerchantSdk(formData.environment, formData.apiKey);
    setSdk(newSdk);
    if (newSdk) {
      newSdk
        .fetchStellarCurrencies(formData.stellarAccountId)
        .then((response: FetchStellarCurrenciesResponse) => {
          setCurrencies(response.stellarCurrencies);
        })
        .catch((err) => console.error("Failed to fetch currencies:", err));
    }
  }, [formData.environment, formData.apiKey, formData.stellarAccountId]);

  const getBalance = async () => {
    const account = await server.loadAccount(accountId);
    console.log("Balances for account: " + accountId);
    account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleGenerateQrCode = async () => {
    setLoading(true);
    try {
      if (!sdk || !formData.selectedCurrency) {
        alert("Please select a currency");
        return;
      }
      const response: SvgQrCodeResponse = await sdk.generateSvgQrCode(
        formData.stellarAccountId,
        formData.selectedCurrency.id,
        parseFloat(formData.amount) || 0,
        formData.memo,
        formData.maxAllowedPayments || undefined,
        formData.webhookUrl || undefined
      );
      setQrCodeSvg(response.svgQrCode);
      setError("");
    } catch (err) {
      setError(err as string);
      console.error("Error when generating QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "selectedCurrency") {
      const selected = currencies.find((c) => c.id === value) || null;
      setFormData((prevState) => ({
        ...prevState,
        selectedCurrency: selected,
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <form>
          <div className="form-group">
            <label htmlFor="selectedCurrency">Select Currency</label>
            <select
              id="selectedCurrency"
              name="selectedCurrency"
              value={formData.selectedCurrency?.id || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label htmlFor="memo">Memo</label>
            <input
              type="text"
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter memo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="webhookUrl">Webhook URL (optional)</label>
            <input
              type="text"
              id="webhookUrl"
              name="webhookUrl"
              value={formData.webhookUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter webhook URL"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerateQrCode}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        </form>
        {qrCodeSvg && (
          <div className="qr-code-container">
            <div className="qr-code-display">
              <h3>Generated QR Code:</h3>
              <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Account />
    </div>
  );
};
export default QrCodeGenerator;
