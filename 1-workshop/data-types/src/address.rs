#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct AddressDemo;

#[contractimpl]
impl AddressDemo {
    pub fn get_user(addr: Address) -> Address {
        // Uses the require_auth method to ensure that the call is made from the given address.
        addr.require_auth();
        addr
    }

    pub fn get_contract(env: &Env) -> Address {
        env.current_contract_address()
    }
}
