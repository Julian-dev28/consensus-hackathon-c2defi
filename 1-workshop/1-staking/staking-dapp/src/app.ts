// Define 'global' on window to ensure compatibility with Node.js modules in the browser
window.global = window;

import {
  isConnected,
  getNetwork,
  signTransaction,
  getPublicKey,
  setAllowed,
} from "@stellar/freighter-api";

import { client } from "../shared/contracts";

// Ensuring that document content is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", async () => {
  // Function to check if Freighter is connected
  async function checkFreighterConnection(): Promise<void> {
    const checkFreighterBtn = document.getElementById("checkFreighterBtn");

    if (!(await isConnected())) {
      alert("Freighter not detected.");
      if (checkFreighterBtn) {
        setAllowed();
        isConnected();
      }
    } else {
      if (checkFreighterBtn) {
        checkFreighterBtn.classList.add("hidden");
      }
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
  const publicKey = await getPublicKey();
  const publicKeyDisplay = document.getElementById(
    "publicKeyDisplay"
  ) as HTMLParagraphElement;
  if (publicKeyDisplay) {
    publicKeyDisplay.textContent = `Public Key: ${publicKey}`;
  } else {
    console.error("Public key display not found in the document.");
  }

  // Get and display the contract balance
  const balance = await client.get_share_token_balance({
    user: publicKey,
  });

  const balanceDisplay = document.getElementById(
    "balanceDisplay"
  ) as HTMLParagraphElement;
  if (balanceDisplay) {
    let formattedBalance = balance.result / BigInt(10 ** 7);
    balanceDisplay.textContent = `Balance: ${formattedBalance}`;
  } else {
    console.error("Balance display not found in the document.");
  }

  // Function to call the deposit method
  async function callDeposit(
    contributor: string,
    token: string,
    amount: bigint
  ): Promise<void> {
    try {
      const result = await client.deposit(
        {
          contributor,
          token,
          amount,
        },
        { simulate: true }
      );
      console.log(result);

      // Sign the transaction after receiving it
      await signTransaction(result.toString());
    } catch (e: any) {
      console.error("Error calling callDeposit:", e);
    }
  }

  // Function to call the withdraw method
  async function callWithdraw(
    contributor: string,
    recipient: string,
    token: string
  ): Promise<void> {
    try {
      const result = await client.withdraw({ contributor, recipient, token });
      console.log(result);

      // Sign the transaction after receiving it
      await signTransaction(result.toString());
    } catch (e: any) {
      console.error("Error calling callWithdraw:", e);
    }
  }

  // Stellar address and button/input elements
  const xlmAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
  const checkFreighterBtn = document.getElementById("checkFreighterBtn");
  const stakeBtn = document.getElementById("stakeBtn");
  const toAddress = document.getElementById("toAddress") as HTMLInputElement;
  const withdrawBtn = document.getElementById("withdrawBtn");
  const amountInput = document.getElementById(
    "amountInput"
  ) as HTMLInputElement;

  // Event listener for the check Freighter button
  if (checkFreighterBtn) {
    checkFreighterBtn.addEventListener("click", () => {
      checkFreighterConnection();
    });
  }

  // Event listener for the stake button
  if (stakeBtn && toAddress && amountInput) {
    stakeBtn.addEventListener("click", () => {
      if (toAddress.value && xlmAddress && amountInput.value) {
        let amount = BigInt(amountInput.value) * BigInt(10 ** 7);
        callDeposit(toAddress.value, xlmAddress, amount);
      } else {
        console.error("No Stellar address provided.");
      }
    });
  } else {
    console.error("Button or input field not found in the document.");
  }

  // Event listener for the withdraw button
  if (withdrawBtn && toAddress) {
    withdrawBtn.addEventListener("click", () => {
      if (toAddress.value) {
        callWithdraw(publicKey, toAddress.value, xlmAddress);
      } else {
        console.error("No Stellar address provided.");
      }
    });
  }
});
