import * as staking from "staking-contract";
import { SorobanRpc } from "@stellar/stellar-sdk";
export const client = new staking.Client({
  ...staking.networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org",
  publicKey: "GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3",
  allowHttp: true,
});

export const server = new SorobanRpc.Server(
  "https://soroban-testnet.stellar.org",
  {
    allowHttp: "https://soroban-testnet.stellar.org".startsWith("http:"),
  }
);
