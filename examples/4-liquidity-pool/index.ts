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

const liquidity_pool_contractId = (
  await $`soroban contract deploy --wasm ./target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

const tokenA_contractId = (
  await $`soroban contract deploy --wasm ./contracts/soroban-liquidity-pool-contract/token/soroban_token_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

const tokenB_contractId = (
  await $`soroban contract deploy --wasm ./contracts/soroban-liquidity-pool-contract/token/soroban_token_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

console.log("deployed contracts");

if (!liquidity_pool_contractId && !tokenA_contractId && !tokenB_contractId)
  throw new Error("Contracts not deployed");

let file = ``;
file += `LP_CONTRACT_ID=${liquidity_pool_contractId}\n`;
file += `TOKEN_A_CONTRACT_ID=${tokenA_contractId}\n`;
file += `TOKEN_B_CONTRACT_ID=${tokenB_contractId}\n`;

if (tokenB_contractId < tokenA_contractId) {
  console.log("changing token order");
  let old_tokenA = tokenA_contractId;
  file = file.replace(tokenA_contractId, tokenB_contractId);
  file = file.replace(tokenB_contractId, old_tokenA);
}

file += `SECRET=${secret}`;

await Bun.write(".env.local", file);

console.log("initializing contracts");

const initialize_token = await $`soroban contract invoke \
  --source ${secret} \
  --network testnet \
  --id ${tokenA_contractId} \
  -- \
  initialize \
  --symbol ABND \
  --decimal 7 \
  --name abundance \
  --admin owner \
`.text();

const initialize_crowdfund = await $`soroban contract invoke \
  --source ${secret} \
  --network testnet \
  --id ${liquidity_pool_contractId} \
  -- \
  initialize \
  --recipient owner \
  --target_amount "10000000000" \
  --token ${token_contractId}
`.text();

initialize_token;
initialize_crowdfund;

console.log("initialized contracts");

const liquidity_pool_bindings =
  await $`soroban contract bindings typescript --wasm ./crowdfund/target/wasm32-unknown-unknown/release/soroban_crowdfund_contract.wasm --id ${liquidity_pool_contractId} --network testnet --output-dir ./.soroban/crowdfund-contract --overwrite`.text();

const token_bindings =
  await $`soroban contract bindings typescript --wasm ./crowdfund/target/wasm32-unknown-unknown/release/abundance_token.wasm --id ${token_contractId} --network testnet --output-dir ./.soroban/token-contract --overwrite`.text();

crowdfund_bindings;
token_bindings;
console.log("generated bindings");
console.log("✅");
