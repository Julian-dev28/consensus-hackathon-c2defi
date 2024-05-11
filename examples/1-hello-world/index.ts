// Import necessary modules from the Stellar SDK and Bun's shell command utility.
import { Horizon, Keypair, Networks } from "@stellar/stellar-sdk";
import { $ } from "bun";

// Execute a shell command to clean the project build directories and local environment settings.
await $`bun rimraf target/wasm32-unknown-unknown/release .env.local`;
console.log("cleaned target");

// Define the URL for the Stellar Horizon test network server.
const horizonUrl = "https://horizon-testnet.stellar.org";
// Initialize the Horizon server object with the test network URL, allowing HTTP connections for testing.
const horizon = new Horizon.Server(horizonUrl, { allowHttp: true });

// Generate a random Stellar keypair for authenticating transactions.
const keypair = Keypair.random();
// Extract the secret and public keys from the keypair.
const secret = keypair.secret();
const pubkey = keypair.publicKey();

// Use Stellar's Friendbot to fund the newly created account with testnet lumens.
await horizon.friendbot(pubkey).call();
console.log("created account");

// Set up environmental variables and add the keypair as 'owner' to the Soroban environment using a shell command.
await $`soroban keys add owner --secret-key`.env({
  ...process.env,
  SOROBAN_SECRET_KEY: secret,
});

// Index.ts continued
// Build the smart contract specified in the Soroban environment.
await $`soroban contract build`;
console.log("built contracts");

// Deploy the smart contract to the Stellar test network using the Soroban CLI.
const hello_world_contractId = (
  await $`soroban contract deploy \
   --wasm target/wasm32-unknown-unknown/release/soroban_hello_world_contract.wasm \
   --network testnet --source owner`.text()
).replace(/\W/g, "");
console.log("deployed contracts");

// Verify the contract ID was obtained; if not, throw an error.
if (!hello_world_contractId) throw new Error("Contracts not deployed");

// Prepare a file content to store environment variables locally.
let file = ``;
file += `HELLO_WORLD_CONTRACT_ID=${hello_world_contractId}\n`;
file += `SECRET=${secret}`;

// Write the constructed environment settings to a local file.
await Bun.write(".env.local", file);
console.log("✅");

// Generate TypeScript bindings for the deployed contract, allowing for interaction with the contract from the client.
const bindings =
  await $`soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/soroban_hello_world_contract.wasm --id ${hello_world_contractId} --network testnet --output-dir ./.soroban/hello-world --overwrite`.text();
bindings;
console.log("generated bindings");

// Install any necessary dependencies for the project using Bun.
const dependencies = await $`bun install`.text();
dependencies;
console.log("installed dependencies");
