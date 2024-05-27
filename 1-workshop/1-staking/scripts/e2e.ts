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
await $`./target/bin/soroban keys add owner --secret-key`.env({
  ...process.env,
  SOROBAN_SECRET_KEY: secret,
});

// Build and deploy the smart contract.
await $`./target/bin/soroban contract build`;
console.log("built contracts");

// Deploy the contract to the test network and obtain the contract ID.
const staking_contractId = (
  await $`./target/bin/soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_staking_contract.wasm \
  --network testnet --source owner`.text()
).replace(/\W/g, "");
console.log("deployed contracts");

// Verify the contract ID was obtained; if not, throw an error.
if (!staking_contractId) throw new Error("Contracts not deployed");

// Save environment variables locally for later use.
let file = ``;
file += `STAKING_CONTRACT_ID=${staking_contractId}\n`;
file += `SECRET=${secret}`;
await Bun.write(".env.local", file);
console.log("✅");

console.log("Staking contract ID:", staking_contractId);
console.log("intializing contract");

// initialize the contract
const initialize = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  initialize \
  --admin owner \
  --token_wasm_hash 1d7515989335d6974948a295e76509ad5625bf168f2e69a0d7b9cc7b41c6cb43 \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`.text();
initialize;

console.log("contract initialized ✅");

// start the campaign
const startCampaign = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  start_campaign \
  --admin owner`.text();

startCampaign;

// make a deposit
const deposit = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  deposit \
  --contributor owner \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 10000000`.text();
deposit;
console.log("deposit made");

// check the balance
const balance = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --source owner \
  --network testnet \
  -- \
  get_share_token_balance \
  --user owner`.text();

balance;
console.log("balance:", balance);

console.log("generating conrtract bindings 📝");
// Generate TypeScript bindings for the deployed contract.
const bindings = await $`./target/bin/soroban contract bindings typescript \
  --wasm target/wasm32-unknown-unknown/release/soroban_staking_contract.wasm \
  --id ${staking_contractId} \
  --network testnet \
  --output-dir ./.soroban/staking-contract \
  --overwrite`.text();
bindings;
console.log("generated bindings");

await $`cd staking-dapp && yarn && yarn dev`;
console.log("dapp running at localhost:5173/");
