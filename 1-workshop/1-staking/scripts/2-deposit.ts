// Import necessary modules from the Stellar SDK and the bun.js shell environment.
import { $ } from "bun";

const staking_contractId = process.env.STAKING_CONTRACT_ID;

// make a deposit
const deposit = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --network testnet \
  --source SCTW7YZCPF5KLB6ALZ2RBUIG3FQIVEJYK5OFCBHZU5637L44AD5OJZYS \
  -- \
  deposit \
  --contributor GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3 \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amount 10000000`.text();
deposit;
console.log("deposit made");

// check the balance
const balance = await $`./target/bin/soroban contract invoke \
  --id ${staking_contractId} \
  --source alice \
  --network testnet \
  -- \
  get_share_token_balance \
  --user GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3`.text();

balance;
console.log("balance:", balance);
