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

const hello_world_contractId = (
  await $`soroban contract deploy --wasm target/wasm32-unknown-unknown/release/soroban_hello_world_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

console.log("deployed contracts");

if (!hello_world_contractId) throw new Error("Contracts not deployed");

let file = ``;
file += `HELLO_WORLD_CONTRACT_ID=${hello_world_contractId}\n`;

file += `SECRET=${secret}`;

await Bun.write(".env.local", file);
console.log("✅");

const bindings =
  await $`soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/soroban_hello_world_contract.wasm --id ${hello_world_contractId} --network testnet --output-dir ./.soroban/hello-world --overwrite`.text();
bindings;
console.log("generated bindings");

const dependencies = await $`bun install`.text();
dependencies;
console.log("installed dependencies");
