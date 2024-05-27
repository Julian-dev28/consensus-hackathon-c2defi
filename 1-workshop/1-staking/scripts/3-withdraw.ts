// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

const staking_contractId = process.env.STAKING_CONTRACT_ID;

// make a withdrawal
const withdraw = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source alice \
  -- \
  withdraw \
  --contributor alice \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 10000000`.text();
withdraw;
console.log("withdrawal made");

// check the balance
const balance = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --source alice \
  --network testnet \
  -- \
  get_share_token_balance \
  --user alice`.text();

balance;
console.log("balance:", balance);
