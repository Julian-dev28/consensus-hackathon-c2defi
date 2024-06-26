// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

const staking_contractId = process.env.STAKING_CONTRACT_ID;

// make a withdrawal
const withdraw = await $`soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source owner \
  -- \
  withdraw \
  --contributor owner \
  --recipient zoro \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`.text();
withdraw;
console.log("withdrawal made");

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
