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

const contractId_1 = (
  await $`soroban contract deploy --wasm target/wasm32-unknown-unknown/release/soroban_hello_world_contract.wasm --network testnet --source owner`.text()
).replace(/\W/g, "");

console.log("deployed contracts");

if (!contractId_1) throw new Error("Contracts not deployed");

let file = ``;
file += `CONTRACT_ID_1=${contractId_1}\n`;

file += `SECRET=${secret}`;

await Bun.write(".env.local", file);
console.log("✅");
