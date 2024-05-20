// Define 'global' on window to ensure compatibility with Node.js modules in the browser
(window as any).global = window;

import {
  isConnected,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";
import { Keypair } from "stellar-sdk";
import { client } from "../shared/contracts";

// Ensuring that document content is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", async () => {
  // Check if Freighter is connected
  async function checkFreighterConnection(): Promise<void> {
    if (!(await isConnected())) {
      alert("Freighter not detected.");
    }
  }

  // Call to check Freighter connection
  await checkFreighterConnection();

  // Get and display the network
  const networkBtn = document.getElementById("networkBtn");
  const networkDisplay = document.getElementById(
    "networkDisplay"
  ) as HTMLParagraphElement;

  if (networkBtn && networkDisplay) {
    networkBtn.addEventListener("click", async () => {
      try {
        const network: string = await getNetwork();
        networkDisplay.textContent = `Network: ${network}`;
      } catch (e: any) {
        networkDisplay.textContent = `Error fetching network: ${e.message}`;
      }
    });
  } else {
    console.error("Network button or display not found in the document.");
  }

  // Call the deposit function
  async function callDeposit(
    contributor: string,
    token: string,
    amount: bigint
  ): Promise<void> {
    try {
      const result = await client.deposit({ contributor, token, amount });
      console.log(result);
      // Assuming you want to sign the transaction after receiving it
      await signTransaction(result.toString());
    } catch (e: any) {
      console.error("Error calling helloWorld:", e);
    }
  }
  // Call the withdraw function
  async function callWithdraw(
    contributor: string,
    recipient: string,
    token: string
  ): Promise<void> {
    try {
      const result = await client.withdraw({
        contributor,
        recipient,
        token,
      });
      console.log(result);
      // Assuming you want to sign the transaction after receiving it
      await signTransaction(result.toString());
    } catch (e: any) {
      console.error("Error calling helloWorld:", e);
    }
  }

  const xlmAddress = "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA";
  const stakeBtn = document.getElementById("stakeBtn");
  const toInput = document.getElementById("toAddress") as HTMLInputElement;
  // const tokenInput = document.getElementById("token") as HTMLInputElement;
  const amountInput = document.getElementById("amount") as HTMLInputElement;

  if (stakeBtn && toInput) {
    stakeBtn.addEventListener("click", () => {
      if (toInput.value && amountInput.value) {
        callDeposit(toInput.value, xlmAddress, BigInt(amountInput.value));
      } else {
        console.error("No Stellar address provided.");
      }
    });
  } else {
    console.error("Button or input field not found in the document.");
  }
});
