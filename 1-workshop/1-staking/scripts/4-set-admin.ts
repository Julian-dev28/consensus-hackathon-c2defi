// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

// Deploy the contract to the test network and obtain the contract ID.
const staking_contractId = process.env.STAKING_CONTRACT_ID;
// initialize the contract
const current_admin = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  get_admin`.text();
current_admin;

console.log("admin:", current_admin);
current_admin;
// set the admin
const setAdmin = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  add_new_admin \
  --new_admin alice`.text();
setAdmin;

console.log("admin set ✅");

// check the admin
const new_admin = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  get_admin`.text();
new_admin;

console.log("new admin:", new_admin);
