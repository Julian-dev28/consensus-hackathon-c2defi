// Define 'global' on window to ensure compatibility with Node.js modules in the browser
(window as any).global = window;

// Import statements need to be bundled or handled with a module system in practice
import {
  isConnected,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";
import { Keypair } from "stellar-sdk"; // Assuming Keypair is what you use from stellar-sdk
import { client } from "../shared/contracts"; // Ensure client has the correct methods

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

  // Call the helloWorld function
  async function callContribute(
    contributor: string,
    amount: bigint
  ): Promise<void> {
    try {
      const result = await client.contribute({ contributor, amount });
      console.log(result);
      // Assuming you want to sign the transaction after receiving it
      await signTransaction(result.toString());
    } catch (e: any) {
      console.error("Error calling helloWorld:", e);
    }
  }

  const helloBtn = document.getElementById("helloBtn");
  const toInput = document.getElementById("toAddress") as HTMLInputElement;
  const amountInput = document.getElementById("amount") as HTMLInputElement;

  if (helloBtn && toInput) {
    helloBtn.addEventListener("click", () => {
      if (toInput.value && amountInput.value) {
        callContribute(toInput.value, BigInt(amountInput.value));
      } else {
        console.error("No Stellar address provided.");
      }
    });
  } else {
    console.error("Button or input field not found in the document.");
  }
});
