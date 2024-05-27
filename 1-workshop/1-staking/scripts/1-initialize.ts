// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

// Deploy the contract to the test network and obtain the contract ID.
const staking_contractId = process.env.STAKING_CONTRACT_ID;
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

console.log("campaign started ✅");
