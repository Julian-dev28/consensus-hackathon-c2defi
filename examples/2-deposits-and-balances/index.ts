// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { Horizon, Keypair, Networks } from "@stellar/stellar-sdk";
import { $ } from "bun";

// Remove the target and local environment settings to start fresh.
await $`bun rimraf target/wasm32-unknown-unknown/release .env.local`;
console.log("cleaned target");

// Setup and connect to the Stellar test network.
const horizonUrl = "https://horizon-testnet.stellar.org";
const horizon = new Horizon.Server(horizonUrl, { allowHttp: true });

// Generate a new keypair for transaction authorization.
const keypair = Keypair.random();
const secret = keypair.secret();
const pubkey = keypair.publicKey();

// Fund the new account using the Friendbot service on the test network.
await horizon.friendbot(pubkey).call();
console.log("created account");

// Configure the environment for deploying a contract and register the secret key.
await $`soroban keys add owner --secret-key`.env({
  ...process.env,
  SOROBAN_SECRET_KEY: secret,
});

// Build and deploy the smart contract.
await $`soroban contract build`;
console.log("built contracts");

// Deploy the contract to the test network and obtain the contract ID.
const incrementor_contractId = (
  await $`soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_increment_contract.wasm \
  --network testnet --source owner`.text()
).replace(/\W/g, "");
console.log("deployed contracts");

// Verify the contract ID was obtained; if not, throw an error.
if (!incrementor_contractId) throw new Error("Contracts not deployed");

// Save environment variables locally for later use.
let file = ``;
file += `INCREMENTOR_CONTRACT_ID=${incrementor_contractId}\n`;
file += `SECRET=${secret}`;
await Bun.write(".env.local", file);
console.log("✅");

// Generate TypeScript bindings for the deployed contract.
const bindings = await $`soroban contract bindings typescript \
  --wasm target/wasm32-unknown-unknown/release/soroban_increment_contract.wasm \
  --id ${incrementor_contractId} \
  -network testnet \
  --output-dir ./.soroban/incrementor-contract \
  --overwrite`.text();
bindings;
console.log("generated bindings");
