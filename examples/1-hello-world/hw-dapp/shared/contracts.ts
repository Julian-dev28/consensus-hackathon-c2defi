import * as helloWorld from "hello-world-contract";
import { SorobanRpc } from "@stellar/stellar-sdk";
export const client = new helloWorld.Client({
  ...helloWorld.networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org",
  publicKey: "GCSXUXZSA2VEXN5VGOWE5ODAJLC575JCMWRJ4FFRDWSTRCJYQK4ML6V3",
  allowHttp: true,
});

let contractId = "CCT5QUDP562C6DEBFYLHAOXVNFRC2BT2I3ZNDKBV2JUP65VVCWC6LY6G";

// export const contract = new helloWorld.Contract(contractId);

export const server = new SorobanRpc.Server(
  "https://soroban-testnet.stellar.org",
  {
    allowHttp: "https://soroban-testnet.stellar.org".startsWith("http:"),
  }
);
