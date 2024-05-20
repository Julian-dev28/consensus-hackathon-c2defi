#![allow(unused)]
/// This module provides functionality related to the Soroban token.
use soroban_sdk::{xdr::ToXdr, Address, Bytes, BytesN, Env};

// token.rs is a module within the project.
// The contract import allows users to use a client to interact with the token contract.
soroban_sdk::contractimport!(file = "./token/soroban_token_contract.wasm");

pub fn create_contract(e: &Env, token_wasm_hash: BytesN<32>, token: &Address) -> Address {
    let mut salt = Bytes::new(e);
    salt.append(&token.to_xdr(e));
    let salt = e.crypto().sha256(&salt);
    e.deployer()
        .with_current_contract(salt)
        .deploy(token_wasm_hash)
}
