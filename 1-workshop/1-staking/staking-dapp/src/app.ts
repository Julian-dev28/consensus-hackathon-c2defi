// Define 'global' on window to ensure compatibility with Node.js modules in the browser
(window as any).global = window;

import {
  isConnected,
  getNetwork,
  signTransaction,
  getPublicKey,
} from "@stellar/freighter-api";
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
  const networkDisplay = document.getElementById(
    "networkDisplay"
  ) as HTMLParagraphElement;

  let network = await getNetwork();
  if (networkDisplay) {
    networkDisplay.textContent = `Network: ${network}`;
  } else {
    console.error("Network display not found in the document.");
  }

  // Get and display the public key
  let publicKey = await getPublicKey();
  const publicKeyDisplay = document.getElementById(
    "publicKeyDisplay"
  ) as HTMLParagraphElement;

  if (publicKeyDisplay) {
    publicKeyDisplay.textContent = `Public Key: ${publicKey}`;
  } else {
    console.error("Public key display not found in the document.");
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
      console.error("Error calling callDeposit:", e);
    }
  }
  // Call the withdraw function
  /**
   * Calls the withdraw function to initiate a withdrawal for a contributor.
   *
   * @param contributor - The address of the contributor initiating the withdrawal.
   * @param recipient - The address where the withdrawn tokens will be sent.
   * @param token - The token to be withdrawn.
   * @returns A Promise that resolves when the withdrawal is successful.
   */
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
      console.error("Error calling callWithdraw:", e);
    }
  }

  const xlmAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
  const stakeBtn = document.getElementById("stakeBtn");
  const toInput = document.getElementById("toAddress") as HTMLInputElement;
  const withdrawBtn = document.getElementById("withdrawBtn");
  // const tokenInput = document.getElementById("token") as HTMLInputElement;
  const amountInput = document.getElementById("amount") as HTMLInputElement;

  if (stakeBtn && toInput && amountInput) {
    stakeBtn.addEventListener("click", () => {
      if (toInput.value && amountInput.value) {
        let amount = BigInt(amountInput.value) ** BigInt(10 ** 18);

        callDeposit(toInput.value, xlmAddress, amount);
      } else {
        console.error("No Stellar address provided.");
      }
    });
  } else {
    console.error("Button or input field not found in the document.");
  }
  if (withdrawBtn && toInput) {
    withdrawBtn.addEventListener("click", () => {
      if (toInput.value) {
        callWithdraw(publicKey, toInput.value, xlmAddress);
      } else {
        console.error("No Stellar address provided.");
      }
    });
  }
});
