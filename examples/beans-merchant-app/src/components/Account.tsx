import React, { useState, useEffect } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { BeansMerchantSdkEnvironment } from "../sdk/environment";
const accountId = `${BeansMerchantSdkEnvironment.ACCOUNT_ID}`;
const server = new StellarSdk.Horizon.Server("https://horizon.stellar.org");

interface Balance {
  asset_type: string;
  balance: number;
}

interface Transaction {
  id: string;
  source_account: string;
  created_at: string;
  memo: string;
  source_asset_code: string;
}

interface Payment {
  id: string;
  source_asset_code: string;
  amount: string;
}

const Account: React.FC = () => {
  const [accountBalances, setAccountBalances] = useState<Balance[]>([]);
  const [transactionHistoryResult, setTransactionHistoryResult] = useState(
    [] as Transaction[]
  );

  const [payments, setPayments] = useState([] as Payment[]);

  const getBalance = async () => {
    try {
      const loadedAccount = await server.loadAccount(accountId);

      console.log("Balances for account: " + accountId);
      loadedAccount.balances.forEach(function (balance) {
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      });

      const convertedBalances = loadedAccount.balances.map((balance) => ({
        ...balance,
        asset_type: convertAssetType(balance.asset_type), // Convert asset type
        balance: balance.balance.toString(),
      })) as unknown as Balance[];

      setAccountBalances(convertedBalances);
    } catch (error) {
      console.error("Failed to fetch account balances:", error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const convertAssetType = (assetType: string): string => {
    switch (assetType) {
      case "native":
        return "XLM";
      case "credit_alphanum4":
        return "USDC";
      // Add more cases for other asset types if needed
      default:
        return assetType;
    }
  };

  const transactionHistory = async () => {
    try {
      const transactions = await server
        .transactions()
        .forAccount(accountId)
        .call();

      setTransactionHistoryResult(
        transactions.records as unknown as Transaction[]
      );
    } catch (err) {
      console.error("Error loading transaction history:", err);
    }
  };

  useEffect(() => {
    getBalance();
    transactionHistory();
  }, []);

  const sortTransactionsByCreatedAt = (transactions: Transaction[]) => {
    return transactions.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  };

  const streamingPayments = () => {
    const es = new EventSource(
      `https://horizon.stellar.org/accounts/${accountId}/payments`
    );

    es.onmessage = (message) => {
      const payment = JSON.parse(message.data);
      console.log("Payment received:", payment);
      setPayments(payment);
    };

    es.onerror = (error) => {
      console.error("error: refresh page or make a payment", error);
    };
  };

  return (
    <div className="account-container">
      <h1 className="account-heading">Account Balances</h1>
      <h4 className="account-id">
        Treasury:{" "}
        <a
          href="https://stellar.expert/explorer/public/account/GB3I2Q2G2VHHNRYXILFVVXFY5GF6XQVFYUV4YGUDV7WKZJZVCKHSWJYI"
          target="_blank"
          rel="noopener noreferrer"
        >
          {accountId}
        </a>
      </h4>
      <ul className="balance-list">
        {accountBalances.map((balance, index) => (
          <li key={index} className="balance-item">
            <strong>Type:</strong> {balance.asset_type},{" "}
            <strong>Balance:</strong> {balance.balance}
          </li>
        ))}
      </ul>
      <h1 className="account-heading">Streaming Payments</h1>
      <h3 className="account-subheading"> Open console to see payments</h3>
      <button
        style={{ border: "1px solid #000", padding: "5px", margin: "1px" }}
        className="btn"
        onClick={streamingPayments}
      >
        Start Streaming Payments
      </button>

      <br />
      <br />
      <h1 className="account-heading">Transaction History</h1>
      <button
        style={{ border: "1px solid #000", padding: "5px", margin: "1px" }}
        className="btn"
        onClick={transactionHistory}
      >
        Load Transaction History
      </button>
      <ul className="transaction-list">
        {sortTransactionsByCreatedAt(transactionHistoryResult).map(
          (transaction, index) => (
            <li key={index} className="transaction-item">
              Transaction ID: {transaction.id}
              <br />
              Source Account: {transaction.source_account}
              <br />
              Created At: {transaction.created_at}
              <br />
              Memo: {convertAssetType(transaction.memo)}
              <br />
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Account;
