// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

const staking_contractId = process.env.STAKING_CONTRACT_ID;

// make a deposit
const deposit = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source zoro \
  -- \
  deposit \
  --contributor zoro \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 10000000`.text();
deposit;
console.log("deposit made");

// check the balance
const balance = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --source zoro \
  --network testnet \
  -- \
  get_share_token_balance \
  --user zoro`.text();

balance;
console.log("balance:", balance);
