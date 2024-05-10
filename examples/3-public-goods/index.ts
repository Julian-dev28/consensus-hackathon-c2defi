import { Horizon, Keypair, Networks } from "@stellar/stellar-sdk";
import { $ } from "bun";

await $`bun rimraf target/wasm32-unknown-unknown/release .env.local`;
console.log("cleaned target");

const horizonUrl = "https://horizon-testnet.stellar.org";
const horizon = new Horizon.Server(horizonUrl, { allowHttp: true });

const keypair = Keypair.random();
const secret = keypair.secret();
const pubkey = keypair.publicKey();

await horizon.friendbot(pubkey).call();

console.log("created account");

await $`soroban keys add owner --secret-key`.env({
  ...process.env,
  SOROBAN_SECRET_KEY: secret,
});

await $`soroban contract build`;
console.log("built contracts");

const crowdfund_contractId = (
  await $`soroban contract deploy --wasm ./crowdfund/target/wasm32-unknown-unknown/release/soroban_crowdfund_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

const token_contractId = (
  await $`soroban contract deploy --wasm ./crowdfund/target/wasm32-unknown-unknown/release/abundance_token.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

console.log("deployed contracts");

if (!crowdfund_contractId && !token_contractId)
  throw new Error("Contracts not deployed");

let file = ``;
file += `CROWDFUND_CONTRACT_ID=${crowdfund_contractId}\n`;
file += `TOKEN_CONTRACT_ID=${token_contractId}\n`;

file += `SECRET=${secret}`;

await Bun.write(".env.local", file);

console.log("initializing contracts");

const initialize_token = await $`soroban contract invoke \
  --source ${secret} \
  --network testnet \
  --id ${token_contractId} \
  -- \
  initialize \
  --symbol ABND \
  --decimal 7 \
  --name abundance \
  --admin owner \
`.text();

let deadline = Math.floor(Date.now() / 1000) + 86400;

const initialize_crowdfund = await $`soroban contract invoke \
  --source ${secret} \
  --network testnet \
  --id ${crowdfund_contractId} \
  -- \
  initialize \
  --recipient owner \
  --deadline ${deadline} \
  --target_amount "10000000000" \
  --token ${token_contractId}
`.text();

initialize_token;
initialize_crowdfund;

console.log("initialized contracts");

const crowdfund_bindings =
  await $`soroban contract bindings typescript --wasm ./crowdfund/target/wasm32-unknown-unknown/release/soroban_crowdfund_contract.wasm --id ${crowdfund_contractId} --network testnet --output-dir ./.soroban/crowdfund-contract --overwrite`.text();

const token_bindings =
  await $`soroban contract bindings typescript --wasm ./crowdfund/target/wasm32-unknown-unknown/release/abundance_token.wasm --id ${token_contractId} --network testnet --output-dir ./.soroban/token-contract --overwrite`.text();

crowdfund_bindings;
token_bindings;
console.log("generated bindings");
console.log("✅");
